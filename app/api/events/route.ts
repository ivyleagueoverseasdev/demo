import { NextRequest, NextResponse } from 'next/server';
import { getEvents, setEvents, validateAdminToken } from '@/lib/kv';
import type { SiteEvent } from '@/lib/types';


const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events }, {
    headers: {
      ...CORS,
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    || (await req.clone().json().catch(() => ({}))).token;
  const authed = await validateAdminToken(String(token || ''));
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json();
  const events: SiteEvent[] = body.events ?? [];
  await setEvents(events);
  return json({ ok: true });
}
