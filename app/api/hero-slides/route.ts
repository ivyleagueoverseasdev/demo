export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, setHeroSlides, validateAdminToken } from '@/lib/kv';
import { DEFAULT_HERO_SLIDES } from '@/lib/data';
import type { HeroSlide } from '@/lib/types';

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
  const kv = await getHeroSlides();
  const slides = kv ?? DEFAULT_HERO_SLIDES;
  return NextResponse.json({ slides }, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    || (await req.clone().json().catch(() => ({}))).token;
  const authed = await validateAdminToken(String(token || ''));
  if (!authed) return json({ error: 'Unauthorized' }, 401);

  const body = await req.json();
  const slides: HeroSlide[] = body.slides ?? [];
  await setHeroSlides(slides);
  return json({ ok: true });
}
