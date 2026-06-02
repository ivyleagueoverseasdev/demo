export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicNews, buildPageMeta } from '@/lib/public-data';

export const metadata: Metadata = buildPageMeta({
  title:       'News & Updates 2026 | ILOC — Overseas Education from Pune',
  description: 'Latest visa rule changes, scholarship updates, and study-abroad news for 2026. Expert commentary from ILOC — Canada IRCC, UK Graduate Route, Australia GST, and more.',
  path:        '/news',
});

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

export default async function NewsPage() {
  const news = await getPublicNews({ publishedOnly: true });

  return (
    <main className="bg-white min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: 'linear-gradient(145deg,#1249C4 0%,#246DFF 55%,#246DFF 100%)' }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="ndots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ndots)" />
          </svg>
        </div>
        <div className="container-xl relative z-10 text-center">
          <div className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 mb-5" />
          <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            ILOC Intelligence
          </p>
          <h1
            className="font-jakarta font-extrabold text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}
          >
            News &amp; Updates 2026
          </h1>
          <p className="font-jakarta text-white/75 max-w-xl mx-auto leading-relaxed text-base">
            Visa rule changes, scholarship deadlines, and study-abroad intelligence — curated weekly by our counselling team.
          </p>
        </div>
      </section>

      {/* ── Articles grid ────────────────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-xl">
          {news.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="font-jakarta font-bold text-slate-700 text-xl mb-2">No articles yet</h2>
              <p className="font-jakarta text-slate-400 text-sm">Check back soon — new updates are published weekly.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_12px_40px_rgba(36,109,255,0.10)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail */}
                  {item.imageUrl ? (
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                        priority={i < 3}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">📰</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <time className="font-jakarta text-[10px] text-amber-600 font-bold uppercase tracking-wide mb-2">
                      {formatDate(item.date)}
                    </time>
                    <h2 className="font-jakarta font-bold text-slate-800 text-[15px] leading-snug mb-2 group-hover:text-primary-600 transition-colors flex-1">
                      {item.title}
                    </h2>
                    {item.excerpt && (
                      <p className="font-jakarta text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="font-jakarta text-xs text-primary-600 font-semibold">Read more</span>
                      <span className="font-jakarta text-xs text-slate-400 group-hover:text-primary-500 transition-colors">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="section bg-white border-t border-slate-100">
        <div className="container-xl text-center">
          <h2 className="font-jakarta font-extrabold text-slate-800 mb-3" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>
            Have a question about these updates?
          </h2>
          <p className="font-jakarta text-slate-500 text-sm max-w-md mx-auto mb-6">
            Our counsellors explain what each policy change means for your specific application — free, personalised, no pressure.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-jakarta font-bold text-sm px-8 py-3.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Book Free Counselling →
          </Link>
        </div>
      </section>
    </main>
  );
}
