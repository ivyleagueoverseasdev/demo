'use client';

import { useState } from 'react';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

type Fields = {
  companyName:     string;
  name:            string;
  yearsInBusiness: string;
  expectedVolume:  string;
  email:           string;
  phone:           string;
};

const EMPTY: Fields = {
  companyName: '', name: '', yearsInBusiness: '', expectedVolume: '', email: '', phone: '',
};

export default function AgentForm() {
  const [f,    setF]    = useState<Fields>(EMPTY);
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  const chg = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.companyName.trim() || !f.name.trim() || !f.email.trim() || !f.phone.trim()) {
      setErr('Please fill in all required fields.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      await fetch('/api/partner-enquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerType:     'agent',
          companyName:     f.companyName,
          name:            f.name,
          yearsInBusiness: f.yearsInBusiness,
          expectedVolume:  f.expectedVolume,
          email:           f.email,
          phone:           f.phone,
        }),
      });
    } catch {
      // Email is best-effort — we still show success so the user isn't blocked
    }
    setBusy(false);
    setOk(true);
  }

  if (ok) {
    return (
      <div className="py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
        <h3 className="font-jakarta font-bold text-slate-800 text-lg mb-2">Application Received!</h3>
        <p className="font-jakarta text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          Thank you, <strong>{f.name}</strong>. Our team will review your application and reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
          Agency Name <span className="text-red-400">*</span>
        </label>
        <input
          required
          value={f.companyName}
          onChange={chg('companyName')}
          type="text"
          className={fieldCls}
          placeholder="Global Ed Consultants"
        />
      </div>

      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
          Contact Person <span className="text-red-400">*</span>
        </label>
        <input
          required
          value={f.name}
          onChange={chg('name')}
          type="text"
          className={fieldCls}
          placeholder="Your full name"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Years in Business</label>
          <select value={f.yearsInBusiness} onChange={chg('yearsInBusiness')} className={fieldCls}>
            <option value="">Select…</option>
            <option value="0-2">0 – 2 Years</option>
            <option value="3-5">3 – 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Expected Volume (Yearly)</label>
          <select value={f.expectedVolume} onChange={chg('expectedVolume')} className={fieldCls}>
            <option value="">Select…</option>
            <option value="1-20">1 – 20 Students</option>
            <option value="20-50">20 – 50 Students</option>
            <option value="50+">50+ Students</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Business Email <span className="text-red-400">*</span>
          </label>
          <input required value={f.email} onChange={chg('email')} type="email" className={fieldCls} placeholder="contact@agency.com" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input required value={f.phone} onChange={chg('phone')} type="tel" className={fieldCls} placeholder="+91 98765 43210" />
        </div>
      </div>

      {err && <p className="font-jakarta text-xs text-red-500">{err}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
      >
        {busy ? 'Submitting…' : 'Submit Agent Application →'}
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">We conduct a strict vetting process for all franchisees.</p>
    </form>
  );
}
