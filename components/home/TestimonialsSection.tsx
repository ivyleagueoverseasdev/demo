'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Testimonial } from '@/lib/types';
import { DEFAULT_TESTIMONIALS, stripFlagEmoji } from '@/lib/data';

// ── Star row ──────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Avatar — image with initials fallback ────────────────────────────────
function Avatar({ name, imageUrl }: { name: string; imageUrl: string }) {
  const [err, setErr] = useState(false);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  if (!imageUrl || err) {
    return (
      <div className="w-11 h-11 rounded-full flex items-center justify-center font-jakarta font-bold text-sm text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#65A30D,#65A30D)' }}>
        {initials}
      </div>
    );
  }

  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <Image
        src={imageUrl}
        alt={name}
        width={44}
        height={44}
        className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-200"
        onError={() => setErr(true)}
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
        <svg className="w-2.5 h-2.5 fill-current text-white" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    </div>
  );
}

// ── Single card ───────────────────────────────────────────────────────────
const cardVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-5 group"
    >
      <div
        className="
          bg-white/80 backdrop-blur-md
          border border-slate-100
          rounded-2xl p-6
          shadow-[0_2px_12px_rgba(101,163,13,0.06)]
          hover:shadow-[0_8px_32px_rgba(101,163,13,0.14)]
          transition-shadow duration-300
          flex flex-col gap-4
        "
      >
        {/* Top: avatar + name */}
        <div className="flex items-start gap-3">
          <Avatar name={t.name} imageUrl={t.imageUrl} />
          <div className="flex-1 min-w-0">
            <div className="font-jakarta font-bold text-slate-800 text-sm leading-tight truncate">{t.name}</div>
            <div className="font-jakarta text-xs text-amber-600 font-semibold mt-0.5 truncate">{t.role}</div>
            <div className="font-jakarta text-xs text-slate-400 mt-0.5 truncate">{stripFlagEmoji(t.country)}</div>
          </div>
        </div>

        {/* Stars */}
        <Stars count={t.stars} />

        {/* Quote */}
        <p className="font-jakarta text-sm md:text-base text-slate-600 leading-relaxed italic flex-1">
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* University chip */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <svg className="w-3.5 h-3.5 text-homeblue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-1.18.19-2.316.54-3.378L12 14z" />
          </svg>
          <span className="font-jakarta text-xs font-semibold text-homeblue-600 truncate">{t.uni}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Container stagger ────────────────────────────────────────────────────
const containerVariant = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ── Section ──────────────────────────────────────────────────────────────
interface Props { testimonials?: Testimonial[] }

export default function TestimonialsSection({ testimonials }: Props) {
  const data = (testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS)
    .filter(t => t.published);

  if (data.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="w-full section overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#F8FAFC 0%,#F7FFDB 60%,#FFFBEB 100%)' }}
    >
      {/* Header */}
      <div className="container-xl mb-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <div className="divider-amber mx-auto" />
          <p className="label mb-3">Global Admits. Realized Ambitions.</p>
          <h2
            className="font-jakarta font-extrabold text-homeblue-600 mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight"
          >
            From Ambition&nbsp;<span className="text-gradient-amber">to Acceptance.</span>
          </h2>
          <p className="font-jakarta text-slate-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Join over 10,000 students who have secured admits to the world&apos;s top universities with maximum scholarships. Here is what they have to say about the ILOC roadmap.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {[
              { icon: '⭐', label: '5.0 JustDial Rating' },
              { icon: '✅', label: '97% Visa Success' },
              { icon: '🎓', label: '10,000+ Alumni' },
              { icon: '🏆', label: '25+ Years of Excellence' },
            ].map(b => (
              <span key={b.label}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-1.5 font-jakarta text-xs font-semibold text-slate-700 shadow-sm">
                <span>{b.icon}</span>{b.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Masonry grid */}
      <div className="container-xl">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          className="columns-1 md:columns-2 lg:columns-3 gap-5"
        >
          {data.map(t => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </motion.div>
      </div>

      {/* Google / JustDial endorsement strip */}
      <div className="container-xl mt-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white rounded-2xl border border-slate-100 px-8 py-5 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-jakarta font-bold text-slate-900 text-sm">5.0 / 5.0</span>
            <span className="font-jakarta text-xs text-slate-500">· JustDial (48+ Reviews)</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          <div className="font-jakarta text-xs text-slate-500 text-center sm:text-left">
            <span className="font-semibold text-slate-700">Verified by JustDial</span> · Ivy League Overseas Consulting, Pune
          </div>
          <Link
            href="/contact"
            className="font-jakarta text-xs font-bold px-5 py-2.5 rounded-full bg-homeblue-600 text-white hover:bg-homeblue-700 transition-colors flex-shrink-0"
          >
            Book Free Session →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
