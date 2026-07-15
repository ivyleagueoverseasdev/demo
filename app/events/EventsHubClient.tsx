'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { SiteEvent, EventType } from '@/lib/types';
import PageHero from '@/components/shared/PageHero';
import { clampCols } from '@/lib/gridCols';

// Full literal strings — never build these via template literals.
// mobile (<640px): 1 col  |  tablet (640-1023px): 2 cols  |  desktop (lg+): admin value
const LG_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

// ── Type config ────────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  webinar:  { label: 'Webinar',    color: '#65A30D', bg: '#F7FFDB', border: '#D9F99D' },
  fair:     { label: 'Fair',       color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' },
  deadline: { label: 'Deadline',   color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  workshop: { label: 'Workshop',   color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  seminar:  { label: 'Seminar',    color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  class:    { label: 'Live Class', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
};

const COUNTRY_OPTIONS = [
  { value: '',             label: 'All Countries' },
  { value: 'usa',         label: 'United States' },
  { value: 'uk',          label: 'United Kingdom' },
  { value: 'australia',   label: 'Australia' },
  { value: 'canada',      label: 'Canada' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'ireland',     label: 'Ireland' },
  { value: 'europe',      label: 'Europe' },
  { value: 'uae',         label: 'United Arab Emirates' },
  { value: 'japan',       label: 'Japan' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'singapore',   label: 'Singapore' },
  { value: 'russia',      label: 'Russia' },
];

const TYPE_OPTIONS = [
  { value: '',         label: 'All Types' },
  { value: 'class',    label: '🎓 Live Classes' },
  { value: 'webinar',  label: 'Webinar' },
  { value: 'fair',     label: 'Fair' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar',  label: 'Seminar' },
  { value: 'deadline', label: 'Deadline' },
];

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return iso; }
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(iso); target.setHours(0,0,0,0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({ event, index, countryOptions = COUNTRY_OPTIONS }: {
  event: SiteEvent; index: number;
  countryOptions?: { value: string; label: string }[];
}) {
  const cfg  = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.seminar;
  const days = daysUntil(event.date);
  const past = days < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <Link
        href={`/events/${event.id}`}
        className="group block h-full rounded-2xl overflow-hidden border bg-white hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(101,163,13,0.13)] transition-all duration-300"
        style={{ borderColor: cfg.border, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
      >
        {/* Image */}
        {event.imageUrl && (
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.60))' }} />
            <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(to right,${cfg.color},#D97706)` }} />
          </div>
        )}

        <div className="p-5 flex flex-col h-full">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full border" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
              {cfg.label}
            </span>
            {!past && days <= 14 && days >= 0 && (
              <span className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                {days === 0 ? 'Today!' : `${days}d left`}
              </span>
            )}
            {past && <span className="font-jakarta text-[10px] text-slate-400 italic">Completed</span>}
            {event.country && (() => {
              const c = countryOptions.find(o => o.value === event.country)
                ?? COUNTRY_OPTIONS.find(o => o.value === event.country);
              return c ? <span className="font-jakarta text-[10px] font-medium text-slate-500">{c.label}</span> : null;
            })()}
          </div>

          <h3 className="font-jakarta font-bold text-slate-800 text-base md:text-lg leading-snug mb-2 group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>
          <p className="font-jakarta text-sm md:text-base text-slate-500 leading-relaxed flex-1 line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Meta */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 font-jakarta text-xs text-slate-600">
              <span>📅</span>
              <span className="font-semibold">{formatDate(event.date)}</span>
              {event.time && <><span className="text-slate-400">·</span><span>{event.time}</span></>}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 font-jakarta text-xs text-slate-500">
                <span>📍</span><span>{event.location}</span>
              </div>
            )}
            {event.seats && (
              <div className="flex items-center gap-2 font-jakarta text-xs text-slate-400">
                <span>🪑</span><span>{event.seats} seats available</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="font-jakarta text-xs font-bold" style={{ color: cfg.color }}>{event.ctaLabel || 'View Details'}</span>
            <span className="font-jakarta text-[11px] font-semibold px-3 py-1 rounded-lg text-white transition-opacity group-hover:opacity-100 opacity-80" style={{ background: cfg.color }}>
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2"><div className="h-4 w-16 bg-slate-100 rounded-full" /><div className="h-4 w-12 bg-slate-100 rounded-full" /></div>
        <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-3 w-full bg-slate-100 rounded-lg" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
        <div className="pt-3 border-t border-slate-100 flex justify-between">
          <div className="h-3 w-20 bg-slate-100 rounded" /><div className="h-7 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────
export default function EventsHubClient({ initialEvents, gridCols, gridRows, countries }: {
  initialEvents: SiteEvent[];
  gridCols?: number;
  gridRows?: number;
  /** Effective destination list (admin add/hide aware); falls back to the static options. */
  countries?: { value: string; label: string }[];
}) {
  // "All Countries" + the effective list from the server
  const countryOptions = countries?.length
    ? [{ value: '', label: 'All Countries' }, ...countries]
    : COUNTRY_OPTIONS;
  const searchParams = useSearchParams();
  // cols × rowLimit drives slice(0, n) — NO CSS row properties are set.
  const cols      = clampCols(gridCols, 3);
  const rowLimit  = Math.max(1, gridRows ?? 2);
  // md: intentionally absent — tablet stays 2-col until lg breakpoint.
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 ${LG_COLS[cols] ?? 'lg:grid-cols-3'} gap-6 md:gap-8`;

  const [search,  setSearch]  = useState('');
  const [country, setCountry] = useState('');
  // Pre-filter from URL: /events?type=classes → show only live classes
  const [type, setType] = useState<string>(() => {
    const t = searchParams.get('type');
    if (t === 'classes' || t === 'class') return 'class';
    const valid = ['webinar','fair','workshop','seminar','deadline','class'];
    return valid.includes(t ?? '') ? (t ?? '') : '';
  });

  const published = useMemo(() => initialEvents.filter(e => e.published), [initialEvents]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return published.filter(e => {
      if (q && !e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
      if (country && e.country !== country) return false;
      if (type    && e.type    !== type)    return false;
      return true;
    });
  }, [published, search, country, type]);

  const today    = new Date().toISOString().slice(0, 10);
  const upcoming = filtered.filter(e => daysUntil(e.date) >= 0);
  const past     = filtered.filter(e => daysUntil(e.date) <  0);
  const activeFilterCount = [search, country, type].filter(Boolean).length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        gradient="linear-gradient(140deg,#051A57 0%,#07257C 45%,#246DFF 100%)"
        breadcrumbLabel="Events"
        eyebrow="Events & Masterclasses"
        eyebrowColor="#A3E635"
        heading={
          <>
            Upcoming Events &amp; Classes.{' '}
            <span style={{ background: 'linear-gradient(135deg,#A3E635,#CCFF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Don&apos;t miss out.
            </span>
          </>
        }
        paragraph="Free webinars, live coaching classes, and university fairs — all designed to give Indian students a clear roadmap to global opportunities."
        image={{
          src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop',
          alt: 'Students attending a live masterclass',
        }}
        badge={{ value: `${upcoming.length}`, label: 'Live events this month' }}
        blobColor="#A3E635"
        extra={
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3 mt-7"
          >
            {[
              { icon: '📅', num: `${upcoming.length}`, label: 'Upcoming' },
              { icon: '🎓', num: '10,000+',            label: 'Students Placed' },
              { icon: '🎁', num: 'Free',               label: 'Demo Sessions' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2">
                <span className="text-base">{s.icon}</span>
                <span className="font-jakarta font-bold text-white text-sm">{s.num}</span>
                <span className="font-jakarta text-white/65 text-xs">{s.label}</span>
              </div>
            ))}
          </motion.div>
        }
      />

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-slate-200" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="container-xl py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
                className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 text-slate-800 placeholder-slate-400 bg-white" />
            </div>
            {/* Country filter */}
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
              {countryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {/* Type filter */}
            <select value={type} onChange={e => setType(e.target.value)}
              className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {/* Clear */}
            {activeFilterCount > 0 && (
              <button onClick={() => { setSearch(''); setCountry(''); setType(''); }}
                className="font-jakarta text-xs font-semibold text-slate-500 hover:text-primary-600 border border-slate-200 rounded-xl px-3 py-2.5 transition-colors flex items-center gap-1.5 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Events grid ───────────────────────────────────────────────────── */}
      <section className="w-full overflow-hidden section bg-slate-50">
        <div className="container-xl">

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-7">
                <div className="h-1 w-8 rounded-full bg-amber-400" />
                <h2 className="font-jakarta font-extrabold text-primary-600 text-xl md:text-2xl">Upcoming ({upcoming.length})</h2>
              </div>
              <AnimatePresence mode="popLayout">
                <div className={gridClass}>
                  {upcoming.slice(0, cols * rowLimit).map((ev, i) => <EventCard key={ev.id} event={ev} index={i} countryOptions={countryOptions} />)}
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-1 w-8 rounded-full bg-slate-300" />
                <h2 className="font-jakarta font-extrabold text-slate-500 text-xl md:text-2xl">Past Events ({past.length})</h2>
              </div>
              <AnimatePresence mode="popLayout">
                <div className={`${gridClass} opacity-70`}>
                  {past.slice(0, cols * rowLimit).map((ev, i) => <EventCard key={ev.id} event={ev} index={i} countryOptions={countryOptions} />)}
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-jakarta font-bold text-slate-700 text-xl mb-2">No events found</h3>
              <p className="font-jakarta text-slate-400 text-sm mb-5">
                Try adjusting your filters or{' '}
                <button onClick={() => { setSearch(''); setCountry(''); setType(''); }} className="text-primary-600 font-semibold hover:underline">
                  clear all filters
                </button>.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="w-full overflow-hidden section bg-white border-t border-slate-100">
        <div className="container-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl px-8 sm:px-14 py-12 text-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" style={{ background: 'radial-gradient(circle,#D97706,transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="font-jakarta font-extrabold text-white mb-3 text-2xl md:text-3xl leading-tight tracking-tight">
                Can&apos;t find an event that works?
              </h2>
              <p className="font-jakarta text-white/70 text-sm md:text-base max-w-lg mx-auto mb-7 leading-relaxed">
                Book a one-on-one free counselling session — 30 minutes, zero pressure, fully personalised.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 font-jakarta font-bold w-full md:w-auto text-base md:text-lg py-3 px-6 md:py-4 md:px-8 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors justify-center" style={{ boxShadow: '0 8px 28px rgba(217,119,6,0.38)' }}>
                Book Free 1-on-1 Session →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
