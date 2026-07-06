'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../_context';
import type { Stat, ServiceItem, ProcessStepItem, Update2026Card } from '@/lib/types';
import { DEFAULT_SERVICES, DEFAULT_PROCESS_STEPS, STATS, DEFAULT_UPDATES_2026, DEFAULT_UPDATES_2026_COLS, DEFAULT_UPDATES_2026_HEADINGS } from '@/lib/data';
import { SkeletonFormBlock } from '@/components/admin/SkeletonCard';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children, onSave, busy, label }: {
  title:    string;
  children: React.ReactNode;
  onSave:   () => Promise<void>;
  busy:     boolean;
  label:    string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-700">{title}</h3>
        <button onClick={onSave} disabled={busy}
          className="font-jakarta font-bold text-sm text-white px-5 py-2 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
          {busy ? 'Saving…' : `Save ${label}`}
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── StatsEditor ───────────────────────────────────────────────────────────────
function StatsEditor({ stats, setStats }: { stats: Stat[]; setStats: (s: Stat[]) => void }) {
  function update(i: number, field: keyof Stat, val: string) {
    setStats(stats.map((s, j) => j === i ? { ...s, [field]: val } : s));
  }
  return (
    <div className="space-y-3">
      <p className="font-jakarta text-xs text-slate-400">These appear in the StatsSection below the hero and across the site.</p>
      {stats.map((stat, i) => (
        <div key={i} className="flex gap-3 items-center">
          <input value={stat.num}  onChange={e => update(i, 'num',  e.target.value)} className={`${inp} w-28 text-xs py-2`} placeholder="10,000+" />
          <input value={stat.label} onChange={e => update(i, 'label', e.target.value)} className={`${inp} flex-1 text-xs py-2`} placeholder="Students Placed" />
          <button onClick={() => setStats(stats.filter((_, j) => j !== i))}
            className="px-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">✕</button>
        </div>
      ))}
      <button onClick={() => setStats([...stats, { num: '', label: '' }])}
        className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
        + Add Stat
      </button>
    </div>
  );
}

// ── ServicesEditor ────────────────────────────────────────────────────────────
function ServicesEditor({ services, setServices }: { services: ServiceItem[]; setServices: (s: ServiceItem[]) => void }) {
  function update(i: number, field: keyof ServiceItem, val: string) {
    setServices(services.map((s, j) => j === i ? { ...s, [field]: val } : s));
  }
  return (
    <div className="space-y-3">
      <p className="font-jakarta text-xs text-slate-400">Service cards shown in the ServicesSection on the homepage.</p>
      {services.map((svc, i) => (
        <div key={svc.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-jakarta text-xs font-bold text-slate-500 uppercase tracking-wide">Card {i + 1}</span>
            <button onClick={() => setServices(services.filter((_, j) => j !== i))}
              className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
          </div>
          <div className="grid sm:grid-cols-[48px_1fr_2fr] gap-2">
            <input value={svc.icon}  onChange={e => update(i, 'icon',  e.target.value)} className={`${inp} text-center text-lg py-2`} placeholder="🎓" />
            <input value={svc.title} onChange={e => update(i, 'title', e.target.value)} className={`${inp} text-xs py-2`} placeholder="Service title" />
            <input value={svc.desc}  onChange={e => update(i, 'desc',  e.target.value)} className={`${inp} text-xs py-2`} placeholder="Short description…" />
          </div>
        </div>
      ))}
      <button onClick={() => setServices([...services, { id: crypto.randomUUID(), icon: '✨', title: '', desc: '' }])}
        className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
        + Add Service
      </button>
    </div>
  );
}

// ── ProcessEditor ─────────────────────────────────────────────────────────────
function ProcessEditor({ steps, setSteps }: { steps: ProcessStepItem[]; setSteps: (s: ProcessStepItem[]) => void }) {
  function update(i: number, field: keyof ProcessStepItem, val: string | number) {
    setSteps(steps.map((s, j) => j === i ? { ...s, [field]: val } : s));
  }
  return (
    <div className="space-y-3">
      <p className="font-jakarta text-xs text-slate-400">Steps shown in the &quot;How It Works&quot; section.</p>
      {steps.map((step, i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-jakarta text-xs font-bold text-slate-500 uppercase tracking-wide">Step {step.step}</span>
            <button onClick={() => setSteps(steps.filter((_, j) => j !== i).map((s, j) => ({ ...s, step: j + 1 })))}
              className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
          </div>
          <div className="grid sm:grid-cols-[48px_1fr_2fr] gap-2">
            <input value={step.icon}  onChange={e => update(i, 'icon',  e.target.value)} className={`${inp} text-center text-lg py-2`} placeholder="📋" />
            <input value={step.title} onChange={e => update(i, 'title', e.target.value)} className={`${inp} text-xs py-2`} placeholder="Step title" />
            <input value={step.desc}  onChange={e => update(i, 'desc',  e.target.value)} className={`${inp} text-xs py-2`} placeholder="Brief description…" />
          </div>
        </div>
      ))}
      <button onClick={() => setSteps([...steps, { step: steps.length + 1, icon: '📌', title: '', desc: '' }])}
        className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
        + Add Step
      </button>
    </div>
  );
}

// ── Updates2026Editor ─────────────────────────────────────────────────────────
function Updates2026Editor({
  cards, setCards, cols, setCols,
}: {
  cards: Update2026Card[]; setCards: (c: Update2026Card[]) => void;
  cols: number;            setCols:  (n: number) => void;
}) {
  function update(i: number, field: keyof Update2026Card, val: string) {
    setCards(cards.map((c, j) => j === i ? { ...c, [field]: val } : c));
  }
  function add() {
    setCards([...cards, { id: crypto.randomUUID(), country: '', year: '2026', imageUrl: '', flag: '🌍', badge: 'Policy Update', update: '', href: '/destinations' }]);
  }
  function remove(i: number) {
    setCards(cards.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-4">
      {/* Grid columns control */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <span className="font-jakarta text-xs font-bold text-slate-600 whitespace-nowrap">Grid columns:</span>
        <div className="flex gap-2">
          {[1,2,3,4].map(n => (
            <button key={n} onClick={() => setCols(n)}
              className={`w-9 h-9 rounded-lg font-jakarta font-bold text-sm transition-all ${
                cols === n
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
              }`}
            >{n}</button>
          ))}
        </div>
        <span className="font-jakarta text-[11px] text-slate-400">(controls public display grid)</span>
      </div>

      {/* Preview grid */}
      <div className={`grid gap-3 ${
        cols === 1 ? 'grid-cols-1' :
        cols === 2 ? 'grid-cols-2' :
        cols === 4 ? 'grid-cols-4' :
                     'grid-cols-3'
      }`}>
        {cards.map((card, i) => (
          <div key={card.id} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            {/* Thumbnail */}
            <div className="relative h-20 w-full bg-slate-100">
              {card.imageUrl ? (
                <Image src={card.imageUrl} alt={card.country} fill className="object-cover" sizes="200px" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300 text-2xl">{card.flag || '🌍'}</div>
              )}
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute bottom-1 left-2 text-lg">{card.flag}</span>
            </div>

            {/* Fields */}
            <div className="p-2 space-y-1.5">
              <div className="flex gap-1.5">
                <input value={card.flag} onChange={e => update(i, 'flag', e.target.value)}
                  className={`${inp} w-12 text-center text-sm py-1.5`} placeholder="🌍" />
                <input value={card.country} onChange={e => update(i, 'country', e.target.value)}
                  className={`${inp} flex-1 text-xs py-1.5`} placeholder="Country name" />
                <input value={card.year} onChange={e => update(i, 'year', e.target.value)}
                  className={`${inp} w-16 text-xs py-1.5`} placeholder="2026" />
              </div>
              <input value={card.imageUrl} onChange={e => update(i, 'imageUrl', e.target.value)}
                className={`${inp} text-xs py-1.5`} placeholder="Image URL (Unsplash or upload)" />
              <input value={card.badge} onChange={e => update(i, 'badge', e.target.value)}
                className={`${inp} text-xs py-1.5`} placeholder="Badge text e.g. Policy Update" />
              <textarea value={card.update} onChange={e => update(i, 'update', e.target.value)}
                rows={2} className={`${inp} text-xs py-1.5 resize-none`} placeholder="Update text…" />
              <input value={card.href} onChange={e => update(i, 'href', e.target.value)}
                className={`${inp} text-xs py-1.5`} placeholder="Link e.g. /destinations/usa" />
              <button onClick={() => remove(i)}
                className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg py-1 transition-colors font-jakarta font-semibold">
                Remove card
              </button>
            </div>
          </div>
        ))}

        {/* Add card button */}
        <button onClick={add}
          className="h-full min-h-[220px] rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-amber-500">
          <span className="text-2xl">+</span>
          <span className="font-jakarta text-xs font-semibold">Add card</span>
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminHomepagePage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [stats,          setStats]          = useState<Stat[]>(STATS);
  const [services,       setServices]       = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [steps,          setSteps]          = useState<ProcessStepItem[]>(DEFAULT_PROCESS_STEPS);
  const [updates2026,    setUpdates2026]    = useState<Update2026Card[]>(DEFAULT_UPDATES_2026);
  const [updates2026Cols,setUpdates2026Cols]= useState<number>(DEFAULT_UPDATES_2026_COLS);
  const [updTexts,       setUpdTexts]       = useState<{ badge: string; heading: string; sub: string }>({ ...DEFAULT_UPDATES_2026_HEADINGS });
  const [loading,  setLoading]  = useState(true);
  const [busySt,   setBusySt]   = useState(false);
  const [busySvc,  setBusySvc]  = useState(false);
  const [busyProc, setBusyProc] = useState(false);
  const [busyUpd,  setBusyUpd]  = useState(false);

  const hdrs = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, contentRes] = await Promise.all([
        fetch('/api/stats',   { cache: 'no-store' }),
        fetch('/api/content', { headers: hdrs, cache: 'no-store' }),
      ]);
      if (statsRes.ok)   { const d = await statsRes.json() as any;   if (d.stats?.length)    setStats(d.stats); }
      if (contentRes.ok) {
        const d = await contentRes.json() as any;
        if (d.siteContent?.services?.length)          setServices(d.siteContent.services);
        if (d.siteContent?.processSteps?.length)      setSteps(d.siteContent.processSteps);
        if (d.siteContent?.updates2026?.length)       setUpdates2026(d.siteContent.updates2026);
        if (typeof d.siteContent?.updates2026Cols === 'number') setUpdates2026Cols(d.siteContent.updates2026Cols);
        setUpdTexts(t => ({
          badge:   d.siteContent?.updates2026Badge   || t.badge,
          heading: d.siteContent?.updates2026Heading || t.heading,
          sub:     d.siteContent?.updates2026Sub     || t.sub,
        }));
      }
    } finally { setLoading(false); }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(); }, [load]);

  async function saveStats() {
    setBusySt(true);
    try {
      const res = await fetch('/api/stats', { method: 'PUT', headers: hdrs, body: JSON.stringify({ stats }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Stats saved — live immediately.', 'success');
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setBusySt(false); }
  }

  async function saveServices() {
    setBusySvc(true);
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ services }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Services saved — live immediately.', 'success');
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setBusySvc(false); }
  }

  async function saveProcess() {
    setBusyProc(true);
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ processSteps: steps }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Process steps saved — live immediately.', 'success');
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setBusyProc(false); }
  }

  async function saveUpdates2026() {
    setBusyUpd(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT', headers: hdrs,
        body: JSON.stringify({
          updates2026, updates2026Cols,
          updates2026Badge:   updTexts.badge,
          updates2026Heading: updTexts.heading,
          updates2026Sub:     updTexts.sub,
        }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ 2026 cards saved — live immediately.', 'success');
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setBusyUpd(false); }
  }

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
      <SkeletonFormBlock rows={3} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🏠 Homepage Content</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">Edit stats, services, and process steps. Each section saves independently to KV.</p>
      </div>

      <Section title="📊 Stats Counters" onSave={saveStats} busy={busySt} label="Stats">
        <StatsEditor stats={stats} setStats={setStats} />
      </Section>

      <Section title="🛠 Services Cards" onSave={saveServices} busy={busySvc} label="Services">
        <ServicesEditor services={services} setServices={setServices} />
      </Section>

      <Section title="📋 How It Works — Process Steps" onSave={saveProcess} busy={busyProc} label="Steps">
        <ProcessEditor steps={steps} setSteps={setSteps} />
      </Section>

      <Section title="🌍 What Changed for 2026 — Country Update Cards" onSave={saveUpdates2026} busy={busyUpd} label="Cards">
        <p className="font-jakarta text-xs text-slate-400 mb-4">
          Add, remove or edit the 2026 policy update cards. Each card shows a country image, title, badge and update text on the homepage.
          Use the grid button to control how many columns they display in.
        </p>

        {/* Section heading texts shown above the cards on the homepage */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 mb-5">
          <span className="font-jakarta text-xs font-bold text-slate-500 uppercase tracking-wide">Section Heading Texts</span>
          <div>
            <label className="block font-jakarta text-[11px] font-semibold text-slate-500 mb-1">Badge (small pill)</label>
            <input value={updTexts.badge} onChange={e => setUpdTexts(t => ({ ...t, badge: e.target.value }))}
              className={inp} placeholder="2026 Immigration Policy Updates" />
          </div>
          <div>
            <label className="block font-jakarta text-[11px] font-semibold text-slate-500 mb-1">Main Heading</label>
            <input value={updTexts.heading} onChange={e => setUpdTexts(t => ({ ...t, heading: e.target.value }))}
              className={inp} placeholder="What changed for 2026." />
          </div>
          <div>
            <label className="block font-jakarta text-[11px] font-semibold text-slate-500 mb-1">Sub-text (paragraph)</label>
            <textarea value={updTexts.sub} onChange={e => setUpdTexts(t => ({ ...t, sub: e.target.value }))}
              rows={2} className={`${inp} resize-none`}
              placeholder="Stay ahead with the latest visa policies, intake rules and scholarship deadlines for your target country." />
          </div>
        </div>

        <Updates2026Editor
          cards={updates2026} setCards={setUpdates2026}
          cols={updates2026Cols} setCols={setUpdates2026Cols}
        />
      </Section>
    </div>
  );
}
