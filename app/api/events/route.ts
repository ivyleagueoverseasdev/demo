export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getEvents, setEvents, validateAdminToken } from '@/lib/kv';
import { DEFAULT_EVENTS } from '@/lib/data';
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
  try {
    const kvEvents = await getEvents();
    const events = kvEvents.length > 0 ? kvEvents : DEFAULT_EVENTS;
    return NextResponse.json({ events }, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[GET /api/events]', msg);
    return json({ error: 'Failed to load events', details: msg }, 500);
  }
}

export async function PUT(req: NextRequest) {
  // â”€â”€ Auth: header-only â€” never read body before auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) {
    console.error('[PUT /api/events] Unauthorized â€” token:', token ? `${token.slice(0, 8)}â€¦` : 'missing');
    return json({ error: 'Unauthorized' }, 401);
  }

  // â”€â”€ Parse body once â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let body: { events?: SiteEvent[] };
  try {
    body = await req.json();
  } catch (e) {
    console.error('[PUT /api/events] Failed to parse body:', e);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const events: SiteEvent[] = body.events ?? [];

  try {
    const before = await getEvents();
    await setEvents(events);

    // â”€â”€ Audit log â€” detect diffs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const beforeIds = new Set(before.map(e => e.id));
    const afterIds  = new Set(events.map(e => e.id));

    for (const e of before) {
      if (!afterIds.has(e.id)) {
        await appendAuditLog({ action: 'Deleted Event', entity: 'event', entityId: e.id, entityName: e.title, before: e, after: null, published: false });
      }
    }
    for (const e of events) {
      const prev = before.find(b => b.id === e.id);
      if (!prev) {
        await appendAuditLog({ action: e.published ? 'Published Event' : 'Saved Draft Event', entity: 'event', entityId: e.id, entityName: e.title, before: null, after: e, published: e.published });
      } else if (JSON.stringify(prev) !== JSON.stringify(e)) {
        await appendAuditLog({ action: e.published ? 'Updated Event' : 'Saved Draft Event', entity: 'event', entityId: e.id, entityName: e.title, before: prev, after: e, published: e.published });
      }
    }

    // Purge Next.js RSC cache so EventsCarousel and /events page reflect new data
    // instantly. On force-dynamic routes this is a no-op; on ISR pages it matters.
    revalidatePath('/');
    revalidatePath('/events');

    return json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[PUT /api/events] KV write failed:', msg);
    return json({ error: 'Failed to save events', details: msg }, 500);
  }
}
