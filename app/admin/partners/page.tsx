'use client';

// Partners B2B editor — full control over the three public partner pages
// (/partners/institutions, /partners/agent, /partners/referral).
// Always shows the content that is currently live (KV override merged onto
// the built-in defaults). Saves via PUT /api/partner-settings — live immediately.

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../layout';
import { apiCall } from '@/lib/edge-utils';
import type { PartnerPageSettings, PartnerStat } from '@/lib/kv';
import { PARTNER_DEFAULTS, mergePartnerSettings, type PartnerPageKey } from '@/lib/partnerDefaults';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

const PAGES: { key: PartnerPageKey; label: string; href: string }[] = [
  { key: 'institutions', label: '🏛 Institutions', href: '/partners/institutions' },
  { key: 'agent',        label: '🤝 Agents',       href: '/partners/agent'        },
  { key: 'referral',     label: '🎁 Referral',     href: '/partners/referral'     },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="font-jakarta text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminPartnersPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const router    = useRouter();

  const [page,    setPage]    = useState<PartnerPageKey>('institutions');
  const [s,       setS]       = useState<PartnerPageSettings>(PARTNER_DEFAULTS.institutions);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);

  const set = (patch: Partial<PartnerPageSettings>) => setS(prev => ({ ...prev, ...patch }));

  const load = useCallback(async (p: PartnerPageKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/partner-settings?page=${p}`, { cache: 'no-store' });
      const d   = res.ok ? await res.json() as { settings?: Partial<PartnerPageSettings> | null } : null;
      // Merge KV onto defaults exactly like the public page does — the editor
      // always shows what is actually live.
      setS(mergePartnerSettings(p, d?.settings ?? null));
    } catch {
      setS(PARTNER_DEFAULTS[p]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(page); }, [page, load]);

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/partner-settings', token, body: { page, settings: s } });
    setBusy(false);
    if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
    flash('✓ Partner page saved — live immediately.', 'success');
    router.refresh();
  }

  // ── Stats helpers ──────────────────────────────────────────────────────────
  function setStat(i: number, patch: Partial<PartnerStat>) {
    setS(prev => ({ ...prev, stats: prev.stats.map((st, j) => j === i ? { ...st, ...patch } : st) }));
  }
  function addStat()        { setS(prev => ({ ...prev, stats: [...prev.stats, { value: '', label: '', desc: '' }] })); }
  function delStat(i: number) { setS(prev => ({ ...prev, stats: prev.stats.filter((_, j) => j !== i) })); }

  // ── List item helpers ──────────────────────────────────────────────────────
  function setItem(i: number, v: string) {
    setS(prev => ({ ...prev, listItems: prev.listItems.map((it, j) => j === i ? v : it) }));
  }
  function addItem()         { setS(prev => ({ ...prev, listItems: [...prev.listItems, ''] })); }
  function delItem(i: number) { setS(prev => ({ ...prev, listItems: prev.listItems.filter((_, j) => j !== i) })); }

  const activePage = PAGES.find(p => p.key === page)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🤝 Partners B2B</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Edit the Institutions, Agent and Referral partner pages. Saved to KV — live immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={activePage.href} target="_blank" rel="noopener noreferrer"
            className="font-jakarta font-semibold text-xs text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            View Page ↗
          </a>
          <button onClick={save} disabled={busy || loading}
            className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {busy ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map(p => (
          <button key={p.key} onClick={() => setPage(p.key)}
            className={`font-jakarta text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${page === p.key ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          {/* Hero section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-jakarta font-bold text-slate-700">🎯 Hero Section</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Badge" hint="Small pill above the heading.">
                  <input value={s.badge} onChange={e => set({ badge: e.target.value })} className={inp} />
                </Field>
                <Field label="Heading" hint="Wrap words in **double asterisks** for the gold highlight.">
                  <input value={s.heading} onChange={e => set({ heading: e.target.value })} className={inp} />
                </Field>
              </div>
              <Field label="Subheading">
                <textarea value={s.subheading} onChange={e => set({ subheading: e.target.value })} rows={2} className={`${inp} resize-none`} />
              </Field>
            </div>
          </div>

          {/* Body section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-jakarta font-bold text-slate-700">📝 Body Content</h3>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Body Heading">
                <input value={s.bodyHeading} onChange={e => set({ bodyHeading: e.target.value })} className={inp} />
              </Field>
              <Field label="Body Intro Paragraph">
                <textarea value={s.bodyIntro} onChange={e => set({ bodyIntro: e.target.value })} rows={4} className={`${inp} resize-none`} />
              </Field>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h3 className="font-jakarta font-bold text-slate-700">📊 Stat Cards</h3>
              <button onClick={addStat}
                className="font-jakarta text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                + Add Stat
              </button>
            </div>
            <div className="p-6 space-y-4">
              {s.stats.map((st, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-jakarta text-[11px] font-bold text-slate-500 uppercase tracking-wide">Stat {i + 1}</p>
                    <button onClick={() => delStat(i)}
                      className="font-jakarta text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">✕ Remove</button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <input value={st.value} onChange={e => setStat(i, { value: e.target.value })} className={inp} placeholder="97%" />
                    <input value={st.label} onChange={e => setStat(i, { label: e.target.value })} className={`${inp} sm:col-span-2`} placeholder="Visa Success Rate" />
                  </div>
                  <textarea value={st.desc} onChange={e => setStat(i, { desc: e.target.value })} rows={2} className={`${inp} resize-none`} placeholder="Short description…" />
                </div>
              ))}
              {s.stats.length === 0 && <p className="font-jakarta text-sm text-slate-400 text-center py-4">No stats — add one above.</p>}
            </div>
          </div>

          {/* List section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h3 className="font-jakarta font-bold text-slate-700">✅ Checklist Section</h3>
              <button onClick={addItem}
                className="font-jakarta text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                + Add Item
              </button>
            </div>
            <div className="p-6 space-y-3">
              <Field label="List Heading">
                <input value={s.listHeading} onChange={e => set({ listHeading: e.target.value })} className={inp} />
              </Field>
              {s.listItems.map((it, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea value={it} onChange={e => setItem(i, e.target.value)} rows={2} className={`${inp} resize-none flex-1`} placeholder="Benefit description…" />
                  <button onClick={() => delItem(i)}
                    className="font-jakarta text-xs font-semibold text-red-500 hover:text-red-700 transition-colors mt-2.5 flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Form section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-jakarta font-bold text-slate-700">📋 Enquiry Form Panel</h3>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <Field label="Form Heading">
                <input value={s.formHeading} onChange={e => set({ formHeading: e.target.value })} className={inp} />
              </Field>
              <Field label="Form Subtext">
                <input value={s.formSubtext} onChange={e => set({ formSubtext: e.target.value })} className={inp} />
              </Field>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={save} disabled={busy}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
              {busy ? 'Saving…' : 'Save Page'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
