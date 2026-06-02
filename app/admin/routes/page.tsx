'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth, useToast } from '../layout';
import type { RedirectRule } from '@/lib/types';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

function emptyRule(): Omit<RedirectRule, 'id'> {
  return { from: '', to: '', type: 301, active: true, note: '' };
}

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ rules }: { rules: RedirectRule[] }) {
  const stats = [
    { label: 'Total',    value: rules.length,                          bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
    { label: 'Active',   value: rules.filter(r => r.active).length,   bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { label: 'Inactive', value: rules.filter(r => !r.active).length,  bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500' },
    { label: '301',      value: rules.filter(r => r.type === 301).length, bg: 'bg-blue-50 border-blue-200',  text: 'text-blue-700'  },
    { label: '302',      value: rules.filter(r => r.type === 302).length, bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
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

// ── RedirectForm ──────────────────────────────────────────────────────────────
function RedirectForm({ initial, editId, onSave, onCancel, busy }: {
  initial:  Omit<RedirectRule, 'id'>;
  editId:   string | null;
  onSave:   (data: Omit<RedirectRule, 'id'>) => void;
  onCancel: () => void;
  busy:     boolean;
}) {
  const [form, setForm] = useState(initial);
  useEffect(() => { setForm(initial); }, [initial]);

  function patch<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  const valid = form.from.startsWith('/') && form.to.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-800">{editId ? '✏️ Edit Redirect' : '✚ New Redirect'}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors">✕</button>
      </div>
      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">
              Source URL * <span className="text-slate-400 font-normal normal-case">(must start with /)</span>
            </label>
            <input
              value={form.from}
              onChange={e => patch('from', e.target.value.startsWith('/') ? e.target.value : `/${e.target.value}`)}
              className={inp}
              placeholder="/old-about-us"
            />
          </div>
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Destination URL *
            </label>
            <input
              value={form.to}
              onChange={e => patch('to', e.target.value)}
              className={inp}
              placeholder="/about or https://example.com/page"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
            <select value={form.type} onChange={e => patch('type', Number(e.target.value) as 301 | 302)} className={`${inp} cursor-pointer`}>
              <option value={301}>301 — Permanent (SEO)</option>
              <option value={302}>302 — Temporary</option>
            </select>
          </div>
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Note (optional)</label>
            <input value={form.note ?? ''} onChange={e => patch('note', e.target.value)} className={inp} placeholder="e.g. Merged blog posts" />
          </div>
          <div className="flex items-center gap-3 self-end pb-2.5">
            <button
              type="button"
              onClick={() => patch('active', !form.active)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.active ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : ''}`} />
            </button>
            <span className="font-jakarta text-sm text-slate-700">{form.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {form.from && form.to && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 font-jakarta text-xs text-slate-600">
            <span className="font-semibold">{form.type}</span>{' '}
            <code className="text-blue-600">{form.from}</code>
            {' → '}
            <code className="text-green-600">{form.to}</code>
          </div>
        )}

        <div className="flex gap-3 flex-wrap pt-1">
          <button
            onClick={() => onSave(form)}
            disabled={busy || !valid}
            className="font-jakarta font-bold text-sm text-white px-7 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            {busy ? 'Saving…' : editId ? '💾 Update Redirect' : '➕ Add Redirect'}
          </button>
          <button onClick={onCancel} className="font-jakarta text-sm px-4 py-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RedirectRow ───────────────────────────────────────────────────────────────
function RedirectRow({ rule, onEdit, onDelete, onToggle }: {
  rule:     RedirectRule;
  onEdit:   (r: RedirectRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-all ${rule.active ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
      {/* Type badge */}
      <span className={`flex-shrink-0 font-jakarta text-xs font-bold px-2.5 py-1 rounded-lg mt-0.5 ${rule.type === 301 ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
        {rule.type}
      </span>

      {/* Route display */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="font-mono text-sm text-blue-600 font-semibold">{rule.from}</code>
          <span className="text-slate-400 text-xs">→</span>
          <code className="font-mono text-sm text-green-600 font-semibold truncate max-w-xs">{rule.to}</code>
          {!rule.active && <span className="font-jakarta text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Inactive</span>}
        </div>
        {rule.note && <p className="font-jakarta text-xs text-slate-400 mt-0.5">{rule.note}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onToggle(rule.id)}
          className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${rule.active ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
        >
          {rule.active ? 'Disable' : 'Enable'}
        </button>
        <button onClick={() => onEdit(rule)} className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(rule.id)} className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          Del
        </button>
      </div>
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
function FilterBar({ search, setSearch, statusFilter, setStatusFilter }: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search source or destination URL…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white" />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Redirects</option>
        <option value="active">Active Only</option>
        <option value="inactive">Inactive Only</option>
        <option value="301">301 Permanent</option>
        <option value="302">302 Temporary</option>
      </select>
      {(search || statusFilter) && (
        <button onClick={() => { setSearch(''); setStatusFilter(''); }}
          className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 flex-shrink-0 flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          Clear
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminRoutesPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [rules,        setRules]        = useState<RedirectRule[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busy,         setBusy]         = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [formInitial,  setFormInitial]  = useState(emptyRule());
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const hdrs = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', { headers: hdrs, cache: 'no-store' });
      if (res.ok) { const d = await res.json(); setRules(d.redirects ?? []); }
    } finally { setLoading(false); }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(); }, [load]);

  async function saveRules(next: RedirectRule[]) {
    const res = await fetch('/api/content', {
      method: 'PUT', headers: hdrs,
      body: JSON.stringify({ redirects: next }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? `HTTP ${res.status}`); }
    setRules(next);
  }

  function handleSave(data: Omit<RedirectRule, 'id'>) {
    setBusy(true);
    let next: RedirectRule[];
    if (editId) {
      next = rules.map(r => r.id === editId ? { ...r, ...data } : r);
    } else {
      next = [...rules, { ...data, id: crypto.randomUUID() }];
    }
    saveRules(next)
      .then(() => { flash(editId ? '✓ Redirect updated.' : '✓ Redirect added.', 'success'); closeForm(); })
      .catch(e => flash(`Save failed: ${e.message}`, 'error'))
      .finally(() => setBusy(false));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this redirect rule?')) return;
    saveRules(rules.filter(r => r.id !== id))
      .then(() => flash('Redirect deleted.', 'info'))
      .catch(e => flash(`Delete failed: ${e.message}`, 'error'));
  }

  function handleToggle(id: string) {
    const next = rules.map(r => r.id === id ? { ...r, active: !r.active } : r);
    saveRules(next)
      .then(() => flash('Redirect updated.', 'success'))
      .catch(e => flash(`Update failed: ${e.message}`, 'error'));
  }

  function openNew() {
    setEditId(null); setFormInitial(emptyRule()); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function openEdit(rule: RedirectRule) {
    setEditId(rule.id);
    setFormInitial({ from: rule.from, to: rule.to, type: rule.type, active: rule.active, note: rule.note });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeForm() { setShowForm(false); setEditId(null); setFormInitial(emptyRule()); }

  const filtered = rules.filter(r => {
    if (search && !r.from.includes(search) && !r.to.includes(search) && !(r.note ?? '').toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'active'   && !r.active) return false;
    if (statusFilter === 'inactive' &&  r.active) return false;
    if (statusFilter === '301'      && r.type !== 301) return false;
    if (statusFilter === '302'      && r.type !== 302) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">↗ Redirects</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Manage 301/302 URL redirect rules stored in KV. Middleware reads these at the Edge — no redeploy needed.
          </p>
        </div>
        {!showForm && (
          <button onClick={openNew}
            className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            + Add Redirect
          </button>
        )}
      </div>

      {/* SEO tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <div>
          <p className="font-jakarta text-sm font-semibold text-blue-800">Use 301 for permanent moves (SEO-safe)</p>
          <p className="font-jakarta text-xs text-blue-700 mt-0.5">
            301 redirects pass link equity. Use 302 only for temporary redirects (e.g. seasonal campaigns).
            Next.js middleware will read these rules from KV at the Edge with zero latency.
          </p>
        </div>
      </div>

      {!loading && rules.length > 0 && <StatsBar rules={rules} />}

      {showForm && (
        <div ref={formRef}>
          <RedirectForm initial={formInitial} editId={editId} onSave={handleSave} onCancel={closeForm} busy={busy} />
        </div>
      )}

      {!loading && rules.length > 0 && (
        <FilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse border border-slate-100" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">↗</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {rules.length === 0 ? 'No redirects yet' : 'No redirects match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400 mb-5">
            {rules.length === 0 ? 'Add your first redirect rule — essential for SEO when restructuring URLs.' : 'Clear your filters to see all redirects.'}
          </p>
          {rules.length === 0 && (
            <button onClick={openNew}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#246DFF,#1249C4)' }}>
              Add First Redirect
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rule => (
            <RedirectRow key={rule.id} rule={rule} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
          {filtered.length < rules.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">Showing {filtered.length} of {rules.length} redirects</p>
          )}
        </div>
      )}
    </div>
  );
}
