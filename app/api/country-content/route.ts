import { NextRequest, NextResponse } from 'next/server';
import { getCountryContent, setCountryContent, validateAdminToken } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  const section = searchParams.get('section');
  if (!country || !section) {
    return NextResponse.json({ error: 'country and section params required' }, { status: 400, headers: CORS });
  }
  const html = await getCountryContent(country, section);
  return NextResponse.json({ html }, { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const { country, section, html } = await req.json() as { country: string; section: string; html: string };
  if (!country || !section || html === undefined) {
    return NextResponse.json({ error: 'country, section, and html are required' }, { status: 400, headers: CORS });
  }

  await setCountryContent(country, section, html);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
