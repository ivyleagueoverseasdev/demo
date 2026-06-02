'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../layout';
import type { SiteEvent, Lead, NewsItem, DynamicPage } from '@/lib/types';
import type { AuditEntry } from '@/lib/schemas';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d    = Math.floor(diff / 86_400_000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon:   string;
  label:  string;
  value:  string | number;
  sub?:   string;
  color:  string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-jakarta font-extrabold text-2xl" style={{ color }}>{value}</span>
      </div>
      <p className="font-jakarta text-sm text-slate-600 font-semibold">{label}</p>
      {sub && <p className="font-jakarta text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── MiniBar ───────────────────────────────────────────────────────────────────
function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="font-jakarta text-xs text-slate-600 w-24 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-jakarta text-xs font-semibold text-slate-700 flex-shrink-0 w-6 text-right">{value}</span>
    </div>
  );
}

// ── ActivityRow ───────────────────────────────────────────────────────────────
function ActivityRow({ entry }: { entry: AuditEntry }) {
  const icons: Record<string, string> = {
    news: '📰', event: '📅', testimonials: '⭐',
    services: '🛠', processSteps: '📋', companyDetails: '🏢',
    globalSettings: '⚙️', lead: '📬',
  };
  const icon = icons[entry.entity] ?? '📝';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-jakarta text-sm text-slate-700 font-semibold truncate">{entry.action}</p>
        <p className="font-jakarta text-xs text-slate-400 truncate">{entry.entityName}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-jakarta text-xs font-semibold text-slate-500">{daysAgo(entry.timestamp)}</p>
        <p className="font-jakarta text-[10px] text-slate-300">{formatTime(entry.timestamp)}</p>
      </div>
    </div>
  );
}

// ── LeadRow ───────────────────────────────────────────────────────────────────
function RecentLeadRow({ lead }: { lead: Lead }) {
  const STATUS = { new: 'bg-blue-50 text-blue-700', contacted: 'bg-amber-50 text-amber-700', closed: 'bg-green-50 text-green-700' };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-jakarta font-bold text-white text-[10px] flex-shrink-0">
        {lead.name.split(' ').slice(0,2).map(w => w[0] ?? '').join('').toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-jakarta text-sm text-slate-700 font-semibold truncate">{lead.name}</p>
        <p className="font-jakarta text-xs text-slate-400">{lead.country || lead.source}</p>
      </div>
      <div className="text-right flex-shrink-0 space-y-0.5">
        <span className={`font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS[lead.status]}`}>{lead.status}</span>
        <p className="font-jakarta text-[10px] text-slate-300">{daysAgo(lead.createdAt)}</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const { token } = useAuth();

  const [events,    setEvents]    = useState<SiteEvent[]>([]);
  const [leads,     setLeads]     = useState<Lead[]>([]);
  const [news,      setNews]      = useState<NewsItem[]>([]);
  const [pages,     setPages]     = useState<DynamicPage[]>([]);
  const [auditLog,  setAuditLog]  = useState<AuditEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshed, setRefreshed] = useState<Date | null>(null);

  const hdrs = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, leadRes, newsRes, pageRes, auditRes] = await Promise.allSettled([
        fetch('/api/events',       { cache: 'no-store' }),
        fetch('/api/leads',        { headers: hdrs, cache: 'no-store' }),
        fetch('/api/news',         { cache: 'no-store' }),
        fetch('/api/pages',        { headers: hdrs, cache: 'no-store' }),
        fetch('/api/admin/audit',  { headers: hdrs, cache: 'no-store' }),
      ]);

      if (evRes.status    === 'fulfilled' && evRes.value.ok)    setEvents((await evRes.value.json()).events ?? []);
      if (leadRes.status  === 'fulfilled' && leadRes.value.ok)  setLeads((await leadRes.value.json()).leads ?? []);
      if (newsRes.status  === 'fulfilled' && newsRes.value.ok)  setNews((await newsRes.value.json()).news ?? []);
      if (pageRes.status  === 'fulfilled' && pageRes.value.ok)  setPages((await pageRes.value.json()).pages ?? []);
      if (auditRes.status === 'fulfilled' && auditRes.value.ok) setAuditLog((await auditRes.value.json()).log ?? []);
    } finally {
      setLoading(false);
      setRefreshed(new Date());
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(); }, [load]);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const today   = new Date().toISOString().slice(0, 10);
  const week    = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

  const pubEvents   = events.filter(e => e.published);
  const upcomingEv  = pubEvents.filter(e => e.date >= today);
  const newLeads    = leads.filter(l => l.createdAt?.startsWith(today));
  const weekLeads   = leads.filter(l => l.createdAt >= week);
  const pubNews     = news.filter(n => n.published);
  const pubPages    = pages.filter(p => p.published);
  const convRate    = leads.length ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100) : 0;

  // Lead source breakdown
  const sources = leads.reduce<Record<string, number>>((acc, l) => {
    const s = l.source || 'unknown';
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const topSources = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSrc     = topSources[0]?.[1] ?? 1;

  // Event type breakdown
  const evTypes = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});

  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const recentAudit = auditLog.slice(0, 8);

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-slate-100" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📈 Analytics</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">Internal KV database metrics — no external tracking required.</p>
        </div>
        <div className="flex items-center gap-3">
          {refreshed && (
            <span className="font-jakarta text-xs text-slate-400">
              Updated {formatTime(refreshed.toISOString())}
            </span>
          )}
          <button onClick={load} className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📬" label="Total Leads"      value={leads.length}     sub={`+${newLeads.length} today · +${weekLeads.length} this week`} color="#7C3AED" />
        <StatCard icon="📅" label="Upcoming Events"  value={upcomingEv.length} sub={`${pubEvents.length} published of ${events.length} total`}    color="#D97706" />
        <StatCard icon="📰" label="Published Articles" value={pubNews.length}  sub={`${news.length} total articles`}                               color="#246DFF" />
        <StatCard icon="📄" label="Live Pages"        value={pubPages.length}  sub={`${pages.length} total pages`}                                 color="#059669" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="font-jakarta font-extrabold text-2xl text-emerald-600">{convRate}%</div>
          <div className="font-jakarta text-xs text-slate-500 mt-1">Lead Conversion</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="font-jakarta font-extrabold text-2xl text-blue-600">{leads.filter(l => l.status === 'new').length}</div>
          <div className="font-jakarta text-xs text-slate-500 mt-1">New Leads</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="font-jakarta font-extrabold text-2xl text-amber-600">{leads.filter(l => l.status === 'contacted').length}</div>
          <div className="font-jakarta text-xs text-slate-500 mt-1">Contacted</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="font-jakarta font-extrabold text-2xl text-slate-700">{auditLog.length}</div>
          <div className="font-jakarta text-xs text-slate-500 mt-1">Audit Events</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-jakarta font-bold text-slate-800">📬 Recent Enquiries</h3>
            <a href="/admin/enquiries" className="font-jakarta text-xs text-amber-600 hover:underline">View all →</a>
          </div>
          {recentLeads.length === 0
            ? <p className="font-jakarta text-sm text-slate-400 text-center py-6">No leads yet.</p>
            : recentLeads.map(l => <RecentLeadRow key={l.id} lead={l} />)
          }
        </div>

        {/* Recent audit activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-jakarta font-bold text-slate-800">🕒 Recent Admin Activity</h3>
            <a href="/admin/history" className="font-jakarta text-xs text-amber-600 hover:underline">Full log →</a>
          </div>
          {recentAudit.length === 0
            ? <p className="font-jakarta text-sm text-slate-400 text-center py-6">No audit entries yet.</p>
            : recentAudit.map(e => <ActivityRow key={e.id} entry={e} />)
          }
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lead sources */}
        {topSources.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-jakarta font-bold text-slate-800 mb-4">📊 Lead Sources</h3>
            <div className="space-y-3">
              {topSources.map(([src, count]) => (
                <MiniBar key={src} label={src} value={count} max={maxSrc} color="#7C3AED" />
              ))}
            </div>
          </div>
        )}

        {/* Event type breakdown */}
        {Object.keys(evTypes).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-jakarta font-bold text-slate-800 mb-4">📅 Events by Type</h3>
            <div className="space-y-3">
              {Object.entries(evTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <MiniBar key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={count} max={events.length} color="#D97706" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Latest news */}
      {news.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-jakarta font-bold text-slate-800">📰 Latest Articles</h3>
            <a href="/admin/news" className="font-jakarta text-xs text-amber-600 hover:underline">Manage →</a>
          </div>
          <div className="space-y-2">
            {[...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.published ? 'bg-green-500' : 'bg-slate-300'}`} />
                <p className="flex-1 font-jakarta text-sm text-slate-700 truncate">{item.title}</p>
                <span className="font-jakarta text-xs text-slate-400 flex-shrink-0">{formatDate(item.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cloudflare dashboard link */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-jakarta font-bold text-lg mb-1">⚡ Cloudflare Web Analytics</h3>
          <p className="font-jakarta text-blue-200 text-sm">Real-time page views, visitor geography and referrers live in the Cloudflare dashboard.</p>
        </div>
        <a href="https://dash.cloudflare.com/?to=/:account/web-analytics" target="_blank" rel="noopener noreferrer"
          className="font-jakarta font-bold text-sm bg-white text-indigo-900 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex-shrink-0 shadow">
          Open Dashboard ↗
        </a>
      </div>
    </div>
  );
}
