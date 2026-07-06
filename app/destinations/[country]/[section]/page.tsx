import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicCountry } from '@/lib/public-data';
import { getCountryContent, getCountrySections } from '@/lib/kv';
import {
  isValidSection,
  getSubpageContent,
  SECTION_LABELS,
} from '@/lib/countrySubpages';
import SectionBody from '../SectionBody';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ country: string; section: string }>;
}

/** Resolve a section's display label — built-in first, then admin-added. */
async function resolveSectionLabel(country: string, section: string): Promise<string | null> {
  if (isValidSection(section)) return SECTION_LABELS[section];
  const custom = await getCountrySections(country).catch(() => []);
  return custom.find(s => s.slug === section)?.label ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, section } = await params;
  const [c, label] = await Promise.all([
    getPublicCountry(country).catch(() => null),
    resolveSectionLabel(country, section),
  ]);
  if (!c || !label) return { title: 'Page Not Found | ILOC' };

  return {
    title: `${label} — Study in ${c.name} 2026 | ILOC`,
    description: `${label} guide for studying in ${c.name} in 2026. Expert advice from ILOC Pune — visa rules, top universities, scholarships and application process.`,
    openGraph: {
      title: `${label} — Study in ${c.name} 2026`,
      images: c.heroImage
        ? [{ url: c.heroImage, width: 1200, height: 630, alt: `Study in ${c.name}` }]
        : [],
    },
  };
}

export default async function SectionPage({ params }: Props) {
  const { country, section } = await params;

  const c = await getPublicCountry(country).catch(() => null);
  if (!c) notFound();

  const label = await resolveSectionLabel(country, section);
  if (!label) notFound();

  let html: string | null = null;
  try {
    const kvHtml = await getCountryContent(country, section);
    html = kvHtml ?? (isValidSection(section) ? getSubpageContent(country, section) : null);
  } catch (e) {
    console.error(`[SectionPage] KV fetch failed for ${country}/${section}:`, e);
    html = isValidSection(section) ? getSubpageContent(country, section) : null;
  }
  // A tab that exists in the sub-nav should never 404 — show a friendly
  // placeholder until the admin saves content for it (custom countries and
  // freshly added custom sections start empty).
  if (!html) {
    html = `<p>Detailed ${label} information for ${c.name} is being prepared. ` +
           `Meanwhile, book a free counselling session and our experts will walk you through everything you need to know.</p>`;
  }

  return (
    <SectionBody
      countryName={c.name}
      color={c.color}
      label={label}
      html={html}
    />
  );
}
