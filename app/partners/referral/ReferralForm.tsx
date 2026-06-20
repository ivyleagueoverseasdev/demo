'use client';

import { useState } from 'react';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

type Fields = {
  name:        string;
  email:       string;
  friendName:  string;
  friendPhone: string;
  country:     string;
};

const EMPTY: Fields = { name: '', email: '', friendName: '', friendPhone: '', country: '' };

export default function ReferralForm() {
  const [f,    setF]    = useState<Fields>(EMPTY);
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  const chg = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.friendName.trim() || !f.friendPhone.trim()) {
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
          partnerType: 'referral',
          name:        f.name,
          companyName: f.name,  // referrals have no company — use referrer's name
          email:       f.email,
          friendName:  f.friendName,
          friendPhone: f.friendPhone,
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
        <h3 className="font-jakarta font-bold text-slate-800 text-lg mb-2">Referral Submitted!</h3>
        <p className="font-jakarta text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          Thank you, <strong>{f.name}</strong>! We will reach out to <strong>{f.friendName}</strong> and keep you in the loop.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submit} noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input required value={f.name} onChange={chg('name')} type="text" className={fieldCls} placeholder="You (The Referrer)" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Your Email <span className="text-red-400">*</span>
          </label>
          <input required value={f.email} onChange={chg('email')} type="email" className={fieldCls} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Friend's Name <span className="text-red-400">*</span>
          </label>
          <input required value={f.friendName} onChange={chg('friendName')} type="text" className={fieldCls} placeholder="Friend's Full Name" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
            Friend's Phone <span className="text-red-400">*</span>
          </label>
          <input required value={f.friendPhone} onChange={chg('friendPhone')} type="tel" className={fieldCls} placeholder="+91 98765 43210" />
        </div>
      </div>

      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">
          Target Country <span className="font-normal text-slate-400">(Optional)</span>
        </label>
        <select value={f.country} onChange={chg('country')} className={fieldCls}>
          <option value="">Select a country…</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other / Not Sure</option>
        </select>
      </div>

      {err && <p className="font-jakarta text-xs text-red-500">{err}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
      >
        {busy ? 'Submitting…' : 'Submit Referral →'}
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">We respect privacy. No spam, just a professional introduction.</p>
    </form>
  );
}
