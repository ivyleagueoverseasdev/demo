'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COMPANY, STATS } from '@/lib/data';

export default function CTASection() {
  return (
    <section className="section bg-white">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }} transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl overflow-hidden px-8 sm:px-14 py-14 sm:py-20 text-center"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 opacity-15"
            style={{ background: 'radial-gradient(circle,#D97706,transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"
            style={{ background: 'radial-gradient(circle,#CCFF00,transparent 70%)' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot" />
              <span className="font-jakarta text-xs font-semibold text-white/90 tracking-wide">Free Counselling Available Now</span>
            </div>

            <h2 className="font-jakarta font-extrabold text-white mb-5 max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.1 }}>
              Your dream university is<br />
              <span className="text-amber-400">one call away.</span>
            </h2>

            <p className="font-jakarta text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
              Book a free 30-minute session with {COMPANY.founder}. Zero pressure — just a personalised roadmap for your future.
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {STATS.slice(0, 4).map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-jakarta font-extrabold text-amber-400 text-2xl">{s.num}</div>
                  <div className="font-jakarta text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 font-jakarta font-bold text-sm px-8 py-4 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-amber">
                Book Free Session →
              </Link>
              <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-8 py-4 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 active:scale-95 transition-all">
                💬 WhatsApp Now
              </a>
              <a href={`tel:${COMPANY.phone}`}
                className="font-jakarta text-xs text-white/50 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
                📞 {COMPANY.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
