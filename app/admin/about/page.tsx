'use client';

// About page editor — full control over /about copy.
// Always shows the content that is currently live (KV override merged onto
// the built-in defaults). Saves via PUT /api/page-settings — live immediately.

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../layout';
import { apiCall } from '@/lib/edge-utils';
import type { AboutPageSettings } from '@/lib/types';
import { ABOUT_DEFAULTS, mergeAboutSettings } from '@/lib/pageDefaults';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="font-jakarta text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-700">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

export default function AdminAboutPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const router    = useRouter();

  const [s,       setS]       = useState<AboutPageSettings>(ABOUT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);

  const set = (patch: Partial<AboutPageSettings>) => setS(prev => ({ ...prev, ...patch }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/page-settings?page=about', { cache: 'no-store' });
      const d   = res.ok ? await res.json() as { settings?: Partial<AboutPageSettings> | null } : null;
      setS(mergeAboutSettings(d?.settings ?? null));
    } catch {
      setS(ABOUT_DEFAULTS);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/page-settings', token, body: { page: 'about', settings: s } });
    setBusy(false);
    if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
    flash('✓ About page saved — live immediately.', 'success');
    router.refresh();
  }

  function setWhyLabel(i: number, v: string) {
    setS(prev => ({ ...prev, whyLabels: prev.whyLabels.map((l, j) => j === i ? v : l) }));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">ℹ️ About Page</h1>
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">ℹ️ About Page</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Edit all copy on /about. Stats come from Homepage → Stats; contact info from General Info. Saved to KV — live immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/about" target="_blank" rel="noopener noreferrer"
            className="font-jakarta font-semibold text-xs text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            View Page ↗
          </a>
          <button onClick={save} disabled={busy}
            className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {busy ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      <Section title="🎯 Hero Section">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Eyebrow" hint="Small amber label above the heading.">
            <input value={s.heroEyebrow} onChange={e => set({ heroEyebrow: e.target.value })} className={inp} />
          </Field>
          <Field label="Heading Line 1">
            <input value={s.heroHeadingLine1} onChange={e => set({ heroHeadingLine1: e.target.value })} className={inp} />
          </Field>
          <Field label="Heading Line 2 (amber)">
            <input value={s.heroHeadingLine2} onChange={e => set({ heroHeadingLine2: e.target.value })} className={inp} />
          </Field>
        </div>
        <Field label="Hero Paragraph">
          <textarea value={s.heroParagraph} onChange={e => set({ heroParagraph: e.target.value })} rows={3} className={`${inp} resize-none`} />
        </Field>
      </Section>

      <Section title="👤 Founder Section">
        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Initials" hint="Avatar block, e.g. ILOC">
            <input value={s.founderInitials} onChange={e => set({ founderInitials: e.target.value })} className={inp} maxLength={6} />
          </Field>
          <Field label="Name">
            <input value={s.founderName} onChange={e => set({ founderName: e.target.value })} className={inp} />
          </Field>
          <Field label="Role">
            <input value={s.founderRole} onChange={e => set({ founderRole: e.target.value })} className={inp} />
          </Field>
          <Field label="Meta Line">
            <input value={s.founderMeta} onChange={e => set({ founderMeta: e.target.value })} className={inp} />
          </Field>
        </div>
        <Field label="Pull Quote" hint="Shown large with the amber border. Include quotation marks if you want them.">
          <textarea value={s.founderQuote} onChange={e => set({ founderQuote: e.target.value })} rows={2} className={`${inp} resize-none`} />
        </Field>
        <Field label="Paragraph 1">
          <textarea value={s.founderParagraph1} onChange={e => set({ founderParagraph1: e.target.value })} rows={3} className={`${inp} resize-none`} />
        </Field>
        <Field label="Paragraph 2">
          <textarea value={s.founderParagraph2} onChange={e => set({ founderParagraph2: e.target.value })} rows={3} className={`${inp} resize-none`} />
        </Field>
      </Section>

      <Section title="🎯 Mission & Vision">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Field label="Mission Title">
              <input value={s.missionTitle} onChange={e => set({ missionTitle: e.target.value })} className={inp} />
            </Field>
            <Field label="Mission Text">
              <textarea value={s.missionDesc} onChange={e => set({ missionDesc: e.target.value })} rows={4} className={`${inp} resize-none`} />
            </Field>
          </div>
          <div className="space-y-3">
            <Field label="Vision Title">
              <input value={s.visionTitle} onChange={e => set({ visionTitle: e.target.value })} className={inp} />
            </Field>
            <Field label="Vision Text">
              <textarea value={s.visionDesc} onChange={e => set({ visionDesc: e.target.value })} rows={4} className={`${inp} resize-none`} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="🏆 Why Choose Us">
        <Field label="Section Heading">
          <input value={s.whyHeading} onChange={e => set({ whyHeading: e.target.value })} className={inp} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          {s.whyLabels.map((label, i) => (
            <Field key={i} label={`Card ${i + 1} Label`}>
              <input value={label} onChange={e => setWhyLabel(i, e.target.value)} className={inp} />
            </Field>
          ))}
        </div>
        <p className="font-jakarta text-[11px] text-slate-400">Card icons and colours are fixed by the design — only labels are editable.</p>
      </Section>

      <Section title="📣 Bottom CTA">
        <Field label="CTA Heading">
          <input value={s.ctaHeading} onChange={e => set({ ctaHeading: e.target.value })} className={inp} />
        </Field>
        <Field label="CTA Paragraph">
          <textarea value={s.ctaParagraph} onChange={e => set({ ctaParagraph: e.target.value })} rows={2} className={`${inp} resize-none`} />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button onClick={save} disabled={busy}
          className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
          {busy ? 'Saving…' : 'Save Page'}
        </button>
      </div>
    </div>
  );
}
