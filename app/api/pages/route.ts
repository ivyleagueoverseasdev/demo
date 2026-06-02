export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { upsertPage, deletePage, getAllPages, validateAdminToken } from '@/lib/kv';
import type { DynamicPage } from '@/lib/types';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

// â”€â”€ Auth: header-only â€” never consume body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function authCheck(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  return validateAdminToken(token);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (!(await authCheck(req))) return json({ error: 'Unauthorized' }, 401);
  try {
    const pages = await getAllPages();
    return json({ pages });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[GET /api/pages]', msg);
    return json({ error: 'Failed to load pages', details: msg }, 500);
  }
}

export async function POST(req: NextRequest) {
  if (!(await authCheck(req))) return json({ error: 'Unauthorized' }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (e) {
    console.error('[POST /api/pages] Bad JSON:', e);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.slug || !body.title) return json({ error: 'slug and title are required' }, 400);

  try {
    const page: DynamicPage = {
      id:              String(body.id ?? crypto.randomUUID()),
      slug:            String(body.slug).toLowerCase().replace(/[^a-z0-9-/]/g, '-'),
      title:           String(body.title),
      metaTitle:       String(body.metaTitle ?? body.title),
      metaDescription: String(body.metaDescription ?? ''),
      layout:          (body.layout as DynamicPage['layout']) ?? 'default',
      blocks:          (body.blocks as DynamicPage['blocks']) ?? [],
      published:       (body.published as boolean) ?? true,
      createdAt:       String(body.createdAt ?? new Date().toISOString()),
      updatedAt:       new Date().toISOString(),
    };
    await upsertPage(page);
    return json({ ok: true, page }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[POST /api/pages] KV write failed:', msg);
    return json({ error: 'Failed to save page', details: msg }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await authCheck(req))) return json({ error: 'Unauthorized' }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (e) {
    console.error('[PUT /api/pages] Bad JSON:', e);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.slug) return json({ error: 'slug is required' }, 400);

  try {
    const patch = { ...body, updatedAt: new Date().toISOString() } as DynamicPage;
    await upsertPage(patch);
    return json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[PUT /api/pages] KV write failed:', msg);
    return json({ error: 'Failed to update page', details: msg }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await authCheck(req))) return json({ error: 'Unauthorized' }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.slug) return json({ error: 'slug is required' }, 400);

  try {
    await deletePage(String(body.slug));
    return json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[DELETE /api/pages] KV write failed:', msg);
    return json({ error: 'Failed to delete page', details: msg }, 500);
  }
}
