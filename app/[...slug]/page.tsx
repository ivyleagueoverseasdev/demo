import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPage, resolveRedirect } from '@/lib/kv';

interface Props { params: Promise<{ slug: string[] }> }

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Always check KV at runtime

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug.join('/'));
  if (!page) return { title: 'Page Not Found' };
  return {
    title:       page.metaTitle || page.title,
    description: page.metaDescription || '',
  };
}

// ── Minimal markdown renderer ─────────────────────────────────────────────
// Matches the plain-text syntax the admin's Pages editor actually accepts
// (see app/admin/pages/page.tsx) — a textarea, not a WYSIWYG. An earlier
// version paired this exact renderer with a RichTextEditor (HTML output),
// so any formatting an admin applied via the rich toolbar showed up as
// literal escaped HTML tags on the live page. List items are now grouped
// into a proper <ul> (was emitting bare <li> with no wrapper), and **bold**
// is parsed inline, matching the same lightweight syntax used for Events.
function parseInline(line: string): ReactNode {
  const parts = line.split(/\*\*([^*]+)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{p}</strong> : p));
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="my-3 space-y-1">
        {listBuffer.map((item, i) => (
          <li key={i} className="font-jakarta text-slate-600 text-sm leading-7 ml-5 list-disc">{parseInline(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith('### ')) {
      flushList();
      nodes.push(<h3 key={i} className="font-jakarta font-bold text-slate-800 text-xl mt-6 mb-2">{parseInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      nodes.push(<h2 key={i} className="font-jakarta font-bold text-primary-600 text-2xl mt-8 mb-3">{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      flushList();
      nodes.push(<h1 key={i} className="font-jakarta font-bold text-primary-600 text-3xl mt-10 mb-4">{parseInline(line.slice(2))}</h1>);
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
    } else if (line.startsWith('> ')) {
      flushList();
      nodes.push(<blockquote key={i} className="font-jakarta italic text-lg text-amber-600 pl-4 my-4 border-l-4 border-amber-400">{parseInline(line.slice(2))}</blockquote>);
    } else if (line.trim() === '') {
      flushList();
      nodes.push(<div key={i} className="h-3" />);
    } else {
      flushList();
      nodes.push(<p key={i} className="font-jakarta text-slate-600 text-sm leading-7 mb-2">{parseInline(line)}</p>);
    }
  });
  flushList();
  return nodes;
}

// ── Typed block prop helpers ─────────────────────────────────────────────
interface HeroProps    { category?: string; headline?: string; subtext?: string }
interface TextProps    { body?: string }
interface CtaProps     { heading?: string; subtext?: string; buttonLabel?: string; buttonHref?: string }
interface StatsProps   { items?: { num: string; label: string }[] }

function asHero(p: Record<string, unknown>):  HeroProps  { return p as HeroProps;  }
function asText(p: Record<string, unknown>):  TextProps  { return p as TextProps;  }
function asCta(p:  Record<string, unknown>):  CtaProps   { return p as CtaProps;   }
function asStats(p: Record<string, unknown>): StatsProps { return p as StatsProps; }

export default async function DynamicPage({ params }: Props) {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');

  // Check for redirect rule first
  const redir = await resolveRedirect(`/${slug}`);
  if (redir) redirect(redir.to);

  // Look up page in KV
  const page = await getPage(slug);
  if (!page || !page.published) notFound();

  const heroBlock  = page.blocks?.find(b => b.type === 'hero');
  const heroProps  = heroBlock ? asHero(heroBlock.props) : null;

  return (
    <div className="bg-white">
      {/* Hero band — admin's "Hero Banner Image" (page.heroImageUrl) previously
          saved to KV but was never actually rendered anywhere; it now shows
          as the hero's background photo, matching every other hero on the site. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20">
        {page.heroImageUrl && (
          <>
            <Image
              src={page.heroImageUrl}
              alt={page.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-600/70" />
          </>
        )}
        <div className="container-xl relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/60 font-jakarta mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white/85">{page.title}</span>
          </nav>

          {heroProps ? (
            <div>
              <div className="badge-amber mb-4">{heroProps.category || 'Article'}</div>
              <h1 className="font-jakarta font-extrabold text-white mb-4"
                style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
                {heroProps.headline || page.title}
              </h1>
              {heroProps.subtext && (
                <p className="font-jakarta text-white/80 text-lg max-w-2xl leading-relaxed">
                  {heroProps.subtext}
                </p>
              )}
            </div>
          ) : (
            <h1 className="font-jakarta font-extrabold text-white"
              style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
              {page.title}
            </h1>
          )}
        </div>
      </section>

      {/* Content blocks */}
      <section className="section bg-white">
        <div className="container-xl max-w-4xl">
          {page.blocks?.map((block) => {
            if (block.type === 'hero') return null; // already rendered above

            if (block.type === 'text') {
              const p = asText(block.props);
              return (
                <div key={block.id} className="mb-8">
                  {renderMarkdown(p.body || '')}
                </div>
              );
            }

            if (block.type === 'cta') {
              const p = asCta(block.props);
              return (
                <div key={block.id} className="my-10 bg-primary-50 rounded-2xl p-8 border border-primary-100 text-center">
                  {p.heading && <h3 className="font-jakarta font-bold text-primary-600 text-xl mb-2">{p.heading}</h3>}
                  {p.subtext && <p className="font-jakarta text-slate-500 text-sm mb-5">{p.subtext}</p>}
                  <Link href={p.buttonHref || '/contact'} className="btn-primary text-sm px-8 py-3 rounded-xl">
                    {p.buttonLabel || 'Book Free Session →'}
                  </Link>
                </div>
              );
            }

            if (block.type === 'stats') {
              const p = asStats(block.props);
              return (
                <div key={block.id} className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
                  {(p.items || []).map((stat, si) => (
                    <div key={si} className="card py-6 text-center">
                      <div className="font-jakarta font-extrabold text-2xl text-gradient-blue">{stat.num}</div>
                      <div className="font-jakarta text-xs text-slate-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              );
            }

            return null;
          })}

          {(!page.blocks || page.blocks.length === 0) && (
            <p className="font-jakarta text-slate-400 text-center py-10">This page has no content yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
