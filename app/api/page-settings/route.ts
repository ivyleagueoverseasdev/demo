export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Settings for the /about and /services pages.
// GET  /api/page-settings?page=about|services  → { settings } (raw KV, null if unset)
// PUT  /api/page-settings { page, settings }   → auth required

import { NextRequest, NextResponse } from 'next/server';
import {
  getAboutSettings, setAboutSettings,
  getServicesSettings, setServicesSettings,
  validateAdminToken,
} from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import { revalidatePath } from 'next/cache';
import type { AboutPageSettings, ServicesPageSettings } from '@/lib/types';

type Page = 'about' | 'services';
const VALID_PAGES: Page[] = ['about', 'services'];

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
      return json({ error: 'page param required: about | services' }, 400);
    }
    const settings = page === 'about' ? await getAboutSettings() : await getServicesSettings();
    return json({ settings });
  } catch (e: unknown) {
    console.error('[GET /api/page-settings]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load settings' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { page?: Page; settings?: AboutPageSettings | ServicesPageSettings };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/page-settings] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.page || !VALID_PAGES.includes(body.page) || !body.settings) {
    return json({ error: 'page and settings required' }, 400);
  }

  try {
    if (body.page === 'about') {
      await setAboutSettings(body.settings as AboutPageSettings);
    } else {
      await setServicesSettings(body.settings as ServicesPageSettings);
    }
    await appendAuditLog({
      action:     `Updated ${body.page === 'about' ? 'About' : 'Services'} Page`,
      entity:     'pageSettings',
      entityId:   body.page,
      entityName: body.page === 'about' ? 'About Page' : 'Services Page',
      before:     null,
      after:      body.settings,
      published:  true,
    });
    revalidatePath(body.page === 'about' ? '/about' : '/services');
    revalidatePath('/');
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/page-settings] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save settings', details: (e as Error).message }, 500);
  }
}
