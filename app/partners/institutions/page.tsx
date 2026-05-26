import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import InstitutionsForm from './InstitutionsForm';

export const metadata: Metadata = {
  title: `Institution Partnerships | ${COMPANY.name}`,
  description: 'Partner with ILOC to recruit top-tier, rigorously screened international students from India. Join 400+ global universities trusting our 97% visa success rate.',
};

export const revalidate = 3600;

export default function InstitutionsPartnerPage() {
  return (
    <main className="bg-white">
      {/* ── Hero Section (Dark Navy) ── */}
      <section className="relative bg-primary-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-xl relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="font-jakarta text-xs font-semibold text-amber-400 tracking-wide uppercase">Global University Network</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Recruit <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">High-Intent</span> Indian Students.
          </h1>
          <p className="font-jakarta text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Join over 400 prestigious global institutions that trust ILOC for rigorous student screening, authentic documentation, and a sustained 97% visa approval rate.
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
                <h2 className="font-jakarta font-extrabold text-3xl text-primary-900 mb-4">Why Partner with ILOC?</h2>
                <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-6" />
                <p className="font-jakarta text-slate-600 leading-relaxed">
                  As India's student mobility accelerates, universities face the challenge of volume versus quality. At Ivy League Overseas Consulting, we solve this by operating as an extension of your admissions office. We do not just process applications; we curate academic profiles.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 text-xl font-black">97%</div>
                  <h3 className="font-jakarta font-bold text-slate-900 mb-2">Visa Success Rate</h3>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed">Our meticulous financial and academic verification guarantees highly genuine students with exceptional visa conversion.</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-xl font-black">2.5k</div>
                  <h3 className="font-jakarta font-bold text-slate-900 mb-2">Alumni Network</h3>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed">A thriving ecosystem of successful placements across the US, UK, Canada, and Australia generating constant organic referrals.</p>
                </div>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-xl text-primary-900 mb-3">Our Commitment to Quality</h3>
                <ul className="space-y-3 font-jakarta text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Rigorous Academic Vetting:</strong> Direct verification of transcripts, test scores, and language proficiency.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Financial Authenticity:</strong> Strict pre-screening of funding sources before application submission.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span><strong>Volume & Scale:</strong> Strategic marketing campaigns ensuring a steady pipeline of diverse applicants.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Onboarding Form */}
            <div className="bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-lg relative">
              <div className="absolute top-0 right-0 p-6 text-slate-300 opacity-50">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Initiate Partnership</h3>
                <p className="font-jakarta text-sm text-slate-500 mb-8">Our institutional relations team will contact you within 24 hours.</p>

                <InstitutionsForm />
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
