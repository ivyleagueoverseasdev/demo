'use client';

// Global Settings editor — controls site-wide branding consumed by the public
// site (Navbar logo/name/header colour, Footer socials & WhatsApp links).
// Persists to KV via PUT /api/content { globalSettings } — live immediately.

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../layout';
import { apiCall } from '@/lib/edge-utils';
import ImagePicker from '@/components/admin/ImagePicker';
import type { GlobalSettings } from '@/lib/types';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

const EMPTY: GlobalSettings = {
  brandName:               '',
  heroImages:              [],
  noticeBanner:            '',
  whatsappUrl:             '',
  whatsappMessage:         '',
  mainLogoUrl:             '',
  businessNameText:        '',
  headerLogoUrl:           '',
  headerBackgroundColor:   '#C7FBA0',
  headerVerticalPadding:   '',
  businessNameDisplayName: '',
  destinationsCols:        4,
  eventsCols:              3,
  classesCols:             3,
};

const COL_OPTIONS = [1, 2, 3, 4, 5, 6];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="font-jakarta text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminGlobalPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [gs,      setGs]      = useState<GlobalSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);

  const set = (patch: Partial<GlobalSettings>) => setGs(g => ({ ...g, ...patch }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as { globalSettings?: GlobalSettings | null };
        if (d.globalSettings) setGs({ ...EMPTY, ...d.globalSettings });
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/content', token, body: { globalSettings: gs } });
    setBusy(false);
    if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
    flash('✓ Global settings saved — live immediately.', 'success');
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">⚙️ Global Settings</h1>
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">⚙️ Global Settings</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Site-wide branding: logo, business name, header colour, social &amp; WhatsApp links. Saved to KV — live immediately.
          </p>
        </div>
        <button onClick={save} disabled={busy}
          className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
          {busy ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">🏷 Branding</h3>
          <p className="font-jakarta text-xs text-slate-400 mt-0.5">Shown in the site header on every page.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business Name (header)" hint="Large name next to the logo in the navbar.">
              <input value={gs.businessNameText ?? ''} onChange={e => set({ businessNameText: e.target.value })} className={inp} placeholder="IVY LEAGUE OVERSEAS CONSULTING" />
            </Field>
            <Field label="Brand Short Name" hint="Compact brand label (e.g. browser/title usage).">
              <input value={gs.brandName ?? ''} onChange={e => set({ brandName: e.target.value })} className={inp} placeholder="ILOC" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImagePicker value={gs.mainLogoUrl ?? ''}   onChange={url => set({ mainLogoUrl: url })}   token={token} label="Main Logo (navbar)" />
            <ImagePicker value={gs.headerLogoUrl ?? ''} onChange={url => set({ headerLogoUrl: url })} token={token} label="Header Logo (optional alt)" />
          </div>
          <Field label="Header Background Colour" hint="Navbar background on every page.">
            <div className="flex items-center gap-2">
              <input type="color" value={gs.headerBackgroundColor || '#C7FBA0'} onChange={e => set({ headerBackgroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <input value={gs.headerBackgroundColor ?? ''} onChange={e => set({ headerBackgroundColor: e.target.value })} className={`${inp} flex-1`} placeholder="#C7FBA0" />
            </div>
          </Field>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">💬 WhatsApp</h3>
          <p className="font-jakarta text-xs text-slate-400 mt-0.5">Powers every WhatsApp button site-wide (header, footer, About &amp; Contact pages).</p>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <Field label="WhatsApp Number / URL" hint="wa.me link — any ?text= here is ignored in favour of the message below.">
            <input value={gs.whatsappUrl ?? ''} onChange={e => set({ whatsappUrl: e.target.value })} className={inp} placeholder="https://wa.me/919158577707" />
          </Field>
          <Field label="Pre-filled Message" hint="Sent automatically when a visitor taps any WhatsApp button.">
            <input value={gs.whatsappMessage ?? ''} onChange={e => set({ whatsappMessage: e.target.value })} className={inp} placeholder="Hi! 👋 I am browsing the ILOC website and would like to learn more about your overseas education services." />
          </Field>
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">🔗 Other Settings</h3>
          <p className="font-jakarta text-xs text-slate-400 mt-0.5">Site-wide announcement banner.</p>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <Field label="Notice Banner" hint="Optional announcement text. Leave empty to hide.">
            <input value={gs.noticeBanner ?? ''} onChange={e => set({ noticeBanner: e.target.value })} className={inp} placeholder="🎉 Fall 2026 intake applications now open!" />
          </Field>
        </div>
      </div>

      {/* Grid Layouts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">📐 Grid Layouts</h3>
          <p className="font-jakarta text-xs text-slate-400 mt-0.5">Number of columns shown on tablet &amp; desktop (md/lg). Mobile always falls back to 1–2 columns.</p>
        </div>
        <div className="p-6 grid sm:grid-cols-3 gap-4">
          <Field label="Destinations Grid" hint="Homepage 'Where will you go?' country cards.">
            <select value={gs.destinationsCols ?? 4} onChange={e => set({ destinationsCols: Number(e.target.value) })} className={inp}>
              {COL_OPTIONS.map(n => <option key={n} value={n}>{n} column{n > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
          <Field label="Events Grid" hint="/events hub — Upcoming &amp; Past Events.">
            <select value={gs.eventsCols ?? 3} onChange={e => set({ eventsCols: Number(e.target.value) })} className={inp}>
              {COL_OPTIONS.map(n => <option key={n} value={n}>{n} column{n > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
          <Field label="Live Classes Grid" hint="Homepage Live Classes board (desktop).">
            <select value={gs.classesCols ?? 3} onChange={e => set({ classesCols: Number(e.target.value) })} className={inp}>
              {COL_OPTIONS.map(n => <option key={n} value={n}>{n} column{n > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={busy}
          className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
          {busy ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
