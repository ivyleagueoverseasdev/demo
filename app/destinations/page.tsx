import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Study Destinations 2026 | USA, UK, Canada & More | ILOC',
  description:
    'Explore 2026 visa guides, scholarships and career pathways for 8 top study destinations — USA, UK, Canada, Australia, Ireland, New Zealand, Singapore and Europe. Expert advice from ILOC Pune.',
};

const FLAG_MAP: Record<string, string> = {
  'usa':         'us',
  'uk':          'gb',
  'canada':      'ca',
  'australia':   'au',
  'ireland':     'ie',
  'new-zealand': 'nz',
  'singapore':   'sg',
  'europe':      'eu',
};

export default function DestinationsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-xs text-white/50 font-jakarta mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span><span className="text-white/80">Destinations</span>
          </nav>
          <div className="max-w-3xl">
            <p className="font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">7+ Countries · 400+ Universities</p>
            <h1 className="font-jakarta font-extrabold text-white mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
              Where will you go?
            </h1>
            <p className="font-jakarta text-white/75 text-lg leading-relaxed">
              Each destination guide below includes 2026 visa updates, latest scholarship opportunities, career prospects and a detailed admission process overview.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-xl">
          <div className="space-y-6">
            {COUNTRIES.map((c) => (
              <Link key={c.code} href={`/destinations/${c.code}`}
                className="group card flex flex-col sm:flex-row overflow-hidden hover:-translate-y-0.5 block">
                {/* Flag panel */}
                <div className="sm:w-56 lg:w-72 h-44 sm:h-auto relative flex-shrink-0 overflow-hidden"
                  style={{ background: `linear-gradient(135deg,${c.color}20,${c.color}06)` }}>
                  <Image
                    src={`https://flagcdn.com/w640/${FLAG_MAP[c.code] ?? c.code}.png`}
                    alt={c.name} fill className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    sizes="300px" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
                      {c.flag}
                    </span>
                  </div>
                </div>

                {/* Info panel */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="font-jakarta font-bold text-primary-600 text-xl mb-1 group-hover:text-amber-600 transition-colors">{c.name}</h2>
                      <span className="font-jakarta text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${c.color}18`, color: c.color }}>
                        {c.unis} universities
                      </span>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      {[['Intake', c.intake], ['Avg Cost', c.avgCost]].map(([l, v]) => (
                        <div key={l} className="rounded-xl p-2.5 text-center bg-slate-50">
                          <div className="font-jakarta text-[8px] uppercase tracking-widest text-slate-400 mb-0.5">{l}</div>
                          <div className="font-jakarta font-bold text-xs text-slate-700">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="font-jakarta text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-jakarta text-xs text-slate-500">
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: c.color }}>✓</span>
                        {h}
                      </span>
                    ))}
                  </div>
                  <div className="font-jakarta text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform inline-block">
                    View 2026 Guide →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
