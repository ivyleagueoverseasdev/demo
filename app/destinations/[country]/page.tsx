import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { COUNTRIES_MAP } from '@/lib/data';

export const runtime = 'edge';

interface Props { params: Promise<{ country: string }> }

export function generateStaticParams() {
  return Object.keys(COUNTRIES_MAP).map(code => ({ country: code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const c = COUNTRIES_MAP[country];
  if (!c) return { title: 'Destination Not Found' };
  return {
    title: `Study in ${c.name} 2026 | Visa Guide & Scholarships | ILOC`,
    description: `${c.description.slice(0, 155)}...`,
    openGraph: {
      images: [{ url: c.heroImage, width: 1200, height: 630, alt: `Study in ${c.name}` }],
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  if (!COUNTRIES_MAP[country]) notFound();
  redirect(`/destinations/${country}/why-study`);
}
