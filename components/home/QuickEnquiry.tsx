'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COMPANY, COUNTRIES } from '@/lib/data';

export default function QuickEnquiry() {
  const [f,    setF]    = useState({ name: '', phone: '', country: '', program: '' });
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');
  const [countryOpts, setCountryOpts] = useState<string[]>(COUNTRIES.map(c => c.name));

  // Effective destination list (admin add/hide aware) — falls back to static
  useEffect(() => {
    fetch('/api/countries', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        if (Array.isArray(d?.countries) && d.countries.length) {
          setCountryOpts(d.countries.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim() || !f.country) {
      setErr('Please fill all required fields.');
      return;
    }
    setErr('');
    setBusy(true);

    try {
      // fetch() only rejects on a network-level failure — a 500 from a KV
      // write failure resolves as an "ok" promise with res.ok === false, so
      // res.ok must be checked explicitly or a genuinely failed submission
      // silently shows a false "success" screen while nothing was saved.
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    f.name,
          phone:   f.phone,
          country: f.country,
          program: f.program,
          source:  'quick-enquiry',
        }),
      });
      if (!res.ok) {
        setBusy(false);
        setErr('Something went wrong saving your request — please try again, or message us directly on WhatsApp.');
        return;
      }
    } catch {
      setBusy(false);
      setErr('Network error — please check your connection and try again, or message us directly on WhatsApp.');
      return;
    }

    setBusy(false);
    setOk(true);

    const waMsg = encodeURIComponent(
      `Hi! I just submitted a quick enquiry on the ILOC website and would love to connect.\n\nName: ${f.name}\nPhone: ${f.phone}\nCountry of Interest: ${f.country}${f.program ? `\nProgram: ${f.program}` : ''}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919158577707?text=${waMsg}`, '_blank');
    }, 1200);
  };

  const inp = 'input text-sm';

  return (
    <section id="enquiry" className="w-full overflow-hidden section bg-gradient-to-b from-white to-homeblue-50/60">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="divider-amber" />
            <p className="label mb-3">Quick Enquiry</p>
            <h2 className="font-jakarta font-extrabold text-homeblue-600 mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              Start your journey<br />with one message.
            </h2>
            <p className="font-jakarta text-slate-500 text-base md:text-lg leading-relaxed mb-6">
              Fill the form and our counsellor will reach out within 24 hours. Alternatively, book a session directly or chat on WhatsApp for instant answers.
            </p>
            <div className="space-y-3">
              {[['📞', COMPANY.phone, `tel:${COMPANY.phone}`], ['✉', COMPANY.email, `mailto:${COMPANY.email}`]].map(([icon, label, href]) => (
                <a key={href as string} href={href as string} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-homeblue-100 flex items-center justify-center text-base flex-shrink-0 group-hover:bg-homeblue-600 transition-colors">
                    <span>{icon}</span>
                  </div>
                  <span className="font-jakarta text-sm text-slate-700 group-hover:text-homeblue-600 transition-colors">{label as string}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="bg-white rounded-3xl shadow-card p-7 sm:p-9 border border-slate-100">
              {!ok ? (
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <h3 className="font-jakarta font-bold text-homeblue-600 text-xl mb-1">Request Free Counselling</h3>
                  <p className="font-jakarta text-sm text-slate-400 mb-4">30 min · Zero pressure · No hidden fees</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                      <input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))}
                        className={inp} placeholder="Arjun Sharma" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Phone / WhatsApp *</label>
                      <input value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))}
                        className={inp} placeholder="+91 98765 43210" type="tel" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Target Country *</label>
                      <select value={f.country} onChange={e => setF(p => ({ ...p, country: e.target.value }))}
                        className={`${inp} cursor-pointer`}>
                        <option value="">Select country</option>
                        {countryOpts.map(n => <option key={n} value={n}>{n}</option>)}
                        {['Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Program Level</label>
                      <select value={f.program} onChange={e => setF(p => ({ ...p, program: e.target.value }))}
                        className={`${inp} cursor-pointer`}>
                        <option value="">Select level</option>
                        {["Undergraduate (Bachelor's)", "Postgraduate (Master's)", "PhD / Doctoral", "Not sure yet"].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {err && <p className="font-jakarta text-xs text-red-500">{err}</p>}

                  <button type="submit" disabled={busy}
                    className="block w-fit mx-auto btn-primary text-sm py-3.5 px-10 rounded-full disabled:opacity-60 disabled:cursor-not-allowed">
                    {busy ? 'Syncing to CRM…' : 'Request Free Counselling →'}
                  </button>

                  <div className="flex items-center gap-3 my-1">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="font-jakarta text-xs text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>

                  <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
                    className="w-fit mx-auto flex items-center gap-2 font-jakarta font-semibold text-sm py-3.5 px-8 rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                    💬 Chat on WhatsApp Instead
                  </a>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl mx-auto mb-5">🎉</div>
                  <h3 className="font-jakarta font-bold text-homeblue-600 text-xl mb-2">Enquiry Received!</h3>
                  <p className="font-jakarta text-slate-500 text-sm leading-relaxed">
                    Our counsellor will contact you at <strong className="text-slate-700">{f.phone}</strong> within 24 hours.
                    {f.country && <><br />We&apos;ll prepare a personalised plan for <strong className="text-amber-600">{f.country}</strong>.</>}
                  </p>
                  <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                    💬 Chat Now for Faster Response
                  </a>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
