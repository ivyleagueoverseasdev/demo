export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getStats, setStats, validateAdminToken } from '@/lib/kv';
import { STATS } from '@/lib/data';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { Stat } from '@/lib/types';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const kv = await getStats();
    return json({ stats: kv ?? STATS });
  } catch (e: unknown) {
    console.error('[GET /api/stats]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load stats' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { stats?: Stat[] };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/stats] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!Array.isArray(body.stats)) return json({ error: 'stats must be an array' }, 400);

  try {
    await setStats(body.stats);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/stats] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save stats', details: (e as Error).message }, 500);
  }
}
