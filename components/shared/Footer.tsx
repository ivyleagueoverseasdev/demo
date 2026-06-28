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

      {/* ── CTA Strip ── */}
      <div className="border-b border-slate-900/10">
        <div className="container-xl py-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-jakarta font-bold text-xl md:text-2xl text-slate-900 leading-tight">
              Ready to study abroad?
            </p>
            <p className="text-slate-700 text-sm md:text-base mt-1">
              Book a free 30-minute counselling session — zero pressure, zero fees.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-bold text-sm px-6 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg"
            >
              Book Free Session →
            </Link>
            <a
              href={contact.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-slate-900 border border-slate-900/20 hover:bg-slate-900/5 transition-colors"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container-xl pt-10 pb-7 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-900/15">
              <Image src="/logo3.png" alt="ILOC" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-jakarta font-extrabold text-slate-900 text-sm leading-tight">IVY LEAGUE</p>
              <p className="font-jakarta font-extrabold text-slate-900 text-sm leading-tight">OVERSEAS CONSULTING</p>
            </div>
          </div>
          <p className="font-jakarta text-sm leading-7 text-slate-700 mb-6 max-w-xs">
            {COMPANY.tagline} Trusted by 10,000+ students across 12 countries for 25+ years of excellence.
          </p>

          {/* Contact */}
          <div className="space-y-2.5 text-sm">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors">
              <span className="text-base">📞</span>
              <span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors">
              <span className="text-base">✉️</span>
              <span>{contact.email}</span>
            </a>
            <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-slate-700 hover:text-amber-700 transition-colors">
              <span className="text-base flex-shrink-0 mt-0.5">📍</span>
              <span className="leading-relaxed">{contact.address}</span>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-5 tracking-wide">Company</h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-5 tracking-wide">Services</h4>
          <ul className="space-y-3">
            {SERVICE_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div className="col-span-2 md:col-span-4">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-5 tracking-wide">Study Destinations</h4>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {DEST_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-slate-900/10">
            <Link href="/destinations" className="font-jakarta text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors">
              View all destinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-900/10">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {COMPANY.since}–{new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <p>Founded by <span className="text-slate-700">{COMPANY.founder}</span> · Pune, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
