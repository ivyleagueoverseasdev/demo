import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/lib/kv';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'News & Updates 2026 | ILOC — Overseas Education from Pune',
  description: 'Latest visa rule changes, scholarship updates, and study-abroad news for 2026. Expert commentary from ILOC Pune — Canada IRCC, UK Graduate Route, Australia GST, and more.',
};

export default async function NewsPage() {
  const allNews = await getNews().catch(() => []);
  const news = allNews.filter(n => n.published);

  return (
    <main className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="section bg-gradient-to-b from-primary-700 to-primary-600 text-white">
        <div className="container-xl text-center">
          <div className="divider-amber mx-auto mb-4" />
          <p className="label text-white/70 mb-2">ILOC Intelligence</p>
          <h1
            className="font-jakarta font-extrabold text-white mb-4"
            style={{ fontSize: 'clamp(2rem,5vw,3.4rem)' }}
          >
            News & Updates 2026
          </h1>
          <p className="font-jakarta text-white/80 max-w-xl mx-auto leading-relaxed text-base">
            Real-time visa rule changes, scholarship updates, and study-abroad intelligence —
            curated by ILOC's counselling team.
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="section">
        <div className="container-xl">
          {news.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-jakarta text-slate-400 text-lg">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  {item.imageUrl ? (
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                      <span className="text-6xl opacity-30">📰</span>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <time className="font-jakarta text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-2">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <h2 className="font-jakarta font-extrabold text-slate-800 text-[15px] leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="font-jakarta text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>
                    <div className="mt-4 font-jakarta text-xs font-bold text-primary-600 group-hover:text-amber-600 transition-colors">
                      Read full article →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section bg-slate-50 border-t border-slate-100">
        <div className="container-xl text-center">
          <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-3">
            Questions about the 2026 updates?
          </h2>
          <p className="font-jakarta text-slate-500 mb-6 max-w-md mx-auto text-sm">
            Book a free 30-minute session with Rajib Sir — we will assess how the latest rules affect your specific profile.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-jakarta font-bold text-sm px-8 py-3.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            style={{ boxShadow: '0 8px 30px rgba(217,119,6,0.30)' }}
          >
            Book Free Counselling →
          </Link>
        </div>
      </section>
    </main>
  );
}
