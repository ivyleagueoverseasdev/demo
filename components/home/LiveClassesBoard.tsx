'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Video, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GRID_COLS_LG, clampCols } from '@/lib/gridCols';

// ── Types ──────────────────────────────────────────────────────────────────
interface LiveClass {
  id:       string;
  eventId:  string;       // matches SiteEvent id in data.ts → /events/[eventId]
  subject:  string;
  level?:   string;
  date:     string;       // display string
  time:     string;
  imageUrl: string;
  imageAlt: string;
  color:    string;       // accent hex
  tag:      string;       // chip label e.g. "Language" | "Test Prep"
  whatsapp: string;       // wa.me link with pre-filled message
}

// ── Static class data ──────────────────────────────────────────────────────
const CLASSES: LiveClass[] = [
  {
    id:       'german-a1',
    eventId:  'class-german-a1',
    subject:  'Online German',
    level:    'A1 Level',
    date:     'Mon, 2 June 2026',
    time:     '8:00 PM – 9:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'German A1 Online Class promotional poster',
    color:    '#4D7C0F',
    tag:      'Language',
    whatsapp: 'https://wa.me/919158577707?text=Hi!%20I%27d%20like%20to%20register%20for%20the%20FREE%20German%20A1%20Demo%20on%202%20June%202026.',
  },
  {
    id:       'gre-online',
    eventId:  'class-gre-online',
    subject:  'GRE Online Coaching',
    date:     'Fri, 5 June 2026',
    time:     '10:00 PM – 11:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'GRE Online Coaching promotional poster',
    color:    '#7C3AED',
    tag:      'Test Prep',
    whatsapp: 'https://wa.me/919158577707?text=Hi!%20I%27d%20like%20to%20register%20for%20the%20FREE%20GRE%20Demo%20on%205%20June%202026.',
  },
  {
    id:       'toefl-online',
    eventId:  'class-toefl-online',
    subject:  'TOEFL Online Coaching',
    date:     'Tue, 9 June 2026',
    time:     '5:00 PM – 6:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'TOEFL Online Coaching promotional poster',
    color:    '#059669',
    tag:      'Test Prep',
    whatsapp: 'https://wa.me/919158577707?text=Hi!%20I%27d%20like%20to%20register%20for%20the%20FREE%20TOEFL%20Demo%20on%209%20June%202026.',
  },
];

// ── FreeDemoBadge — pulsing shimmer badge ─────────────────────────────────
function FreeDemoBadge() {
  return (
    <div className="relative">
      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(251,191,36,0.35)' }}
        animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Badge */}
      <motion.div
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-jakarta font-bold text-[11px] text-amber-900 select-none overflow-hidden"
        style={{
          background: 'linear-gradient(135deg,#FDE68A,#FCD34D,#FBBF24)',
          boxShadow: '0 4px 14px rgba(251,191,36,0.55)',
        }}
      >
        {/* Shimmer sweep */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.55) 50%,transparent 70%)',
            backgroundSize: '220% 100%',
          }}
          animate={{ backgroundPosition: ['150% 0', '-150% 0'] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.8 }}
        />
        <span>🎁</span>
        <span>1st Session FREE Demo</span>
      </motion.div>
    </div>
  );
}

// ── BookingModal ──────────────────────────────────────────────────────────
function BookingModal({ cls, onClose }: { cls: LiveClass; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Build WhatsApp message with form data
    const msg = encodeURIComponent(
      `Hi! I'd like to book the FREE Demo for *${cls.subject}${cls.level ? ` (${cls.level})` : ''}* on ${cls.date}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`
    );
    window.open(`https://wa.me/919158577707?text=${msg}`, '_blank');
    setSent(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg,${cls.color},#FBBF24)` }} />

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          {!sent ? (
            <>
              <div className="mb-5">
                <span
                  className="inline-block font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2"
                  style={{ background: `${cls.color}18`, color: cls.color }}
                >
                  {cls.tag}
                </span>
                <h3 className="font-jakarta font-extrabold text-slate-800 text-xl leading-tight">
                  Book Your Free Demo
                </h3>
                <p className="font-jakarta text-sm text-slate-500 mt-1">
                  {cls.subject}{cls.level ? ` — ${cls.level}` : ''} · {cls.date} · {cls.time}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  { label: 'Full Name',    val: name,  set: setName,  type: 'text',  ph: 'e.g. Rahul Sharma', req: true },
                  { label: 'Phone Number', val: phone, set: setPhone, type: 'tel',   ph: '+91 98765 43210',   req: true },
                  { label: 'Email Address',val: email, set: setEmail, type: 'email', ph: 'you@email.com',     req: false },
                ].map(({ label, val, set, type, ph, req }) => (
                  <div key={label}>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 mb-1">
                      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      type={type}
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={ph}
                      required={req}
                      className="w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 transition-shadow placeholder:text-slate-300"
                      style={{ '--tw-ring-color': cls.color } as React.CSSProperties}
                    />
                  </div>
                ))}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full font-jakarta font-bold text-sm text-white py-3 rounded-2xl mt-1 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${cls.color},${cls.color}CC)` }}
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.25) 50%,transparent 65%)',
                      backgroundSize: '250% 100%',
                    }}
                    animate={{ backgroundPosition: ['150% 0', '-150% 0'] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                  />
                  <span className="relative">Confirm via WhatsApp →</span>
                </motion.button>

                <p className="font-jakarta text-[10px] text-slate-400 text-center">
                  We'll send you the Zoom link &amp; joining instructions on WhatsApp.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: cls.color }} />
              </motion.div>
              <h3 className="font-jakarta font-extrabold text-slate-800 text-xl mb-2">You're In!</h3>
              <p className="font-jakarta text-sm text-slate-500">
                Your WhatsApp has opened. Send the message to confirm your FREE demo seat.
              </p>
              <button
                onClick={onClose}
                className="mt-6 font-jakarta text-sm font-semibold px-6 py-2.5 rounded-xl text-white transition-all"
                style={{ background: cls.color }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ClassCard ─────────────────────────────────────────────────────────────
function ClassCard({ cls, index, onBook }: { cls: LiveClass; index: number; onBook: (cls: LiveClass) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, delay: index * 0.10, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 cursor-pointer"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', minWidth: 300 }}
    >
      {/* ── Poster image ── */}
      <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
        <Image
          src={cls.imageUrl}
          alt={cls.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 90vw, 360px"
        />
        {/* Gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.10) 50%,transparent 100%)' }}
        />

        {/* Tag chip — top left */}
        <div className="absolute top-3 left-3">
          <span
            className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
            style={{ background: cls.color }}
          >
            {cls.tag}
          </span>
        </div>

        {/* Online badge — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <Video className="w-3 h-3 text-white" />
          <span className="font-jakarta text-[9px] font-bold text-white tracking-wide">LIVE ONLINE</span>
        </div>

        {/* Free Demo badge — overlaps image bottom */}
        <div className="absolute -bottom-4 left-4">
          <FreeDemoBadge />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-5 pt-8 pb-5">
        {/* Accent line */}
        <div className="w-10 h-1 rounded-full mb-3" style={{ background: cls.color }} />

        <h3 className="font-jakarta font-extrabold text-slate-800 text-lg leading-tight mb-0.5">
          {cls.subject}
        </h3>
        {cls.level && (
          <p className="font-jakarta text-xs font-semibold mb-3" style={{ color: cls.color }}>{cls.level}</p>
        )}

        {/* Date & time */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center gap-2 font-jakarta text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cls.color }} strokeWidth={2} />
            <span className="font-semibold">{cls.date}</span>
          </div>
          <div className="flex items-center gap-2 font-jakarta text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" strokeWidth={2} />
            <span>{cls.time}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-auto space-y-2.5">
          {/* Primary */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onBook(cls)}
            className="w-full font-jakarta font-bold text-sm text-white py-3 rounded-2xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg,${cls.color},${cls.color}CC)`, boxShadow: `0 6px 18px ${cls.color}44` }}
          >
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%)',
                backgroundSize: '250% 100%',
              }}
              animate={{ backgroundPosition: ['150% 0', '-150% 0'] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
            />
            <span className="relative">Book Free Demo →</span>
          </motion.button>

          {/* Secondary */}
          <Link
            href={`/events/${cls.eventId}`}
            className="w-full flex items-center justify-center font-jakarta text-xs font-semibold transition-colors hover:underline"
            style={{ color: cls.color }}
          >
            View Course Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── LiveClassesBoard (main export) ────────────────────────────────────────
export default function LiveClassesBoard({ gridCols }: { gridCols?: number }) {
  const [activeModal, setActiveModal] = useState<LiveClass | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [classes, setClasses] = useState<LiveClass[]>(CLASSES);
  const trackRef = useRef<HTMLDivElement>(null);
  const CARD_W = 316;
  const cols = clampCols(gridCols, 3);

  useEffect(() => {
    fetch('/api/events', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        const kvClasses = (d?.events ?? []).filter(
          (e: any) => e.type === 'class' && e.published
        );
        if (kvClasses.length > 0) {
          setClasses(kvClasses.map((e: any) => ({
            id:       e.id,
            eventId:  e.id,
            subject:  e.title,
            date:     e.date,
            time:     e.time,
            imageUrl: e.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1600&auto=format&fit=crop',
            imageAlt: `${e.title} promotional poster`,
            color:    '#0891B2',
            tag:      'Live Class',
            whatsapp: e.ctaUrl?.startsWith('https://wa.me/')
              ? e.ctaUrl
              : `https://wa.me/919158577707?text=${encodeURIComponent(`Hi! I'd like to register for ${e.title}.`)}`,
          })));
        }
      })
      .catch(() => {});
  }, []);

  function scrollTo(idx: number) {
    const clamped = Math.min(Math.max(idx, 0), classes.length - 1);
    setCarouselIdx(clamped);
    trackRef.current?.scrollTo({ left: clamped * CARD_W, behavior: 'smooth' });
  }

  return (
    <>
      <section id="classes" className="section bg-white border-y border-slate-100">
        <div className="container-xl">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          >
            <div>
              <div className="divider-amber" />
              <p className="label mb-3">Live Online Classes</p>
              <h2
                className="font-jakarta font-extrabold text-homeblue-600"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)' }}
              >
                Upcoming Live Classes<br className="hidden sm:block" /> &amp; Events
              </h2>
              <p className="font-jakarta text-sm text-slate-500 mt-2 max-w-lg">
                GRE · GMAT · SAT · TOEFL · IELTS · German — expert-led batches, all online.{' '}
                <span className="font-semibold text-amber-600">First session is always a FREE demo.</span>
              </p>
            </div>

            {/* Nav arrows (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              {[
                { dir: -1, Icon: ChevronLeft,  label: 'Previous' },
                { dir:  1, Icon: ChevronRight, label: 'Next' },
              ].map(({ dir, Icon, label }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(carouselIdx + dir)}
                  disabled={(dir === -1 && carouselIdx === 0) || (dir === 1 && carouselIdx === classes.length - 1)}
                  aria-label={label}
                  className="w-11 h-11 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-homeblue-400 hover:text-homeblue-600 hover:bg-homeblue-50 transition-all disabled:opacity-30 disabled:cursor-default"
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Cards grid (desktop 3-col) / carousel (mobile) ── */}

          {/* Desktop: static grid — admin-configurable column count */}
          <div className={`hidden lg:grid ${GRID_COLS_LG[cols]} gap-6`}>
            {classes.map((cls, i) => (
              <ClassCard key={cls.id} cls={cls} index={i} onBook={setActiveModal} />
            ))}
          </div>

          {/* Mobile/tablet: horizontal scroll carousel */}
          <div className="lg:hidden">
            <div
              ref={trackRef}
              className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-2"
              style={{ scrollSnapType: 'x mandatory' }}
              onScroll={() => {
                if (!trackRef.current) return;
                setCarouselIdx(Math.round(trackRef.current.scrollLeft / CARD_W));
              }}
            >
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {classes.map((cls, i) => (
                  <div key={cls.id} style={{ scrollSnapAlign: 'start', width: 300 }}>
                    <ClassCard cls={cls} index={i} onBook={setActiveModal} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {classes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    height: 6,
                    width: i === carouselIdx ? 24 : 6,
                    background: i === carouselIdx ? '#D97706' : '#CBD5E1',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── USP strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-jakarta font-bold text-amber-900 text-sm">Every batch starts with a FREE demo session.</p>
                <p className="font-jakarta text-xs text-amber-700">No commitment. No payment. Just show up and learn.</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => classes[0] && setActiveModal(classes[0])}
              className="flex-shrink-0 font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)', boxShadow: '0 4px 14px rgba(101,163,13,0.35)' }}
            >
              Reserve My Free Seat →
            </motion.button>
          </motion.div>

        </div>
      </section>

      {/* ── Booking modal ── */}
      <AnimatePresence>
        {activeModal && (
          <BookingModal cls={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
