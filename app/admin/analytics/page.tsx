'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../_context';
import type { SiteEvent, Lead, NewsItem, DynamicPage } from '@/lib/types';
import type { AuditEntry } from '@/lib/schemas';
import { TrafficChart } from '@/components/admin/TrafficChart';
import type { ChartPoint } from '@/components/admin/TrafficChart';
import Link from 'next/link';
import { SkeletonAnalyticsGrid } from '@/components/admin/SkeletonCard';

// ── Traffic data shape ────────────────────────────────────────────────────────
interface TrafficStats {
  live:        number;
  today:       number;
  yesterday:   number;
  week:        number;
  lastWeek:    number;
  month:       number;
  lastMonth:   number;
  todayTrend:  number;
  weekTrend:   number;
  monthTrend:  number;
  chart:       ChartPoint[];
  countries:   { locationKey: string; code: string; city: string | null; name: string; count: number; pct: number }[];
  sources:     { key: string; name: string; count: number; pct: number }[];
}

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

function flagEmoji(code: string): string {
  if (!code || code === 'XX') return '🌍';
  return [...code.toUpperCase()]
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

const SOURCE_ICONS: Record<string, string> = {
  direct:    '🔗', google:    '🔍', bing:    '🔎',
  yahoo:     '🔎', facebook:  '📱', instagram: '📸',
  linkedin:  '💼', twitter:   '🐦', youtube:   '▶️',
  whatsapp:  '💬', referral:  '↗️',
};

// ── CMS helper components ──────────────────────────────────────────────────────
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

function ActivityRow({ entry }: { entry: AuditEntry }) {
  const icons: Record<string, string> = {
    news: '📰', event: '📅', testimonials: '⭐',
    services: '🛠', processSteps: '📋', companyDetails: '🏢',
    globalSettings: '⚙️', lead: '📬',
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
        {icons[entry.entity] ?? '📝'}
      </div>
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

function RecentLeadRow({ lead }: { lead: Lead }) {
  const STATUS = { new: 'bg-lime-50 text-lime-700', contacted: 'bg-amber-50 text-amber-700', closed: 'bg-green-50 text-green-700' };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center font-jakarta font-bold text-white text-[10px] flex-shrink-0">
        {lead.name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()}
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

// ── Traffic UI sub-components ─────────────────────────────────────────────────
function TrendBadge({ pct }: { pct: number }) {
  if (pct === 0) return <span className="font-jakarta text-xs text-slate-400 font-medium">—</span>;
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-jakarta text-xs font-bold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
      {up ? '↑' : '↓'} {Math.abs(pct)}%
    </span>
  );
}

function TrafficMetricCard({ label, value, trend, sub, accent }: {
  label:  string;
  value:  number;
  trend:  number;
  sub:    string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-1">
      <p className="font-jakarta text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="font-jakarta font-extrabold text-3xl" style={{ color: accent }}>{value.toLocaleString()}</p>
      <div className="flex items-center gap-2 mt-1">
        <TrendBadge pct={trend} />
        <span className="font-jakarta text-xs text-slate-400">{sub}</span>
      </div>
    </div>
  );
}

function SkeletonTrafficSection() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-2xl h-28" />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="bg-slate-100 rounded-xl h-56" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-100 rounded-2xl h-52" />
        <div className="bg-slate-100 rounded-2xl h-52" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const { token } = useAuth();
  const hdrs = { Authorization: `Bearer ${token}` };

  // CMS state
  const [events,    setEvents]    = useState<SiteEvent[]>([]);
  const [leads,     setLeads]     = useState<Lead[]>([]);
  const [news,      setNews]      = useState<NewsItem[]>([]);
  const [pages,     setPages]     = useState<DynamicPage[]>([]);
  const [auditLog,  setAuditLog]  = useState<AuditEntry[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);

  // Traffic state
  const [traffic,         setTraffic]         = useState<TrafficStats | null>(null);
  const [trafficLoading,  setTrafficLoading]  = useState(true);

  const [refreshed, setRefreshed] = useState<Date | null>(null);

  const loadCms = useCallback(async () => {
    setCmsLoading(true);
    try {
      const [evRes, leadRes, newsRes, pageRes, auditRes] = await Promise.allSettled([
        fetch('/api/events',      { cache: 'no-store' }),
        fetch('/api/leads',       { headers: hdrs, cache: 'no-store' }),
        fetch('/api/news',        { cache: 'no-store' }),
        fetch('/api/pages',       { headers: hdrs, cache: 'no-store' }),
        fetch('/api/admin/audit', { headers: hdrs, cache: 'no-store' }),
      ]);
      if (evRes.status    === 'fulfilled' && evRes.value.ok)    setEvents(((await evRes.value.json()) as { events?: SiteEvent[] }).events ?? []);
      if (leadRes.status  === 'fulfilled' && leadRes.value.ok)  setLeads(((await leadRes.value.json()) as { leads?: Lead[] }).leads ?? []);
      if (newsRes.status  === 'fulfilled' && newsRes.value.ok)  setNews(((await newsRes.value.json()) as { news?: NewsItem[] }).news ?? []);
      if (pageRes.status  === 'fulfilled' && pageRes.value.ok)  setPages(((await pageRes.value.json()) as { pages?: DynamicPage[] }).pages ?? []);
      if (auditRes.status === 'fulfilled' && auditRes.value.ok) setAuditLog(((await auditRes.value.json()) as { log?: AuditEntry[] }).log ?? []);
    } finally {
      setCmsLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTraffic = useCallback(async () => {
    setTrafficLoading(true);
    try {
      const res = await fetch('/api/traffic', { headers: hdrs, cache: 'no-store' });
      if (res.ok) setTraffic(await res.json() as TrafficStats);
    } finally {
      setTrafficLoading(false);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setRefreshed(null);
    await Promise.all([loadCms(), loadTraffic()]);
    setRefreshed(new Date());
  }, [loadCms, loadTraffic]);

  useEffect(() => { void load(); }, [load]);

  // ── CMS derived metrics ────────────────────────────────────────────────────
  const today       = new Date().toISOString().slice(0, 10);
  const week        = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
  const pubEvents   = events.filter(e => e.published);
  const upcomingEv  = pubEvents.filter(e => e.date >= today);
  const newLeads    = leads.filter(l => l.createdAt?.startsWith(today));
  const weekLeads   = leads.filter(l => l.createdAt >= week);
  const pubNews     = news.filter(n => n.published);
  const pubPages    = pages.filter(p => p.published);
  const convRate    = leads.length ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100) : 0;

  const sources    = leads.reduce<Record<string, number>>((acc, l) => { const s = l.source || 'unknown'; acc[s] = (acc[s] ?? 0) + 1; return acc; }, {});
  const topSources = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSrc     = topSources[0]?.[1] ?? 1;

  const evTypes = events.reduce<Record<string, number>>((acc, e) => { acc[e.type] = (acc[e.type] ?? 0) + 1; return acc; }, {});

  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const recentAudit = auditLog.slice(0, 8);

  if (cmsLoading && trafficLoading) return <SkeletonAnalyticsGrid />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📈 Analytics</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">Real-time visitor traffic and CMS content metrics.</p>
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

      {/* ══ WEB TRAFFIC SECTION ══════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-jakarta font-bold text-slate-800 text-lg">🌐 Web Traffic</h2>
          <span className="font-jakarta text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Last 30 days</span>
        </div>

        {trafficLoading ? <SkeletonTrafficSection /> : (
          <>
            {/* Metric cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Live Visitors */}
              <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  <span className="font-jakarta text-xs font-semibold text-white/90 uppercase tracking-wide">Live Now</span>
                </div>
                <p className="font-jakarta font-extrabold text-4xl">{(traffic?.live ?? 0).toLocaleString()}</p>
                <p className="font-jakarta text-xs text-white/70 mt-1.5">visitors on site · last 5 min</p>
              </div>

              <TrafficMetricCard
                label="Today"
                value={traffic?.today ?? 0}
                trend={traffic?.todayTrend ?? 0}
                sub="vs yesterday"
                accent="#1249C4"
              />
              <TrafficMetricCard
                label="This Week"
                value={traffic?.week ?? 0}
                trend={traffic?.weekTrend ?? 0}
                sub="vs last 7 days"
                accent="#7C3AED"
              />
              <TrafficMetricCard
                label="This Month"
                value={traffic?.month ?? 0}
                trend={traffic?.monthTrend ?? 0}
                sub="vs prior month"
                accent="#D97706"
              />
            </div>

            {/* Area chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-jakarta font-bold text-slate-800">Page Views — 30 Day Trend</h3>
                <span className="font-jakarta text-xs text-slate-400">{traffic?.month.toLocaleString() ?? 0} total</span>
              </div>
              <TrafficChart data={traffic?.chart ?? []} />
            </div>

            {/* Geo + Sources */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Top Locations */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-jakarta font-bold text-slate-800 mb-4">📍 Top Locations</h3>
                {(!traffic?.countries.length) ? (
                  <p className="font-jakarta text-sm text-slate-400 text-center py-6">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {traffic.countries.slice(0, 7).map(c => (
                      <div key={c.locationKey} className="flex items-center gap-3">
                        <span className="text-lg w-7 text-center flex-shrink-0">{flagEmoji(c.code)}</span>
                        <span className="font-jakarta text-sm text-slate-700 flex-1 truncate">{c.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-homeblue" style={{ width: `${c.pct}%` }} />
                          </div>
                          <span className="font-jakarta text-xs font-semibold text-slate-500 w-8 text-right">{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Sources */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-jakarta font-bold text-slate-800 mb-4">🔗 Traffic Sources</h3>
                {(!traffic?.sources.length) ? (
                  <p className="font-jakarta text-sm text-slate-400 text-center py-6">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {traffic.sources.slice(0, 7).map(s => (
                      <div key={s.key} className="flex items-center gap-3">
                        {/* Known platforms get a specific icon; dynamic domains get a globe */}
                        <span className="text-base w-6 text-center flex-shrink-0">{SOURCE_ICONS[s.key] ?? '🌐'}</span>
                        <span className="font-jakarta text-sm text-slate-700 flex-1 truncate">{s.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${s.pct}%` }} />
                          </div>
                          <span className="font-jakarta text-xs font-semibold text-slate-500 w-8 text-right">{s.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* ══ CMS METRICS SECTION ══════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="font-jakarta font-bold text-slate-800 text-lg">🗂 CMS Metrics</h2>
          <span className="font-jakarta text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Internal database</span>
        </div>

        {cmsLoading ? <SkeletonAnalyticsGrid /> : (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="📬" label="Total Leads"        value={leads.length}       sub={`+${newLeads.length} today · +${weekLeads.length} this week`} color="#7C3AED" />
              <StatCard icon="📅" label="Upcoming Events"    value={upcomingEv.length}  sub={`${pubEvents.length} published of ${events.length} total`}    color="#D97706" />
              <StatCard icon="📰" label="Published Articles" value={pubNews.length}     sub={`${news.length} total articles`}                               color="#65A30D" />
              <StatCard icon="📄" label="Live Pages"         value={pubPages.length}    sub={`${pages.length} total pages`}                                 color="#059669" />
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <div className="font-jakarta font-extrabold text-2xl text-emerald-600">{convRate}%</div>
                <div className="font-jakarta text-xs text-slate-500 mt-1">Lead Conversion</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <div className="font-jakarta font-extrabold text-2xl text-lime-600">{leads.filter(l => l.status === 'new').length}</div>
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

            {/* Recent leads + activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-jakarta font-bold text-slate-800">📬 Recent Enquiries</h3>
                  <Link href="/admin/enquiries" className="font-jakarta text-xs text-amber-600 hover:underline">View all →</Link>
                </div>
                {recentLeads.length === 0
                  ? <p className="font-jakarta text-sm text-slate-400 text-center py-6">No leads yet.</p>
                  : recentLeads.map(l => <RecentLeadRow key={l.id} lead={l} />)
                }
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-jakarta font-bold text-slate-800">🕒 Recent Admin Activity</h3>
                  <Link href="/admin/history" className="font-jakarta text-xs text-amber-600 hover:underline">Full log →</Link>
                </div>
                {recentAudit.length === 0
                  ? <p className="font-jakarta text-sm text-slate-400 text-center py-6">No audit entries yet.</p>
                  : recentAudit.map(e => <ActivityRow key={e.id} entry={e} />)
                }
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid lg:grid-cols-2 gap-6">
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
                  <Link href="/admin/news" className="font-jakarta text-xs text-amber-600 hover:underline">Manage →</Link>
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
          </>
        )}
      </section>
    </div>
  );
}
