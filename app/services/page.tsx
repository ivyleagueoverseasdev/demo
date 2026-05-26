import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY, SERVICES } from '@/lib/data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Services | Overseas Education Consulting | ILOC Pune',
  description:
    'End-to-end study abroad services — undergraduate & postgraduate admissions, profile building, IELTS/GRE coaching, visa preparation and pre-departure support. 97% visa approval rate.',
};

const EXTRA_SERVICES = [
  { id:'sop',   icon:'✍️', title:'SOP & LOR Writing',        desc:'Professionally crafted Statements of Purpose and Letters of Recommendation tailored to each university and program.' },
  { id:'accom', icon:'🏠', title:'Accommodation Guidance',   desc:'Pre-arrival support to find safe, affordable student housing near your campus in any target country.' },
  { id:'forex', icon:'💱', title:'Forex & Banking Setup',    desc:'Currency exchange guidance, student banking accounts and international money transfer support for seamless transitions.' },
  { id:'career',icon:'💼', title:'Career Coaching',          desc:'Resume review, interview preparation and internship search support specifically for international students in 2026.' },
];

const INSTITUTE_SERVICES = [
  { icon:'🏫', title:'Student Pipeline',    desc:'Access a verified pool of qualified Indian students seeking admission at your institution.' },
  { icon:'📊', title:'Marketing Support',   desc:'ILOC promotes your institution through counselling sessions, education fairs and digital channels.' },
  { icon:'🤝', title:'MOU Partnerships',    desc:'Formalise the relationship with a signed MOU defining clear commission and referral terms.' },
];

export default function ServicesPage() {
  const all = [...SERVICES, ...EXTRA_SERVICES];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-xs text-white/50 font-jakarta mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span><span className="text-white/80">Services</span>
          </nav>
          <div className="max-w-3xl">
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">What We Offer</p>
            <h1 className="font-jakarta font-extrabold text-white mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
              Complete services for<br /><span className="text-amber-400">every step of your journey.</span>
            </h1>
            <p className="font-jakarta text-white/75 text-lg leading-relaxed max-w-2xl">
              From university shortlisting to visa clearance — our end-to-end process is designed so you never have to figure anything out alone.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="divider-blue mb-4" />
          <h2 className="font-jakarta font-extrabold text-primary-600 mb-10" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Student Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {all.map((s, i) => (
              <Link key={s.id} href="/contact"
                className="group card p-6 hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl mb-5
                                group-hover:bg-primary-600 transition-colors duration-300">
                  <span>{s.icon}</span>
                </div>
                <h3 className="font-jakarta font-bold text-slate-800 text-[14px] mb-2 group-hover:text-primary-600 transition-colors">
                  {s.title}
                </h3>
                <p className="font-jakarta text-xs text-slate-500 leading-relaxed flex-1">{s.desc}</p>
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
              For Institutes
            </h2>
            <p className="font-jakarta text-slate-500 mt-3">Partner with ILOC to access a verified student pipeline across India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {INSTITUTE_SERVICES.map(s => (
              <div key={s.title} className="card p-7">
                <div className="text-3xl mb-5">{s.icon}</div>
                <h3 className="font-jakarta font-bold text-primary-600 text-base mb-2">{s.title}</h3>
                <p className="font-jakarta text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="card p-6 border-amber-200 bg-amber-50/50">
            <h3 className="font-jakarta font-bold text-amber-600 text-base mb-2">Interested in a B2B partnership?</h3>
            <p className="font-jakarta text-sm text-slate-600 mb-4">Contact us to discuss MOU terms, commission structures and student pipeline access.</p>
            <Link href="/contact" className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-flex">
              Enquire About Partnership →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-600 text-white">
        <div className="container-xl text-center">
          <h2 className="font-jakarta font-extrabold text-white mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            Start with a free 30-min session.
          </h2>
          <p className="font-jakarta text-white/70 mb-8 max-w-lg mx-auto">Zero pressure. Direct founder access. Personalised roadmap.</p>
          <Link href="/contact" className="btn-primary text-sm px-8 py-3.5 rounded-xl">Book Free Counselling →</Link>
        </div>
      </section>
    </div>
  );
}
