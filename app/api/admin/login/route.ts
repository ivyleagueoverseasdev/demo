export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { setAdminToken } from '@/lib/kv';
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

  const expected = process.env.ADMIN_PASSWORD || 'iloc-admin';
  if (!body.password || body.password !== expected) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: CORS });
  }

  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');

  try {
    await setAdminToken(token);
  } catch (e: unknown) {
    console.error('[POST /api/admin/login] KV write failed:', (e as Error).stack ?? e);
    return NextResponse.json({ error: 'Failed to persist token', details: (e as Error).message }, { status: 500, headers: CORS });
  }

  return NextResponse.json({ token }, { status: 200, headers: CORS });
}
