'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../layout';
import { apiCall } from '@/lib/edge-utils';
import type { Lead } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new:       { label: 'New',       bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200'  },
  contacted: { label: 'Contacted', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  closed:    { label: 'Closed',    bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
};
type LeadStatus = keyof typeof STATUS_CONFIG;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ leads }: { leads: Lead[] }) {
  const today  = new Date().toISOString().slice(0, 10);
  const stats = [
    { label: 'Total Leads',    value: leads.length,                                         bg: 'bg-slate-50 border-slate-200',   text: 'text-slate-700' },
    { label: 'New',            value: leads.filter(l => l.status === 'new').length,         bg: 'bg-lime-50 border-lime-200',     text: 'text-lime-700'  },
    { label: 'Contacted',      value: leads.filter(l => l.status === 'contacted').length,   bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700' },
    { label: 'Closed/Won',     value: leads.filter(l => l.status === 'closed').length,      bg: 'bg-green-50 border-green-200',   text: 'text-green-700' },
    { label: 'Today',          value: leads.filter(l => l.createdAt?.startsWith(today)).length, bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-2xl border ${s.bg} px-4 py-3 text-center`}>
          <div className={`font-jakarta font-extrabold text-xl ${s.text}`}>{s.value}</div>
          <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`font-jakarta text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border} flex-shrink-0`}>
      {c.label}
    </span>
  );
}

// ── StatusDropdown ────────────────────────────────────────────────────────────
function StatusDropdown({ lead, onUpdate }: { lead: Lead; onUpdate: (id: string, status: LeadStatus) => void }) {
  return (
    <select
      value={lead.status}
      onChange={e => onUpdate(lead.id, e.target.value as LeadStatus)}
      className="font-jakarta text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer"
    >
      {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
      ))}
    </select>
  );
}

// ── LeadRow ───────────────────────────────────────────────────────────────────
function LeadRow({ lead, onUpdate, onDelete }: {
  lead:     Lead;
  onUpdate: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 p-4 sm:p-5">
        {/* Avatar initials */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-600 to-lime-500 flex items-center justify-center font-jakarta font-bold text-white text-xs flex-shrink-0">
          {lead.name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Row 1: name + status */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-jakarta font-bold text-slate-800 text-sm">{lead.name}</span>
            <StatusBadge status={lead.status as LeadStatus} />
          </div>
          {/* Row 2: contact + meta */}
          <div className="font-jakarta text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="hover:text-lime-600 transition-colors">📞 {lead.phone}</a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="hover:text-lime-600 transition-colors truncate max-w-[180px]">✉ {lead.email}</a>
            )}
            {lead.country  && <span>🌍 {lead.country}</span>}
            {lead.program  && <span>📚 {lead.program}</span>}
            {lead.source   && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{lead.source}</span>}
          </div>
          {/* Timestamp */}
          <p className="font-jakarta text-[10px] text-slate-300 mt-1">{formatDate(lead.createdAt)}</p>

          {/* Message expansion */}
          {lead.message && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(e => !e)}
                className="font-jakarta text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                {expanded ? '▲ Hide message' : '▼ Show message'}
              </button>
              {expanded && (
                <p className="font-jakarta text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  {lead.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
          <StatusDropdown lead={lead} onUpdate={onUpdate} />
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(lead.name)}, this is ILOC regarding your enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="WhatsApp"
            >
              💬
            </a>
          )}
          <button
            onClick={() => onDelete(lead.id)}
            className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  sourceFilter, setSourceFilter,
  sources,
}: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  sourceFilter: string; setSourceFilter: (v: string) => void;
  sources: string[];
}) {
  const active = search || statusFilter || sourceFilter;
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, phone…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white"
        />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Statuses</option>
        {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
        ))}
      </select>
      {sources.length > 0 && (
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
          <option value="">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
      {active && (
        <button onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); }}
          className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          Clear
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminEnquiriesPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [leads,        setLeads]        = useState<Lead[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy,       setSortBy]       = useState<'newest' | 'oldest' | 'status'>('newest');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      });
      if (res.ok) { const d = await res.json() as any; setLeads(d.leads ?? []); }
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const t = setInterval(() => { void load(); }, 30_000);
    return () => clearInterval(t);
  }, [load]);

  async function handleUpdate(id: string, status: LeadStatus) {
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/leads', token, body: { id, status } });
    if (!ok) { flash(`Failed to update status: ${error}`, 'error'); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    flash(`Status updated to ${STATUS_CONFIG[status].label}.`, 'success');
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead permanently?')) return;
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/leads', token, body: { id, delete: true } });
    if (!ok) { flash(`Delete failed: ${error}`, 'error'); return; }
    setLeads(prev => prev.filter(l => l.id !== id));
    flash('Lead deleted.', 'info');
  }

  // Unique sources for filter dropdown
  const sources = [...new Set(leads.map(l => l.source).filter(Boolean))].sort();

  // Filter + sort
  const filtered = leads
    .filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q) && !l.phone.includes(q)) return false;
      }
      if (statusFilter && l.status !== statusFilter) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      return a.status.localeCompare(b.status);
    });

  const convRate = leads.length > 0
    ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📬 Enquiries</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            CRM for incoming leads. Updates sync to KV instantly. Auto-refreshes every 30 s.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {leads.length > 0 && (
            <span className="font-jakarta text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              {convRate}% conversion rate
            </span>
          )}
          <button onClick={load} className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && leads.length > 0 && <StatsBar leads={leads} />}

      {/* Sort + Filter */}
      {!loading && leads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-jakarta text-xs text-slate-500">Sort:</span>
            {(['newest', 'oldest', 'status'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`font-jakarta text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors capitalize ${sortBy === s ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s}
              </button>
            ))}
          </div>
          <FilterBar
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            sourceFilter={sourceFilter} setSourceFilter={setSourceFilter}
            sources={sources}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">📬</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {leads.length === 0 ? 'No enquiries yet' : 'No enquiries match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400">
            {leads.length === 0
              ? 'Leads submitted via the contact or quick-enquiry form will appear here.'
              : 'Try clearing your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => (
            <LeadRow key={lead.id} lead={lead} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
          {filtered.length < leads.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">
              Showing {filtered.length} of {leads.length} leads
            </p>
          )}
        </div>
      )}
    </div>
  );
}
