import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { getServicesSettings, getSiteContent } from '@/lib/kv';
import { mergeServicesSettings } from '@/lib/pageDefaults';
import type { ServiceItem } from '@/lib/types';
import PageHero from '@/components/shared/PageHero';

// Edge + dynamic so admin edits (Services editor, Homepage services list)
// go live immediately.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Services | Overseas Education Consulting | ILOC Pune',
  description:
    'End-to-end study abroad services — undergraduate & postgraduate admissions, profile building, IELTS/GRE coaching, visa preparation and pre-departure support. 97% visa approval rate.',
};

export default async function ServicesPage() {
  const [kvSettings, siteContent] = await Promise.all([
    getServicesSettings().catch(() => null),
    getSiteContent<{ services?: ServiceItem[] }>().catch(() => null),
  ]);

  const s = mergeServicesSettings(kvSettings);
  // Core services are managed in /admin/homepage (same list as the homepage)
  const coreServices = siteContent?.services?.length ? siteContent.services : SERVICES;
  const all = [...coreServices, ...s.extraServices];

  return (
    <div className="bg-white">
      {/* Hero */}
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
          src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop',
          alt: 'Counsellor guiding a student through university options',
        }}
        badge={{ value: '97%', label: 'Visa approval rate' }}
        blobColor="#B5FF00"
      />

      {/* Services grid */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="divider-blue mb-4" />
          <h2 className="font-jakarta font-extrabold text-primary-600 mb-10" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            {s.studentHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {all.map((svc) => (
              <Link key={svc.id} href="/contact"
                className="group card p-6 hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl mb-5
                                group-hover:bg-primary-600 transition-colors duration-300">
                  <span>{svc.icon}</span>
                </div>
                <h3 className="font-jakarta font-bold text-slate-800 text-[14px] mb-2 group-hover:text-primary-600 transition-colors">
                  {svc.title}
                </h3>
                <p className="font-jakarta text-xs text-slate-500 leading-relaxed flex-1">{svc.desc}</p>
                <div className="mt-4 font-jakarta text-xs font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Book session →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Institute services */}
      <section className="section bg-slate-50">
        <div className="container-xl">
          <div className="mb-10">
            <div className="divider-amber mb-4" />
            <h2 className="font-jakarta font-extrabold text-primary-600" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              {s.instituteHeading}
            </h2>
            <p className="font-jakarta text-slate-500 mt-3">{s.instituteIntro}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {s.instituteServices.map(svc => (
              <div key={svc.title} className="card p-7">
                <div className="text-3xl mb-5">{svc.icon}</div>
                <h3 className="font-jakarta font-bold text-primary-600 text-base mb-2">{svc.title}</h3>
                <p className="font-jakarta text-sm text-slate-500 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
          <div className="card p-6 border-amber-200 bg-amber-50/50">
            <h3 className="font-jakarta font-bold text-amber-600 text-base mb-2">{s.partnerBoxHeading}</h3>
            <p className="font-jakarta text-sm text-slate-600 mb-4">{s.partnerBoxText}</p>
            <Link href="/contact" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-flex">
              Enquire About Partnership →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-white" style={{ background: 'linear-gradient(135deg,#0C37A0,#246DFF)' }}>
        <div className="container-xl text-center">
          <h2 className="font-jakarta font-extrabold text-white mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            {s.ctaHeading}
          </h2>
          <p className="font-jakarta text-white/70 mb-8 max-w-lg mx-auto">{s.ctaParagraph}</p>
          <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-xl">Book Free Counselling →</Link>
        </div>
      </section>
    </div>
  );
}
