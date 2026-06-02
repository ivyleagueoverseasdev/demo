export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getCountryMeta, setCountryMeta, validateAdminToken } from '@/lib/kv';
import type { CountryMeta } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const country = new URL(req.url).searchParams.get('country');
  if (!country) {
    return NextResponse.json({ error: 'country param required' }, { status: 400, headers: CORS });
  }
  const meta = await getCountryMeta(country);
  return NextResponse.json({ meta }, { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  const { country, meta } = await req.json() as { country: string; meta: CountryMeta };
  if (!country || !meta) {
    return NextResponse.json({ error: 'country and meta required' }, { status: 400, headers: CORS });
  }
  await setCountryMeta(country, meta);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
