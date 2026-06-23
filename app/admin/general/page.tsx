'use client';

// Company Details editor — phone, email, address, maps & WhatsApp links.
// Consumed by the public Footer (contact block) and Navbar info bar.
// Persists to KV via PUT /api/content { companyDetails } — live immediately.

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../_context';
import { apiCall } from '@/lib/edge-utils';
import { COMPANY } from '@/lib/data';
import type { CompanyDetails } from '@/lib/types';
import ImagePicker from '@/components/admin/ImagePicker';
import { SkeletonFormBlock } from '@/components/admin/SkeletonCard';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

const DEFAULTS: CompanyDetails = {
  phone:    COMPANY.phone,
  whatsapp: COMPANY.wa,
  email:    COMPANY.email,
  address:  COMPANY.address,
  mapsLink: COMPANY.mapsLink,
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="font-jakarta text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminGeneralPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [cd,      setCd]      = useState<CompanyDetails>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);

  const set = (patch: Partial<CompanyDetails>) => setCd(c => ({ ...c, ...patch }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as { companyDetails?: CompanyDetails | null };
        if (d.companyDetails) setCd({ ...DEFAULTS, ...d.companyDetails });
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/content', token, body: { companyDetails: cd } });
    setBusy(false);
    if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
    flash('✓ Company details saved — live immediately.', 'success');
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🏢 General Info</h1>
        <SkeletonFormBlock rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🏢 General Info</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Contact details shown in the Footer, Navbar info bar, and Contact page. Saved to KV — live immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/contact" target="_blank" rel="noopener noreferrer"
            className="font-jakarta font-semibold text-xs text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            View Contact ↗
          </a>
          <button onClick={save} disabled={busy}
            className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {busy ? 'Saving…' : 'Save Details'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">📞 Contact Details</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone" hint="Shown as click-to-call in navbar & footer.">
              <input value={cd.phone} onChange={e => set({ phone: e.target.value })} className={inp} placeholder="+91-9158577707" />
            </Field>
            <Field label="Email">
              <input value={cd.email} onChange={e => set({ email: e.target.value })} className={inp} placeholder="ivyleagueoverseas@gmail.com" />
            </Field>
          </div>
          <Field label="WhatsApp URL" hint="Full wa.me link with optional pre-filled message.">
            <input value={cd.whatsapp} onChange={e => set({ whatsapp: e.target.value })} className={inp} placeholder="https://wa.me/919158577707?text=Hi…" />
          </Field>
          <Field label="Office Address">
            <textarea value={cd.address} onChange={e => set({ address: e.target.value })} rows={3} className={`${inp} resize-none`} placeholder="1st Floor, Govind Chambers, Karve Rd…" />
          </Field>
          <Field label="Google Maps Link">
            <input value={cd.mapsLink} onChange={e => set({ mapsLink: e.target.value })} className={inp} placeholder="https://maps.app.goo.gl/…" />
          </Field>
          <Field label="Contact Page Hero Image" hint="The large photo shown in the banner at the top of the /contact page. Paste a URL, upload, or pick from the library.">
            <ImagePicker
              value={cd.contactHeroImageUrl ?? ''}
              onChange={url => set({ contactHeroImageUrl: url })}
              label=""
              token={token}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={busy}
          className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
          {busy ? 'Saving…' : 'Save Details'}
        </button>
      </div>
    </div>
  );
}
