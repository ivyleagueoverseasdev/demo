import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/lib/kv';
import type { NewsItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews().catch(() => []);
  const item = news.find(n => n.slug === slug);
  if (!item) return { title: 'Article Not Found | ILOC' };
  return {
    title: `${item.title} | ILOC`,
    description: item.excerpt,
    openGraph: item.imageUrl
      ? { images: [{ url: item.imageUrl, width: 1200, height: 630, alt: item.title }] }
      : undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;

  let item: NewsItem | undefined;
  try {
    const news = await getNews();
    item = news.find(n => n.slug === slug && n.published);
  } catch (e) {
    console.error(`[NewsArticlePage] KV fetch failed for slug "${slug}":`, e);
  }
  if (!item) notFound();
  const article = item as NewsItem;

  return (
    <main className="bg-white min-h-screen">
      {/* ── Hero Image ── */}
      {article.imageUrl && (
        <div className="relative h-[40vh] min-h-[280px] bg-slate-800 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
      )}

      {/* ── Article ── */}
      <section className="section">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-jakarta mb-8">
              <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
              <span>›</span>
              <Link href="/news" className="hover:text-slate-600 transition-colors">News</Link>
              <span>›</span>
              <span className="text-slate-600 line-clamp-1">{article.title}</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
              <div className="divider-amber mb-4" />
              <time className="font-jakarta text-[11px] text-amber-600 font-semibold uppercase tracking-wide mb-3 block">
                {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
              <h1
                className="font-jakarta font-extrabold text-primary-600 leading-tight mb-4"
                style={{ fontSize: 'clamp(1.7rem,3.5vw,2.6rem)' }}
              >
                {article.title}
              </h1>
              <p className="font-jakarta text-slate-500 text-base leading-relaxed border-l-4 border-amber-400 pl-4 bg-amber-50 py-3 rounded-r-xl">
                {article.excerpt}
              </p>
            </div>

            {/* Content */}
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
              "
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* CTA */}
            <div className="mt-12 rounded-2xl p-6 sm:p-8 border border-primary-100 bg-gradient-to-br from-primary-50 to-white">
              <h3 className="font-jakarta font-bold text-slate-800 text-base mb-1">
                Get personalised advice on this update
              </h3>
              <p className="font-jakarta text-sm text-slate-500 mb-4">
                Free 30-min session with Rajib Sir · Zero pressure · Tailored action plan
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

            {/* Back link */}
            <div className="mt-8 text-center">
              <Link href="/news" className="font-jakarta text-sm text-slate-400 hover:text-primary-600 transition-colors">
                ← Back to all news
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
