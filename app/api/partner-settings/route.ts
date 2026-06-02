export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerSettings, setPartnerSettings, validateAdminToken } from '@/lib/kv';
import type { PartnerPageSettings } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

type Page = 'institutions' | 'agent' | 'referral';
const VALID_PAGES: Page[] = ['institutions', 'agent', 'referral'];

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') as Page | null;
  if (!page || !VALID_PAGES.includes(page)) {
    return NextResponse.json({ error: 'page param required: institutions | agent | referral' }, { status: 400, headers: CORS });
  }
  const settings = await getPartnerSettings(page);
  return NextResponse.json({ settings }, { headers: CORS });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!(await validateAdminToken(String(token || '')))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }
  const body = await req.json() as { page: Page; settings: PartnerPageSettings };
  if (!body?.page || !VALID_PAGES.includes(body.page) || !body?.settings) {
    return NextResponse.json({ error: 'page and settings required' }, { status: 400, headers: CORS });
  }
  await setPartnerSettings(body.page, body.settings);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
