export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getCountryContent, setCountryContent, validateAdminToken } from '@/lib/kv';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const section = searchParams.get('section');
    if (!country || !section) return json({ error: 'country and section params required' }, 400);
    const html = await getCountryContent(country, section);
    return json({ html });
  } catch (e: unknown) {
    console.error('[GET /api/country-content]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load content' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { country?: string; section?: string; html?: string };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/country-content] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.country || !body.section || body.html === undefined) {
    return json({ error: 'country, section, and html are required' }, 400);
  }

  try {
    await setCountryContent(body.country, body.section, body.html);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/country-content] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save content', details: (e as Error).message }, 500);
  }
}
