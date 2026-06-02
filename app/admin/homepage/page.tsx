'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../layout';
import type { Stat, ServiceItem, ProcessStepItem } from '@/lib/types';
import { DEFAULT_SERVICES, DEFAULT_PROCESS_STEPS, STATS } from '@/lib/data';

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
      <p className="font-jakarta text-xs text-slate-400">Steps shown in the "How It Works" section.</p>
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminHomepagePage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [stats,    setStats]    = useState<Stat[]>(STATS);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [steps,    setSteps]    = useState<ProcessStepItem[]>(DEFAULT_PROCESS_STEPS);
  const [loading,  setLoading]  = useState(true);
  const [busySt,   setBusySt]   = useState(false);
  const [busySvc,  setBusySvc]  = useState(false);
  const [busyProc, setBusyProc] = useState(false);

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
        if (d.siteContent?.services?.length)      setServices(d.siteContent.services);
        if (d.siteContent?.processSteps?.length)  setSteps(d.siteContent.processSteps);
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

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-slate-100 rounded-xl animate-pulse" />
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-slate-100" />)}
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
    </div>
  );
}
