export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getNews, upsertNews, deleteNews, validateAdminToken } from '@/lib/kv';
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
    headers: { ...CORS, 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' },
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
    await deleteNews(body.id);
    return NextResponse.json({ ok: true, deleted: body.id }, { headers: CORS });
  }

  const news = await getNews();
  const existing = news.find(n => n.id === body.id);
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404, headers: CORS });

  await upsertNews({ ...existing, ...body, id: existing.id, createdAt: existing.createdAt });
  return NextResponse.json({ ok: true }, { headers: CORS });
}
