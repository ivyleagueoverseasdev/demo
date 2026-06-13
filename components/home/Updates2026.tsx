'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/data';

export default function Updates2026() {
  const highlights = COUNTRIES.flatMap(c =>
    c.visa2026.slice(0, 1).map(v => ({ country: c.name, flag: c.flag, code: c.code, update: v }))
  );

  return (
    <section className="section bg-white">
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
          <h2 className="font-jakarta font-extrabold text-homeblue-600 mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            What changed for 2026.
          </h2>
          <p className="font-jakarta text-slate-500 max-w-xl mx-auto">
            Stay ahead with the latest visa policies, intake rules and scholarship deadlines for your target country.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.country}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/destinations/${h.code}`}
                className="group card p-5 hover:-translate-y-1 block transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{h.flag}</span>
                  <div>
                    <div className="font-jakarta font-bold text-homeblue-600 text-sm">{h.country} 2026</div>
                    <div className="badge-amber text-[10px] mt-0.5">Policy Update</div>
                  </div>
                </div>
                <p className="font-jakarta text-sm text-slate-600 leading-relaxed line-clamp-2">{h.update}</p>
                <div className="mt-3 font-jakarta text-xs font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read 2026 guide →
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
