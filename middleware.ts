import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

// NOTE: middleware.ts runs on the edge runtime by default in Next.js App Router.
// Declaring `export const runtime` here is not allowed and will crash the
// Cloudflare Pages build — the runtime declaration must be absent entirely.

// Paths under /admin that bypass auth
const OPEN_PREFIXES = ['/admin/login'];

// Prefixes that should never be tracked for analytics
const NO_TRACK: string[] = ['/admin', '/api', '/_next'];

// ── Source classifier ─────────────────────────────────────────────────────────
function classifySource(referer: string | null): string {
  if (!referer) return 'direct';
  try {
    const host = new URL(referer).hostname.toLowerCase();
    if (host.includes('google.'))               return 'google';
    if (host.includes('bing.'))                 return 'bing';
    if (host.includes('yahoo.'))                return 'yahoo';
    if (host.includes('facebook.') || host.includes('fb.com')) return 'facebook';
    if (host.includes('instagram.'))            return 'instagram';
    if (host.includes('linkedin.'))             return 'linkedin';
    if (host.includes('twitter.') || host.includes('x.com'))   return 'twitter';
    if (host.includes('youtube.'))              return 'youtube';
    if (host.includes('whatsapp.'))             return 'whatsapp';
    // Return the exact root domain instead of a generic bucket — strip www.
    // and cap at 40 chars so KV keys stay compact.
    return host.replace(/^www\./, '').slice(0, 40);
  } catch {
    return 'direct';
  }
}

// ── KV traffic shape (abbreviated keys keep stored JSON compact) ──────────────
interface TrafficDay {
  v: number;                  // total views
  c: Record<string, number>;  // country code → count
  s: Record<string, number>;  // source name  → count
}

// ── Async page-view recorder — called via waitUntil, never awaited inline ─────
async function recordPageView(
  kv: KVNamespace,
  location: string,  // "{country}|{city}", e.g. "IN|Pune"
  source:   string,
): Promise<void> {
  const now    = new Date();
  const date   = now.toISOString().slice(0, 10);  // "2026-06-28"
  const minute = now.toISOString().slice(0, 16);  // "2026-06-28T14:35"

  // Daily aggregate — read-modify-write with eventual consistency.
  // For a small site the race window is negligible; we favour simplicity
  // over Durable Object complexity.
  try {
    const dayKey = `traffic:day:${date}`;
    const raw    = await kv.get(dayKey);
    const day: TrafficDay = raw
      ? (JSON.parse(raw) as TrafficDay)
      : { v: 0, c: {}, s: {} };
    day.v += 1;
    day.c[location] = (day.c[location] ?? 0) + 1;
    day.s[source]   = (day.s[source]   ?? 0) + 1;
    // Retain 95 days so the dashboard can display a full month of history
    await kv.put(dayKey, JSON.stringify(day), { expirationTtl: 95 * 86_400 });
  } catch {
    // Swallow — analytics must never block page delivery
  }

  // Per-minute live bucket — TTL of 10 min so stale entries auto-expire
  try {
    const liveKey = `traffic:live:${minute}`;
    const cur     = await kv.get(liveKey);
    await kv.put(liveKey, String((cur ? parseInt(cur, 10) : 0) + 1), {
      expirationTtl: 600,
    });
  } catch {
    // Swallow
  }
}

// ── Admin auth ────────────────────────────────────────────────────────────────
async function handleAdminAuth(
  req: NextRequest,
  pathname: string,
): Promise<NextResponse> {
  if (OPEN_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('iloc_admin')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  try {
    const ctx = getOptionalRequestContext();
    const kv  = ctx?.env?.CONTENT_KV;

    if (!kv) {
      if (process.env.NODE_ENV !== 'production') return NextResponse.next();
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const valid = await kv.get(`session:${token}`);
    if (!valid) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url));
      res.cookies.delete('iloc_admin');
      return res;
    }

    // Renew sliding 24-hour TTL on every authenticated page load
    await kv.put(`session:${token}`, '1', { expirationTtl: 86_400 });
  } catch {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

// ── Main middleware ───────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth takes full precedence
  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(req, pathname);
  }

  // Public page-view tracking (fire-and-forget, never delays response)
  const shouldTrack =
    !NO_TRACK.some(p => pathname.startsWith(p)) &&
    !/\.\w{1,5}$/.test(pathname); // skip paths with a file extension

  if (shouldTrack) {
    try {
      const cfCtx = getOptionalRequestContext();
      const kv    = cfCtx?.env?.CONTENT_KV;
      if (kv && cfCtx?.ctx) {
        const country  = req.headers.get('cf-ipcountry') ?? 'XX';
        const city     = req.headers.get('cf-ipcity')    ?? 'Unknown';
        const location = `${country}|${city}`;
        const source   = classifySource(req.headers.get('referer'));
        // waitUntil keeps the Worker alive for the KV writes without adding
        // latency to the actual page response.
        cfCtx.ctx.waitUntil(recordPageView(kv, location, source));
      }
    } catch {
      // Never propagate analytics errors to visitors
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Cover every route; Next.js automatically skips _next/static files.
    // The middleware above also skips by prefix/extension at runtime.
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
};
