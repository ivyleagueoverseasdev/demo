export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getNews, upsertNews, deleteNews, validateAdminToken } from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
import type { NewsItem } from '@/lib/types';


const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const news = await getNews();
  return NextResponse.json({ news }, {
    headers: { ...CORS, 'Cache-Control': 'no-store' },
  });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const body = await req.json() as Partial<NewsItem>;
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: 'title and slug are required' }, { status: 400, headers: CORS });
  }

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

  await upsertNews(item);
  await appendAuditLog({
    action:     item.published ? 'Published News Article' : 'Saved Draft News Article',
    entity:     'news',
    entityId:   item.id,
    entityName: item.title,
    before:     null,
    after:      item,
    published:  item.published,
  });
  return NextResponse.json({ ok: true, item }, { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const body = await req.json() as Partial<NewsItem> & { delete?: boolean };
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400, headers: CORS });

  if (body.delete) {
    const news = await getNews();
    const toDelete = news.find(n => n.id === body.id);
    await deleteNews(body.id);
    if (toDelete) {
      await appendAuditLog({
        action:     'Deleted News Article',
        entity:     'news',
        entityId:   body.id,
        entityName: toDelete.title,
        before:     toDelete,
        after:      null,
        published:  false,
      });
    }
    return NextResponse.json({ ok: true, deleted: body.id }, { headers: CORS });
  }

  const news = await getNews();
  const existing = news.find(n => n.id === body.id);
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404, headers: CORS });

  const updated = { ...existing, ...body, id: existing.id, createdAt: existing.createdAt };
  await upsertNews(updated);
  await appendAuditLog({
    action:     updated.published ? 'Updated News Article' : 'Saved Draft News Article',
    entity:     'news',
    entityId:   updated.id,
    entityName: updated.title,
    before:     existing,
    after:      updated,
    published:  updated.published,
  });
  return NextResponse.json({ ok: true }, { headers: CORS });
}
