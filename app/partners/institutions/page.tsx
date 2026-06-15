import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import InstitutionsForm from './InstitutionsForm';
import PageHero from '@/components/shared/PageHero';
import { getPartnerSettings } from '@/lib/kv';
import type { PartnerPageSettings } from '@/lib/kv';
import { PARTNER_DEFAULTS, mergePartnerSettings } from '@/lib/partnerDefaults';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `Institution Partnerships | ${COMPANY.name}`,
  description: 'Partner with ILOC to recruit top-tier, rigorously screened international students from India. Join 400+ global universities trusting our 97% visa success rate.',
};

const DEFAULTS: PartnerPageSettings = PARTNER_DEFAULTS['institutions'];

function renderHeading(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? (
      <span key={i} style={{ background: 'linear-gradient(135deg,#B5FF00,#CCFF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {p.slice(2, -2)}
      </span>
    ) : p
  );
}

export default async function InstitutionsPartnerPage() {
  const kv = await getPartnerSettings('institutions').catch(() => null);
  const s: PartnerPageSettings = mergePartnerSettings('institutions', kv);

  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(150deg,#051A57 0%,#0C37A0 55%,#246DFF 100%)"
        breadcrumbLabel="Institutions"
        eyebrow={s.badge}
        eyebrowColor="#B5FF00"
        heading={renderHeading(s.heading)}
        paragraph={s.subheading}
        image={{ src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80&auto=format&fit=crop', alt: 'Diverse group of international students walking on a university campus' }}
        imagePosition="left"
        badge={{ value: s.stats[0]?.value ?? '97%', label: s.stats[0]?.label ?? 'Visa Success Rate' }}
        blobColor="#B5FF00"
      />

      {/* ── Content & Form Layout ── */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-jakarta font-extrabold text-3xl text-slate-900 mb-4">{s.bodyHeading}</h2>
                <div className="w-16 h-1 rounded-full mb-6" style={{ background: 'linear-gradient(90deg,#CCFF00,#D97706)' }} />
                <p className="font-jakarta text-slate-500 leading-relaxed">{s.bodyIntro}</p>
              </div>

              {/* Stat cards */}
              <div className="grid sm:grid-cols-2 gap-5">
                {s.stats.map((stat, i) => (
                  <div key={i} className="group bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-partner-100 transition-all duration-200">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-black text-lg transition-all duration-200 ${i % 2 === 0 ? 'bg-partner-50 text-partner-600 group-hover:bg-partner-600 group-hover:text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}`}>
                      {stat.value}
                    </div>
                    <h3 className="font-jakarta font-bold text-slate-800 mb-1.5">{stat.label}</h3>
                    <p className="font-jakarta text-sm text-slate-500 leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* List */}
              <div>
                <h3 className="font-jakarta font-bold text-xl text-slate-900 mb-4">{s.listHeading}</h3>
                <ul className="space-y-3 font-jakarta text-slate-600">
                  {s.listItems.map((item, i) => {
                    const [title, ...rest] = item.split(':');
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-partner-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-partner-600" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="text-sm leading-relaxed">{rest.length ? <><strong className="text-slate-700">{title}:</strong>{rest.join(':')}</> : item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="sticky top-8">
              <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-[80px] opacity-[0.06] pointer-events-none" style={{ background: '#65A30D' }} />
                <div className="absolute top-0 right-0 p-6 text-partner-300 opacity-30">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-partner-50 text-partner-600 text-xs font-semibold font-jakarta px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-partner-500 animate-pulse" />
                    Open for Partnerships
                  </div>
                  <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">{s.formHeading}</h3>
                  <p className="font-jakarta text-sm text-slate-400 mb-8">{s.formSubtext}</p>
                  <InstitutionsForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
