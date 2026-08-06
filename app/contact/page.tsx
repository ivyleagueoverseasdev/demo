'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANY, COUNTRIES, buildWhatsAppLink } from '@/lib/data';
import PageHero from '@/components/shared/PageHero';

export default function ContactPage() {
  const [f,    setF]    = useState({ name:'', email:'', phone:'', country:'', program:'', msg:'' });
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');
  const [wa,         setWa]         = useState(buildWhatsAppLink(COMPANY.wa, COMPANY.whatsappMessage));
  const [phone,      setPhone]      = useState(COMPANY.phone);
  const [email,      setEmail]      = useState(COMPANY.email);
  const [address,    setAddress]    = useState(COMPANY.address);
  const [mapsLink,   setMapsLink]   = useState(COMPANY.mapsLink);
  const [heroImage,  setHeroImage]  = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop');
  const [heroBadge,  setHeroBadge]  = useState({ value: '24h', label: 'Average response time' });
  const [countryOpts, setCountryOpts] = useState<string[]>(COUNTRIES.map(c => c.name));

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        const cd = d?.companyDetails;
        const gs = d?.globalSettings;
        const waBase = cd?.whatsapp || gs?.whatsappUrl || COMPANY.wa;
        const waMsg  = gs?.whatsappMessage || COMPANY.whatsappMessage;
        setWa(buildWhatsAppLink(waBase, waMsg));
        if (cd?.phone)               setPhone(cd.phone);
        if (cd?.email)               setEmail(cd.email);
        if (cd?.address)             setAddress(cd.address);
        if (cd?.mapsLink)            setMapsLink(cd.mapsLink);
        if (cd?.contactHeroImageUrl) setHeroImage(cd.contactHeroImageUrl);
        // Admin-editable image caption badge (/admin/global → Page Image Captions)
        const pb = gs?.pageHeroBadges?.contact;
        if (pb?.value || pb?.label) {
          setHeroBadge(b => ({ value: pb.value || b.value, label: pb.label || b.label }));
        }
        // Effective destination list (admin add/hide aware)
        if (Array.isArray(d?.countries) && d.countries.length) {
          setCountryOpts(d.countries.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => {});
  }, []);

  const chg = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim() || !f.country || !f.program) {
      setErr('Please fill all required fields.');
      return;
    }
    setErr('');
    setBusy(true);

    try {
      // fetch() only rejects on a network-level failure — a 500 from a KV
      // write failure resolves as an "ok" promise with res.ok === false, so
      // res.ok MUST be checked explicitly or a genuinely failed submission
      // silently shows the visitor a false "success" screen while nothing
      // was ever saved (this was happening — enquiries were vanishing
      // without a trace whenever the save failed).
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    f.name,
          phone:   f.phone,
          email:   f.email,
          country: f.country,
          program: f.program,
          message: f.msg,
          source:  'contact-page',
        }),
      });
      if (!res.ok) {
        setBusy(false);
        setErr('Something went wrong saving your request — please try again, or reach us directly on WhatsApp/phone below.');
        return;
      }
    } catch {
      setBusy(false);
      setErr('Network error — please check your connection and try again, or reach us directly on WhatsApp/phone below.');
      return;
    }

    setBusy(false);
    setOk(true);

    // Open WhatsApp with pre-filled message after showing success state briefly
    const waMsg = encodeURIComponent(
      `Hi! I just submitted a counselling request on the ILOC website and would love to connect.\n\nName: ${f.name}\nPhone: ${f.phone}\nCountry of Interest: ${f.country}\nProgram: ${f.program}${f.msg ? `\n\nMessage: ${f.msg}` : ''}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/919158577707?text=${waMsg}`, '_blank');
    }, 1200);
  };

  const inp = 'input text-sm';

  return (
    <div className="bg-white">
      {/* Hero */}
      <PageHero
        gradient="linear-gradient(115deg,#1249C4 0%,#246DFF 55%,#5A8CFF 100%)"
        breadcrumbLabel="Contact"
        eyebrow="We're Here to Help"
        eyebrowColor="#CCFF00"
        heading={
          <>
            Get in{' '}
            <span style={{ background: 'linear-gradient(135deg,#CCFF00,#A3E635)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              touch.
            </span>
          </>
        }
        paragraph="Book a free counselling session or send us a message. We'll respond within 24 hours."
        image={{
          src: heroImage,
          alt: 'ILOC counselling office desk'
        }}
        imagePosition="left"
        badge={heroBadge}
        blobColor="#CCFF00"
      />

      <section className="w-full overflow-hidden section bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
            {/* Info */}
            <div>
              <div className="divider-amber mb-4" />
              <h2 className="font-jakarta font-extrabold text-primary-600 mb-6 text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight">
                Talk to our counsellor directly.
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon:'📞', label:'Phone',         value: phone,           href:`tel:${phone}` },
                  { icon:'✉',  label:'Email',         value: email,           href:`mailto:${email}` },
                  { icon:'📍', label:'Office',        value: address,         href: mapsLink },
                  { icon:'⏰', label:'Response Time', value:'Within 24 hours', href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">{item.label}</div>
                      {item.href
                        ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                             rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                             className="font-jakarta text-sm text-slate-700 hover:text-amber-500 transition-colors">{item.value}</a>
                        : <div className="font-jakarta text-sm text-slate-700">{item.value}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
              <a href={wa} target="_blank" rel="noopener noreferrer"
                className="w-fit mx-auto flex items-center gap-2 font-jakarta font-bold text-sm py-3.5 px-8 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                💬 Instant Response on WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="card p-7 sm:p-9">
              {!ok ? (
                <form onSubmit={submit} noValidate className="space-y-4">
                  <h3 className="font-jakarta font-extrabold text-primary-600 text-xl mb-1">Book Free Session</h3>
                  <p className="font-jakarta text-xs text-slate-400 mb-4">30 min · Zero pressure · Personalised roadmap</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                      <input value={f.name} onChange={e=>chg('name',e.target.value)} className={inp} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Phone / WhatsApp *</label>
                      <input value={f.phone} onChange={e=>chg('phone',e.target.value)} type="tel" className={inp} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                    <input value={f.email} onChange={e=>chg('email',e.target.value)} type="email" className={inp} placeholder="you@example.com" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Target Country *</label>
                      <select value={f.country} onChange={e=>chg('country',e.target.value)} className={`${inp} cursor-pointer`}>
                        <option value="">Select country</option>
                        {countryOpts.map(n=><option key={n} value={n}>{n}</option>)}
                        {['Other'].map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Program Level *</label>
                      <select value={f.program} onChange={e=>chg('program',e.target.value)} className={`${inp} cursor-pointer`}>
                        <option value="">Select level</option>
                        {["Undergraduate","Postgraduate (Master's)","PhD","Diploma","Not sure"].map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1.5">Message (optional)</label>
                    <textarea value={f.msg} onChange={e=>chg('msg',e.target.value)} rows={3}
                      className={`${inp} resize-none`} placeholder="Tell us about your goals or any specific questions..." />
                  </div>
                  {err && <p className="font-jakarta text-xs text-red-500">{err}</p>}
                  <button type="submit" disabled={busy}
                    className="block w-fit mx-auto btn-primary text-sm py-3.5 px-10 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
                    {busy ? 'Syncing to CRM…' : 'Submit Request →'}
                  </button>
                  <p className="font-jakarta text-center text-xs text-slate-400">
                    Our counsellor will contact you within 24 hours.
                  </p>
                </form>
              ) : (
                <div className="py-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl mx-auto mb-5">🎉</div>
                  <h3 className="font-jakarta font-bold text-primary-600 text-xl mb-2">We&apos;ve received your request!</h3>
                  <p className="font-jakarta text-slate-500 text-sm mb-6 leading-relaxed">
                    Our counsellor will call you at <strong>{f.phone}</strong> within 24 hours.
                    {f.country && <> We&apos;ll prepare a personalised plan for <strong className="text-amber-600">{f.country}</strong>.</>}
                  </p>
                  <a href={wa} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                    💬 Connect on WhatsApp for instant help
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
