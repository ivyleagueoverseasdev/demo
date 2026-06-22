import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Paths under /admin that are always public (no cookie required)
const OPEN_PREFIXES = ['/admin/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (OPEN_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('iloc_admin')?.value;

  // No cookie at all → redirect to login immediately (no KV round-trip)
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Validate session in KV
  try {
    const ctx = getOptionalRequestContext();
    const kv = (ctx?.env as { CONTENT_KV?: KVNamespace } | undefined)?.CONTENT_KV;

    if (!kv) {
      // Local dev without CF context — allow through; client-side auth still applies
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
    await kv.put(`session:${token}`, '1', { expirationTtl: 86400 });
  } catch {
    // Transient KV failure: allow through in dev, gate in production
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
