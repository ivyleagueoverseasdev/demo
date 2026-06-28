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
interface TrafficDay {
  v: number;
  c: Record<string, number>;
  s: Record<string, number>;
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
      const country  = req.headers.get('cf-ipcountry') ?? 'XX';
      const cityRaw  = req.headers.get('cf-ipcity');
      const location = cityRaw && cityRaw !== 'Unknown'
        ? `${country}|${cityRaw}`
        : country;
      const source   = classifySource(refStr);

      cfCtx.ctx.waitUntil(recordPageView(kv, location, source));
    }
  } catch { }

  return new NextResponse(null, { status: 204 });
}
