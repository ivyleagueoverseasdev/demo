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

// â”€â”€ POST â€” public: save a new lead and send email notification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Email notification via Resend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Fire-and-forget â€” a failed email must never block the lead from being saved.
  void sendLeadEmail(lead, req).catch(e =>
    console.error('[POST /api/leads] Email send failed:', (e as Error).stack ?? e)
  );

  return json({ ok: true, id: lead.id }, 201);
}

async function sendLeadEmail(lead: Lead, req: NextRequest): Promise<void> {
  // Read RESEND_API_KEY from Cloudflare env (injected via wrangler.toml secret)
  const { getOptionalRequestContext } = await import('@cloudflare/next-on-pages');
  const ctx = getOptionalRequestContext();
  const apiKey = (ctx?.env as Record<string, string> | undefined)?.RESEND_API_KEY
    ?? process.env.RESEND_API_KEY
    ?? '';

  if (!apiKey) {
    console.warn('[leads/email] RESEND_API_KEY not configured â€” skipping notification');
    return;
  }

  const html = `
    <h2>New Enquiry â€” ILOC Website</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="font-weight:bold;color:#555">Name</td><td>${lead.name}</td></tr>
      <tr><td style="font-weight:bold;color:#555">Phone</td><td><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
      <tr><td style="font-weight:bold;color:#555">Email</td><td><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
      <tr><td style="font-weight:bold;color:#555">Country</td><td>${lead.country || 'â€”'}</td></tr>
      <tr><td style="font-weight:bold;color:#555">Program</td><td>${lead.program || 'â€”'}</td></tr>
      <tr><td style="font-weight:bold;color:#555">Source</td><td>${lead.source}</td></tr>
      <tr><td style="font-weight:bold;color:#555">Message</td><td style="max-width:420px">${lead.message || 'â€”'}</td></tr>
      <tr><td style="font-weight:bold;color:#555">Time</td><td>${new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
    </table>
    <p style="margin-top:16px;font-size:12px;color:#999">
      Lead ID: ${lead.id} Â· View in admin: ${new URL(req.url).origin}/admin/enquiries
    </p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:    'ILOC Enquiries <notifications@resend.dev>',
      to:      ['ivyleagueoverseas@gmail.com'],
      subject: `ðŸŽ“ New Enquiry: ${lead.name} (${lead.country || lead.source})`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    console.error('[leads/email] Resend API error:', res.status, err);
  } else {
    console.log('[leads/email] Notification sent for lead:', lead.id);
  }
}

// â”€â”€ GET â€” admin: list all leads â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ PUT â€” admin: update status or delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
