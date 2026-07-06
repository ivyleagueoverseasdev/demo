export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

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
// v  = total views     c = views by "COUNTRY|City"    s = views by source
// r  = views by Indian state "MH|Pune" (regionCode|city, city optional)
// n  = brand-new visitors (first visit ever)          u = unique visitors today
interface TrafficDay {
  v: number;
  c: Record<string, number>;
  s: Record<string, number>;
  r?: Record<string, number>;
  n?: number;
  u?: number;
}

// ── Daily write budget guard ───────────────────────────────────────────────────
// Cloudflare KV FREE plan allows only 1,000 writes PER DAY across the whole
// namespace. Page-view tracking must never consume that entire budget, or
// admin login / session / content-save writes start failing with
// "KV put() limit exceeded for the day" (HTTP 500 on /admin/login).
//
// We cap the number of tracked views per day using the day counter we already
// store (no extra key needed). Each tracked view costs at most 2 writes
// (day + live), so ANALYTICS writes are bounded to ≈ 2 × DAILY_TRACK_CAP,
// leaving the rest of the 1,000/day budget reserved for admin operations.
// Raise this only after upgrading to the paid KV plan (1,000 → 1M+ writes/day).
const DAILY_TRACK_CAP = 350;

// ── Write page view to KV ─────────────────────────────────────────────────────
async function recordPageView(
  kv: KVNamespace,
  location: string,
  source: string,
  region: string | null,
  newVisitor: boolean,
  firstToday: boolean,
): Promise<void> {
  const now    = new Date();
  const date   = now.toISOString().slice(0, 10);
  const minute = now.toISOString().slice(0, 16);

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
    if (newVisitor) day.n = (day.n ?? 0) + 1;
    if (firstToday) day.u = (day.u ?? 0) + 1;
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
    let nv     = false;   // brand-new visitor (first ever visit)
    let ft     = false;   // first page view of the calendar day

    try {
      const body = await req.json() as { page?: string; ref?: string; nv?: boolean; ft?: boolean };
      if (typeof body.page === 'string')  page   = body.page;
      if (typeof body.ref  === 'string')  refStr = body.ref;
      if (body.nv === true) nv = true;
      if (body.ft === true) ft = true;
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

      cfCtx.ctx.waitUntil(recordPageView(kv, location, source, region, nv, ft));
    }
  } catch { }

  return new NextResponse(null, { status: 204 });
}
