export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/kv';
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
  const expected = cfPass ?? process.env.ADMIN_PASSWORD ?? 'iloc-admin';

  if (!body.password || body.password !== expected) {
    console.warn('[POST /api/admin/login] Bad password attempt');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: CORS });
  }

  // Generate a 48-character cryptographically random hex token
  const arr   = new Uint8Array(24);
  crypto.getRandomValues(arr);
  const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');

  try {
    // Write session:<token> = "1" to KV with 24h TTL.
    // Each login creates its own KV key â€” multiple sessions are supported.
    await createAdminSession(token);
    console.log('[POST /api/admin/login] Session created, token prefix:', token.slice(0, 8));
  } catch (e: unknown) {
    console.error('[POST /api/admin/login] KV session write failed:', (e as Error).stack ?? e);
    return NextResponse.json(
      { error: 'Failed to create session â€” check CONTENT_KV binding in Cloudflare Pages settings', details: (e as Error).message },
      { status: 500, headers: CORS }
    );
  }

  return NextResponse.json({ token }, { status: 200, headers: CORS });
}
