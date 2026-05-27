import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COUNTRIES_MAP } from '@/lib/data';
import { getCountryContent } from '@/lib/kv';
import {
  isValidSection,
  getSubpageContent,
  SECTION_LABELS,
  SECTION_SLUGS,
} from '@/lib/countrySubpages';

export const dynamic = 'force-dynamic';

interface Props {
  params: { country: string; section: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, section } = params;
  const c = COUNTRIES_MAP[country];
  if (!c || !isValidSection(section)) return { title: 'Page Not Found | ILOC' };

  const label = SECTION_LABELS[section];
  return {
    title: `${label} — Study in ${c.name} 2026 | ILOC`,
    description: `${label} guide for studying in ${c.name} in 2026. Expert advice from ILOC Pune — visa rules, top universities, scholarships and application process.`,
    openGraph: {
      title: `${label} — Study in ${c.name} 2026`,
      images: [{ url: c.heroImage, width: 1200, height: 630, alt: `Study in ${c.name}` }],
    },
  };
}

export default async function SectionPage({ params }: Props) {
  const { country, section } = params;

  if (!COUNTRIES_MAP[country]) notFound();
  if (!isValidSection(section)) notFound();

  let html: string | null = null;
  try {
    const kvHtml = await getCountryContent(country, section);
    html = kvHtml ?? getSubpageContent(country, section);
  } catch (e) {
    console.error(`[SectionPage] KV fetch failed for ${country}/${section}:`, e);
    html = getSubpageContent(country, section);
  }
  if (!html) notFound();

  const c     = COUNTRIES_MAP[country];
  const label = SECTION_LABELS[section];

  return (
    <section className="section bg-white">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="mb-8">
            <div className="divider-amber mb-4" />
            <p className="label mb-2">{c.name} — 2026 Guide</p>
            <h2
              className="font-jakarta font-extrabold text-primary-600"
              style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}
            >
              {label}
            </h2>
          </div>

          {/* Rich content */}
          <div
            className="
              prose prose-slate max-w-none
              prose-headings:font-jakarta prose-headings:font-extrabold prose-headings:text-primary-600
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-slate-800
              prose-p:font-jakarta prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:font-jakarta prose-li:text-slate-600 prose-li:leading-relaxed
              prose-ul:my-4 prose-ol:my-4
              prose-strong:text-slate-800 prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-amber-400
              prose-blockquote:bg-amber-50 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3
              prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-table:text-sm prose-th:font-jakarta prose-th:font-semibold prose-th:text-primary-600
              prose-th:bg-primary-50 prose-td:font-jakarta prose-td:text-slate-600
              prose-table:border prose-table:border-slate-200 prose-td:border prose-td:border-slate-200
              prose-th:border prose-th:border-slate-200 prose-th:px-3 prose-th:py-2
              prose-td:px-3 prose-td:py-2
            "
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* ILOC CTA strip */}
          <div
            className="mt-12 rounded-2xl p-6 sm:p-8 border"
            style={{
              background:   `linear-gradient(135deg,${c.color}08,${c.color}14)`,
              borderColor:  `${c.color}30`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-jakarta font-bold text-slate-800 text-base mb-1">
                  Get personalised guidance for {c.name}
                </h3>
                <p className="font-jakarta text-sm text-slate-500">
                  Free 30-min session with Rajib Paul · Zero pressure · Tailored scholarship strategy
                </p>
              </div>
              <a
                href="https://wa.me/919158577707"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 font-jakarta font-bold text-sm px-6 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
              >
                💬 Book via WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
