export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, setHeroSlides, validateAdminToken } from '@/lib/kv';
import { DEFAULT_HERO_SLIDES } from '@/lib/data';
import { revalidatePath } from 'next/cache';
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
  try {
    const kv = await getHeroSlides();
    return NextResponse.json({ slides: kv ?? DEFAULT_HERO_SLIDES }, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[GET /api/hero-slides]', msg);
    return json({ error: 'Failed to load slides', details: msg }, 500);
  }
}

export async function PUT(req: NextRequest) {
  // â”€â”€ Auth: header-only â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) {
    console.error('[PUT /api/hero-slides] Unauthorized');
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { slides?: HeroSlide[] };
  try {
    body = await req.json();
  } catch (e) {
    console.error('[PUT /api/hero-slides] Bad JSON:', e);
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    await setHeroSlides(body.slides ?? []);
    revalidatePath('/');
    return json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[PUT /api/hero-slides] KV write failed:', msg);
    return json({ error: 'Failed to save slides', details: msg }, 500);
  }
}
