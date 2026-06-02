export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getNews, upsertNews, deleteNews, validateAdminToken } from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { NewsItem } from '@/lib/types';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const news = await getNews();
    return json({ news });
  } catch (e: unknown) {
    console.error('[GET /api/news]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load news' }, 500);
  }
}

export async function POST(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: Partial<NewsItem>;
  try {
    body = await parseBody<Partial<NewsItem>>(req);
  } catch (e) {
    console.error('[POST /api/news] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.title || !body.slug) return json({ error: 'title and slug are required' }, 400);

  const item: NewsItem = {
    id:        body.id        || `news_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title:     body.title,
    slug:      body.slug,
    date:      body.date      || new Date().toISOString().slice(0, 10),
    excerpt:   body.excerpt   || '',
    content:   body.content   || '',
    imageUrl:  body.imageUrl  || '',
    published: body.published ?? true,
    createdAt: body.createdAt || new Date().toISOString(),
  };

  try {
    await upsertNews(item);
    await appendAuditLog({ action: item.published ? 'Published News Article' : 'Saved Draft News Article', entity: 'news', entityId: item.id, entityName: item.title, before: null, after: item, published: item.published });
    return json({ ok: true, item }, 201);
  } catch (e: unknown) {
    console.error('[POST /api/news] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save article', details: (e as Error).message }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: Partial<NewsItem> & { delete?: boolean };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/news] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.id) return json({ error: 'id required' }, 400);

  try {
    if (body.delete) {
      const news = await getNews();
      const toDelete = news.find(n => n.id === body.id);
      await deleteNews(body.id);
      if (toDelete) {
        await appendAuditLog({ action: 'Deleted News Article', entity: 'news', entityId: body.id, entityName: toDelete.title, before: toDelete, after: null, published: false });
      }
      return json({ ok: true, deleted: body.id });
    }

    const news    = await getNews();
    const existing = news.find(n => n.id === body.id);
    if (!existing) return json({ error: 'Article not found' }, 404);

    const updated = { ...existing, ...body, id: existing.id, createdAt: existing.createdAt };
    await upsertNews(updated);
    await appendAuditLog({ action: updated.published ? 'Updated News Article' : 'Saved Draft News Article', entity: 'news', entityId: updated.id, entityName: updated.title, before: existing, after: updated, published: updated.published });
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/news] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to update article', details: (e as Error).message }, 500);
  }
}
