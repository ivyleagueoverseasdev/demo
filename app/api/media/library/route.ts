export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getMediaLibrary, addMediaToLibrary, validateAdminToken } from '@/lib/kv';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const urls = await getMediaLibrary();
    return json({ urls });
  } catch (e: unknown) {
    console.error('[GET /api/media/library]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load library' }, 500);
  }
}

export async function POST(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { url?: string };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[POST /api/media/library] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.url) return json({ error: 'url is required' }, 400);

  try {
    await addMediaToLibrary(body.url);
    const urls = await getMediaLibrary();
    return json({ ok: true, urls });
  } catch (e: unknown) {
    console.error('[POST /api/media/library] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to add to library', details: (e as Error).message }, 500);
  }
}

// PUT — replace the entire library list (used by delete operations in admin)
export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { urls?: string[] };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/media/library] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!Array.isArray(body.urls)) return json({ error: 'urls array is required' }, 400);

  try {
    const ctx = getOptionalRequestContext();
    const kv  = (ctx?.env as Record<string, unknown> | undefined)?.CONTENT_KV as
      { put(k: string, v: string): Promise<void> } | undefined;

    if (kv) {
      await kv.put('mediaLibrary', JSON.stringify(body.urls));
    } else {
      // Local dev — use the kv wrapper which falls back to DEV_STORE
      const { getMediaLibrary: _, addMediaToLibrary: __ } = await import('@/lib/kv');
      // Re-build the list by abusing the existing helpers isn't clean;
      // write directly to the globalThis store in dev.
      const g = globalThis as unknown as { __iloc_dev_store?: Map<string, string> };
      g.__iloc_dev_store?.set('mediaLibrary', JSON.stringify(body.urls));
    }
    return json({ ok: true, urls: body.urls });
  } catch (e: unknown) {
    console.error('[PUT /api/media/library] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to update library', details: (e as Error).message }, 500);
  }
}
