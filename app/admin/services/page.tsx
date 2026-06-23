'use client';

// Services page editor — full control over /services copy and the 4×3 image grid.
// Saves via PUT /api/page-settings { page: 'services', settings: s } — live immediately.

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useToast } from '../_context';
import { apiCall } from '@/lib/edge-utils';
import type { ServicesPageSettings, ServiceItem, InstituteServiceItem, StudentServiceCard } from '@/lib/types';
import { SERVICES_DEFAULTS, mergeServicesSettings } from '@/lib/pageDefaults';
import { SkeletonFormBlock } from '@/components/admin/SkeletonCard';
import ImagePicker from '@/components/admin/ImagePicker';

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

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <h3 className="font-jakarta font-bold text-slate-700">{title}</h3>
        {action}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

const addBtn = 'font-jakarta text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors';

export default function AdminServicesPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const router    = useRouter();

  const [s,       setS]       = useState<ServicesPageSettings>(SERVICES_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);

  const set = (patch: Partial<ServicesPageSettings>) => setS(prev => ({ ...prev, ...patch }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/page-settings?page=services', { cache: 'no-store' });
      const d   = res.ok ? await res.json() as { settings?: Partial<ServicesPageSettings> | null } : null;
      setS(mergeServicesSettings(d?.settings ?? null));
    } catch {
      setS(SERVICES_DEFAULTS);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/page-settings', token, body: { page: 'services', settings: s } });
    setBusy(false);
    if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
    flash('✓ Services page saved — live immediately.', 'success');
    router.refresh();
  }

  // ── Student services grid helpers ──────────────────────────────────────────
  function setSvc(i: number, patch: Partial<StudentServiceCard>) {
    setS(prev => ({ ...prev, studentServices: prev.studentServices.map((it, j) => j === i ? { ...it, ...patch } : it) }));
  }
  function addSvc() {
    setS(prev => ({
      ...prev,
      studentServices: [...prev.studentServices, { id: `svc_${Date.now()}`, title: '', description: '', imageUrl: '' }],
    }));
  }
  function delSvc(i: number) {
    setS(prev => ({ ...prev, studentServices: prev.studentServices.filter((_, j) => j !== i) }));
  }

  // ── Legacy extra services helpers ──────────────────────────────────────────
  function setExtra(i: number, patch: Partial<ServiceItem>) {
    setS(prev => ({ ...prev, extraServices: prev.extraServices.map((it, j) => j === i ? { ...it, ...patch } : it) }));
  }
  function addExtra() {
    setS(prev => ({ ...prev, extraServices: [...prev.extraServices, { id: `svc_${Date.now()}`, icon: '✨', title: '', desc: '' }] }));
  }
  function delExtra(i: number) {
    setS(prev => ({ ...prev, extraServices: prev.extraServices.filter((_, j) => j !== i) }));
  }

  // ── Institute services helpers ─────────────────────────────────────────────
  function setInst(i: number, patch: Partial<InstituteServiceItem>) {
    setS(prev => ({ ...prev, instituteServices: prev.instituteServices.map((it, j) => j === i ? { ...it, ...patch } : it) }));
  }
  function addInst() {
    setS(prev => ({ ...prev, instituteServices: [...prev.instituteServices, { icon: '🏫', title: '', desc: '' }] }));
  }
  function delInst(i: number) {
    setS(prev => ({ ...prev, instituteServices: prev.instituteServices.filter((_, j) => j !== i) }));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🛠 Services Page</h1>
        <SkeletonFormBlock rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🛠 Services Page</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Edit the hero, the 12-card student services grid, and the bottom CTA. Saved to KV — live immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/services" target="_blank" rel="noopener noreferrer"
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

      {/* ── Hero Section ── */}
      <Section title="🎯 Hero Section">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Eyebrow">
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
          <textarea value={s.heroParagraph} onChange={e => set({ heroParagraph: e.target.value })} rows={2} className={`${inp} resize-none`} />
        </Field>
        <Field label="Hero Banner Image" hint="Large photo shown on the right side of the hero. Paste a URL, upload a file, or pick from the library.">
          <ImagePicker
            value={s.heroImageUrl ?? SERVICES_DEFAULTS.heroImageUrl ?? ''}
            onChange={url => set({ heroImageUrl: url })}
            label=""
            token={token}
          />
        </Field>
      </Section>

      {/* ── Student Services Grid (4×3) ── */}
      <Section
        title="🎓 Student Services Grid"
        action={<button onClick={addSvc} className={addBtn}>+ Add Card</button>}
      >
        <div className="pb-1">
          <Field label="Section Heading" hint="The heading above the 4-column services grid on /services.">
            <input value={s.studentHeading} onChange={e => set({ studentHeading: e.target.value })} className={inp} />
          </Field>
        </div>

        <p className="font-jakarta text-[11px] text-slate-400">
          {s.studentServices.length} card{s.studentServices.length !== 1 ? 's' : ''} — displayed as a 4-column grid on desktop. Changes save instantly to the live page.
        </p>

        <div className="space-y-4">
          {s.studentServices.map((svc, i) => (
            <div key={svc.id || i} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40 space-y-4">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="font-jakarta text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Card {i + 1}{svc.title ? ` — ${svc.title}` : ''}
                </span>
                <button onClick={() => delSvc(i)}
                  className="font-jakarta text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">
                  ✕ Remove
                </button>
              </div>

              {/* Title */}
              <Field label="Title">
                <input
                  value={svc.title}
                  onChange={e => setSvc(i, { title: e.target.value })}
                  className={inp}
                  placeholder="e.g. Undergraduate Admissions"
                />
              </Field>

              {/* Description */}
              <Field label="Card Description" hint="2–3 lines shown below the title on the grid card at /services.">
                <textarea
                  value={svc.description}
                  onChange={e => setSvc(i, { description: e.target.value })}
                  rows={3}
                  className={`${inp} resize-none`}
                  placeholder="Short description of this service…"
                />
              </Field>

              {/* Body — shown on /services/[id] detail page */}
              <Field
                label="Full Page Content"
                hint={`Appears on the detail page at /services/${svc.id || '…'}. Press Enter twice between paragraphs. Leave blank to hide the content section.`}
              >
                <textarea
                  value={svc.body ?? ''}
                  onChange={e => setSvc(i, { body: e.target.value })}
                  rows={6}
                  className={`${inp} resize-y`}
                  placeholder="Write the full content for this service's detail page. Press Enter twice to start a new paragraph."
                />
              </Field>

              {/* Image */}
              <Field label="Card & Hero Image" hint="Used on the /services grid card AND as the hero banner on the /services/[id] detail page.">
                <ImagePicker
                  value={svc.imageUrl}
                  onChange={url => setSvc(i, { imageUrl: url })}
                  label=""
                  token={token}
                />
              </Field>
            </div>
          ))}

          {s.studentServices.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-jakarta text-sm">
              No service cards yet. Click <strong>+ Add Card</strong> to start building the grid.
            </div>
          )}
        </div>
      </Section>

      {/* ── Legacy Extra Service Cards (kept for backward-compat, not shown on page) ── */}
      <Section
        title="✨ Extra Service Cards (Legacy)"
        action={<button onClick={addExtra} className={addBtn}>+ Add</button>}
      >
        <p className="font-jakarta text-[11px] text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
          These cards are no longer shown on the services page — use the <strong>Student Services Grid</strong> above instead. Data is preserved in KV.
        </p>
        {s.extraServices.map((svc, i) => (
          <div key={svc.id || i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-jakarta text-[11px] font-bold text-slate-500 uppercase tracking-wide">Extra Service {i + 1}</p>
              <button onClick={() => delExtra(i)}
                className="font-jakarta text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">✕ Remove</button>
            </div>
            <div className="grid sm:grid-cols-[80px_1fr] gap-3">
              <input value={svc.icon} onChange={e => setExtra(i, { icon: e.target.value })} className={`${inp} text-center text-xl`} placeholder="✍️" />
              <input value={svc.title} onChange={e => setExtra(i, { title: e.target.value })} className={inp} placeholder="Service title" />
            </div>
            <textarea value={svc.desc} onChange={e => setExtra(i, { desc: e.target.value })} rows={2} className={`${inp} resize-none`} placeholder="Short description…" />
          </div>
        ))}
        {s.extraServices.length === 0 && <p className="font-jakarta text-sm text-slate-400 text-center py-3">No legacy cards.</p>}
      </Section>

      {/* ── For Institutes ── */}
      <Section
        title="🏫 For Institutes"
        action={<button onClick={addInst} className={addBtn}>+ Add Card</button>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Heading">
            <input value={s.instituteHeading} onChange={e => set({ instituteHeading: e.target.value })} className={inp} />
          </Field>
          <Field label="Section Intro">
            <input value={s.instituteIntro} onChange={e => set({ instituteIntro: e.target.value })} className={inp} />
          </Field>
        </div>
        {s.instituteServices.map((svc, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-jakarta text-[11px] font-bold text-slate-500 uppercase tracking-wide">Institute Card {i + 1}</p>
              <button onClick={() => delInst(i)}
                className="font-jakarta text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">✕ Remove</button>
            </div>
            <div className="grid sm:grid-cols-[80px_1fr] gap-3">
              <input value={svc.icon} onChange={e => setInst(i, { icon: e.target.value })} className={`${inp} text-center text-xl`} placeholder="🏫" />
              <input value={svc.title} onChange={e => setInst(i, { title: e.target.value })} className={inp} placeholder="Card title" />
            </div>
            <textarea value={svc.desc} onChange={e => setInst(i, { desc: e.target.value })} rows={2} className={`${inp} resize-none`} placeholder="Short description…" />
          </div>
        ))}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <Field label="Partnership Box Heading">
            <input value={s.partnerBoxHeading} onChange={e => set({ partnerBoxHeading: e.target.value })} className={inp} />
          </Field>
          <Field label="Partnership Box Text">
            <input value={s.partnerBoxText} onChange={e => set({ partnerBoxText: e.target.value })} className={inp} />
          </Field>
        </div>
      </Section>

      {/* ── Bottom CTA ── */}
      <Section title="📣 Bottom CTA">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="CTA Heading">
            <input value={s.ctaHeading} onChange={e => set({ ctaHeading: e.target.value })} className={inp} />
          </Field>
          <Field label="CTA Paragraph">
            <input value={s.ctaParagraph} onChange={e => set({ ctaParagraph: e.target.value })} className={inp} />
          </Field>
        </div>
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
