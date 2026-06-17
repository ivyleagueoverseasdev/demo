export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getLeads, upsertLead, deleteLead, validateAdminToken } from '@/lib/kv';
import { parseBody, getBearerToken, CORS } from '@/lib/edge-utils';
import type { Lead } from '@/lib/types';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// -- POST: public -- save a new lead and send email notification ---------------
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[POST /api/leads] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.name || !body.phone) {
    return json({ error: 'name and phone are required' }, 400);
  }

  const lead: Lead = {
    id:        `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name:      String(body.name    ?? '').trim(),
    phone:     String(body.phone   ?? '').trim(),
    email:     String(body.email   ?? '').trim(),
    country:   String(body.country ?? '').trim(),
    program:   String(body.program ?? '').trim(),
    message:   String(body.message ?? '').trim(),
    status:    'new',
    source:    String(body.source  ?? 'website').trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    await upsertLead(lead);
  } catch (e: unknown) {
    console.error('[POST /api/leads] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to save enquiry', details: (e as Error).message }, 500);
  }

  // Fire-and-forget -- a failed email must never block the lead from being saved.
  void sendLeadEmail(lead, req).catch(e =>
    console.error('[POST /api/leads] Email send failed:', (e as Error).stack ?? e)
  );

  return json({ ok: true, id: lead.id }, 201);
}

// -- Email notification via Google Apps Script --------------------------------
async function sendLeadEmail(lead: Lead, req: NextRequest): Promise<void> {
  // Read GOOGLE_SCRIPT_URL from Cloudflare env (set via Pages dashboard or wrangler secret)
  const { getOptionalRequestContext } = await import('@cloudflare/next-on-pages');
  const ctx = getOptionalRequestContext();
  const scriptUrl = (ctx?.env as Record<string, string> | undefined)?.GOOGLE_SCRIPT_URL
    ?? process.env.GOOGLE_SCRIPT_URL
    ?? '';

  if (!scriptUrl) {
    console.warn('[leads/email] GOOGLE_SCRIPT_URL not configured -- skipping notification');
    return;
  }

  const origin = new URL(req.url).origin;
  const payload = JSON.stringify({
    name:     lead.name,
    phone:    lead.phone,
    email:    lead.email,
    country:  lead.country,
    program:  lead.program,
    message:  lead.message,
    source:   lead.source,
    id:       lead.id,
    adminUrl: `${origin}/admin/enquiries`,
    time:     new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
  });

  try {
    // GAS /exec returns a 302 redirect. The Edge fetch follows it as GET (per RFC),
    // dropping the body. We use redirect:'manual', then re-POST to the Location URL.
    let res = await fetch(scriptUrl, {
      method:   'POST',
      headers:  { 'Content-Type': 'application/json' },
      body:     payload,
      redirect: 'manual',
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        res = await fetch(location, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    payload,
        });
      }
    }

    if (!res.ok) {
      const err = await res.text().catch(() => 'unknown');
      console.error('[leads/email] Google Script error:', res.status, err);
    } else {
      console.log('[leads/email] Notification sent for lead:', lead.id);
    }
  } catch (e) {
    console.error('[leads/email] Google Script fetch failed:', (e as Error).stack ?? e);
  }
}

// -- GET: admin -- list all leads ----------------------------------------------
export async function GET(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);
  try {
    const leads = await getLeads();
    return json({ leads });
  } catch (e: unknown) {
    console.error('[GET /api/leads]', (e as Error).stack ?? e);
    return json({ error: 'Failed to load leads' }, 500);
  }
}

// -- PUT: admin -- update status or delete ------------------------------------
export async function PUT(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  let body: { id?: string; status?: string; delete?: boolean };
  try {
    body = await parseBody(req);
  } catch (e) {
    console.error('[PUT /api/leads] parse error:', e);
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!body.id) return json({ error: 'id required' }, 400);

  try {
    if (body.delete === true) {
      await deleteLead(body.id);
      return json({ ok: true });
    }

    const leads = await getLeads();
    const lead  = leads.find(l => l.id === body.id);
    if (!lead) return json({ error: 'Lead not found' }, 404);

    if (body.status && ['new', 'contacted', 'closed'].includes(body.status)) {
      lead.status = body.status as Lead['status'];
    }
    await upsertLead(lead);
    return json({ ok: true });
  } catch (e: unknown) {
    console.error('[PUT /api/leads] KV write failed:', (e as Error).stack ?? e);
    return json({ error: 'Failed to update lead', details: (e as Error).message }, 500);
  }
}
