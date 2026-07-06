import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicCountry } from '@/lib/public-data';
import { getCountryContent } from '@/lib/kv';
import { getSubpageContent, SECTION_LABELS } from '@/lib/countrySubpages';
import SectionBody from './SectionBody';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ country: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const c = await getPublicCountry(country).catch(() => null);
  if (!c) return { title: 'Destination Not Found' };
  return {
    title: `Study in ${c.name} 2026 | Visa Guide & Scholarships | ILOC`,
    description: c.description ? `${c.description.slice(0, 155)}...` : `Study in ${c.name} — expert guidance from ILOC.`,
    openGraph: {
      images: c.heroImage
        ? [{ url: c.heroImage, width: 1200, height: 630, alt: `Study in ${c.name}` }]
        : [],
    },
  };
}

// The layout renders the hero and tab bar; this page opens the
// "Why Study Here" section by default so visitors immediately see content.
export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const c = await getPublicCountry(country).catch(() => null);
  if (!c) notFound();

  let html: string | null = null;
  try {
    const kvHtml = await getCountryContent(country, 'why-study');
    html = kvHtml ?? getSubpageContent(country, 'why-study');
  } catch {
    html = getSubpageContent(country, 'why-study');
  }
  if (!html) return null; // custom country with no content yet — hero + tabs still render

  return (
    <SectionBody
      countryName={c.name}
      color={c.color}
      label={SECTION_LABELS['why-study']}
      html={html}
    />
  );
}
