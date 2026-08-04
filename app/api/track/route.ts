export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { istDateStr, istDaysAgo, hashVisitor, clientIp } from '@/lib/analytics';

// ── Source classifier ─────────────────────────────────────────────────────────
function classifySource(ref: string | null): string {
  if (!ref) return 'direct';
  try {
    const host = new URL(ref).hostname.toLowerCase();
    if (host.includes('ivyleagueoverseas.com') || host.includes('localhost')) return 'direct';
    if (host.includes('google.'))    return 'google';
    if (host.includes('bing.'))      return 'bing';
    if (host.includes('yahoo.'))     return 'yahoo';
    if (host.includes('facebook.') || host.includes('fb.com')) return 'facebook';
    if (host.includes('instagram.')) return 'instagram';
    if (host.includes('linkedin.'))  return 'linkedin';
    if (host.includes('twitter.') || host.includes('x.com'))   return 'twitter';
    if (host.includes('youtube.'))   return 'youtube';
    if (host.includes('whatsapp.'))  return 'whatsapp';
    return host.replace(/^www\./, '').slice(0, 40);
  } catch {
    return 'direct';
  }
}

// ── KV shape ──────────────────────────────────────────────────────────────────
// v = total page views      c = views by "COUNTRY|City"    s = views by source
// r = views by Indian state "MH|Pune" (regionCode|city, city optional)
// h = visitor-hash set seen THIS DAY (dedup key for "u")
// u = distinct visitors this day (unique visitors)
// n = distinct visitors this day who were NOT seen in the trailing 30 days (new visitors)
interface TrafficDay {
  v: number;
  c: Record<string, number>;
  s: Record<string, number>;
  r?: Record<string, number>;
  h?: Record<string, 1>;
  n?: number;
  u?: number;
}

// ── Daily write budget guard ───────────────────────────────────────────────────
// Cloudflare KV FREE plan allows only 1,000 writes PER DAY across the whole
// namespace. Page-view tracking must never consume that entire budget, or
// admin login / session / content-save writes start failing with
// "KV put() limit exceeded for the day" (HTTP 500 on /admin/login).
//
// Each tracked view costs at most 2 writes (day + live). The visitor-hash
// dedup below adds NO extra writes — the hash set lives inside the same day
// object we already read and write — and NO extra reads on repeat views
// (the 30-day "new visitor" lookback only runs once, the first time a given
// hash is seen that day). Raise this only after upgrading the KV plan.
const DAILY_TRACK_CAP = 350;

// Rolling window used to decide "new" vs "returning" visitor. A visitor
// hash not seen in any of the preceding N days counts as new today.
const NEW_VISITOR_WINDOW_DAYS = 29;

/**
 * Was this visitor hash seen on any of the preceding N IST days? Only
 * called once per hash per day (guarded by the `!seenToday` check below),
 * so worst case this adds N reads per UNIQUE visitor — never per view.
 */
async function wasSeenInLast29Days(kv: KVNamespace, hash: string): Promise<boolean> {
  const dates = Array.from({ length: NEW_VISITOR_WINDOW_DAYS }, (_, i) => istDaysAgo(i + 1));
  const raws  = await Promise.all(dates.map(d => kv.get(`traffic:day:${d}`)));
  for (const raw of raws) {
    if (!raw) continue;
    try {
      const day = JSON.parse(raw) as TrafficDay;
      if (day.h?.[hash]) return true;
    } catch { /* skip malformed */ }
  }
  return false;
}

// ── Write page view to KV ─────────────────────────────────────────────────────
async function recordPageView(
  kv: KVNamespace,
  location: string,
  source: string,
  region: string | null,
  visitorHash: string,
): Promise<void> {
  const date   = istDateStr();
  const minute = new Date().toISOString().slice(0, 16);

  try {
    const dayKey = `traffic:day:${date}`;
    const raw    = await kv.get(dayKey);
    const day: TrafficDay = raw ? JSON.parse(raw) as TrafficDay : { v: 0, c: {}, s: {} };

    // Budget guard: once today's cap is hit, stop ALL analytics writes so the
    // remaining KV write quota stays available for admin auth + content saves.
    if (day.v >= DAILY_TRACK_CAP) return;

    day.v += 1;
    day.c[location] = (day.c[location] ?? 0) + 1;
    day.s[source]   = (day.s[source]   ?? 0) + 1;
    if (region) {
      day.r = day.r ?? {};
      day.r[region] = (day.r[region] ?? 0) + 1;
    }

    // Server-side dedup — immune to cleared localStorage / incognito /
    // repeat testing, since it's keyed off IP+UA rather than anything the
    // client can wipe. Same visitor hitting refresh 50 times today still
    // only counts once here.
    day.h = day.h ?? {};
    if (!day.h[visitorHash]) {
      day.h[visitorHash] = 1;
      day.u = (day.u ?? 0) + 1;
      if (!(await wasSeenInLast29Days(kv, visitorHash))) {
        day.n = (day.n ?? 0) + 1;
      }
    }

    await kv.put(dayKey, JSON.stringify(day), { expirationTtl: 95 * 86_400 });

    // Live bucket — best-effort; only reached while under the daily cap.
    try {
      const liveKey = `traffic:live:${minute}`;
      const cur     = await kv.get(liveKey);
      await kv.put(liveKey, String((cur ? parseInt(cur, 10) : 0) + 1), { expirationTtl: 600 });
    } catch { }
  } catch { }
}

// ── Endpoint ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    let page   = '/';
    let refStr = '';

    try {
      const body = await req.json() as { page?: string; ref?: string };
      if (typeof body.page === 'string') page   = body.page;
      if (typeof body.ref  === 'string') refStr = body.ref;
    } catch { }

    // Never track admin or api paths
    if (page.startsWith('/admin') || page.startsWith('/api')) {
      return new NextResponse(null, { status: 204 });
    }

    const cfCtx = getOptionalRequestContext();
    const kv    = cfCtx?.env?.CONTENT_KV;

    if (kv && cfCtx?.ctx) {
      // Prefer the request's cf geolocation object (available on all CF plans);
      // fall back to headers for older/proxied setups.
      const cf = cfCtx.cf as {
        country?: string; city?: string; region?: string; regionCode?: string;
      } | undefined;

      const country = cf?.country || req.headers.get('cf-ipcountry') || 'XX';
      const city    = cf?.city || req.headers.get('cf-ipcity') || '';
      const location = city && city !== 'Unknown'
        ? `${country}|${city}`
        : country;
      const source   = classifySource(refStr);

      // Indian state bucket — "MH|Pune", "KA", … (state-wise map in admin)
      let region: string | null = null;
      if (country === 'IN') {
        const stateCode = cf?.regionCode || '';
        const stateName = cf?.region || '';
        const state     = stateCode || stateName;
        if (state) {
          region = city && city !== 'Unknown' ? `${state}|${city}` : state;
        }
      }

      const visitorHash = await hashVisitor(clientIp(req.headers), req.headers.get('user-agent') ?? '');

      cfCtx.ctx.waitUntil(recordPageView(kv, location, source, region, visitorHash));
    }
  } catch { }

  return new NextResponse(null, { status: 204 });
}
