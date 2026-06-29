'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_UPDATES_2026, DEFAULT_UPDATES_2026_COLS } from '@/lib/data';
import type { Update2026Card } from '@/lib/types';

export default function Updates2026() {
  const [cards, setCards] = useState<Update2026Card[]>(DEFAULT_UPDATES_2026);
  const [cols,  setCols]  = useState<number>(DEFAULT_UPDATES_2026_COLS);

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        if (d?.siteContent?.updates2026?.length) setCards(d.siteContent.updates2026);
        if (typeof d?.siteContent?.updates2026Cols === 'number') setCols(d.siteContent.updates2026Cols);
      })
      .catch(() => {});
  }, []);

  const gridClass =
    cols === 1 ? 'grid-cols-1' :
    cols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="w-full overflow-hidden section bg-white">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }} transition={{ duration: 0.45 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-4 py-2 text-xs font-jakarta font-bold uppercase tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" />
            2026 Immigration Policy Updates
          </div>
          <h2 className="font-jakarta font-extrabold text-homeblue-600 mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
            What changed for 2026.
          </h2>
          <p className="font-jakarta text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Stay ahead with the latest visa policies, intake rules and scholarship deadlines for your target country.
          </p>
        </motion.div>

        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                href={card.href}
                className="group card hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(36,109,255,0.14),0_8px_32px_rgba(0,0,0,0.08)] block transition-all duration-300 overflow-hidden"
              >
                {/* Country image strip */}
                <div className="relative h-28 w-full overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.country}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  {/* Flag overlay on image */}
                  <span className="absolute bottom-2 left-3 text-2xl drop-shadow-lg">{card.flag}</span>
                  <span className="absolute top-2 right-2 badge-amber text-[9px] px-2 py-0.5">{card.badge}</span>
                </div>

                {/* Text content */}
                <div className="p-4">
                  <div className="font-jakarta font-bold text-homeblue-600 text-sm mb-2">
                    {card.country} {card.year}
                  </div>
                  <p className="font-jakarta text-sm text-slate-600 leading-relaxed line-clamp-3">{card.update}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }} transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mt-8"
        >
          <Link href="/destinations" className="btn-secondary text-sm px-8 py-3 rounded-xl">
            View All 2026 Country Guides
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
