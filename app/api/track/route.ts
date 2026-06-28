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
    day.v += 1;
    day.c[location] = (day.c[location] ?? 0) + 1;
    day.s[source]   = (day.s[source]   ?? 0) + 1;
    await kv.put(dayKey, JSON.stringify(day), { expirationTtl: 95 * 86_400 });
  } catch { }

  try {
    const liveKey = `traffic:live:${minute}`;
    const cur     = await kv.get(liveKey);
    await kv.put(liveKey, String((cur ? parseInt(cur, 10) : 0) + 1), { expirationTtl: 600 });
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
