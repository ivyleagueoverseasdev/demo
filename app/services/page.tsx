import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServicesSettings } from '@/lib/kv';
import { mergeServicesSettings, SERVICES_DEFAULTS } from '@/lib/pageDefaults';
import PageHero from '@/components/shared/PageHero';

// Edge + dynamic so admin edits go live immediately.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Services | Overseas Education Consulting | ILOC Pune',
  description:
    'End-to-end study abroad services — undergraduate & postgraduate admissions, profile building, IELTS/GRE coaching, visa preparation and pre-departure support. 97% visa approval rate.',
};

export default async function ServicesPage() {
  const kvSettings = await getServicesSettings().catch(() => null);
  const s = mergeServicesSettings(kvSettings);
  const services = s.studentServices.length ? s.studentServices : SERVICES_DEFAULTS.studentServices;

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(150deg,#051A57 0%,#0C37A0 50%,#1A5CE8 100%)"
        breadcrumbLabel="Services"
        eyebrow={s.heroEyebrow}
        eyebrowColor="#B5FF00"
        heading={
          <>
            {s.heroHeadingLine1}<br />
            <span style={{ background: 'linear-gradient(135deg,#B5FF00,#CCFF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {s.heroHeadingLine2}
            </span>
          </>
        }
        paragraph={s.heroParagraph}
        image={{
          src: s.heroImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop',
          alt: 'Counsellor guiding a student through university options',
        }}
        badge={{ value: '97%', label: 'Visa approval rate' }}
        blobColor="#B5FF00"
      />

      {/* ── Student Services 4×3 Grid ── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="divider-blue mb-4" />
          <h2
            className="font-jakarta font-extrabold text-primary-600 mb-10"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
          >
            {s.studentHeading}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.id}
                href={`/services/${svc.id}`}
                className="group card overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={svc.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop'}
                    alt={svc.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  />
                  {/* Subtle gradient overlay so title pops against any image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-jakarta font-bold text-slate-800 text-[14px] leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="font-jakarta text-xs text-slate-500 leading-relaxed flex-1">
                    {svc.description}
                  </p>
                  <div className="mt-4 font-jakarta text-xs font-semibold text-amber-500 group-hover:text-amber-600 transition-colors">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section text-white" style={{ background: 'linear-gradient(135deg,#0C37A0,#246DFF)' }}>
        <div className="container-xl text-center">
          <h2
            className="font-jakarta font-extrabold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
          >
            {s.ctaHeading}
          </h2>
          <p className="font-jakarta text-white/70 mb-8 max-w-lg mx-auto">{s.ctaParagraph}</p>
          <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-xl">
            Book Free Counselling →
          </Link>
        </div>
      </section>

    </div>
  );
}
