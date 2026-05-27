export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/kv';
import { getAuditLog, clearAuditLog } from '@/lib/audit';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  if (!(await validateAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  const log = await getAuditLog();
  return NextResponse.json({ log }, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  if (!(await validateAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  await clearAuditLog();
  return NextResponse.json({ ok: true }, { headers: CORS });
}
