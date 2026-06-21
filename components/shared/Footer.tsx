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

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
        <div className="container-xl py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-jakarta font-bold text-xl text-slate-900 leading-tight">
              Ready to study abroad?
            </p>
            <p className="text-slate-700 text-sm mt-1">
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
      <div className="container-xl pt-14 pb-10 grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-14">

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

          {/* WhatsApp CTA */}
          <a
            href={contact.wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="mt-6 inline-flex items-center gap-2.5 font-jakarta font-bold text-sm text-white px-5 py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
          >
            {WHATSAPP_ICON}
            Chat on WhatsApp
          </a>
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

      {/* ── Trust badges ── */}
      <div className="border-t border-slate-900/10">
        <div className="container-xl py-5 flex flex-wrap items-center justify-center gap-6">
          {[
            { num: '10,000+', label: 'Students Placed' },
            { num: '97%',     label: 'Visa Approval'   },
            { num: '25+',     label: 'Years Active'     },
            { num: '12',      label: 'Countries'        },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-jakarta font-extrabold text-slate-900 text-sm">{s.num}</span>
              <span className="font-jakarta text-xs text-slate-600">{s.label}</span>
            </div>
          ))}
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
