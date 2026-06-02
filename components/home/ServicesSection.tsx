'use client';

import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { ServiceItem } from '@/lib/types';
import { DEFAULT_SERVICES } from '@/lib/data';
import {
  GraduationCap, Medal, Star, BookOpen, ShieldCheck, Users,
  Globe, Briefcase, FileText, BadgeCheck, Award,
} from 'lucide-react';

// ── Icon registry: service id → Lucide icon + glow config ─────────────────
const SERVICE_ICONS: Record<string, { Icon: React.ElementType; color: string; glow: string; bg: string }> = {
  undergrad: { Icon: GraduationCap, color: '#246DFF', glow: 'rgba(36,109,255,0.45)',  bg: '#EBF4FF' },
  postgrad:  { Icon: Medal,         color: '#D97706', glow: 'rgba(217,119,6,0.45)',   bg: '#FFFBEB' },
  profiling: { Icon: Star,          color: '#7C3AED', glow: 'rgba(124,58,237,0.40)', bg: '#F5F3FF' },
  training:  { Icon: BookOpen,      color: '#059669', glow: 'rgba(5,150,105,0.40)',  bg: '#ECFDF5' },
  visa:      { Icon: ShieldCheck,   color: '#DC2626', glow: 'rgba(220,38,38,0.35)',  bg: '#FEF2F2' },
  counsel:   { Icon: Users,         color: '#246DFF', glow: 'rgba(36,109,255,0.40)',   bg: '#EBF4FF' },
};

const FALLBACKS = [GraduationCap, Medal, Star, BookOpen, ShieldCheck, Users, Globe, Briefcase, FileText, BadgeCheck, Award];

function getIconCfg(id: string, index: number) {
  return SERVICE_ICONS[id] ?? {
    Icon: FALLBACKS[index % FALLBACKS.length],
    color: '#246DFF', glow: 'rgba(36,109,255,0.40)', bg: '#EBF4FF',
  };
}

// ── Animation variants ─────────────────────────────────────────────────────
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};
const cardVariant = {
  hidden:  { opacity: 0, y: 22, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ── Magnetic CTA ───────────────────────────────────────────────────────────
function MagneticBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 380, damping: 30 });
  const y = useSpring(0, { stiffness: 380, damping: 30 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.22);
    y.set((e.clientY - r.top  - r.height / 2) * 0.22);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <Link href={href} className="btn-secondary text-sm px-6 py-2.5 rounded-xl inline-flex">{children}</Link>
    </motion.div>
  );
}

interface Props { services?: ServiceItem[]; }

export default function ServicesSection({ services }: Props) {
  const data: ServiceItem[] = services && services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Subtle texture — decorative only, opacity so low a 404 is invisible */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=40&auto=format&fit=crop"
          alt="" fill className="object-cover" sizes="100vw"
          onError={() => {}}
        />
      </div>
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle,#D97706,transparent 65%)', transform: 'translate(30%,30%)' }}
        aria-hidden
      />

      <div className="container-xl relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 items-end mb-12"
        >
          <div>
            <div className="divider-blue" />
            <p className="label mb-3">End-to-End Premium Support</p>
            <h2 className="font-jakarta font-extrabold text-primary-600" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              Six ways we take you<br />
              <span style={{ background: 'linear-gradient(135deg,#246DFF,#246DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                from Pune to the world.
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="font-jakarta text-slate-500 leading-relaxed text-[15px]">
              From university shortlisting and SOP writing to scholarship negotiation and visa preparation — our end-to-end premium process leaves absolutely nothing to chance.
            </p>
            <div className="flex flex-wrap gap-3">
              <MagneticBtn href="/services">Explore Our Strategic Pathways</MagneticBtn>
              <Link href="/contact" className="btn-primary text-sm px-6 py-2.5 rounded-xl">Book Free Session →</Link>
            </div>
          </div>
        </motion.div>

        {/* ── Card grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {data.map((s, i) => {
            const { Icon, color, glow, bg } = getIconCfg(s.id, i);
            return (
              <motion.div
                key={s.id}
                variants={cardVariant}
                className="group relative"
                onClick={() => { window.location.href = '/contact'; }}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full bg-white rounded-2xl border border-slate-100 cursor-pointer overflow-hidden"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)' }}
                >
                  {/* Hover wash */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(145deg,rgba(36,109,255,0.025),rgba(217,119,6,0.015))' }} />
                  {/* Animated bottom border */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{ background: 'linear-gradient(to right,#246DFF,#246DFF,#D97706)' }} />

                  <div className="relative p-6 flex flex-col h-full">
                    {/* Ghost index */}
                    <div
                      className="font-jakarta font-extrabold select-none absolute top-3 right-4 leading-none text-primary-50 group-hover:text-primary-100 transition-colors duration-300"
                      style={{ fontSize: '3.8rem' }} aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Glowing icon */}
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                      className="relative w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                      style={{ background: bg, border: `1px solid ${color}22` }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg,${color},${color}CC)` }}
                      />
                      {/* Default state */}
                      <Icon
                        className="relative z-10 group-hover:opacity-0 transition-opacity duration-200"
                        style={{ width: 22, height: 22, color, filter: `drop-shadow(0 0 8px ${glow})` }}
                        strokeWidth={1.75}
                      />
                      {/* Hover state — white */}
                      <Icon
                        className="absolute z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ width: 22, height: 22, color: '#fff' }}
                        strokeWidth={1.75}
                      />
                    </motion.div>

                    <h3 className="font-jakarta font-bold text-slate-800 text-[15px] mb-2.5 leading-snug group-hover:text-primary-600 transition-colors duration-200 relative">
                      {s.title}
                    </h3>
                    <p className="font-jakarta text-sm text-slate-500 leading-relaxed flex-1 relative">{s.desc}</p>

                    {/* Micro-CTA */}
                    <div className="mt-5 pt-4 border-t border-slate-100 font-jakarta text-xs font-bold text-amber-600 flex items-center gap-1.5 relative opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
                      Book a free session
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Bottom trust bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { Icon: GraduationCap, num: '10,000+', label: 'Students Placed',    color: '#246DFF' },
            { Icon: BadgeCheck,    num: '97%',    label: 'Visa Approval Rate',   color: '#059669' },
            { Icon: Award,         num: '400+',   label: 'Partner Universities', color: '#7C3AED' },
            { Icon: ShieldCheck,   num: '₹0',     label: 'Hidden Fees, Ever',    color: '#D97706' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-center hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-200"
            >
              <stat.Icon
                className="mx-auto mb-2"
                style={{ width: 20, height: 20, color: stat.color, filter: `drop-shadow(0 0 6px ${stat.color}55)` }}
                strokeWidth={1.75}
              />
              <div className="font-jakarta font-extrabold text-primary-600 text-xl leading-none mb-1">{stat.num}</div>
              <div className="font-jakarta text-[11px] text-slate-500 font-medium leading-snug">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
