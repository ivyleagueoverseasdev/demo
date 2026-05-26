import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import AgentForm from './AgentForm';

export const metadata: Metadata = {
  title: `Agent & Franchisee Partnerships | ${COMPANY.name}`,
  description: 'Scale your overseas education business by partnering with ILOC. Access our 400+ university network, transparent commissions, and powerful CRM support.',
};

export const revalidate = 3600;

export default function AgentPartnerPage() {
  return (
    <main className="bg-white">
      {/* ── Hero Section (Dark Navy) ── */}
      <section className="relative bg-primary-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-xl relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="font-jakarta text-xs font-semibold text-amber-400 tracking-wide uppercase">B2B Franchise & Agent Network</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Consultancy</span> with ILOC.
          </h1>
          <p className="font-jakarta text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Leverage our established brand, direct university tie-ups, and industry-leading CRM processing to multiply your revenue with absolute transparency.
          </p>
        </div>
      </section>

      {/* ── Content & Form Layout ── */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Elite Copywriting */}
            <div className="space-y-8">
              <div>
                <h2 className="font-jakarta font-extrabold text-3xl text-primary-900 mb-4">Empower Your Business</h2>
                <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-6" />
                <p className="font-jakarta text-slate-600 leading-relaxed">
                  The overseas education market is highly fragmented and competitive. Building direct relationships with top-tier universities takes years. By joining the ILOC Agent Network, you bypass the friction. You focus on recruiting students in your local market; we provide the portfolio, the processing power, and the payouts.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-xl font-black">400+</div>
                  <h3 className="font-jakarta font-bold text-slate-900 mb-2">Direct Tie-Ups</h3>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed">Offer your students immediate access to top universities across the globe without negotiating individual contracts.</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-xl font-black">100%</div>
                  <h3 className="font-jakarta font-bold text-slate-900 mb-2">Transparency</h3>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed">Clear commission structures, real-time application tracking via our CRM, and guaranteed on-time payouts.</p>
                </div>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-xl text-primary-900 mb-3">Partner Benefits</h3>
                <ul className="space-y-3 font-jakarta text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Industry-Leading Revenue Share:</strong> Maximise your earnings with our highly competitive commission models.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Dedicated Processing Team:</strong> Our expert back-office handles SOP reviews, application submissions, and visa prep.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Marketing & Brand Support:</strong> Utilize the trusted ILOC brand equity to convert high-value leads locally.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Onboarding Form */}
            <div className="bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-lg relative">
              <div className="absolute top-0 right-0 p-6 text-slate-300 opacity-50">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              </div>
              <div className="relative z-10">
                <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Apply for Agency Partner</h3>
                <p className="font-jakarta text-sm text-slate-500 mb-8">Register your agency to get access to our commercial terms.</p>

                <AgentForm />
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
