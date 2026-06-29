export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPages, getCompanyDetails, getGlobalSettings, getRedirects,
  getSiteContent, setCompanyDetails, setGlobalSettings, setRedirects,
  setSiteContent, validateAdminToken,
} from '@/lib/kv';
import { appendAuditLog } from '@/lib/audit';
import { parseBody, getBearerToken } from '@/lib/edge-utils';
import { revalidatePath } from 'next/cache';
import type { CompanyDetails, GlobalSettings, ServiceItem, ProcessStepItem, Testimonial, Update2026Card } from '@/lib/types';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const [pages, redirects, siteContent, companyDetails, globalSettings] = await Promise.all([
      getAllPages(),
      getRedirects(),
      getSiteContent(),
      getCompanyDetails(),
      getGlobalSettings(),
    ]);
    return NextResponse.json(
      { pages, redirects, siteContent: siteContent || {}, companyDetails: companyDetails || null, globalSettings: globalSettings || null },
      { headers: { ...CORS, 'Cache-Control': 'no-store' } },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[GET /api/content]', msg);
    return NextResponse.json({ error: 'Failed to load content', details: msg }, { status: 500, headers: CORS });
  }
}

export async function PUT(req: NextRequest) {
  // â”€â”€ Auth: read token from header ONLY â€” never consume body for auth â”€â”€â”€â”€â”€â”€
  const token  = getBearerToken(req);
  const authed = await validateAdminToken(token);
  if (!authed) {
    console.error('[PUT /api/content] Unauthorized â€” token:', token ? `${token.slice(0, 8)}â€¦` : 'missing');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  // â”€â”€ Parse body once via edge-safe helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  type ContentBody = {
    redirects?:        unknown[];
    services?:         ServiceItem[];
    processSteps?:     ProcessStepItem[];
    testimonials?:     Testimonial[];
    updates2026?:      Update2026Card[];
    updates2026Cols?:  number;
    companyDetails?:   CompanyDetails;
    globalSettings?:   GlobalSettings;
  };
  let body: ContentBody;
  try {
    body = await parseBody<ContentBody>(req);
  } catch (e) {
    console.error('[PUT /api/content] Failed to parse body:', e);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS });
  }

  try {
    if (body.redirects !== undefined)     await setRedirects(body.redirects as never);
    if (body.companyDetails !== undefined) await setCompanyDetails(body.companyDetails);
    if (body.globalSettings !== undefined) await setGlobalSettings(body.globalSettings);

    // Merge site-content fields into the shared KV key
    if (body.services !== undefined || body.processSteps !== undefined || body.testimonials !== undefined ||
        body.updates2026 !== undefined || body.updates2026Cols !== undefined) {
      const existing = (await getSiteContent<Record<string, unknown>>()) ?? {};
      const updated: Record<string, unknown> = { ...existing };

      if (body.services !== undefined) {
        await appendAuditLog({ action: 'Updated Services', entity: 'services', entityId: 'services', entityName: 'Services List', before: existing.services ?? null, after: body.services, published: true });
        updated.services = body.services;
      }
      if (body.processSteps !== undefined) {
        await appendAuditLog({ action: 'Updated Process Steps', entity: 'processSteps', entityId: 'processSteps', entityName: 'Process Steps', before: existing.processSteps ?? null, after: body.processSteps, published: true });
        updated.processSteps = body.processSteps;
      }
      if (body.testimonials !== undefined) {
        await appendAuditLog({ action: 'Updated Testimonials', entity: 'testimonials', entityId: 'testimonials', entityName: 'Testimonials List', before: existing.testimonials ?? null, after: body.testimonials, published: true });
        updated.testimonials = body.testimonials;
      }
      if (body.updates2026 !== undefined) {
        await appendAuditLog({ action: 'Updated 2026 Cards', entity: 'updates2026', entityId: 'updates2026', entityName: '2026 Update Cards', before: existing.updates2026 ?? null, after: body.updates2026, published: true });
        updated.updates2026 = body.updates2026;
      }
      if (body.updates2026Cols !== undefined) {
        updated.updates2026Cols = body.updates2026Cols;
      }

      await setSiteContent(updated);
    }

    if (body.companyDetails !== undefined) {
      await appendAuditLog({ action: 'Updated Company Details', entity: 'companyDetails', entityId: 'companyDetails', entityName: 'Company Details', before: null, after: body.companyDetails, published: true });
    }
    if (body.globalSettings !== undefined) {
      await appendAuditLog({ action: 'Updated Global Settings', entity: 'globalSettings', entityId: 'globalSettings', entityName: 'Global Settings', before: null, after: body.globalSettings, published: true });
    }

    revalidatePath('/');
    revalidatePath('/contact');
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[PUT /api/content] KV write failed:', msg);
    return NextResponse.json({ error: 'Failed to save content', details: msg }, { status: 500, headers: CORS });
  }
}
