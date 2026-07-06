export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getCustomCountries, getHiddenCountries,
  setCustomCountries, setHiddenCountries, validateAdminToken,
} from '@/lib/kv';
import { getPublicCountries } from '@/lib/public-data';
import { appendAuditLog } from '@/lib/audit';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { CustomCountry } from '@/lib/types';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { ...CORS, 'Cache-Control': 'no-store' } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/**
 * GET — public. Returns the effective destination list (built-in minus hidden,
 * plus admin-added custom countries) along with the raw admin state so the
 * admin editor can render add/hide controls.
 */
export async function GET() {
  try {
    const [countries, custom, hidden] = await Promise.all([
      getPublicCountries(),
      getCustomCountries().catch(() => [] as CustomCountry[]),
      getHiddenCountries().catch(() => [] as string[]),
    ]);
    return json({ countries, custom, hidden });
  } catch (e: unknown) {
    console.error('[GET /api/countries]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load countries' }, 500);
  }
}

/** PUT — admin. Saves custom countries and/or the hidden built-in codes. */
export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { custom?: CustomCountry[]; hidden?: string[] };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/countries] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  try {
    if (body.custom !== undefined) {
      const cleaned = body.custom
        .filter(c => c && typeof c.code === 'string' && c.code.trim())
        .map(c => ({ ...c, code: c.code.trim().toLowerCase() }));
      await setCustomCountries(cleaned);
      await appendAuditLog({
        action: 'Updated Custom Countries', entity: 'countries', entityId: 'customCountries',
        entityName: 'Destination Countries', before: null, after: cleaned, published: true,
      });
    }
    if (body.hidden !== undefined) {
      const cleaned = body.hidden.filter(c => typeof c === 'string' && c.trim());
      await setHiddenCountries(cleaned);
      await appendAuditLog({
        action: 'Updated Hidden Countries', entity: 'countries', entityId: 'hiddenCountries',
        entityName: 'Destination Countries', before: null, after: cleaned, published: true,
      });
    }
    revalidatePath('/');
    revalidatePath('/destinations');
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/countries] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save countries', details: (e as Error).message }, 500);
  }
}
