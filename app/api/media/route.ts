import { NextRequest, NextResponse } from 'next/server';
import { getSiteMedia, setSiteMedia, validateAdminToken } from '@/lib/kv';
import { DEFAULT_MEDIA } from '@/lib/data';

export const runtime = 'edge';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const media = await getSiteMedia();
  return NextResponse.json(media ?? DEFAULT_MEDIA, {
    headers: {
      ...CORS,
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const body = await req.json() as {
    heroImages?:     string[];
    aboutImage?:     string;
    officeImage?:    string;
    countryImages?:  Record<string, string>;
  };

  const existing = await getSiteMedia() ?? { ...DEFAULT_MEDIA };
  const updated = {
    ...existing,
    ...(body.heroImages     !== undefined && { heroImages:     body.heroImages     }),
    ...(body.aboutImage     !== undefined && { aboutImage:     body.aboutImage     }),
    ...(body.officeImage    !== undefined && { officeImage:    body.officeImage    }),
    ...(body.countryImages  !== undefined && { countryImages:  body.countryImages  }),
  };

  await setSiteMedia(updated);
  return NextResponse.json({ ok: true, media: updated }, { headers: CORS });
}
