export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCountryMeta, setCountryMeta, validateAdminToken } from '@/lib/kv';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { CountryMeta } from '@/lib/kv';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  try {
    const country = new URL(req.url).searchParams.get('country');
    if (!country) return json({ error: 'country param required' }, 400);
    const meta = await getCountryMeta(country);
    return json({ meta });
  } catch (e: unknown) {
    console.error('[GET /api/country-meta]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load country meta' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { country?: string; meta?: CountryMeta };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/country-meta] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.country || !body.meta) return json({ error: 'country and meta required' }, 400);

  try {
    await setCountryMeta(body.country, body.meta);
    revalidatePath('/destinations');
    revalidatePath('/destinations/' + body.country);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/country-meta] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save country meta', details: (e as Error).message }, 500);
  }
}
