export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getMarqueeSettings, setMarqueeSettings, validateAdminToken } from '@/lib/kv';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import { revalidatePath } from 'next/cache';
import type { MarqueeSettings } from '@/lib/kv';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const settings = await getMarqueeSettings();
    return json({ settings });
  } catch (e: unknown) {
    console.error('[GET /api/marquee]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load settings' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let settings: Partial<MarqueeSettings>;
  try {
    settings = await parseBody<Partial<MarqueeSettings>>(req);
  } catch (e) {
    console.error('[PUT /api/marquee] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!settings || typeof settings !== 'object') return json({ error: 'settings body required' }, 400);

  try {
    await setMarqueeSettings(settings as MarqueeSettings);
    revalidatePath('/');
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/marquee] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save settings', details: (e as Error).message }, 500);
  }
}
