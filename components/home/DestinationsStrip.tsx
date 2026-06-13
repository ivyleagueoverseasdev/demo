'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { COUNTRIES } from '@/lib/data';

type Country = (typeof COUNTRIES)[number];

function DestinationCard({ c, i }: { c: Country; i: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/destinations/${c.code}`}
        className="group block rounded-2xl overflow-hidden relative h-64 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
      >
        {/* Campus photo — falls back to branded gradient on load error */}
        {!imgError ? (
          <Image
            src={c.campusImage || c.heroImage}
            alt={`Study in ${c.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg,${c.color} 0%,${c.color}99 100%)` }}
          />
        )}

        {/* Gradient overlay — strong at bottom for text legibility */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to top,${c.color}F0 0%,${c.color}99 45%,${c.color}33 75%,transparent 100%)`,
          }}
        />

        {/* Subtle top vignette */}
        <div
          className="absolute top-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,0.25),transparent)' }}
        />

        {/* 2026 badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="badge-amber text-[10px] shadow-sm">2026 ✓</span>
        </div>

        {/* Flag + uni count — top left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
            {c.flag}
          </span>
          <span className="font-jakarta text-[10px] font-bold text-white/90 bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">
            {c.unis} unis
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="glass-card rounded-xl px-3 py-2.5">
            <h3 className="font-jakarta font-extrabold text-white text-base leading-tight mb-0.5">
              {c.name}
            </h3>
            <p className="font-jakarta text-white/75 text-[11px] leading-snug line-clamp-1 mb-2">
              {c.tagline}
            </p>
            <div className="flex items-center justify-between">
              <span
                className="font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: 'rgba(255,255,255,0.20)' }}
              >
                {c.intake}
              </span>
              <span className="font-jakarta text-[11px] font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DestinationsStrip() {
  return (
    <section className="section bg-slate-50">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.45 }}
          className="text-center mb-12"
        >
          <div className="divider-amber mx-auto" />
          <p className="label mb-3">Study Destinations</p>
          <h2 className="font-jakarta font-extrabold text-homeblue-600 mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Where will you go?
          </h2>
          <p className="font-jakarta text-slate-500 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            We assist with admissions across 12 countries and 400+ partner universities.
            Click any destination for 2026 visa updates, scholarships and career opportunities.
          </p>
        </motion.div>

        {/* Country cards — 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {COUNTRIES.map((c, i) => (
            <DestinationCard key={c.code} c={c} i={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-10"
        >
          <Link href="/destinations" className="btn-secondary text-sm px-8 py-3 rounded-xl">
            View All Destinations
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
