export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// POST /api/partner-enquiry
// Accepts partner form data, generates type-specific email templates,
// and forwards to the Google Apps Script webhook — same pattern as /api/leads.

import { NextRequest, NextResponse } from 'next/server';
import { parseBody, CORS } from '@/lib/edge-utils';
import { generatePartnerEmail, type PartnerType } from '@/lib/partnerEmail';

const VALID_TYPES: PartnerType[] = ['institutions', 'agent', 'referral'];

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[partner-enquiry] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  const name        = String(body.name        ?? '').trim();
  const companyName = String(body.companyName ?? '').trim();
  const partnerType = String(body.partnerType ?? '') as PartnerType;

  if (!name)                          return json({ error: 'name is required' }, 400);
  if (!VALID_TYPES.includes(partnerType))
    return json({ error: 'partnerType must be institutions | agent | referral' }, 400);

  const origin = new URL(req.url).origin;

  const { userSubject, userHtml, adminSubject, adminHtml } = generatePartnerEmail(
    name,
    companyName,
    partnerType,
    {
      email:           String(body.email           ?? '').trim(),
      phone:           String(body.phone           ?? '').trim(),
      designation:     String(body.designation     ?? '').trim(),
      country:         String(body.country         ?? '').trim(),
      yearsInBusiness: String(body.yearsInBusiness ?? '').trim(),
      expectedVolume:  String(body.expectedVolume  ?? '').trim(),
      friendName:      String(body.friendName      ?? '').trim(),
      friendPhone:     String(body.friendPhone     ?? '').trim(),
      message:         String(body.message         ?? '').trim(),
    },
    `${origin}/admin/enquiries`,
  );

  // Build GAS payload — the four custom keys let GAS skip its default
  // student-enquiry template and use these pre-built subjects/bodies instead.
  const gasPayload = JSON.stringify({
    name,
    email:              String(body.email ?? '').trim(),
    source:             `partner-${partnerType}`,
    customUserSubject:  userSubject,
    customUserHtml:     userHtml,
    customAdminSubject: adminSubject,
    customAdminHtml:    adminHtml,
  });

  // Await the GAS fetch before responding — Cloudflare Workers kill the
  // isolate the moment the Response is returned, so fire-and-forget dies.
  // Promise.race gives GAS up to 8 s; after that we return anyway.
  await Promise.race([
    sendToGAS(gasPayload),
    new Promise<void>(resolve => setTimeout(resolve, 8000)),
  ]).catch(e =>
    console.error('[partner-enquiry] Email send failed:', (e as Error).stack ?? e)
  );

  return json({ ok: true });
}

async function sendToGAS(payload: string): Promise<void> {
  const { getOptionalRequestContext } = await import('@cloudflare/next-on-pages');
  const ctx       = getOptionalRequestContext();
  const cfUrl     = (ctx?.env as Record<string, string> | undefined)?.GOOGLE_SCRIPT_URL ?? '';
  const procUrl   = process.env.GOOGLE_SCRIPT_URL ?? '';
  const scriptUrl = cfUrl || procUrl;

  if (!scriptUrl) {
    console.error('[partner-enquiry] GOOGLE_SCRIPT_URL not configured — email skipped');
    return;
  }

  try {
    const res = await fetch(scriptUrl, {
      method:   'POST',
      headers:  { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:     new URLSearchParams({ data: payload }).toString(),
      redirect: 'follow',
    });
    if (!res.ok) {
      console.error('[partner-enquiry] GAS returned error:', res.status, res.statusText);
    }
  } catch (e) {
    console.error('[partner-enquiry] fetch error:', (e as Error).message);
    throw e;
  }
}
