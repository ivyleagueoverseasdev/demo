import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award, Globe, ShieldCheck, UserCheck,
  Target, GraduationCap, TrendingUp,
  Clock, Phone, Mail,
} from 'lucide-react';
import { COMPANY, STATS, buildWhatsAppLink } from '@/lib/data';
import { getAboutSettings, getStats, getCompanyDetails, getGlobalSettings } from '@/lib/kv';
import { mergeAboutSettings } from '@/lib/pageDefaults';
import PageHero from '@/components/shared/PageHero';

// Edge + dynamic so admin edits (About editor, Homepage stats, Company details)
// go live immediately.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us | Ivy League Overseas Consulting',
  description:
    'Learn about ILOC — Pune\'s most trusted overseas education consultancy for 25+ years. 10,000+ students placed, 97% visa approval, zero hidden fees.',
};

// ── "Why ILOC" card visuals — fixed icons/colors; labels are admin-editable ──
const WHY_VISUALS = [
  { Icon: Award,       color: '#D97706', glow: 'rgba(217,119,6,0.35)',  bg: '#FFFBEB', border: '#FDE68A' },
  { Icon: TrendingUp,  color: '#65A30D', glow: 'rgba(101,163,13,0.35)', bg: '#F7FFDB', border: '#D9F99D' },
  { Icon: ShieldCheck, color: '#059669', glow: 'rgba(5,150,105,0.35)',  bg: '#ECFDF5', border: '#6EE7B7' },
  { Icon: UserCheck,   color: '#7C3AED', glow: 'rgba(124,58,237,0.35)', bg: '#F5F3FF', border: '#DDD6FE' },
];

// Mission / Vision card visuals (titles & copy are admin-editable)
const MV_VISUALS = [
  { Icon: Target, color: '#D97706', glow: 'rgba(217,119,6,0.30)'  },
  { Icon: Globe,  color: '#65A30D', glow: 'rgba(101,163,13,0.30)' },
];

// ── Stat icon mapping (by index, matches STATS order) ─────────────────────
const STAT_ICONS = [GraduationCap, TrendingUp, Award, Clock, Globe, ShieldCheck];

export default async function AboutPage() {
  const [kvSettings, kvStats, kvCompany, kvGlobal] = await Promise.all([
    getAboutSettings().catch(() => null),
    getStats().catch(() => null),
    getCompanyDetails().catch(() => null),
    getGlobalSettings().catch(() => null),
  ]);

  const s     = mergeAboutSettings(kvSettings);
  const stats = kvStats?.length ? kvStats : STATS;
  const phone = kvCompany?.phone    || COMPANY.phone;
  const email = kvCompany?.email    || COMPANY.email;
  const wa    = buildWhatsAppLink(
    kvCompany?.whatsapp || COMPANY.wa,
    kvGlobal?.whatsappMessage || COMPANY.whatsappMessage,
  );

  const missionVision = [
    { ...MV_VISUALS[0], title: s.missionTitle, desc: s.missionDesc },
    { ...MV_VISUALS[1], title: s.visionTitle,  desc: s.visionDesc  },
  ];

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(135deg,#0C37A0 0%,#1249C4 55%,#246DFF 100%)"
        breadcrumbLabel="About Us"
        eyebrow={s.heroEyebrow}
        eyebrowColor="#CCFF00"
        heading={
          <>
            {s.heroHeadingLine1}<br />
            <span style={{ background: 'linear-gradient(135deg,#CCFF00,#A3E635)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {s.heroHeadingLine2}
            </span>
          </>
        }
        paragraph={s.heroParagraph}
        image={{
          src: s.heroImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
          alt: s.heroImageAlt || 'Students collaborating in a modern library',
        }}
        badge={{ value: s.heroBadgeValue || '10,000+', label: s.heroBadgeLabel || 'Students placed worldwide' }}
        blobColor="#CCFF00"
      />

      {/* ── Stats ── */}
      <section className="w-full overflow-hidden bg-white border-b border-slate-100">
        <div className="container-xl py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((st, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length] ?? GraduationCap;
            return (
              <div
                key={st.label}
                className="flex flex-col items-center text-center py-5 px-3 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-amber-50 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-primary-500 group-hover:text-amber-500 transition-colors" style={{ width: 18, height: 18 }} strokeWidth={2} />
                </div>
                <div
                  className="font-jakarta font-extrabold text-xl md:text-2xl text-gradient-blue leading-none mb-1.5"
                >
                  {st.num}
                </div>
                <div className="font-jakarta text-xs font-medium text-slate-500">{st.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Founder's Message — ILOC logo on the left ── */}
      <section className="w-full overflow-hidden section">
        <div className="container-xl grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
          {/* Centred (was left-aligned on desktop) and nudged further down
              per repeated client feedback — the earlier mt-4/mt-10 offset
              wasn't perceptible enough, so it's now roughly double. */}
          <div className="flex justify-center mt-8 md:mt-20">
            <div className="relative w-52 h-52 rounded-full overflow-hidden shadow-blue border border-slate-100">
              <Image
                src={kvGlobal?.mainLogoUrl || '/logo3.png'}
                alt={COMPANY.name}
                fill
                className="object-cover"
                sizes="208px"
                unoptimized
              />
            </div>
          </div>
          <div>
            <div className="divider-amber mb-4" />
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-500 mb-4">
              Founder&apos;s Message
            </p>
            <blockquote
              className="font-jakarta font-bold text-primary-600 text-xl sm:text-2xl leading-relaxed mb-6 italic"
              style={{ borderLeft: '4px solid #D97706', paddingLeft: '1.5rem' }}
            >
              {s.founderQuote}
            </blockquote>
            <p className="font-jakarta text-base md:text-lg text-slate-600 leading-relaxed mb-4">
              {s.founderParagraph1}
            </p>
            <p className="font-jakarta text-base md:text-lg text-slate-600 leading-relaxed">
              {s.founderParagraph2}
            </p>
            <p className="font-jakarta font-bold text-slate-400 italic mt-6">— {s.founderName}</p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="w-full overflow-hidden section bg-slate-50">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="divider-amber mx-auto" />
            <h2
              className="font-jakarta font-extrabold text-primary-600 mt-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight"
            >
              Mission &amp; Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {missionVision.map(({ Icon, title, color, glow, desc }) => (
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
                <h3 className="font-jakarta font-bold text-primary-600 text-xl md:text-2xl mb-3">{title}</h3>
                <p className="font-jakarta text-base text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ILOC ── */}
      <section className="w-full overflow-hidden section bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="divider-blue mx-auto" />
            <h2
              className="font-jakarta font-extrabold text-primary-600 mt-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight"
            >
              {s.whyHeading}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {WHY_VISUALS.map(({ Icon, color, glow, bg, border }, i) => (
              <div
                key={i}
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
                  {s.whyLabels[i] ?? ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact info strip ── */}
      <section className="w-full overflow-hidden bg-primary-50 border-y border-primary-100 py-6">
        <div className="container-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2.5 font-jakarta text-sm text-slate-700 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Phone className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              {phone}
            </a>
            <div className="hidden sm:block w-px h-5 bg-primary-200" />
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 font-jakarta text-sm text-slate-700 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <Mail className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
              </div>
              {email}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full overflow-hidden section bg-white">
        <div className="container-xl text-center">
          <h2
            className="font-jakarta font-extrabold text-primary-600 mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight"
          >
            {s.ctaHeading}
          </h2>
          <p className="font-jakarta text-base md:text-lg text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            {s.ctaParagraph}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-full">
              Book Free Counselling →
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-8 py-3.5 rounded-full text-white"
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
