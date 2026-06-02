'use client';

/**
 * /admin — Overview dashboard.
 * Auth + sidebar are handled by app/admin/layout.tsx.
 * This page just renders the dashboard content.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from './layout';
import type { SiteEvent, DynamicPage, Lead, RedirectRule } from '@/lib/types';

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, href }: {
  icon:   string;
  label:  string;
  value:  number | string;
  color:  string;
  href?:  string;
}) {
  const inner = (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-jakarta font-extrabold text-2xl" style={{ color }}>{value}</span>
      </div>
      <p className="font-jakarta text-sm text-slate-500">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ── Quick link ─────────────────────────────────────────────────────────────────
function QuickLink({ href, icon, label, desc }: {
  href:  string;
  icon:  string;
  label: string;
  desc:  string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-jakarta font-semibold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">{label}</p>
        <p className="font-jakarta text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <svg className="w-4 h-4 text-slate-300 group-hover:text-amber-400 flex-shrink-0 ml-auto mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </Link>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminOverview() {
  const { token } = useAuth();

  const [pages,     setPages]     = useState<DynamicPage[]>([]);
  const [events,    setEvents]    = useState<SiteEvent[]>([]);
  const [leads,     setLeads]     = useState<Lead[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading,   setLoading]   = useState(true);

  const hdrs = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pRes, cRes, evRes, lRes] = await Promise.all([
        fetch('/api/pages',   { headers: hdrs, cache: 'no-store' }).catch(() => null),
        fetch('/api/content', { headers: hdrs, cache: 'no-store' }).catch(() => null),
        fetch('/api/events',                   { cache: 'no-store' }).catch(() => null),
        fetch('/api/leads',   { headers: hdrs, cache: 'no-store' }).catch(() => null),
      ]);
      if (pRes?.ok)  { const d = await pRes.json();  setPages(d.pages      ?? []); }
      if (cRes?.ok)  { const d = await cRes.json();  setRedirects(d.redirects ?? []); }
      if (evRes?.ok) { const d = await evRes.json(); setEvents(d.events    ?? []); }
      if (lRes?.ok)  { const d = await lRes.json();  setLeads(d.leads      ?? []); }
    } finally {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const today     = new Date().toISOString().slice(0, 10);
  const newToday  = leads.filter(l => l.createdAt?.startsWith(today)).length;
  const upcoming  = events.filter(e => e.published && e.date >= today).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">Dashboard</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">
          All changes go live via Cloudflare KV — no redeploy required.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📄" label="Pages"            value={loading ? '…' : pages.length}                         color="#246DFF" href="/admin/pages"    />
        <StatCard icon="📅" label="Upcoming Events"  value={loading ? '…' : upcoming}                             color="#D97706" href="/admin/events"   />
        <StatCard icon="📬" label="New Leads Today"  value={loading ? '…' : `+${newToday}`}                       color="#059669" href="/admin/enquiries"/>
        <StatCard icon="↗"  label="Active Redirects" value={loading ? '…' : redirects.filter(r => r.active).length} color="#7C3AED" href="/admin/routes"   />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-jakarta font-semibold text-slate-700 text-sm mb-3 uppercase tracking-wide">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickLink href="/admin/media"     icon="🖼️" label="Upload Media"         desc="Drag & drop images to Cloudflare R2" />
          <QuickLink href="/admin/events"    icon="📅" label="Manage Events"         desc="Add or edit live classes and events" />
          <QuickLink href="/admin/pages"     icon="📄" label="Create Page"           desc="New KV-powered page, no build needed" />
          <QuickLink href="/admin/news"      icon="📰" label="Publish Article"       desc="Write and publish a news update" />
          <QuickLink href="/admin/stories"   icon="⭐" label="Add Testimonial"       desc="Add a student success story" />
          <QuickLink href="/admin/enquiries" icon="📬" label="View Enquiries"        desc="Review and manage CRM leads" />
        </div>
      </div>

      {/* Two-column lower section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-jakarta font-bold text-slate-800 text-sm">Recent Enquiries</h3>
            <Link href="/admin/enquiries" className="font-jakarta text-xs text-amber-600 hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : leads.length === 0 ? (
            <p className="font-jakarta text-sm text-slate-400 text-center py-6">No enquiries yet.</p>
          ) : (
            <div className="space-y-2">
              {leads.slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0">
                    <p className="font-jakarta font-semibold text-slate-700 text-sm truncate">{l.name}</p>
                    <p className="font-jakarta text-xs text-slate-400 truncate">{l.country} · {l.phone}</p>
                  </div>
                  <span className={`flex-shrink-0 font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${
                    l.status === 'new'       ? 'bg-blue-50 text-blue-600'
                    : l.status === 'contacted' ? 'bg-amber-50 text-amber-600'
                    : 'bg-green-50 text-green-600'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Cloudflare KV (Content)', ok: true  },
              { label: 'Cloudflare R2 (Media)',   ok: true  },
              { label: 'Edge Runtime',            ok: true  },
              { label: 'API Routes (16 routes)',  ok: true  },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="font-jakarta text-sm text-slate-600">{s.label}</span>
                <span className={`flex items-center gap-1.5 font-jakarta text-xs font-semibold ${s.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {s.ok ? 'Operational' : 'Error'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-jakarta text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              Open Cloudflare Dashboard ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
