import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

// Paths under /admin that bypass the auth check
const OPEN_PREFIXES = ['/admin/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Middleware only handles admin auth — page-view tracking is done
  // client-side via /api/track to avoid interfering with the Edge Function
  // execution context that public Server Components rely on.
  if (!pathname.startsWith('/admin')) return NextResponse.next();
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

    await kv.put(`session:${token}`, '1', { expirationTtl: 86_400 });
  } catch {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
