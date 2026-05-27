export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { setAdminToken } from '@/lib/kv';


const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));

  // Password check: env var ADMIN_PASSWORD, fallback "iloc-admin" in dev
  const expected = process.env.ADMIN_PASSWORD || 'iloc-admin';
  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: CORS });
  }

  // Generate and store a random token valid for 7 days
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  const token = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');

  await setAdminToken(token);

  return NextResponse.json({ token }, { status: 200, headers: CORS });
}
