import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COUNTRIES_MAP, COMPANY } from '@/lib/data';
import { getSiteMedia } from '@/lib/kv';
import { SECTION_SLUGS, SECTION_LABELS } from '@/lib/countrySubpages';
import SubNav from './SubNav';

interface Props {
  children: React.ReactNode;
  params:   Promise<{ country: string }>;
}

export default async function CountryLayout({ children, params }: Props) {
  const { country } = await params;
  const c = COUNTRIES_MAP[country];
  if (!c) notFound();

  const media       = await getSiteMedia().catch(() => null);
  const campusImage = media?.countryImages?.[country] || c.campusImage;

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[72vh] flex items-end overflow-hidden"
        style={{ backgroundColor: c.color }}
      >
        {/* Campus photo as base layer */}
        <Image
          src={campusImage}
          alt={`${c.name} campus`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Hero portrait overlaid */}
        <Image
          src={c.heroImage}
          alt={c.name}
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
        />

        {/* Bottom-heavy gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              ${c.color}F8 0%,
              ${c.color}C0 30%,
              ${c.color}70 55%,
              ${c.color}20 78%,
              transparent 100%
            )`,
          }}
        />

        {/* Top vignette for nav legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,transparent 30%)' }}
        />

        <div className="relative z-10 container-xl pb-16 pt-36">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/70 font-jakarta mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <span>›</span>
            <span className="text-white font-semibold">{c.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Flag + title */}
            <div>
              <div
                className="text-8xl mb-5 leading-none"
                style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.5))' }}
              >
                {c.flag}
              </div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot" />
                <span className="font-jakarta text-xs font-semibold text-white tracking-wide">2026 Updated Guide</span>
              </div>
              <h1
                className="font-jakarta font-extrabold text-white leading-tight"
                style={{ fontSize: 'clamp(2.6rem,6vw,4.5rem)' }}
              >
                Study in {c.name}
              </h1>
              <p className="font-jakarta text-white/85 text-lg mt-3 max-w-lg leading-relaxed">
                {c.tagline}
              </p>
            </div>

            {/* Glassmorphic stat tiles */}
            <div className="grid grid-cols-2 gap-3 lg:min-w-[280px]">
              {[
                ['📅 Intake',       c.intake],
                ['💰 Avg Cost',     c.avgCost],
                ['✅ Visa Rate',    c.visaRate],
                ['🏛️ Universities', c.unis],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="glass-card rounded-2xl px-4 py-3.5 text-center"
                >
                  <div className="font-jakarta text-[9px] text-white/65 uppercase tracking-widest mb-1 leading-none">
                    {label}
                  </div>
                  <div className="font-jakarta font-extrabold text-white text-sm leading-tight">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Sub-Navigation ────────────────────────────────────────── */}
      <SubNav
        country={country}
        sections={SECTION_SLUGS}
        labels={SECTION_LABELS}
        accentColor={c.color}
      />

      {/* ── Section Content ──────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="section relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${c.color} 0%,${c.color}CC 100%)` }}
      >
        <Image
          src={campusImage}
          alt=""
          fill
          aria-hidden
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="relative z-10 container-xl text-center">
          <div
            className="text-6xl mb-5"
            style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}
          >
            {c.flag}
          </div>
          <h2
            className="font-jakarta font-extrabold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
          >
            Ready to study in {c.name}?
          </h2>
          <p className="font-jakarta text-white/80 mb-8 max-w-lg mx-auto leading-relaxed">
            Book a free counselling session and we&apos;ll create a personalised roadmap —
            including scholarship strategy and visa guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-bold text-sm px-8 py-3.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              style={{ boxShadow: '0 8px 30px rgba(217,119,6,0.40)' }}
            >
              Book Free {c.name} Counselling →
            </Link>
            <a
              href={COMPANY.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-8 py-3.5 rounded-xl border-2 border-white/40 text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
            >
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
