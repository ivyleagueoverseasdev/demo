import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award, Globe, ShieldCheck, UserCheck,
  Target, Eye, GraduationCap, TrendingUp,
  Clock, BadgeCheck, Phone, Mail,
} from 'lucide-react';
import { COMPANY, STATS } from '@/lib/data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About Us | Ivy League Overseas Consulting',
  description:
    'Learn about ILOC — founded by Rajib Paul Choudhury in Pune. 2,500+ students placed, 97% visa approval, zero hidden fees.',
};

// ── "Why ILOC" recognition cards — explicit objects, zero string-indexing ──
const WHY_ILOC = [
  {
    Icon:  Award,
    label: 'Google Verified Business',
    color: '#D97706',
    glow:  'rgba(217,119,6,0.35)',
    bg:    '#FFFBEB',
    border:'#FDE68A',
  },
  {
    Icon:  TrendingUp,
    label: '97% Visa Approval',
    color: '#2D5A99',
    glow:  'rgba(45,90,153,0.35)',
    bg:    '#EBF4FF',
    border:'#BFDBFE',
  },
  {
    Icon:  ShieldCheck,
    label: 'Zero Hidden Fees',
    color: '#059669',
    glow:  'rgba(5,150,105,0.35)',
    bg:    '#ECFDF5',
    border:'#6EE7B7',
  },
  {
    Icon:  UserCheck,
    label: 'Direct Founder Access',
    color: '#7C3AED',
    glow:  'rgba(124,58,237,0.35)',
    bg:    '#F5F3FF',
    border:'#DDD6FE',
  },
];

// ── Mission / Vision cards ─────────────────────────────────────────────────
const MISSION_VISION = [
  {
    Icon:  Target,
    title: 'Our Mission',
    color: '#D97706',
    glow:  'rgba(217,119,6,0.30)',
    desc:  'To provide quality, transparent and unbiased overseas education counselling that empowers every student to achieve their global aspirations — regardless of background or budget.',
  },
  {
    Icon:  Globe,
    title: 'Our Vision',
    color: '#2D5A99',
    glow:  'rgba(45,90,153,0.30)',
    desc:  'To be the most trusted overseas education consulting brand in India — known for ethical practices, zero hidden fees, personalised service and outstanding student outcomes.',
  },
];

// ── Stat icon mapping (by index, matches STATS order) ─────────────────────
const STAT_ICONS = [GraduationCap, TrendingUp, Award, Clock, Globe, ShieldCheck];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-xs text-white/50 font-jakarta mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/80">About Us</span>
          </nav>
          <div className="max-w-3xl">
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
              Est. {COMPANY.since}
            </p>
            <h1
              className="font-jakarta font-extrabold text-white mb-5"
              style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}
            >
              Honest guidance.<br />
              <span className="text-amber-400">Proven results.</span>
            </h1>
            <p className="font-jakarta text-white/75 text-lg leading-relaxed max-w-2xl">
              {COMPANY.name} (ILOC) is a premium overseas education consultancy founded by{' '}
              {COMPANY.founder} in {COMPANY.since}. Based in Pune, we've placed 2,500+ students
              at 400+ universities worldwide — with a 97% visa approval rate and zero hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="container-xl py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((s, i) => {
            const Icon = STAT_ICONS[i] ?? GraduationCap;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center text-center py-5 px-3 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-amber-50 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-primary-500 group-hover:text-amber-500 transition-colors" style={{ width: 18, height: 18 }} strokeWidth={2} />
                </div>
                <div
                  className="font-jakarta font-extrabold text-gradient-blue leading-none mb-1.5"
                  style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}
                >
                  {s.num}
                </div>
                <div className="font-jakarta text-xs font-medium text-slate-500">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="section">
        <div className="container-xl grid md:grid-cols-[280px_1fr] gap-12 items-start">
          <div>
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center font-jakarta font-black text-2xl text-white mb-5 shadow-blue">
              RP
            </div>
            <h3 className="font-jakarta font-bold text-primary-600 text-lg">{COMPANY.founder}</h3>
            <p className="font-jakarta text-sm text-amber-600 mt-0.5">Founder &amp; Head Counsellor</p>
            <p className="font-jakarta text-xs text-slate-400 mt-0.5">10+ Years Experience · Pune, India</p>
          </div>
          <div>
            <div className="divider-amber mb-4" />
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
              Founder's Message
            </p>
            <blockquote
              className="font-jakarta font-bold text-primary-600 text-xl sm:text-2xl leading-relaxed mb-6 italic"
              style={{ borderLeft: '4px solid #D97706', paddingLeft: '1.5rem' }}
            >
              "Every student deserves honest, personalised guidance — not a one-size-fits-all
              template driven by commissions."
            </blockquote>
            <p className="font-jakarta text-slate-600 leading-relaxed mb-4">
              I founded ILOC with one simple belief: students deserve unbiased, transparent
              guidance from someone who genuinely cares. Too many students are mis-guided by agents
              chasing commissions — we operate on a completely different model. Our fee is fixed,
              transparent and never tied to any specific university.
            </p>
            <p className="font-jakarta text-slate-600 leading-relaxed">
              With 2,500+ students placed across 400+ universities in 7+ countries, our track
              record speaks for itself. Every student gets my direct attention — that's the ILOC
              promise.
            </p>
            <p className="font-jakarta font-bold text-slate-400 italic mt-6">— {COMPANY.founder}</p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section bg-slate-50">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="divider-amber mx-auto" />
            <h2
              className="font-jakarta font-extrabold text-primary-600 mt-4"
              style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
            >
              Mission &amp; Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {MISSION_VISION.map(({ Icon, title, color, glow, desc }) => (
              <div key={title} className="card p-8">
                {/* Premium glowing icon container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${color}18, ${color}08)`,
                    border: `1px solid ${color}30`,
                    boxShadow: `0 0 20px ${glow}, 0 4px 12px ${color}18`,
                  }}
                >
                  <Icon
                    style={{
                      width: 26, height: 26, color,
                      filter: `drop-shadow(0 0 8px ${glow})`,
                    }}
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-jakarta font-bold text-primary-600 text-lg mb-3">{title}</h3>
                <p className="font-jakarta text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ILOC — fixed, no string-index emoji bug ── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="divider-blue mx-auto" />
            <h2
              className="font-jakarta font-extrabold text-primary-600 mt-4"
              style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
            >
              Why choose ILOC?
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {WHY_ILOC.map(({ Icon, label, color, glow, bg, border }) => (
              <div
                key={label}
                className="card flex flex-col items-center text-center py-8 px-4 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Glowing icon badge */}
                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    boxShadow: `0 0 14px ${glow}`,
                  }}
                >
                  <Icon
                    style={{
                      width: 26, height: 26, color,
                      filter: `drop-shadow(0 0 6px ${glow})`,
                    }}
                    strokeWidth={1.75}
                  />
                </div>
                <span className="font-jakarta text-sm font-semibold text-slate-700 leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact info strip ── */}
      <section className="bg-primary-50 border-y border-primary-100 py-6">
        <div className="container-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`tel:${COMPANY.phone}`}
              className="flex items-center gap-2.5 font-jakarta text-sm text-slate-700 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Phone className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              {COMPANY.phone}
            </a>
            <div className="hidden sm:block w-px h-5 bg-primary-200" />
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-2.5 font-jakarta text-sm text-slate-700 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Mail className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              {COMPANY.email}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section bg-white">
        <div className="container-xl text-center">
          <h2
            className="font-jakarta font-extrabold text-primary-600 mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
          >
            Ready to begin your journey?
          </h2>
          <p className="font-jakarta text-slate-500 mb-8 max-w-lg mx-auto">
            Book a free 30-minute counselling session with our team. No pressure, no commitment
            — just clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-xl">
              Book Free Counselling →
            </Link>
            <a
              href={COMPANY.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-8 py-3.5 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
