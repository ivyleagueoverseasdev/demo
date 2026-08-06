export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicNews, getPublicNewsItem, buildPageMeta } from '@/lib/public-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicNewsItem(slug).catch(() => null);
  if (!item) return { title: 'Article Not Found | ILOC' };
  return {
    ...buildPageMeta({
      title:       `${item.title} | ILOC News`,
      description: item.excerpt || item.title,
      path:        `/news/${slug}`,
      imageUrl:    item.imageUrl || undefined,
    }),
    // News-specific structured metadata
    openGraph: {
      type:        'article',
      title:       item.title,
      description: item.excerpt,
      publishedTime: item.createdAt,
      ...(item.imageUrl && { images: [{ url: item.imageUrl, width: 1200, height: 630, alt: item.title }] }),
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;

  const item = await getPublicNewsItem(slug).catch(() => null);
  if (!item) notFound();

  // Fetch 3 related articles (excluding current)
  const related = await getPublicNews({ publishedOnly: true, limit: 4 }).then(
    news => news.filter(n => n.slug !== slug).slice(0, 3)
  ).catch(() => []);

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <main className="bg-white min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {item.imageUrl && (
        <div className="relative h-[42vh] min-h-[300px] bg-slate-900 overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover opacity-65"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        </div>
      )}

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-jakarta mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
              <span aria-hidden>›</span>
              <Link href="/news" className="hover:text-slate-600 transition-colors">News</Link>
              <span aria-hidden>›</span>
              <span className="text-slate-600 line-clamp-1">{item.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 mb-5" />
              <time
                dateTime={item.date}
                className="font-jakarta text-[11px] text-amber-600 font-bold uppercase tracking-wide mb-3 block"
              >
                {formatDate(item.date)}
              </time>
              <h1
                className="font-jakarta font-extrabold text-primary-600 leading-tight mb-5"
                style={{ fontSize: 'clamp(1.7rem,3.5vw,2.7rem)' }}
              >
                {item.title}
              </h1>
              {item.excerpt && (
                <p className="font-jakarta text-slate-600 text-base leading-relaxed border-l-4 border-amber-400 pl-5 bg-amber-50 py-3.5 rounded-r-2xl">
                  {item.excerpt}
                </p>
              )}
            </header>

            {/* Rich content */}
            <article
              className="
                prose prose-slate max-w-none
                prose-headings:font-jakarta prose-headings:font-extrabold prose-headings:text-primary-600
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-7 prose-h3:mb-3 prose-h3:text-slate-800
                prose-p:font-jakarta prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-5
                prose-li:font-jakarta prose-li:text-slate-600 prose-li:leading-relaxed
                prose-ul:my-5 prose-ol:my-5
                prose-strong:text-slate-800 prose-strong:font-semibold
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-amber-400
                prose-blockquote:bg-amber-50 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-4
                prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:font-medium
                prose-hr:border-slate-200 prose-hr:my-8
                prose-img:rounded-2xl
              "
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* Immediately after the article text — not pushed below the CTA card */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 font-jakarta text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-8"
            >
              ← Back to all news
            </Link>

            {/* CTA card */}
            <aside className="mt-12 rounded-2xl p-6 sm:p-8 border border-primary-100 bg-gradient-to-br from-primary-50 to-white">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">IL</div>
                <div className="flex-1">
                  <h3 className="font-jakarta font-bold text-slate-800 text-base mb-1">
                    Get personalised advice on this update
                  </h3>
                  <p className="font-jakarta text-sm text-slate-500 mb-4">
                    Free 30-min session · Expert counsellor · Tailored action plan · Zero pressure
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 font-jakarta font-bold text-sm px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      Book Free Session →
                    </Link>
                    <a
                      href="https://wa.me/919158577707"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-white transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                    >
                      💬 Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related articles ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section bg-slate-50 border-t border-slate-100">
          <div className="container-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-jakarta font-extrabold text-slate-800 text-xl mb-7">More from ILOC Intelligence</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                  >
                    {rel.imageUrl && (
                      <div className="relative h-32 overflow-hidden flex-shrink-0">
                        <Image src={rel.imageUrl} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <time className="font-jakarta text-[9px] text-amber-600 font-bold uppercase tracking-wide mb-1.5">{formatDate(rel.date)}</time>
                      <h3 className="font-jakarta font-bold text-slate-800 text-sm leading-snug group-hover:text-primary-600 transition-colors">{rel.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
