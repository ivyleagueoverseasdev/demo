export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getEvents, setEvents, validateAdminToken } from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
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
    headers: { ...CORS, 'Cache-Control': 'no-store' },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    || (await req.clone().json().catch(() => ({}))).token;
  const authed = await validateAdminToken(String(token || ''));
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json();
  const before = await getEvents();
  const events: SiteEvent[] = body.events ?? [];

  await setEvents(events);

  // ── Audit log ──────────────────────────────────────────────────────────
  // Detect what changed: find new/updated/deleted events by comparing IDs
  const beforeIds = new Set(before.map(e => e.id));
  const afterIds  = new Set(events.map(e => e.id));

  // Deleted
  for (const e of before) {
    if (!afterIds.has(e.id)) {
      await appendAuditLog({ action: 'Deleted Event', entity: 'event', entityId: e.id, entityName: e.title, before: e, after: null, published: false });
    }
  }
  // Added or updated
  for (const e of events) {
    const prev = before.find(b => b.id === e.id);
    if (!prev) {
      await appendAuditLog({ action: e.published ? 'Published Event' : 'Saved Draft Event', entity: 'event', entityId: e.id, entityName: e.title, before: null, after: e, published: e.published });
    } else if (JSON.stringify(prev) !== JSON.stringify(e)) {
      await appendAuditLog({ action: e.published ? 'Updated Event' : 'Saved Draft Event', entity: 'event', entityId: e.id, entityName: e.title, before: prev, after: e, published: e.published });
    }
  }

  return json({ ok: true });
}
