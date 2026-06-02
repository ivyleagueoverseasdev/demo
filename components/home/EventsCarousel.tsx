'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_EVENTS } from '@/lib/data';
import type { SiteEvent, EventType } from '@/lib/types';

// ── Event type visual config ───────────────────────────────────────────────
const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  webinar:  { label: 'Webinar',  color: '#246DFF', bg: '#EBF4FF', border: '#BFDBFE' },
  fair:     { label: 'Fair',     color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' },
  deadline: { label: 'Deadline', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  workshop: { label: 'Workshop', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  seminar:  { label: 'Seminar',  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

// ── Individual event card ──────────────────────────────────────────────────
function EventCard({ event }: { event: SiteEvent }) {
  const cfg  = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.seminar;
  const days = daysUntil(event.date);
  const soon = days >= 0 && days <= 14;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden border bg-white"
      style={{ width: 300, minWidth: 300, borderColor: cfg.border, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      {/* Hero image */}
      {event.imageUrl && (
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill className="object-cover" sizes="300px"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0.05),rgba(255,255,255,0.55))' }} />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Type + urgency badges */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
          {soon && days >= 0 && (
            <span className="font-jakarta text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              {days === 0 ? 'Today!' : `${days}d left`}
            </span>
          )}
          {days < 0 && (
            <span className="font-jakarta text-[10px] text-slate-400">Completed</span>
          )}
        </div>

        <h3 className="font-jakarta font-bold text-slate-800 text-[15px] leading-snug mb-2">{event.title}</h3>
        <p className="font-jakarta text-xs text-slate-500 leading-relaxed flex-1 line-clamp-2 mb-4">{event.description}</p>

        {/* Meta — Lucide icons replace emoji */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 font-jakarta text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} strokeWidth={2} />
            <span className="font-semibold">{formatDate(event.date)}</span>
            <span className="text-slate-400">·</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 font-jakarta text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" strokeWidth={2} />
            <span>{event.location}</span>
          </div>
          {event.seats && (
            <div className="flex items-center gap-2 font-jakarta text-xs text-slate-400">
              <Users className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
              <span>{event.seats} seats available</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={`/events/${event.id}`}
            className="w-full flex items-center justify-center gap-2 font-jakarta font-semibold text-xs py-2.5 rounded-xl transition-colors text-white"
            style={{ background: `linear-gradient(135deg,${cfg.color},${cfg.color}CC)` }}
          >
            {event.ctaLabel || 'Register'} →
          </Link>
        </motion.div>
      </div>

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: cfg.color }} />
    </div>
  );
}

// ── Main EventsCarousel ────────────────────────────────────────────────────
export default function EventsCarousel() {
  const [events, setEvents] = useState<SiteEvent[]>(DEFAULT_EVENTS);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const CARD_W = 316;

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.events?.length) setEvents(d.events.filter((e: SiteEvent) => e.published)); })
      .catch(() => {});
  }, []);

  const publishedEvents = events.filter(e => e.published);
  const total = publishedEvents.length;

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => setActive(i => (i + 1) % total), 4500);
    return () => clearInterval(t);
  }, [total]);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({ left: active * CARD_W, behavior: 'smooth' });
  }, [active]);

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / CARD_W);
    setActive(Math.min(Math.max(idx, 0), total - 1));
  }, [total]);

  if (!publishedEvents.length) return null;

  return (
    <section className="section bg-slate-50 border-y border-slate-100">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="divider-amber" />
            <p className="label mb-3">Events &amp; Deadlines</p>
            <h2 className="font-jakarta font-extrabold text-primary-600" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              Upcoming events<br />you don&apos;t want to miss.
            </h2>
          </div>

          {/* Nav arrows — Lucide icons */}
          <div className="flex items-center gap-2">
            {[
              { di: 0, Icon: ChevronLeft,  label: 'Previous' },
              { di: 1, Icon: ChevronRight, label: 'Next' },
            ].map(({ di, Icon, label }) => (
              <button
                key={label}
                onClick={() => setActive(i => Math.min(Math.max(i + (di === 0 ? -1 : 1), 0), total - 1))}
                className="w-11 h-11 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all disabled:opacity-30 disabled:cursor-default"
                disabled={(di === 0 && active === 0) || (di === 1 && active === total - 1)}
                aria-label={label}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-2"
          style={{ scrollSnapType: 'x mandatory', cursor: 'grab' }}
        >
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {publishedEvents.map((ev, i) => (
              <motion.div
                key={ev.id}
                style={{ scrollSnapAlign: 'start' }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <EventCard event={ev} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {publishedEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{ height: 6, width: i === active ? 24 : 6, background: i === active ? '#D97706' : '#CBD5E1' }}
            />
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-6">
          <Link href="/events" className="font-jakarta text-sm font-semibold text-primary-600 hover:text-amber-600 transition-colors">
            View all events &amp; masterclasses →
          </Link>
        </div>
      </div>
    </section>
  );
}
