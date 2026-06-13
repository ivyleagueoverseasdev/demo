// ── Edge runtime: KV reads happen at request time via getOptionalRequestContext ──
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import lazyLoad from 'next/dynamic';
import { getHomepageData } from '@/lib/public-data';
import { buildPageMeta } from '@/lib/public-data';

// ── Above-fold: eager imports ─────────────────────────────────────────────
import HeroSection       from '@/components/home/HeroSection';
import StatsSection      from '@/components/home/StatsSection';
import DestinationsStrip from '@/components/home/DestinationsStrip';
import HowItWorks        from '@/components/home/HowItWorks';

// ── Below-fold: lazy-loaded ───────────────────────────────────────────────
const UniversityMarquee   = lazyLoad(() => import('@/components/home/UniversityMarquee'));
const TestimonialsSection = lazyLoad(() => import('@/components/home/TestimonialsSection'));
const LiveClassesBoard    = lazyLoad(() => import('@/components/home/LiveClassesBoard'));
const EventsCarousel      = lazyLoad(() => import('@/components/home/EventsCarousel'));
const Updates2026         = lazyLoad(() => import('@/components/home/Updates2026'));
const QuickEnquiry        = lazyLoad(() => import('@/components/home/QuickEnquiry'));

export const metadata: Metadata = buildPageMeta({
  title:       'Ivy League Overseas Consulting | Study Abroad from Pune',
  description: 'Premium overseas education consulting from Pune. 10,000+ students placed over 25+ years, 97% visa approval. Free 30-min counselling for USA, UK, Canada, Australia.',
  path:        '/',
});

export default async function HomePage() {
  // Single call via public-data — all error handling + defaults are centralised there.
  const { heroSlides, processSteps, testimonials, noticeBanner, globalSettings } =
    await getHomepageData();

  return (
    <>
      {noticeBanner && (
        <div className="bg-amber-500 text-white text-center font-jakarta text-xs font-semibold py-2.5 px-4 leading-snug">
          {noticeBanner}
        </div>
      )}
      <HeroSection slides={heroSlides} />
      <StatsSection />
      <DestinationsStrip gridCols={globalSettings?.destinationsCols} />
      <HowItWorks    steps={processSteps} />
      <UniversityMarquee />
      <TestimonialsSection testimonials={testimonials} />
      <LiveClassesBoard gridCols={globalSettings?.classesCols} />
      <EventsCarousel />
      <Updates2026 />
      <QuickEnquiry />
    </>
  );
}
