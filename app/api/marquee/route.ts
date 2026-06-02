export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getMarqueeSettings, setMarqueeSettings, validateAdminToken } from '@/lib/kv';
import type { MarqueeSettings } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const settings = await getMarqueeSettings();
  return NextResponse.json({ settings }, { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  const settings = await req.json() as MarqueeSettings;
  if (!settings) {
    return NextResponse.json({ error: 'settings body required' }, { status: 400, headers: CORS });
  }
  await setMarqueeSettings(settings);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
