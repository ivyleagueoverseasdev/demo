import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/data';
import { getPartnerSettings, getGlobalSettings } from '@/lib/kv';
import { PARTNER_DEFAULTS, mergePartnerSettings, type PartnerPageKey } from '@/lib/partnerDefaults';
import PageHero from '@/components/shared/PageHero';

// Edge + dynamic so admin edits to any partner page (badge/subheading)
// are reflected immediately in these nav cards.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Partner With Us | ${COMPANY.name}`,
  description:
    'Explore ILOC partnership programs — join our agent & franchisee network, recruit students as an institution, or earn rewards through student & alumni referrals.',
};

const TRACKS: {
  key: PartnerPageKey;
  href: string;
  icon: string;
  title: string;
  stat: string;
  gradient: string;
  accent: string;
}[] = [
  {
    key: 'agent',
    href: '/partners/agent',
    icon: '🤝',
    title: 'Agents & Franchisees',
    stat: '400+ Direct Tie-Ups',
    gradient: 'linear-gradient(135deg,#1249C4 0%,#246DFF 100%)',
    accent: '#CCFF00',
  },
  {
    key: 'institutions',
    href: '/partners/institutions',
    icon: '🎓',
    title: 'Institutions',
    stat: '97% Visa Success Rate',
    gradient: 'linear-gradient(135deg,#0C37A0 0%,#1A5CE8 100%)',
    accent: '#B5FF00',
  },
  {
    key: 'referral',
    href: '/partners/referral',
    icon: '🎁',
    title: 'Alumni & Students',
    stat: '60% From Referrals',
    gradient: 'linear-gradient(135deg,#07257C 0%,#1249C4 100%)',
    accent: '#A3E635',
  },
];

export default async function PartnersIndexPage() {
  const [kvResults, gs] = await Promise.all([
    Promise.all(TRACKS.map(t => getPartnerSettings(t.key).catch(() => null))),
    getGlobalSettings().catch(() => null),
  ]);
  const pb = gs?.pageHeroBadges?.partners;
  const tracks = TRACKS.map((t, i) => ({
    ...t,
    s: mergePartnerSettings(t.key, kvResults[i]) ?? PARTNER_DEFAULTS[t.key],
  }));

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(145deg,#07257C 0%,#1249C4 50%,#5A8CFF 100%)"
        breadcrumbLabel="Partners"
        eyebrow="Partner Programs"
        eyebrowColor="#B5FF00"
        heading={
          <>
            Grow With{' '}
            <span style={{ background: 'linear-gradient(135deg,#B5FF00,#CCFF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ILOC.
            </span>
          </>
        }
        paragraph="Whether you run a consultancy, represent a university, or simply want to help a friend study abroad — there's a partnership track built for you. Join 400+ institutions and a growing network of agents already partnering with ILOC."
        image={{
          src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80&auto=format&fit=crop',
          alt: 'Business partners shaking hands over an agreement',
        }}
        badge={{ value: pb?.value || '3', label: pb?.label || 'Partnership tracks to choose from' }}
        blobColor="#B5FF00"
      />

      {/* ── Nav cards ── */}
      <section className="w-full overflow-hidden section bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <div className="divider-blue mx-auto" />
            <h2 className="font-jakarta font-extrabold text-primary-600 mt-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              Choose Your Partnership Track
            </h2>
            <p className="font-jakarta text-base md:text-lg text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Whatever role you play in a student&apos;s journey, ILOC has a program designed for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tracks.map(t => (
              <Link
                key={t.key}
                href={t.href}
                className="group relative overflow-hidden rounded-3xl text-white p-8 flex flex-col hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 shadow-xl"
                style={{ background: t.gradient }}
              >
                {/* Decorative glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
                  style={{ background: t.accent, transform: 'translate(30%,-30%)' }}
                  aria-hidden
                />
                {/* Dot grid texture */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden>
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id={`pdots-${t.key}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pdots-${t.key})`} />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    {t.icon}
                  </div>
                  <div className="inline-flex items-center gap-1.5 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
                    <span className="font-jakarta text-[11px] font-semibold tracking-widest uppercase text-white/70">
                      {t.s.badge}
                    </span>
                  </div>
                  <h3 className="font-jakarta font-extrabold text-xl md:text-2xl mb-3 leading-snug">{t.title}</h3>
                  <p className="font-jakarta text-sm md:text-base text-white/75 leading-relaxed flex-1 mb-6">
                    {t.s.subheading}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/15">
                    <span className="font-jakarta text-sm font-bold" style={{ color: t.accent }}>
                      {t.stat}
                    </span>
                    <span className="font-jakarta text-sm font-semibold text-white inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Explore <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full overflow-hidden section text-white" style={{ background: 'linear-gradient(135deg,#0C37A0,#246DFF)' }}>
        <div className="container-xl text-center">
          <h2 className="font-jakarta font-extrabold text-white mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
            Not sure which track fits you?
          </h2>
          <p className="font-jakarta text-base md:text-lg text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
            Tell us a little about yourself and our partnerships team will point you in the right direction — no pressure, no obligation.
          </p>
          <Link href="/contact" className="btn-primary w-full md:w-auto text-base md:text-lg font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl">
            Get in Touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
