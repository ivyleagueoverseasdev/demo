export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getStats, setStats, validateAdminToken } from '@/lib/kv';
import { STATS } from '@/lib/data';
import type { Stat } from '@/lib/types';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const kv = await getStats();
  const stats = kv ?? STATS;
  return NextResponse.json({ stats }, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const body = await req.json().catch(() => null);
  const stats: Stat[] = body?.stats ?? [];
  if (!Array.isArray(stats)) {
    return NextResponse.json({ error: 'stats must be an array' }, { status: 400, headers: CORS });
  }
  await setStats(stats);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
