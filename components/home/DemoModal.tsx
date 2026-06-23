'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY } from '@/lib/data';

interface Props {
  open:    boolean;
  onClose: () => void;
}

const BEZIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BATCH_OPTIONS = [
  'Morning — 7:00 AM to 9:00 AM',
  'Afternoon — 12:00 PM to 2:00 PM',
  'Evening — 6:00 PM to 8:00 PM',
  'Weekend Batch (Sat & Sun)',
];

const SCORE_OPTIONS = ['5.0–5.5', '6.0', '6.5', '7.0', '7.5', '8.0+'];

interface FormState {
  name:    string;
  phone:   string;
  email:   string;
  target:  string;
  batch:   string;
  message: string;
}

const EMPTY: FormState = { name: '', phone: '', email: '', target: '', batch: '', message: '' };

export default function DemoModal({ open, onClose }: Props) {
  const [form,  setForm]  = useState<FormState>(EMPTY);
  const [busy,  setBusy]  = useState(false);
  const [done,  setDone]  = useState(false);
  const [error, setError] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  // Focus first field when opened
  useEffect(() => {
    if (open) { setTimeout(() => firstRef.current?.focus(), 180); }
    if (!open) { setForm(EMPTY); setDone(false); setError(''); }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else      document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return; }
    setError(''); setBusy(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          phone:   form.phone.trim(),
          email:   form.email.trim(),
          country: 'IELTS Demo Class Request',
          program: `Target: ${form.target || 'Not specified'} | Batch: ${form.batch || 'Not specified'}`,
          message: form.message.trim(),
          source:  'ielts-demo-modal',
        }),
      });
    } catch { /* silent — still show success */ }

    setBusy(false);
    setDone(true);

    // Open WhatsApp with pre-filled professional message
    const msg = encodeURIComponent(
      `Hi! I just registered for a Free IELTS DEMO Class via the ILOC website.\n\n` +
      `Name: ${form.name.trim()}\n` +
      `Phone: ${form.phone.trim()}\n` +
      (form.email ? `Email: ${form.email.trim()}\n` : '') +
      (form.target ? `Target Band: ${form.target}\n` : '') +
      (form.batch  ? `Preferred Batch: ${form.batch}\n` : '') +
      `\nLooking forward to the demo class!`
    );
    setTimeout(() => window.open(`https://wa.me/${COMPANY.phone.replace(/\D/g, '')}?text=${msg}`, '_blank'), 1400);
  };

  const inp = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-lime-300 focus:border-lime-500 outline-none transition-all placeholder-slate-400 text-slate-800';
  const lbl = 'block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="demo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9998]"
          />

          {/* Centering container */}
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-0 sm:px-4 pointer-events-none">
          {/* Panel */}
          <motion.div
            key="demo-panel"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 60, scale: 0.95  }}
            transition={{ duration: 0.4, ease: BEZIER }}
            className="pointer-events-auto w-full sm:w-[560px] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.35)]"
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-6 pt-6 pb-4 rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg,#1A2E05 0%,#4D7C0F 100%)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-jakarta text-[11px] font-semibold text-white/90 tracking-wide">Free · No Obligation</span>
                  </div>
                  <h2 className="font-jakarta font-extrabold text-white text-xl leading-tight">
                    Book Your Free<br />
                    <span className="text-amber-400">IELTS Demo Class</span>
                  </h2>
                  <p className="font-jakarta text-white/70 text-xs mt-1">
                    Experience our expert coaching — live, no strings attached.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center transition-colors flex-shrink-0 mt-1"
                >
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['🎯 96% Success Rate', '📚 Expert Faculty', '⏱️ 90-Min Demo', '🆓 100% Free'].map(b => (
                  <span key={b} className="font-jakarta text-[11px] font-medium text-white/80 bg-white/10 border border-white/15 rounded-full px-2.5 py-1">{b}</span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {done ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
                    >
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <h3 className="font-jakarta font-extrabold text-slate-800 text-xl mb-2">You&apos;re Registered! 🎉</h3>
                    <p className="font-jakarta text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                      Our IELTS expert team will contact you within <strong>2 hours</strong> to confirm your demo class slot.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left mb-5">
                      <p className="font-jakarta text-xs font-semibold text-emerald-700 mb-1">WhatsApp Opening…</p>
                      <p className="font-jakarta text-xs text-slate-500 leading-relaxed">We&apos;re opening a WhatsApp message so our counsellor can confirm your batch preference instantly.</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="font-jakarta font-bold text-sm text-white px-8 py-3 rounded-xl transition-all"
                      style={{ background: 'linear-gradient(135deg,#3F6212,#65A30D)' }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Full Name *</label>
                        <input
                          ref={firstRef}
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Your full name"
                          required
                          className={inp}
                        />
                      </div>
                      <div>
                        <label className={lbl}>Phone Number *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          placeholder="+91 98765 43210"
                          required
                          className={inp}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="your@email.com (optional)"
                        className={inp}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Target Band Score</label>
                        <select value={form.target} onChange={set('target')} className={inp}>
                          <option value="">Select target score</option>
                          {SCORE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={lbl}>Preferred Batch</label>
                        <select value={form.batch} onChange={set('batch')} className={inp}>
                          <option value="">Select batch timing</option>
                          {BATCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={lbl}>Anything else? (optional)</label>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        rows={2}
                        placeholder="E.g. current band score, exam date, specific concerns…"
                        className={`${inp} resize-none`}
                      />
                    </div>

                    {error && (
                      <p className="font-jakarta text-xs text-red-500 font-medium">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full font-jakarta font-bold text-sm text-white py-4 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 8px 28px rgba(16,185,129,0.35)' }}
                    >
                      {busy ? 'Booking…' : '🎓 Book My Free DEMO Class →'}
                    </button>

                    <p className="font-jakarta text-[11px] text-slate-400 text-center leading-relaxed">
                      By submitting, you agree to be contacted by ILOC. No spam — ever.{' '}
                      <span className="text-lime-500">Free · No credit card · Zero obligation.</span>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
