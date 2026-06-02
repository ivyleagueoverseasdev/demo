/**
 * (public) route group layout.
 *
 * This layout applies to all routes placed inside app/(public)/.
 * The parentheses mean the segment name is NOT included in the URL —
 * app/(public)/about/page.tsx is served at /about, not /public/about.
 *
 * The root app/layout.tsx already provides Navbar, Footer, and fonts for
 * all public pages. This layout adds public-specific metadata and
 * structured data that every public page should inherit.
 *
 * Architecture note:
 *   app/layout.tsx          → root shell (fonts, Navbar, Footer, WhatsApp button)
 *   app/(public)/layout.tsx → public-page defaults (SEO, structured data)
 *   app/admin/layout.tsx    → admin shell (sidebar, auth gate) — overrides root
 */

import type { Metadata } from 'next';
import { COMPANY } from '@/lib/data';

export const metadata: Metadata = {
  metadataBase: new URL('https://ivyleagueoverseas.com'),
  title: {
    default:  `${COMPANY.short} | Ivy League Overseas Consulting`,
    template: `%s | ${COMPANY.short}`,
  },
  description:
    'Premium overseas education consulting from Pune. 10,000+ students placed, 97% visa approval, 25+ years expertise. Free 30-min counselling for USA, UK, Canada, Australia and more.',
  keywords: [
    'study abroad consultancy Pune',
    'overseas education consultant India',
    'USA student visa Pune',
    'study in Canada from India 2026',
    'IELTS coaching Pune',
    'university admissions consultant',
    'GRE coaching Pune',
    'scholarship guidance India',
  ],
  authors:  [{ name: COMPANY.founder }],
  creator:  COMPANY.name,
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    siteName:    COMPANY.name,
    title:       'Ivy League Overseas Consulting | Study Abroad from Pune',
    description: 'Premium overseas education consulting. 10,000+ students placed, 97% visa approval. Free counselling available.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ivy League Overseas Consulting | Study Abroad from Pune',
    description: '10,000+ students placed. 97% visa approval. 25+ years expertise.',
  },
  robots:     { index: true, follow: true },
  alternates: { canonical: 'https://ivyleagueoverseas.com' },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Structured data — Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':   'https://schema.org',
            '@type':      'EducationalOrganization',
            name:         COMPANY.name,
            alternateName: COMPANY.short,
            url:          'https://ivyleagueoverseas.com',
            logo:         'https://ivyleagueoverseas.com/logo2.png',
            telephone:    COMPANY.phone,
            email:        COMPANY.email,
            address: {
              '@type':           'PostalAddress',
              streetAddress:     COMPANY.address,
              addressLocality:   'Pune',
              addressRegion:     'Maharashtra',
              addressCountry:    'IN',
            },
            description: 'Premium overseas education consulting from Pune. 10,000+ students placed over 25+ years.',
            foundingDate: String(COMPANY.since),
          }),
        }}
      />
      {children}
    </>
  );
}
