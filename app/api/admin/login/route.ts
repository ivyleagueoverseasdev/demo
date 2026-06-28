export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/session';
import { parseBody, CORS } from '@/lib/edge-utils';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[POST /api/admin/login] parse error:', e);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: CORS });
  }

  // Read password from CF env first (via request context), fall back to process.env for local dev
  const { getOptionalRequestContext } = await import('@cloudflare/next-on-pages');
  const ctx      = getOptionalRequestContext();
  const cfPass   = (ctx?.env as Record<string, string> | undefined)?.ADMIN_PASSWORD;
  const expected = cfPass ?? process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'Server misconfiguration — ADMIN_PASSWORD not set' }, { status: 503, headers: CORS });

  if (!body.password || body.password !== expected) {
    console.warn('[POST /api/admin/login] Bad password attempt');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: CORS });
  }

  // Stateless signed session token — HMAC-signed with ADMIN_PASSWORD, valid 24h.
  // No KV write, so login is immune to the KV daily write limit.
  const token = await signToken(expected, 86_400);

  return NextResponse.json({ token }, { status: 200, headers: CORS });
}
