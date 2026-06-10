import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/data';
import { getCountryMeta } from '@/lib/kv';

// Edge + dynamic so admin edits to country stats/images (KV) go live immediately.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Study Destinations 2026 | USA, UK, Canada, Europe, UAE & More | ILOC',
  description:
    'Explore 2026 visa guides, scholarships and career pathways for 12 top study destinations — USA, UK, Canada, Australia, Ireland, New Zealand, Europe, UAE, Japan, South Korea, Singapore and Russia. Expert advice from ILOC Pune.',
};

export default async function DestinationsPage() {
  // Merge admin-edited KV overrides onto the static country defaults.
  const metas = await Promise.all(
    COUNTRIES.map(c => getCountryMeta(c.code).catch(() => null)),
  );
  const countries = COUNTRIES.map((c, i) => {
    const m = metas[i];
    return {
      ...c,
      intake:      m?.intake      || c.intake,
      avgCost:     m?.avgCost     || c.avgCost,
      visaRate:    m?.visaRate    || c.visaRate,
      unis:        m?.unis        || c.unis,
      tagline:     m?.tagline     || c.tagline,
      description: m?.description || c.description,
      highlights:  m?.highlights?.length ? m.highlights : c.highlights,
      heroImage:   m?.heroImage   || c.heroImage,
      campusImage: m?.campusImage || c.campusImage,
      color:       m?.color       || c.color,
    };
  });

  return (
    <div className="bg-white">
      {/* ── Picture-based hero ── */}
      <section className="relative overflow-hidden min-h-[380px] flex items-end">
        {/* Background collage — top 4 country images */}
        <div className="absolute inset-0 grid grid-cols-4">
          {countries.slice(0, 4).map((c, i) => (
            <div key={c.code} className="relative overflow-hidden">
              <Image
                src={c.heroImage}
                alt={c.name}
                fill
                className="object-cover"
                sizes="25vw"
                priority={i === 0}
              />
              {/* Per-column color tint */}
              <div
                className="absolute inset-0"
                style={{ background: `${c.color}55` }}
              />
            </div>
          ))}
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30" />

        {/* Content */}
        <div className="container-xl relative z-10 py-16 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/50 font-jakarta mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/80">Destinations</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 rounded-full bg-amber-400" />
              <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400">
                12 Countries · 400+ Partner Universities
              </p>
            </div>
            <h1
              className="font-jakarta font-extrabold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(2rem,5vw,3.8rem)' }}
            >
              Where will you{' '}
              <span style={{
                background: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                study?
              </span>
            </h1>
            <p className="font-jakarta text-white/75 text-base leading-relaxed max-w-2xl">
              Each guide includes 2026 visa updates, scholarship opportunities, career prospects, and a full admission process overview — personalised by our expert team.
            </p>

            {/* Quick country flag strip */}
            <div className="flex flex-wrap gap-2 mt-6">
              {countries.map(c => (
                <Link
                  key={c.code}
                  href={`/destinations/${c.code}`}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/35 backdrop-blur-sm rounded-full px-3 py-1.5 font-jakarta text-xs font-medium text-white/85 hover:text-white transition-all"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Country cards grid ── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="space-y-6">
            {countries.map((c) => (
              <Link key={c.code} href={`/destinations/${c.code}`}
                className="group card flex flex-col sm:flex-row overflow-hidden hover:-translate-y-0.5 block">
                {/* Picture panel */}
                <div className="sm:w-56 lg:w-72 h-44 sm:h-auto relative flex-shrink-0 overflow-hidden">
                  <Image
                    src={c.campusImage}
                    alt={`${c.name} campus`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width:640px) 100vw, 300px"
                  />
                  {/* Color tint overlay */}
                  <div
                    className="absolute inset-0 opacity-30 group-hover:opacity-20 transition-opacity"
                    style={{ background: c.color }}
                  />
                  {/* Flag badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="font-jakarta font-bold text-xs text-slate-800">{c.name}</span>
                  </div>
                </div>

                {/* Info panel */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="font-jakarta font-bold text-primary-600 text-xl mb-1 group-hover:text-amber-600 transition-colors">{c.name}</h2>
                      <span className="font-jakarta text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${c.color}18`, color: c.color }}>
                        {c.unis} universities
                      </span>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      {[['Intake', c.intake], ['Avg Cost', c.avgCost]].map(([l, v]) => (
                        <div key={l} className="rounded-xl p-2.5 text-center bg-slate-50">
                          <div className="font-jakarta text-[8px] uppercase tracking-widest text-slate-400 mb-0.5">{l}</div>
                          <div className="font-jakarta font-bold text-xs text-slate-700">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-jakarta text-xs text-slate-500">
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: c.color }}>✓</span>
                        {h}
                      </span>
                    ))}
                  </div>
                  <div className="font-jakarta text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform inline-block">
                    View 2026 Guide →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
