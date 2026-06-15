import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import ReferralForm from './ReferralForm';
import PageHero from '@/components/shared/PageHero';
import { getPartnerSettings } from '@/lib/kv';
import type { PartnerPageSettings } from '@/lib/kv';
import { PARTNER_DEFAULTS, mergePartnerSettings } from '@/lib/partnerDefaults';

export const metadata: Metadata = {
  title: `Student Referral Register | ${COMPANY.name}`,
  description: 'Refer a friend or family member to ILOC and earn rewards. A seamless process ensuring the people you care about receive world-class education consulting.',
};

export const revalidate = 3600;
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DEFAULTS: PartnerPageSettings = PARTNER_DEFAULTS['referral'];

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

const STEP_BG   = ['bg-partner-600', 'bg-amber-500',   'bg-emerald-500'];
const STEP_RING = ['ring-partner-200','ring-amber-200', 'ring-emerald-200'];

export default async function ReferralPartnerPage() {
  const kv = await getPartnerSettings('referral').catch(() => null);
  const s: PartnerPageSettings = mergePartnerSettings('referral', kv);

  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <PageHero
        gradient="linear-gradient(125deg,#07257C 0%,#1249C4 50%,#7AADFF 100%)"
        breadcrumbLabel="Alumni & Referrals"
        eyebrow={s.badge}
        eyebrowColor="#A3E635"
        heading={renderHeading(s.heading)}
        paragraph={s.subheading}
        image={{ src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80&auto=format&fit=crop', alt: 'Two people shaking hands over a successful referral agreement' }}
        badge={{ value: '60%', label: 'Students placed via referrals' }}
        blobColor="#A3E635"
      />

      {/* ── Content & Form Layout ── */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <div className="space-y-8">
              <div>
                <h2 className="font-jakarta font-extrabold text-3xl text-slate-900 mb-4">{s.bodyHeading}</h2>
                <div className="w-16 h-1 rounded-full mb-6" style={{ background: 'linear-gradient(90deg,#CCFF00,#D97706)' }} />
                <p className="font-jakarta text-slate-500 leading-relaxed">{s.bodyIntro}</p>
              </div>

              {/* Steps — numbered timeline style */}
              <div className="relative">
                <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-100" />
                <div className="space-y-4">
                  {s.stats.map((stat, i) => {
                    const bg   = STEP_BG[i   % STEP_BG.length];
                    const ring = STEP_RING[i % STEP_RING.length];
                    return (
                      <div key={i} className="relative flex items-start gap-5 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className={`z-10 w-10 h-10 rounded-full ${bg} ring-4 ${ring} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                          {stat.value}
                        </div>
                        <div>
                          <h3 className="font-jakarta font-bold text-slate-800">{stat.label}</h3>
                          <p className="font-jakarta text-sm text-slate-500 mt-0.5 leading-relaxed">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rewards box */}
              <div className="bg-partner-50 border border-partner-100 p-6 rounded-2xl">
                <h3 className="font-jakarta font-bold text-lg text-partner-900 mb-3">{s.listHeading}</h3>
                <ul className="space-y-2.5">
                  {s.listItems.map((item, i) => {
                    const [title, ...rest] = item.split(':');
                    return (
                      <li key={i} className="flex items-start gap-3 font-jakarta text-sm text-slate-600">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-partner-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-partner-600" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span>{rest.length ? <><strong className="text-slate-700">{title}:</strong>{rest.join(':')}</> : item}</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-partner-50 text-partner-600 text-xs font-semibold font-jakarta px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-partner-500 animate-pulse" />
                    Earn Rewards
                  </div>
                  <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">{s.formHeading}</h3>
                  <p className="font-jakarta text-sm text-slate-400 mb-8">{s.formSubtext}</p>
                  <ReferralForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
