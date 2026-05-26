import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getGlobalSettings, getSiteContent } from '@/lib/kv';
import type { ServiceItem, ProcessStepItem, Testimonial } from '@/lib/types';
import { DEFAULT_HERO_IMAGES } from '@/lib/data';

// ── Above-fold: eager imports ─────────────────────────────────────────────
import HeroSection       from '@/components/home/HeroSection';
import StatsSection      from '@/components/home/StatsSection';
import DestinationsStrip from '@/components/home/DestinationsStrip';
import ServicesSection   from '@/components/home/ServicesSection';
import HowItWorks        from '@/components/home/HowItWorks';

// ── Below-fold: lazy-loaded, not in the critical JS bundle ────────────────
const UniversityMarquee   = dynamic(() => import('@/components/home/UniversityMarquee'));
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'));
const EventsCarousel      = dynamic(() => import('@/components/home/EventsCarousel'));
const Updates2026         = dynamic(() => import('@/components/home/Updates2026'));
const QuickEnquiry        = dynamic(() => import('@/components/home/QuickEnquiry'));
const CTASection          = dynamic(() => import('@/components/home/CTASection'));

export const metadata: Metadata = {
  title: 'Ivy League Overseas Consulting | Study Abroad from Pune',
  description:
    'Premium overseas education consulting from Pune. 2,500+ students placed, 97% visa approval. Free 30-min counselling for USA, UK, Canada, Australia.',
};

// Revalidate every 60 s so KV edits surface quickly without a full redeploy
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch KV overrides in parallel — both fall back gracefully on error
  const [siteContent, globalSettings] = await Promise.all([
    getSiteContent<{
      services?:     ServiceItem[];
      processSteps?: ProcessStepItem[];
      testimonials?: Testimonial[];
    }>().catch(() => null),
    getGlobalSettings().catch(() => null),
  ]);

  const heroImages = globalSettings?.heroImages?.length
    ? globalSettings.heroImages
    : DEFAULT_HERO_IMAGES;

  const noticeBanner = globalSettings?.noticeBanner?.trim() || null;

  return (
    <>
      {noticeBanner && (
        <div className="bg-amber-500 text-white text-center font-jakarta text-xs font-semibold py-2.5 px-4 leading-snug">
          {noticeBanner}
        </div>
      )}
      <HeroSection heroImages={heroImages} />
      <StatsSection />
      <DestinationsStrip />
      <ServicesSection services={siteContent?.services} />
      <HowItWorks     steps={siteContent?.processSteps} />
      <UniversityMarquee />
      <TestimonialsSection testimonials={siteContent?.testimonials} />
      <EventsCarousel />
      <Updates2026 />
      <QuickEnquiry />
      <CTASection />
    </>
  );
}
