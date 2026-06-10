'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, COUNTRIES } from '@/lib/data';

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
  label: `${c.flag} ${c.name}`,
  href:  `/destinations/${c.code}`,
}));

const SOCIAL = (links: { wa: string; instagram: string; linkedIn: string }) => [
  {
    label: 'WhatsApp',
    href:  links.wa,
    icon:  (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  links.instagram,
    icon:  (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href:  links.linkedIn,
    icon:  (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  // Admin-editable contact details & social links (KV via /api/content),
  // falling back to the hardcoded COMPANY constants until loaded.
  const [contact, setContact] = useState({
    phone:    COMPANY.phone,
    email:    COMPANY.email,
    address:  COMPANY.address,
    mapsLink: COMPANY.mapsLink,
    wa:       COMPANY.wa,
  });
  const [links, setLinks] = useState({
    wa:        COMPANY.wa,
    instagram: 'https://instagram.com/ivyleagueoverseas',
    linkedIn:  'https://linkedin.com/company/ivyleagueoverseas',
  });

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        const cd = d?.companyDetails;
        const gs = d?.globalSettings;
        if (cd) {
          setContact(c => ({
            phone:    cd.phone    || c.phone,
            email:    cd.email    || c.email,
            address:  cd.address  || c.address,
            mapsLink: cd.mapsLink || c.mapsLink,
            wa:       cd.whatsapp || c.wa,
          }));
        }
        if (gs || cd) {
          setLinks(l => ({
            wa:        gs?.whatsappUrl || cd?.whatsapp || l.wa,
            instagram: gs?.instagram   || l.instagram,
            linkedIn:  gs?.linkedIn    || l.linkedIn,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const social = SOCIAL(links);

  return (
    <footer className="bg-slate-900 text-white/75">

      {/* ── CTA Strip ── */}
      <div className="bg-gradient-to-r from-lime-700 to-lime-600 border-b border-white/10">
        <div className="container-xl py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-jakarta font-bold text-xl text-white leading-tight">
              Ready to study abroad?
            </p>
            <p className="text-white/75 text-sm mt-1">
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
              className="inline-flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-6 py-3 rounded-xl text-white border border-white/25 hover:bg-white/10 transition-colors"
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
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
              <Image src="/logo2.png" alt="ILOC" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="font-jakarta font-extrabold text-white text-sm leading-tight">IVY LEAGUE</p>
              <p className="font-jakarta font-extrabold text-white text-sm leading-tight">OVERSEAS CONSULTING</p>
            </div>
          </div>
          <p className="font-jakarta text-sm leading-7 text-white/55 mb-6 max-w-xs">
            {COMPANY.tagline} Trusted by 10,000+ students across 12 countries for 25+ years of excellence.
          </p>

          {/* Contact */}
          <div className="space-y-2.5 text-sm">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-white/55 hover:text-white transition-colors">
              <span className="text-base">📞</span>
              <span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-white/55 hover:text-white transition-colors">
              <span className="text-base">✉️</span>
              <span>{contact.email}</span>
            </a>
            <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-white/55 hover:text-amber-400 transition-colors">
              <span className="text-base flex-shrink-0 mt-0.5">📍</span>
              <span className="leading-relaxed">{contact.address}</span>
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3 mt-6">
            {social.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-white text-sm mb-5 tracking-wide">Company</h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-white/55 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-jakarta font-bold text-white text-sm mb-5 tracking-wide">Services</h4>
          <ul className="space-y-3">
            {SERVICE_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-white/55 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div className="col-span-2 md:col-span-4">
          <h4 className="font-jakarta font-bold text-white text-sm mb-5 tracking-wide">Study Destinations</h4>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {DEST_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-white/55 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-white/10">
            <Link href="/destinations" className="font-jakarta text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              View all destinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="border-t border-white/8">
        <div className="container-xl py-5 flex flex-wrap items-center justify-center gap-6">
          {[
            { num: '10,000+', label: 'Students Placed' },
            { num: '97%',     label: 'Visa Approval'   },
            { num: '25+',     label: 'Years Active'     },
            { num: '12',      label: 'Countries'        },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="font-jakarta font-extrabold text-white text-sm">{s.num}</span>
              <span className="font-jakarta text-xs text-white/40">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/8">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <p>© {COMPANY.since}–{new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <p>Founded by <span className="text-white/50">{COMPANY.founder}</span> · Pune, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
