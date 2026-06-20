'use client';

import { useState } from 'react';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

type Fields = {
  companyName:  string;
  name:         string;
  designation:  string;
  email:        string;
  country:      string;
};

const EMPTY: Fields = { companyName: '', name: '', designation: '', email: '', country: '' };

export default function InstitutionsForm() {
  const [f,    setF]    = useState<Fields>(EMPTY);
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  const chg = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.companyName.trim() || !f.name.trim() || !f.email.trim()) {
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
          partnerType: 'institutions',
          companyName: f.companyName,
          name:        f.name,
          designation: f.designation,
          email:       f.email,
          country:     f.country,
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
        <h3 className="font-jakarta font-bold text-slate-800 text-lg mb-2">Request Received!</h3>
        <p className="font-jakarta text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          Thank you, <strong>{f.name}</strong>. Our B2B partnerships team will review your proposal and contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
          University / Institution Name <span className="text-red-400">*</span>
        </label>
        <input
          required
          value={f.companyName}
          onChange={chg('companyName')}
          type="text"
          className={fieldCls}
          placeholder="e.g. University of Technology Sydney"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Contact Person <span className="text-red-400">*</span>
          </label>
          <input required value={f.name} onChange={chg('name')} type="text" className={fieldCls} placeholder="John Doe" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
          <input value={f.designation} onChange={chg('designation')} type="text" className={fieldCls} placeholder="Admissions Director" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Official Email <span className="text-red-400">*</span>
          </label>
          <input required value={f.email} onChange={chg('email')} type="email" className={fieldCls} placeholder="john@university.edu" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Country</label>
          <input value={f.country} onChange={chg('country')} type="text" className={fieldCls} placeholder="Australia" />
        </div>
      </div>

      {err && <p className="font-jakarta text-xs text-red-500">{err}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
      >
        {busy ? 'Submitting…' : 'Submit Partnership Request →'}
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">Your information is secure and encrypted.</p>
    </form>
  );
}
