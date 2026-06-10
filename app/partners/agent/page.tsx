import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import AgentForm from './AgentForm';
import { getPartnerSettings } from '@/lib/kv';
import type { PartnerPageSettings } from '@/lib/kv';

export const metadata: Metadata = {
  title: `Agent & Franchisee Partnerships | ${COMPANY.name}`,
  description: 'Scale your overseas education business by partnering with ILOC. Access our 400+ university network, transparent commissions, and powerful CRM support.',
};

export const revalidate = 3600;
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DEFAULTS: PartnerPageSettings = {
  badge:       'B2B Franchise & Agent Network',
  heading:     'Scale Your **Consultancy** with ILOC.',
  subheading:  'Leverage our established brand, direct university tie-ups, and industry-leading CRM processing to multiply your revenue with absolute transparency.',
  bodyHeading: 'Empower Your Business',
  bodyIntro:   'The overseas education market is highly fragmented and competitive. Building direct relationships with top-tier universities takes years. By joining the ILOC Agent Network, you bypass the friction. You focus on recruiting students in your local market; we provide the portfolio, the processing power, and the payouts.',
  stats: [
    { value: '400+', label: 'Direct Tie-Ups',  desc: 'Offer your students immediate access to top universities across the globe without negotiating individual contracts.' },
    { value: '100%', label: 'Transparency',    desc: 'Clear commission structures, real-time application tracking via our CRM, and guaranteed on-time payouts.' },
  ],
  listHeading: 'Partner Benefits',
  listItems: [
    'Industry-Leading Revenue Share: Maximise your earnings with our highly competitive commission models.',
    'Dedicated Processing Team: Our expert back-office handles SOP reviews, application submissions, and visa prep.',
    'Marketing & Brand Support: Utilize the trusted ILOC brand equity to convert high-value leads locally.',
  ],
  formHeading: 'Apply for Agency Partner',
  formSubtext: 'Register your agency to get access to our commercial terms.',
};

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

export default async function AgentPartnerPage() {
  const kv = await getPartnerSettings('agent').catch(() => null);
  const s: PartnerPageSettings = kv
    ? { ...DEFAULTS, ...kv, stats: kv.stats?.length ? kv.stats : DEFAULTS.stats, listItems: kv.listItems?.length ? kv.listItems : DEFAULTS.listItems }
    : DEFAULTS;

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

              {/* Benefits list */}
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
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-[80px] opacity-[0.06] pointer-events-none" style={{ background: '#65A30D' }} />
                <div className="absolute top-0 right-0 p-6 text-partner-300 opacity-30">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-partner-50 text-partner-600 text-xs font-semibold font-jakarta px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-partner-500 animate-pulse" />
                    Accepting Applications
                  </div>
                  <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-1">{s.formHeading}</h3>
                  <p className="font-jakarta text-sm text-slate-400 mb-8">{s.formSubtext}</p>
                  <AgentForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
