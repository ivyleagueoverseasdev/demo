'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_EVENTS } from '@/lib/data';
import type { SiteEvent, EventType } from '@/lib/types';

// ── Type config ────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  webinar:  { label: 'Webinar',   color: '#2D5A99', bg: '#EBF4FF', border: '#BFDBFE' },
  fair:     { label: 'Fair',      color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' },
  deadline: { label: 'Deadline',  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  workshop: { label: 'Workshop',  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  seminar:  { label: 'Seminar',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

const COUNTRY_OPTIONS = [
  { value: '', label: 'All Countries' },
  { value: 'usa',       label: '🇺🇸 USA' },
  { value: 'uk',        label: '🇬🇧 UK' },
  { value: 'canada',    label: '🇨🇦 Canada' },
  { value: 'australia', label: '🇦🇺 Australia' },
  { value: 'ireland',   label: '🇮🇪 Ireland' },
  { value: 'singapore', label: '🇸🇬 Singapore' },
  { value: 'europe',    label: '🇪🇺 Europe' },
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'webinar',  label: 'Webinar'  },
  { value: 'fair',     label: 'Fair'     },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar',  label: 'Seminar'  },
  { value: 'deadline', label: 'Deadline' },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

// ── Event card for the grid ────────────────────────────────────────────────
function EventCard({ event, index }: { event: SiteEvent; index: number }) {
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
        className="group block h-full rounded-2xl overflow-hidden border bg-white hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(26,54,93,0.13)] transition-all duration-300"
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
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.65))' }}
            />
            {/* Animated bottom gradient line */}
            <div
              className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 ease-out"
              style={{ background: `linear-gradient(to right,${cfg.color},#D97706)` }}
            />
          </div>
        )}

        <div className="p-5 flex flex-col h-full">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
            >
              {cfg.label}
            </span>
            {!past && days <= 14 && days >= 0 && (
              <span className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                {days === 0 ? 'Today!' : `${days}d left`}
              </span>
            )}
            {past && (
              <span className="font-jakarta text-[10px] text-slate-400 italic">Completed</span>
            )}
            {event.country && (() => {
              const c = COUNTRY_OPTIONS.find(o => o.value === event.country);
              return c ? (
                <span className="font-jakarta text-[10px] font-medium text-slate-500">{c.label}</span>
              ) : null;
            })()}
          </div>

          <h3 className="font-jakarta font-bold text-slate-800 text-[15px] leading-snug mb-2 group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>
          <p className="font-jakarta text-xs text-slate-500 leading-relaxed flex-1 line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Meta */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 font-jakarta text-xs text-slate-600">
              <span>📅</span>
              <span className="font-semibold">{formatDate(event.date)}</span>
              <span className="text-slate-400">·</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 font-jakarta text-xs text-slate-500">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
            {event.seats && (
              <div className="flex items-center gap-2 font-jakarta text-xs text-slate-400">
                <span>🪑</span>
                <span>{event.seats} seats available</span>
              </div>
            )}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span
              className="font-jakarta text-xs font-bold"
              style={{ color: cfg.color }}
            >
              {event.ctaLabel || 'View Details'}
            </span>
            <span
              className="font-jakarta text-[11px] font-semibold px-3 py-1 rounded-lg text-white transition-opacity group-hover:opacity-100 opacity-80"
              style={{ background: cfg.color }}
            >
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function EventsHubPage() {
  const [events,  setEvents]  = useState<SiteEvent[]>(DEFAULT_EVENTS);
  const [search,  setSearch]  = useState('');
  const [country, setCountry] = useState('');
  const [type,    setType]    = useState('');

  // Hydrate from KV
  useEffect(() => {
    fetch('/api/events')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.events?.length) setEvents(d.events); })
      .catch(() => {});
  }, []);

  const published = useMemo(() => events.filter(e => e.published), [events]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return published.filter(e => {
      if (q && !e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
      if (country && e.country !== country) return false;
      if (type && e.type !== type) return false;
      return true;
    });
  }, [published, search, country, type]);

  const upcoming = filtered.filter(e => daysUntil(e.date) >= 0);
  const past     = filtered.filter(e => daysUntil(e.date) <  0);

  const activeFilterCount = [search, country, type].filter(Boolean).length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: 'linear-gradient(145deg,#0F2247 0%,#1A365D 55%,#2D5A99 100%)' }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="edots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#edots)" />
          </svg>
        </div>
        {/* Amber glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle,#D97706,transparent 68%)', transform: 'translate(30%,-30%)' }}
        />

        <div className="container-xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 mb-5" />
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
              Events & Masterclasses
            </p>
            <h1
              className="font-jakarta font-extrabold text-white mb-5 leading-tight"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}
            >
              Upcoming Events &amp; Masterclasses.{' '}
              <span style={{
                background: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Don&apos;t miss out.
              </span>
            </h1>
            <p className="font-jakarta text-white/75 max-w-xl mx-auto leading-relaxed text-base mb-8">
              Free webinars, hands-on workshops and university fairs — designed to give Indian students and parents a clear roadmap to global opportunities.
            </p>

            {/* Live stats */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '📅', num: `${upcoming.length}`, label: 'Upcoming Events' },
                { icon: '🎓', num: '2,500+',              label: 'Students Placed' },
                { icon: '✅', num: '₹0',                  label: 'Event Cost' },
              ].map(s => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="font-jakarta font-bold text-white text-sm">{s.num}</span>
                  <span className="font-jakarta text-white/65 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-16 z-30 border-b border-slate-200"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="container-xl py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 text-slate-800 placeholder-slate-400 bg-white"
              />
            </div>

            {/* Country filter */}
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-slate-700 bg-white cursor-pointer flex-shrink-0"
            >
              {COUNTRY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-slate-700 bg-white cursor-pointer flex-shrink-0"
            >
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSearch(''); setCountry(''); setType(''); }}
                className="font-jakarta text-xs font-semibold text-slate-500 hover:text-primary-600 border border-slate-200 rounded-xl px-3 py-2.5 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Events grid ────────────────────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-xl">

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-7">
                <div className="h-1 w-8 rounded-full bg-amber-400" />
                <h2 className="font-jakarta font-extrabold text-primary-600 text-xl">
                  Upcoming ({upcoming.length})
                </h2>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((ev, i) => (
                    <EventCard key={ev.id} event={ev} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-1 w-8 rounded-full bg-slate-300" />
                <h2 className="font-jakarta font-extrabold text-slate-500 text-xl">
                  Past Events ({past.length})
                </h2>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-70">
                  {past.map((ev, i) => (
                    <EventCard key={ev.id} event={ev} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-jakarta font-bold text-slate-700 text-xl mb-2">No events found</h3>
              <p className="font-jakarta text-slate-400 text-sm mb-5">
                Try adjusting your filters or{' '}
                <button
                  onClick={() => { setSearch(''); setCountry(''); setType(''); }}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  clear all filters
                </button>.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-slate-100">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-700 to-primary-500 rounded-3xl px-8 sm:px-14 py-12 text-center overflow-hidden relative"
          >
            <div
              className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
              style={{ background: 'radial-gradient(circle,#D97706,transparent 70%)' }}
            />
            <div className="relative z-10">
              <h2 className="font-jakarta font-extrabold text-white mb-3"
                style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                Can&apos;t find an event that works?
              </h2>
              <p className="font-jakarta text-white/70 max-w-lg mx-auto mb-7 leading-relaxed text-sm">
                Book a one-on-one free counselling session with Rajib Paul. 30 minutes, zero pressure, fully personalised.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-jakarta font-bold text-sm px-9 py-4 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                style={{ boxShadow: '0 8px 28px rgba(217,119,6,0.38)' }}
              >
                Book Free 1-on-1 Session →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
