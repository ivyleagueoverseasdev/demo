import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';
import ReferralForm from './ReferralForm';

export const metadata: Metadata = {
  title: `Student Referral Register | ${COMPANY.name}`,
  description: 'Refer a friend or family member to ILOC and earn rewards. A seamless process ensuring the people you care about receive world-class education consulting.',
};

export const revalidate = 3600;

export default function ReferralPartnerPage() {
  return (
    <main className="bg-white">
      {/* ── Hero Section (Dark Navy) ── */}
      <section className="relative bg-primary-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-xl relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="font-jakarta text-xs font-semibold text-amber-400 tracking-wide uppercase">ILOC Alumni & Student Network</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
            Share Success. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Earn Rewards.</span>
          </h1>
          <p className="font-jakarta text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Over 60% of our students come through referrals. Help your friends navigate their study abroad journey with Pune's most trusted consultants, and get rewarded for every successful enrollment.
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
                <h2 className="font-jakarta font-extrabold text-3xl text-primary-900 mb-4">How It Works</h2>
                <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-6" />
                <p className="font-jakarta text-slate-600 leading-relaxed">
                  We believe that the best endorsement of our premium consulting services is the success of our students. If you or someone you know has benefited from our expertise, share the advantage. The process is completely transparent and seamless.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-900">Submit Referral</h3>
                    <p className="font-jakarta text-sm text-slate-500 mt-1">Fill out the quick form with your friend's details.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-900">Free Consultation</h3>
                    <p className="font-jakarta text-sm text-slate-500 mt-1">Our expert team contacts them for a complimentary profile evaluation.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-900">Earn Rewards</h3>
                    <p className="font-jakarta text-sm text-slate-500 mt-1">Once they successfully enroll, your referral reward is instantly processed.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-jakarta font-bold text-lg text-primary-900 mb-2">Exclusive Alumni Rewards</h3>
                <p className="font-jakarta text-sm text-slate-600">
                  Are you a past ILOC student? We offer exclusive monetary rewards and premium gifts for our alumni network. Connect with your counsellor to learn more about the alumni-tier benefits.
                </p>
              </div>
            </div>

            {/* Right: Onboarding Form */}
            <div className="bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-lg relative">
              <div className="absolute top-0 right-0 p-6 text-slate-300 opacity-50">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              </div>
              <div className="relative z-10">
                <h3 className="font-jakarta font-extrabold text-2xl text-slate-900 mb-2">Register a Referral</h3>
                <p className="font-jakarta text-sm text-slate-500 mb-8">Enter the details below. We will handle the rest.</p>

                <ReferralForm />
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
