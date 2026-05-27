export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getAllPages, getCompanyDetails, getGlobalSettings, getRedirects, getSiteContent, setCompanyDetails, setGlobalSettings, setRedirects, setSiteContent, validateAdminToken } from '@/lib/kv';
import type { CompanyDetails, GlobalSettings, ServiceItem, ProcessStepItem, Testimonial } from '@/lib/types';


const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  const [pages, redirects, siteContent, companyDetails, globalSettings] = await Promise.all([
    getAllPages(),
    getRedirects(),
    getSiteContent(),
    getCompanyDetails(),
    getGlobalSettings(),
  ]);
  return NextResponse.json(
    { pages, redirects, siteContent: siteContent || {}, companyDetails: companyDetails || null, globalSettings: globalSettings || null },
    { headers: { ...CORS, 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    || (await req.clone().json().catch(() => ({}))).token;
  const authed = await validateAdminToken(String(token || ''));
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const body = await req.json() as {
    redirects?:        unknown[];
    services?:         ServiceItem[];
    processSteps?:     ProcessStepItem[];
    testimonials?:     Testimonial[];
    companyDetails?:   CompanyDetails;
    globalSettings?:   GlobalSettings;
  };

  if (body.redirects)        await setRedirects(body.redirects as never);
  if (body.companyDetails)   await setCompanyDetails(body.companyDetails);
  if (body.globalSettings)   await setGlobalSettings(body.globalSettings);

  // Merge services / processSteps / testimonials into the site content KV key
  if (body.services !== undefined || body.processSteps !== undefined || body.testimonials !== undefined) {
    const existing = (await getSiteContent<Record<string, unknown>>()) ?? {};
    const updated: Record<string, unknown> = { ...existing };
    if (body.services      !== undefined) updated.services      = body.services;
    if (body.processSteps  !== undefined) updated.processSteps  = body.processSteps;
    if (body.testimonials  !== undefined) updated.testimonials  = body.testimonials;
    await setSiteContent(updated);
  }

  return NextResponse.json({ ok: true }, { headers: CORS });
}
