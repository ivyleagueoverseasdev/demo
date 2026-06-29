'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, COUNTRIES, buildWhatsAppLink } from '@/lib/data';

const QUICK_LINKS = [
  { label: 'About Us',           href: '/about'        },
  { label: 'Our Services',       href: '/services'     },
  { label: 'Destinations',       href: '/destinations' },
  { label: 'Events & Classes',   href: '/events'       },
  { label: 'News & Updates',     href: '/news'         },
  { label: 'Contact Us',         href: '/contact'      },
];

const SERVICE_LINKS = [
  { label: 'University Admissions', href: '/services' },
  { label: 'Visa Assistance',       href: '/services' },
  { label: 'Test Prep (GRE/IELTS)', href: '/events?type=classes' },
  { label: 'Scholarship Guidance',  href: '/services' },
  { label: 'Profile Building',      href: '/services' },
  { label: 'Free Counselling',      href: '/contact'  },
];

// Top 8 destinations for footer
const DEST_LINKS = COUNTRIES.slice(0, 8).map(c => ({
  label: c.name,
  href:  `/destinations/${c.code}`,
}));

export default function Footer() {
  // Admin-editable contact details & WhatsApp link (KV via /api/content),
  // falling back to the hardcoded COMPANY constants until loaded.
  const [contact, setContact] = useState({
    phone:    COMPANY.phone,
    email:    COMPANY.email,
    address:  COMPANY.address,
    mapsLink: COMPANY.mapsLink,
    wa:       buildWhatsAppLink(COMPANY.wa, COMPANY.whatsappMessage),
  });

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        const cd = d?.companyDetails;
        const gs = d?.globalSettings;
        const waBase = cd?.whatsapp || gs?.whatsappUrl || COMPANY.wa;
        const waMsg  = gs?.whatsappMessage || COMPANY.whatsappMessage;
        setContact(c => ({
          phone:    cd?.phone    || c.phone,
          email:    cd?.email    || c.email,
          address:  cd?.address  || c.address,
          mapsLink: cd?.mapsLink || c.mapsLink,
          wa:       buildWhatsAppLink(waBase, waMsg),
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="text-slate-700" style={{ backgroundColor: '#C7FBA0' }}>

      {/* ── Main grid ── */}
      <div className="container-xl pt-8 pb-6 grid grid-cols-2 md:grid-cols-12 gap-6 lg:gap-10">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-slate-900/15">
              <Image src="/logo3.png" alt="ILOC" width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-jakarta font-extrabold text-slate-900 text-xs leading-tight">IVY LEAGUE</p>
              <p className="font-jakarta font-extrabold text-slate-900 text-xs leading-tight">OVERSEAS CONSULTING</p>
            </div>
          </div>
          <p className="font-jakarta text-xs leading-6 text-slate-700 mb-4 max-w-xs">
            Trusted by 10,000+ students across 12 countries for 25+ years of excellence.
          </p>
          <div className="space-y-2 text-xs">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
              <span>📞</span><span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
              <span>✉️</span><span>{contact.email}</span>
            </a>
            <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-slate-700 hover:text-amber-700 transition-colors">
              <span className="flex-shrink-0 mt-0.5">📍</span>
              <span className="leading-relaxed">{contact.address}</span>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-slate-900 text-xs mb-3 tracking-wide uppercase">Company</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-xs text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-slate-900 text-xs mb-3 tracking-wide uppercase">Services</h4>
          <ul className="space-y-2">
            {SERVICE_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-xs text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div className="col-span-2 md:col-span-4">
          <h4 className="font-jakarta font-bold text-slate-900 text-xs mb-3 tracking-wide uppercase">Destinations</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {DEST_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-xs text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-900/10">
            <Link href="/destinations" className="font-jakarta text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors">
              View all destinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-900/10">
        <div className="container-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {COMPANY.since}–{new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <span>Founded by <span className="text-slate-700">{COMPANY.founder}</span> · Pune, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
