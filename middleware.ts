import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { verifyToken } from '@/lib/session';

// Paths under /admin that bypass the auth check
const OPEN_PREFIXES = ['/admin/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Middleware only gates admin PAGES. It verifies the signed session cookie
  // (lib/session.ts) — NO Cloudflare KV reads or writes — so admin access is
  // completely independent of the KV daily quota. Page-view tracking is done
  // client-side via /api/track to avoid interfering with the Edge Function
  // execution context that public Server Components rely on.
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (OPEN_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('iloc_admin')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  const secret =
    (getOptionalRequestContext()?.env as Record<string, string | undefined> | undefined)?.ADMIN_PASSWORD
    ?? process.env.ADMIN_PASSWORD;

  if (!secret) {
    // No secret configured → local next dev: allow through. In production a
    // missing secret is a misconfiguration, so send to login to be safe.
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const ok = await verifyToken(secret, token);
  if (!ok) {
    const res = NextResponse.redirect(new URL('/admin/login', req.url));
    res.cookies.delete('iloc_admin');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
