'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, COUNTRIES, buildWhatsAppLink } from '@/lib/data';

const NAV_LINKS = [
  { label: 'About Us',           href: '/about'        },
  { label: 'Services',           href: '/services'     },
  { label: 'Destinations',       href: '/destinations' },
  { label: 'Test Prep & Events', href: '/events'       },
  { label: 'News',               href: '/news'         },
  { label: 'Partner With Us',    href: '/partners'     },
  { label: 'Contact',            href: '/contact'      },
];

const DEST_LINKS = COUNTRIES.slice(0, 8).map(c => ({
  label: c.name,
  href:  `/destinations/${c.code}`,
}));

export default function Footer() {
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
    <footer style={{ backgroundColor: '#C7FBA0' }} className="text-slate-800">

      {/* ── Row 1: Brand | Nav links | Destinations | Contact ── */}
      <div className="container-xl py-3 flex flex-wrap items-start gap-x-8 gap-y-3 border-b border-slate-900/10">

        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-900/15 flex-shrink-0">
            <Image src="/logo3.png" alt="ILOC" width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-jakarta font-extrabold text-slate-900 text-[10px] leading-tight">IVY LEAGUE</p>
            <p className="font-jakarta font-extrabold text-slate-900 text-[10px] leading-tight">OVERSEAS CONSULTING</p>
          </div>
        </div>

        {/* Vertical divider (desktop) */}
        <div className="hidden lg:block w-px self-stretch bg-slate-900/10" />

        {/* Navigation links */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-jakarta text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pages</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className="font-jakarta text-[10px] text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px self-stretch bg-slate-900/10" />

        {/* Destinations */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-jakarta text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destinations</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            {DEST_LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className="font-jakarta text-[10px] text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px self-stretch bg-slate-900/10" />

        {/* Contact — pushed to right on desktop */}
        <div className="flex flex-col gap-0.5 lg:ml-auto">
          <p className="font-jakarta text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact</p>
          <a href={`tel:${contact.phone}`}
            className="font-jakarta text-[10px] text-slate-700 hover:text-slate-900 transition-colors">
            📞 {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`}
            className="font-jakarta text-[10px] text-slate-700 hover:text-slate-900 transition-colors">
            ✉️ {contact.email}
          </a>
          <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer"
            className="font-jakarta text-[10px] text-slate-700 hover:text-amber-700 transition-colors max-w-[200px] leading-relaxed">
            📍 {contact.address}
          </a>
        </div>
      </div>

      {/* ── Row 2: Legal strip ── */}
      <div className="container-xl py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-slate-600">
        <p>© {COMPANY.since}–{new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/contact" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <span className="text-slate-400">·</span>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <span className="text-slate-400">·</span>
          <span>Founded by <span className="text-slate-700">{COMPANY.founder}</span> · Pune, India</span>
        </div>
      </div>
    </footer>
  );
}
