import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import ReferralForm from './ReferralForm';
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
      <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
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
      <section className="relative text-white overflow-hidden py-24 sm:py-32" style={{ background: 'linear-gradient(135deg,#4D7C0F 0%,#3F6212 60%,#1A2E05 100%)' }}>
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-xl relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span className="font-jakarta text-xs font-semibold text-white/90 tracking-wide uppercase">{s.badge}</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            {renderHeading(s.heading)}
          </h1>
          <p className="font-jakarta text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {s.subheading}
          </p>
        </div>
      </section>

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
