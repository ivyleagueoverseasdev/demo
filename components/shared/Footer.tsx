import Link from 'next/link';
import { COMPANY, COUNTRIES } from '@/lib/data';

const LINKS = {
  Company: [
    { label: 'About Us',         href: '/about'        },
    { label: 'Our Services',     href: '/services'      },
    { label: 'Destinations',     href: '/destinations'  },
    { label: 'Testimonials',     href: '/#testimonials' },
    { label: 'Contact Us',       href: '/contact'       },
    { label: 'Admin',            href: '/admin'         },
  ],
  Destinations: COUNTRIES.map(c => ({ label: `${c.flag} ${c.name}`, href: `/destinations/${c.code}` })),
  Services: [
    { label: 'University Admissions',  href: '/services' },
    { label: 'Visa Assistance',        href: '/services' },
    { label: 'Test Preparation',       href: '/services' },
    { label: 'Scholarship Guidance',   href: '/services' },
    { label: 'Profile Building',       href: '/services' },
    { label: 'Free Counselling',       href: '/contact'  },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white/80">
      {/* CTA strip */}
      <div className="bg-primary-600 border-b border-white/10">
        <div className="container-xl py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-jakarta font-bold text-xl text-white">Ready to study abroad?</p>
            <p className="text-white/70 text-sm mt-1">Book a free 30-minute counselling session — zero pressure, zero fees.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-bold text-sm px-6 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-amber">
              Book Free Session →
            </Link>
            <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-white border border-white/20 hover:bg-white/10 transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-xl py-14 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="font-jakarta font-black text-white text-[11px]">IL</span>
            </div>
            <span className="font-jakarta font-bold text-white text-lg">ILOC</span>
          </div>
          <p className="text-sm leading-6 text-white/60 mb-5 max-w-xs">
            {COMPANY.tagline} Trusted by 2,500+ students since {COMPANY.since}.
          </p>
          <div className="space-y-2 text-sm">
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span>📞</span>{COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span>✉</span>{COMPANY.email}
            </a>
            <a href={COMPANY.mapsLink} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-2 text-white/60 hover:text-amber-400 transition-colors">
              <span className="flex-shrink-0 mt-0.5">📍</span>
              <span>{COMPANY.address}</span>
            </a>
          </div>
        </div>

        {/* Links */}
        {(Object.entries(LINKS) as [string, { label: string; href: string }[]][]).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-jakarta font-semibold text-white text-sm mb-4">{title}</h4>
            <ul className="space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}
                    className="font-jakarta text-sm text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {COMPANY.since}–{new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>Founded by <span className="text-white/60">{COMPANY.founder}</span> · Pune, India</p>
        </div>
      </div>
    </footer>
  );
}
