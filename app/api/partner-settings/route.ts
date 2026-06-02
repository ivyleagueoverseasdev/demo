export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerSettings, setPartnerSettings, validateAdminToken } from '@/lib/kv';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { PartnerPageSettings } from '@/lib/kv';

type Page = 'institutions' | 'agent' | 'referral';
const VALID_PAGES: Page[] = ['institutions', 'agent', 'referral'];

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get('page') as Page | null;
    if (!page || !VALID_PAGES.includes(page)) {
      return json({ error: 'page param required: institutions | agent | referral' }, 400);
    }
    const settings = await getPartnerSettings(page);
    return json({ settings });
  } catch (e: unknown) {
    console.error('[GET /api/partner-settings]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load settings' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { page?: Page; settings?: PartnerPageSettings };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/partner-settings] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.page || !VALID_PAGES.includes(body.page) || !body.settings) {
    return json({ error: 'page and settings required' }, 400);
  }

  try {
    await setPartnerSettings(body.page, body.settings);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/partner-settings] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save settings', details: (e as Error).message }, 500);
  }
}
