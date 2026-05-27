export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getMediaLibrary, addMediaToLibrary, validateAdminToken } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const urls = await getMediaLibrary();
  return NextResponse.json({ urls }, { headers: CORS });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  if (!(await validateAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const body = await req.json() as { url?: string };
  if (!body?.url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400, headers: CORS });
  }

  await addMediaToLibrary(body.url);
  const urls = await getMediaLibrary();
  return NextResponse.json({ ok: true, urls }, { headers: CORS });
}
