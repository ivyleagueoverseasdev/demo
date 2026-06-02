'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../layout';
import type { AuditEntry } from '@/lib/schemas';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Binding { ok: boolean; label: string }
interface StatusData {
  bindings:   Record<string, Binding>;
  kv:         { ok: boolean; error: string };
  deployEnv:  string;
  isPreview:  boolean;
  cfBranch:   string | null;
  timestamp:  string;
  runtime:    string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

// ── StatusIndicator ───────────────────────────────────────────────────────────
function StatusBadge({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
        <span className="font-jakarta text-sm text-slate-700">{label}</span>
        {detail && <span className="font-jakarta text-xs text-slate-400">· {detail}</span>}
      </div>
      <span className={`font-jakarta text-xs font-bold ${ok ? 'text-emerald-600' : 'text-red-500'}`}>
        {ok ? 'Configured ✅' : 'Missing ❌'}
      </span>
    </div>
  );
}

// ── AuditRow ──────────────────────────────────────────────────────────────────
function AuditRow({ entry }: { entry: AuditEntry }) {
  const ENTITY_ICONS: Record<string, string> = {
    news: '📰', event: '📅', testimonials: '⭐', services: '🛠',
    processSteps: '📋', companyDetails: '🏢', globalSettings: '⚙️',
    lead: '📬', pages: '📄', redirects: '↗', media: '🖼',
  };
  const icon = ENTITY_ICONS[entry.entity] ?? '📝';

  const ACTION_COLORS: Record<string, string> = {
    Published:  'text-green-600 bg-green-50 border-green-200',
    Updated:    'text-blue-600 bg-blue-50 border-blue-200',
    Deleted:    'text-red-600 bg-red-50 border-red-200',
    Saved:      'text-amber-600 bg-amber-50 border-amber-200',
    Reset:      'text-slate-600 bg-slate-100 border-slate-200',
  };
  const actionWord = Object.keys(ACTION_COLORS).find(k => entry.action.includes(k)) ?? 'Updated';
  const colorClass = ACTION_COLORS[actionWord];

  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-slate-50 last:border-0">
      {/* Icon */}
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
            {actionWord}
          </span>
          <span className="font-jakarta text-sm text-slate-700 font-semibold truncate">{entry.entityName}</span>
        </div>
        <p className="font-jakarta text-xs text-slate-400">{entry.action}</p>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <p className="font-jakarta text-xs font-semibold text-slate-500">{daysAgo(entry.timestamp)}</p>
        <p className="font-jakarta text-[10px] text-slate-300">{formatDate(entry.timestamp).split(',').slice(-1)[0]?.trim()}</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminHistoryPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [log,         setLog]         = useState<AuditEntry[]>([]);
  const [status,      setStatus]      = useState<StatusData | null>(null);
  const [logLoading,  setLogLoading]  = useState(true);
  const [statLoading, setStatLoading] = useState(true);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('');

  const hdrs = { Authorization: `Bearer ${token}` };

  const loadLog = useCallback(async () => {
    setLogLoading(true);
    try {
      const res = await fetch('/api/admin/audit', { headers: hdrs, cache: 'no-store' });
      if (res.ok) { const d = await res.json(); setLog(d.log ?? []); }
    } finally { setLogLoading(false); }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStatus = useCallback(async () => {
    setStatLoading(true);
    try {
      const res = await fetch('/api/system/status', { headers: hdrs, cache: 'no-store' });
      if (res.ok) { const d = await res.json(); setStatus(d); }
    } finally { setStatLoading(false); }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void loadLog(); void loadStatus(); }, [loadLog, loadStatus]);

  async function clearLog() {
    if (!confirm('Clear the entire audit log? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/admin/audit', { method: 'DELETE', headers: hdrs });
      if (!res.ok) throw new Error('API error');
      setLog([]);
      flash('Audit log cleared.', 'info');
    } catch {
      flash('Failed to clear log.', 'error');
    }
  }

  const ENTITY_OPTIONS = [...new Set(log.map(e => e.entity))].sort();

  const filtered = log.filter(e => {
    if (search && !e.entityName.toLowerCase().includes(search.toLowerCase()) && !e.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter && e.entity !== filter) return false;
    return true;
  });

  const allOk = status ? Object.values(status.bindings).every(b => b.ok) && status.kv.ok : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🕒 Audit Log &amp; System Status</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">Read-only log of all admin changes and live environment health check.</p>
      </div>

      {/* ── System Status ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-800">⚙️ System Status</h3>
          <div className="flex items-center gap-3">
            {!statLoading && status && (
              <span className={`font-jakarta text-xs font-bold px-3 py-1 rounded-full ${status.isPreview ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {status.deployEnv}
              </span>
            )}
            <button onClick={loadStatus} className="font-jakarta text-xs text-slate-500 hover:text-slate-700 transition-colors">↻ Refresh</button>
          </div>
        </div>

        <div className="p-6">
          {statLoading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : !status ? (
            <p className="font-jakarta text-sm text-red-500">Failed to load system status. Check Cloudflare logs.</p>
          ) : (
            <div className="space-y-0">
              {/* KV */}
              <StatusBadge
                ok={status.kv.ok}
                label="KV Namespace (CONTENT_KV)"
                detail={status.kv.ok ? 'Read test passed' : status.kv.error}
              />
              {/* Bindings */}
              {Object.entries(status.bindings).map(([key, b]) => (
                <StatusBadge key={key} ok={b.ok} label={b.label} />
              ))}

              {/* Overall */}
              <div className={`mt-4 rounded-2xl p-4 flex items-center gap-3 ${allOk ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <span className="text-xl">{allOk ? '✅' : '⚠️'}</span>
                <div>
                  <p className={`font-jakarta font-bold text-sm ${allOk ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {allOk ? 'All systems operational' : 'Some configuration is missing'}
                  </p>
                  <p className={`font-jakarta text-xs mt-0.5 ${allOk ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {allOk
                      ? `Runtime: ${status.runtime} · Branch: ${status.cfBranch ?? 'local'} · Checked ${new Date(status.timestamp).toLocaleTimeString('en-IN')}`
                      : 'Set missing env vars in Cloudflare Pages → Settings → Environment Variables'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Audit Log ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-jakarta font-bold text-slate-800">🕒 Audit Log</h3>
            <p className="font-jakarta text-xs text-slate-400 mt-0.5">Last {log.length} admin actions · newest first</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadLog} className="font-jakarta text-xs text-slate-500 hover:text-slate-700 transition-colors">↻</button>
            {log.length > 0 && (
              <button onClick={clearLog}
                className="font-jakarta text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                Clear Log
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pt-4 pb-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by action or item name…"
              className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
            <option value="">All Entities</option>
            {ENTITY_OPTIONS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
          </select>
        </div>

        <div className="px-6 pb-6">
          {logLoading ? (
            <div className="space-y-3 pt-4">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🕒</div>
              <p className="font-jakarta font-semibold text-slate-600 mb-1">{log.length === 0 ? 'No audit entries yet' : 'No entries match your filters'}</p>
              <p className="font-jakarta text-xs text-slate-400">
                {log.length === 0 ? 'Admin actions (publish, update, delete) will appear here automatically.' : 'Try clearing your search or filter.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(e => <AuditRow key={e.id} entry={e} />)}
            </div>
          )}

          {filtered.length < log.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-4">
              Showing {filtered.length} of {log.length} entries
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
