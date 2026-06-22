'use server';

// ─── Admin CRUD Server Actions ────────────────────────────────────────────────
//
// Pattern used for every entity (events, classes, news, etc.):
//   1. assertAdmin() — validates HTTP-only cookie against KV session
//   2. Read → mutate → write (using existing lib/kv.ts helpers)
//   3. revalidatePath() — purges Next.js cache so public pages reflect the change
//
// Usage in client components (admin pages):
//
//   import { addEvent, updateEvent, deleteEvent } from '@/lib/admin-crud-actions';
//   import { useTransition } from 'react';
//
//   const [pending, startTransition] = useTransition();
//
//   function handleDelete(id: string) {
//     startTransition(async () => {
//       const { error } = await deleteEvent(id);
//       if (error) flash(error, 'error'); else flash('Deleted', 'success');
//     });
//   }

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import {
  getEvents,
  setEvents,
  upsertEvent,
  deleteEvent as kvDeleteEvent,
} from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
import type { SiteEvent } from '@/lib/types';

// ─── Auth guard (cookie → KV) ─────────────────────────────────────────────────

async function assertAdmin(): Promise<void> {
  const jar   = await cookies();
  const token = jar.get('iloc_admin')?.value;
  if (!token) throw new Error('Unauthorized — sign in first');

  const ctx = getOptionalRequestContext();
  const kv  = (ctx?.env as { CONTENT_KV?: KVNamespace } | undefined)?.CONTENT_KV;

  if (!kv) {
    if (process.env.NODE_ENV !== 'production') return; // local dev bypass
    throw new Error('Unauthorized');
  }

  const valid = await kv.get(`session:${token}`);
  if (!valid) throw new Error('Session expired — please sign in again');

  // Renew sliding 24-hour TTL
  await kv.put(`session:${token}`, '1', { expirationTtl: 86400 });
}

type ActionResult = { error?: string };

// ─── Events: Add ──────────────────────────────────────────────────────────────

export async function addEvent(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();

    const event: SiteEvent = {
      id:          crypto.randomUUID(),
      title:       formData.get('title')       as string,
      type:        formData.get('type')        as SiteEvent['type'],
      date:        formData.get('date')        as string,
      time:        formData.get('time')        as string,
      location:    formData.get('location')    as string,
      description: formData.get('description') as string,
      ctaLabel:   (formData.get('ctaLabel')    as string)  || 'Register',
      imageUrl:   (formData.get('imageUrl')    as string)  || undefined,
      seats:      formData.get('seats') ? Number(formData.get('seats')) : undefined,
      published:   formData.get('published') === 'true',
      createdAt:   new Date().toISOString(),
    };

    await upsertEvent(event);

    await appendAuditLog({
      action: event.published ? 'Published Event' : 'Saved Draft Event',
      entity: 'event', entityId: event.id, entityName: event.title,
      before: null, after: event, published: event.published,
    });

    // ── Sync wiring ────────────────────────────────────────────────────────────
    // revalidatePath purges the Next.js RSC payload cache for these routes.
    // On Cloudflare Pages, force-dynamic pages bypass Next.js caching entirely,
    // so this is a safety net — but it's required for any ISR page and for
    // future-proofing. Always call it after every KV write.
    revalidatePath('/');              // Home → EventsCarousel, LiveClassesBoard
    revalidatePath('/events');        // Public events listing
    revalidatePath('/admin/events');  // Admin table

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add event' };
  }
}

// ─── Events: Update ───────────────────────────────────────────────────────────

export async function updateEvent(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await assertAdmin();

    const all = await getEvents();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) return { error: 'Event not found' };

    const before = { ...all[idx] };
    all[idx] = {
      ...all[idx],
      title:       (formData.get('title')       as string) || all[idx].title,
      type:        (formData.get('type')        as SiteEvent['type']) || all[idx].type,
      date:        (formData.get('date')        as string) || all[idx].date,
      time:        (formData.get('time')        as string) || all[idx].time,
      location:    (formData.get('location')    as string) || all[idx].location,
      description: (formData.get('description') as string) || all[idx].description,
      ctaLabel:    (formData.get('ctaLabel')    as string) || all[idx].ctaLabel,
      imageUrl:    (formData.get('imageUrl')    as string) || all[idx].imageUrl,
      published:   formData.has('published')
        ? formData.get('published') === 'true'
        : all[idx].published,
    };

    await setEvents(all);

    await appendAuditLog({
      action: 'Updated Event', entity: 'event',
      entityId: id, entityName: all[idx].title,
      before, after: all[idx], published: all[idx].published,
    });

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update event' };
  }
}

// ─── Events: Delete ───────────────────────────────────────────────────────────

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();

    const all = await getEvents();
    const target = all.find(e => e.id === id);

    await kvDeleteEvent(id);

    if (target) {
      await appendAuditLog({
        action: 'Deleted Event', entity: 'event',
        entityId: id, entityName: target.title,
        before: target, after: null, published: false,
      });
    }

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete event' };
  }
}

// ─── Template: Publish / Unpublish toggle ─────────────────────────────────────
// Use this pattern for any entity that has a `published` boolean.

export async function toggleEventPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  try {
    await assertAdmin();

    const all = await getEvents();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) return { error: 'Event not found' };

    all[idx] = { ...all[idx], published };
    await setEvents(all);

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to toggle event' };
  }
}
