'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANY, COUNTRIES, buildWhatsAppLink } from '@/lib/data';

const QUICK_LINKS = [
  { label: 'About Us',           href: '/about'        },
  { label: 'Our Services',       href: '/services'     },
  { label: 'Destinations',       href: '/destinations' },
  { label: 'Test Prep & Events', href: '/events'       },
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
  const [destLinks, setDestLinks] = useState(DEST_LINKS);
  // Bottom bar — admin-editable via /admin/global (Footer section)
  const [bottomBar, setBottomBar] = useState({
    copyright:  `© ${COMPANY.since}–${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.`,
    privacyUrl: '/contact',
    termsUrl:   '/contact',
    foundedBy:  `Founded by ${COMPANY.founder} · Pune, India`,
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
        // Effective destination list (admin add/hide aware)
        if (Array.isArray(d?.countries) && d.countries.length) {
          setDestLinks(d.countries.slice(0, 8).map((c: { code: string; name: string }) => ({
            label: c.name,
            href:  `/destinations/${c.code}`,
          })));
        }
        // Empty fields fall back to the defaults (matches the admin hints);
        // a "-" in Founded By hides that line entirely.
        setBottomBar(b => ({
          copyright:  gs?.footerCopyright?.trim()  || b.copyright,
          privacyUrl: gs?.footerPrivacyUrl?.trim() || b.privacyUrl,
          termsUrl:   gs?.footerTermsUrl?.trim()   || b.termsUrl,
          foundedBy:  gs?.footerFoundedBy?.trim() === '-'
            ? ''
            : (gs?.footerFoundedBy?.trim() || b.foundedBy),
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="text-slate-700" style={{ backgroundColor: '#65D906' }}>

      {/* ── Main grid ── */}
      <div className="container-xl pt-8 pb-6 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

        {/* Contact column — no logo or brand name */}
        <div className="col-span-2 md:col-span-3">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-4 tracking-wide uppercase">Get in Touch</h4>
          <div className="space-y-3 text-sm">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors">
              <span className="text-base">📞</span><span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors">
              <span className="text-base">✉️</span><span>{contact.email}</span>
            </a>
            <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-slate-700 hover:text-amber-700 transition-colors">
              <span className="text-base flex-shrink-0 mt-0.5">📍</span>
              <span className="leading-relaxed">{contact.address}</span>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-4 tracking-wide uppercase">Company</h4>
          <ul className="space-y-2.5">
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
        <div className="col-span-1 md:col-span-3">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-4 tracking-wide uppercase">Services</h4>
          <ul className="space-y-2.5">
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
        <div className="col-span-2 md:col-span-3">
          <h4 className="font-jakarta font-bold text-slate-900 text-sm mb-4 tracking-wide uppercase">Destinations</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {destLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-jakarta text-sm text-slate-700 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-slate-900/10">
            <Link href="/destinations" className="font-jakarta text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors">
              View all destinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar — admin-editable via /admin/global → Footer section ── */}
      <div className="border-t border-slate-900/10">
        <div className="container-xl py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
          <p>{bottomBar.copyright}</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href={bottomBar.privacyUrl} className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href={bottomBar.termsUrl} className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            {bottomBar.foundedBy && <span>{bottomBar.foundedBy}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
