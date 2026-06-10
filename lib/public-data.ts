/**
 * Public data helpers — fetch site content from CONTENT_KV.
 *
 * These functions are designed for Server Components and Edge API routes.
 * They NEVER require an auth token — KV reads are public operations.
 * All functions catch errors and return typed defaults so the site never
 * crashes due to a KV miss.
 *
 * Usage in a Server Component:
 *   import { getHomepageData } from '@/lib/public-data';
 *   const data = await getHomepageData();
 */

import {
  getHeroSlides,
  getSiteContent,
  getGlobalSettings,
  getStats,
  getEvents,
  getNews,
  getMarqueeSettings,
  getCountryMeta,
  getCountryContent,
} from '@/lib/kv';
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_SERVICES,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_EVENTS,
  STATS,
  COUNTRIES,
} from '@/lib/data';
import type {
  HeroSlide,
  SiteEvent,
  NewsItem,
  ServiceItem,
  ProcessStepItem,
  Testimonial,
  Stat,
  GlobalSettings,
} from '@/lib/types';
import type { MarqueeSettings, CountryMeta } from '@/lib/kv';

// ── Typed return shapes ───────────────────────────────────────────────────────

export interface HomepageData {
  heroSlides:   HeroSlide[];
  stats:        Stat[];
  services:     ServiceItem[];
  processSteps: ProcessStepItem[];
  testimonials: Testimonial[];
  globalSettings: GlobalSettings | null;
  noticeBanner:   string | null;
}

export interface EventsPageData {
  events: SiteEvent[];
}

export interface NewsPageData {
  news: NewsItem[];
}

export interface UniversityMarqueeData {
  settings: MarqueeSettings | null;
}

// ── Homepage ──────────────────────────────────────────────────────────────────

export async function getHomepageData(): Promise<HomepageData> {
  const [heroSlides, siteContent, stats, globalSettings] = await Promise.all([
    getHeroSlides().catch(() => null),
    getSiteContent<{
      services?:     ServiceItem[];
      processSteps?: ProcessStepItem[];
      testimonials?: Testimonial[];
    }>().catch(() => null),
    getStats().catch(() => null),
    getGlobalSettings().catch(() => null),
  ]);

  return {
    heroSlides:     (heroSlides?.filter(s => s.enabled) ?? []).length > 0
      ? heroSlides!.filter(s => s.enabled)
      : DEFAULT_HERO_SLIDES.filter(s => s.enabled),
    stats:          stats?.length ? stats : STATS,
    services:       siteContent?.services?.length ? siteContent.services : DEFAULT_SERVICES,
    processSteps:   siteContent?.processSteps?.length ? siteContent.processSteps : DEFAULT_PROCESS_STEPS,
    testimonials:   siteContent?.testimonials?.length ? siteContent.testimonials : DEFAULT_TESTIMONIALS,
    globalSettings: globalSettings ?? null,
    noticeBanner:   globalSettings?.noticeBanner?.trim() || null,
  };
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getPublicEvents(opts?: {
  publishedOnly?: boolean;
  type?:          SiteEvent['type'];
  country?:       string;
  limit?:         number;
}): Promise<SiteEvent[]> {
  const events = await getEvents().catch(() => [] as SiteEvent[]);
  const list   = events.length > 0 ? events : DEFAULT_EVENTS;

  return list
    .filter(e => {
      if (opts?.publishedOnly !== false && !e.published) return false;
      if (opts?.type    && e.type    !== opts.type)    return false;
      if (opts?.country && e.country !== opts.country) return false;
      return true;
    })
    .slice(0, opts?.limit ?? 100);
}

export async function getUpcomingEvents(limit = 6): Promise<SiteEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  return getPublicEvents({ publishedOnly: true, limit: 100 }).then(events =>
    events.filter(e => e.date >= today).slice(0, limit)
  );
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function getPublicNews(opts?: {
  publishedOnly?: boolean;
  limit?:         number;
}): Promise<NewsItem[]> {
  const news = await getNews().catch(() => [] as NewsItem[]);
  return news
    .filter(n => opts?.publishedOnly !== false ? n.published : true)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, opts?.limit ?? 100);
}

export async function getPublicNewsItem(slug: string): Promise<NewsItem | null> {
  const news = await getNews().catch(() => [] as NewsItem[]);
  return news.find(n => n.slug === slug && n.published) ?? null;
}

// ── Country pages ─────────────────────────────────────────────────────────────

export async function getCountryPageData(code: string): Promise<{
  meta:      CountryMeta | null;
  country:   (typeof COUNTRIES)[number] | undefined;
  sections:  Partial<Record<string, string>>;
}> {
  // Must mirror the public site's section slugs (lib/countrySubpages.ts)
  const SECTION_SLUGS = ['why-study', 'application-procedure', 'university-list', 'salient-features', 'entry-criteria'];
  const country = COUNTRIES.find(c => c.code === code);
  const meta    = await getCountryMeta(code).catch(() => null);

  const sections: Partial<Record<string, string>> = {};
  await Promise.all(
    SECTION_SLUGS.map(async s => {
      const html = await getCountryContent(code, s).catch(() => null);
      if (html) sections[s] = html;
    })
  );

  return { meta, country, sections };
}

// ── University marquee ────────────────────────────────────────────────────────

export async function getMarqueeData(): Promise<UniversityMarqueeData> {
  const settings = await getMarqueeSettings().catch(() => null);
  return { settings };
}

// ── Global settings ───────────────────────────────────────────────────────────

export async function getPublicGlobalSettings(): Promise<GlobalSettings | null> {
  return getGlobalSettings().catch(() => null);
}

// ── SEO helpers ───────────────────────────────────────────────────────────────

export function buildPageMeta(opts: {
  title:        string;
  description:  string;
  path:         string;
  imageUrl?:    string;
}) {
  const baseUrl = 'https://ivyleagueoverseas.com'; // update when domain is live
  return {
    title:       opts.title,
    description: opts.description,
    openGraph: {
      title:       opts.title,
      description: opts.description,
      url:         `${baseUrl}${opts.path}`,
      type:        'website' as const,
      ...(opts.imageUrl && { images: [{ url: opts.imageUrl, width: 1200, height: 630 }] }),
    },
    alternates: { canonical: `${baseUrl}${opts.path}` },
  };
}
