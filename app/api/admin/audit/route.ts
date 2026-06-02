export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/kv';
import { getAuditLog, clearAuditLog } from '@/lib/audit';
import { getBearerToken, CORS } from '@/lib/edge-utils';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);
  try {
    const log = await getAuditLog();
    return json({ log });
  } catch (e: unknown) {
    console.error('[GET /api/admin/audit]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load audit log' }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);
  try {
    await clearAuditLog();
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[DELETE /api/admin/audit]', (e as Error).stack ?? e);
    return json({ error: 'Failed to clear audit log' }, 500);
  }
}
