export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSiteMedia, setSiteMedia, validateAdminToken } from '@/lib/kv';
import { DEFAULT_MEDIA } from '@/lib/data';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const media = await getSiteMedia();
    return NextResponse.json(media ?? DEFAULT_MEDIA, {
      headers: { ...CORS, 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (e: unknown) {
    console.error('[GET /api/media]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load media' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { heroImages?: string[]; aboutImage?: string; officeImage?: string; countryImages?: Record<string, string> };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/media] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  try {
    const existing = await getSiteMedia() ?? { ...DEFAULT_MEDIA };
    const updated  = {
      ...existing,
      ...(body.heroImages    !== undefined && { heroImages:    body.heroImages    }),
      ...(body.aboutImage    !== undefined && { aboutImage:    body.aboutImage    }),
      ...(body.officeImage   !== undefined && { officeImage:   body.officeImage   }),
      ...(body.countryImages !== undefined && { countryImages: body.countryImages }),
    };
    await setSiteMedia(updated);
    return json({ ok: true, media: updated });
  } catch (e: unknown) {
    console.error('[PUT /api/media] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save media', details: (e as Error).message }, 500);
  }
}
