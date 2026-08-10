import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServicesSettings } from '@/lib/kv';
import { mergeServicesSettings, SERVICES_DEFAULTS } from '@/lib/pageDefaults';
import PageHero from '@/components/shared/PageHero';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function getService(slug: string) {
  const kv = await getServicesSettings().catch(() => null);
  const s  = mergeServicesSettings(kv);
  const services = s.studentServices.length ? s.studentServices : SERVICES_DEFAULTS.studentServices;
  return services.find(svc => svc.id === slug) ?? null;
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = await getService(slug);
  if (!svc) return { title: 'Service Not Found | ILOC' };
  return {
    title: `${svc.title} | ILOC Pune`,
    description: svc.description,
    openGraph: {
      title: `${svc.title} | ILOC`,
      description: svc.description,
      images: svc.imageUrl ? [{ url: svc.imageUrl, width: 1200, height: 630, alt: svc.title }] : [],
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const svc = await getService(slug);
  if (!svc) notFound();

  const paragraphs = (svc.body ?? '').split('\n\n').map(p => p.trim()).filter(Boolean);

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(150deg,#051A57 0%,#0C37A0 50%,#1A5CE8 100%)"
        breadcrumbLabel={svc.title}
        eyebrow="Our Services"
        eyebrowColor="#B5FF00"
        heading={svc.title}
        paragraph={svc.description}
        image={{
          src: svc.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop',
          alt: svc.title,
        }}
        blobColor="#B5FF00"
      />

      {/* ── Body content ── */}
      <section className="section bg-white">
        <div className="container-xl max-w-3xl">
          {paragraphs.length > 0 && (
            <>
              <div className="divider-blue mb-8" />
              <div className="space-y-5">
                {paragraphs.map((para, i) => (
                  <p key={i} className="font-jakarta text-slate-600 leading-relaxed" style={{ fontSize: 'clamp(0.95rem,1.5vw,1.05rem)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </>
          )}
          {/* Immediately after the body text (or the hero, if a service has
              no body yet) — not buried below the separate CTA section. */}
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-jakarta text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-8"
          >
            ← All Services
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section text-white" style={{ background: 'linear-gradient(135deg,#0C37A0,#246DFF)' }}>
        <div className="container-xl text-center">
          <h2
            className="font-jakarta font-extrabold text-white mb-4"
            style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)' }}
          >
            Ready to get started?
          </h2>
          <p className="font-jakarta text-white/70 mb-8 max-w-lg mx-auto">
            Book a free 30-minute session with our expert counsellors. No pressure, no commitment — just clarity.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-full">
            Book Free Counselling →
          </Link>
        </div>
      </section>

    </div>
  );
}
