export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCountryContent, setCountryContent, validateAdminToken } from '@/lib/kv';
import { isValidSection, getSubpageContent } from '@/lib/countrySubpages';
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
    const kvHtml = await getCountryContent(country, section);
    // No KV override yet → return the built-in default that is actually live
    // on the public page, so the admin editor shows existing content to edit.
    const fallback = isValidSection(section) ? getSubpageContent(country, section) : null;
    return json({ html: kvHtml ?? fallback ?? '', isDefault: kvHtml === null });
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
    revalidatePath('/destinations/' + body.country);
    revalidatePath('/destinations/' + body.country + '/' + body.section);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/country-content] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save content', details: (e as Error).message }, 500);
  }
}
