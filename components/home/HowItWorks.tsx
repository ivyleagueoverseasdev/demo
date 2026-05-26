'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ProcessStepItem } from '@/lib/types';
import { DEFAULT_PROCESS_STEPS } from '@/lib/data';
import { Handshake, LayoutList, Trophy, Plane, PenLine, Globe } from 'lucide-react';

// ── Per-step icon config ───────────────────────────────────────────────────
const STEP_ICONS: Record<number, { Icon: React.ElementType; color: string; glow: string }> = {
  1: { Icon: Handshake,  color: '#FBBF24', glow: 'rgba(251,191,36,0.55)' },
  2: { Icon: LayoutList, color: '#FBBF24', glow: 'rgba(251,191,36,0.55)' },
  3: { Icon: Trophy,     color: '#FBBF24', glow: 'rgba(251,191,36,0.55)' },
  4: { Icon: Plane,      color: '#FBBF24', glow: 'rgba(251,191,36,0.55)' },
};
const STEP_FALLBACKS = [Handshake, LayoutList, Trophy, Plane, PenLine, Globe];

function getStepIcon(step: number) {
  return STEP_ICONS[step] ?? {
    Icon: STEP_FALLBACKS[(step - 1) % STEP_FALLBACKS.length],
    color: '#FBBF24', glow: 'rgba(251,191,36,0.55)',
  };
}

// ── Variants ───────────────────────────────────────────────────────────────
const stepContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const stepVariant = {
  hidden:  { opacity: 0, y: 28, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const connectorVariant = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};

interface Props { steps?: ProcessStepItem[]; }

export default function HowItWorks({ steps }: Props) {
  const data: ProcessStepItem[] = steps && steps.length > 0 ? steps : DEFAULT_PROCESS_STEPS;

  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#0F2247 0%,#1A365D 50%,#2D5A99 100%)' }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="wdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wdots)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle,#D97706,transparent 68%)', transform: 'translate(30%,-30%)' }} aria-hidden />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle,#93C5FD,transparent 70%)', transform: 'translate(-30%,30%)' }} aria-hidden />

      <div className="container-xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 mb-4" />
          <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3">The ILOC Roadmap</p>
          <h2 className="font-jakarta font-extrabold text-white mb-5" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Your Roadmap to{' '}
            <span style={{ background: 'linear-gradient(135deg,#FBBF24,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Your Dream University.
            </span>
          </h2>
          <p className="font-jakarta text-white/75 max-w-xl mx-auto leading-relaxed text-base">
            Our proven 4-step process is trusted by 2,500+ families. Every action is pre-planned,
            every deadline tracked — parents stay informed, students stay focused.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            {['97% Visa Approval', '2,500+ Students Placed', '₹0 Hidden Charges'].map(p => (
              <span key={p} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 font-jakarta text-xs font-semibold text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Step cards */}
        <motion.div
          variants={stepContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {data.map((step, i) => {
            const { Icon, color, glow } = getStepIcon(step.step);
            return (
              <motion.div key={step.step} variants={stepVariant} className="relative">
                {/* Connector */}
                {i < data.length - 1 && (
                  <motion.div
                    variants={connectorVariant}
                    className="hidden lg:block absolute top-9 z-0 origin-left"
                    style={{
                      left: 'calc(100% + 10px)', width: 'calc(100% - 20px)', height: 1,
                      background: 'linear-gradient(to right,rgba(251,191,36,0.55),rgba(251,191,36,0.08))',
                    }}
                  />
                )}

                <motion.div
                  whileHover={{ y: -7 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative z-10 h-full rounded-2xl cursor-default overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(251,191,36,0.10),transparent 70%)' }} />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full"
                    style={{ background: 'linear-gradient(to right,#FBBF24,#D97706,#1A365D)' }} />

                  <div className="relative p-6">
                    {/* Ghost number */}
                    <div
                      className="font-jakarta font-extrabold select-none absolute top-2 right-3 leading-none text-white/[0.055] group-hover:text-white/[0.10] transition-all duration-300"
                      style={{ fontSize: '5.5rem' }} aria-hidden
                    >
                      {String(step.step).padStart(2, '0')}
                    </div>

                    {/* Glowing icon */}
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 18 }}
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(251,191,36,0.22)' }}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }} />
                      <Icon
                        className="relative z-10 group-hover:opacity-0 transition-opacity duration-200"
                        style={{ width: 24, height: 24, color, filter: `drop-shadow(0 0 10px ${glow})` }}
                        strokeWidth={1.75}
                      />
                      <Icon
                        className="absolute z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ width: 24, height: 24, color: '#fff' }}
                        strokeWidth={1.75}
                      />
                    </motion.div>

                    <div className="font-jakarta text-[10px] font-bold text-amber-400 tracking-[0.2em] uppercase mb-2">
                      Step {String(step.step).padStart(2, '0')}
                    </div>
                    <h3 className="font-jakarta font-bold text-white text-base mb-3 leading-snug">{step.title}</h3>
                    <p className="font-jakarta text-sm text-white/75 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-14"
        >
          <p className="font-jakarta text-white/55 text-xs mb-5 tracking-wide">
            Join 2,500+ students who started with a free 30-minute session
          </p>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 font-jakarta font-bold text-sm px-10 py-4 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              style={{ boxShadow: '0 8px 32px rgba(217,119,6,0.40)' }}
            >
              Book Your Free Session Today <span className="text-base">→</span>
            </Link>
          </motion.div>
          <p className="font-jakarta text-white/40 text-[11px] mt-3">
            No obligation · No sales pressure · Direct with Rajib Paul
          </p>
        </motion.div>
      </div>
    </section>
  );
}
