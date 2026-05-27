export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getLeads, upsertLead, deleteLead, validateAdminToken } from '@/lib/kv';
import type { Lead } from '@/lib/types';


const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// POST — public: store a new lead from any enquiry form
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.phone) {
    return NextResponse.json({ error: 'name and phone are required' }, { status: 400, headers: CORS });
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

  await upsertLead(lead);

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201, headers: CORS });
}

// GET — admin only: return all leads
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const leads = await getLeads();
  return NextResponse.json({ leads }, {
    headers: {
      ...CORS,
      'Cache-Control': 'no-store',
    },
  });
}

// PUT — admin only: update lead status or delete
export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  const authed = await validateAdminToken(token);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400, headers: CORS });

  if (body.delete === true) {
    await deleteLead(body.id);
    return NextResponse.json({ ok: true }, { headers: CORS });
  }

  const leads = await getLeads();
  const lead = leads.find(l => l.id === body.id);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS });

  if (body.status && ['new', 'contacted', 'closed'].includes(body.status)) {
    lead.status = body.status;
  }

  await upsertLead(lead);
  return NextResponse.json({ ok: true }, { headers: CORS });
}
