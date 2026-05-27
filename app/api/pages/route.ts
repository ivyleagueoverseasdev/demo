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

async function authCheck(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    || (await req.clone().json().catch(() => ({}))).token;
  return validateAdminToken(String(token || ''));
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const authed = await authCheck(req);
  if (!authed) return json({ error: 'Unauthorized' }, 401);
  const pages = await getAllPages();
  return json({ pages });
}

export async function POST(req: NextRequest) {
  const authed = await authCheck(req);
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json();
  if (!body.slug || !body.title) return json({ error: 'slug and title are required' }, 400);

  const page: DynamicPage = {
    id:              body.id || crypto.randomUUID(),
    slug:            body.slug.toLowerCase().replace(/[^a-z0-9-\/]/g, '-'),
    title:           body.title,
    metaTitle:       body.metaTitle || body.title,
    metaDescription: body.metaDescription || '',
    layout:          body.layout || 'default',
    blocks:          body.blocks || [],
    published:       body.published ?? true,
    createdAt:       body.createdAt || new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
  };

  await upsertPage(page);
  return json({ ok: true, page }, 201);
}

export async function PUT(req: NextRequest) {
  const authed = await authCheck(req);
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json();
  if (!body.slug) return json({ error: 'slug is required' }, 400);

  const patch: Partial<DynamicPage> = { ...body, updatedAt: new Date().toISOString() };
  await upsertPage(patch as DynamicPage);
  return json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const authed = await authCheck(req);
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const { slug } = await req.json();
  if (!slug) return json({ error: 'slug is required' }, 400);

  await deletePage(slug);
  return json({ ok: true });
}
