import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import FloatingActions from '@/components/shared/FloatingActions';
import { PageTracker } from '@/components/shared/PageTracker';
import { COMPANY } from '@/lib/data';

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.short} | Ivy League Overseas Consulting | Study Abroad from Pune`,
    template: `%s | ${COMPANY.short}`,
  },
  description:
    'Premium overseas education consulting from Pune. 10,000+ students placed over 25+ years, 97% visa approval rate. Free 30-min counselling. USA, UK, Canada, Australia & more.',
  keywords: [
    'study abroad consultancy Pune',
    'overseas education consultant India',
    'USA student visa Pune',
    'study in Canada from India 2026',
    'IELTS coaching Pune',
    'university admissions consultant',
  ],
  authors:  [{ name: COMPANY.founder }],
  creator:  COMPANY.name,
  icons: {
    icon:     [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/favicon.ico',
    apple:    [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type:        'website',
    siteName:    COMPANY.name,
    title:       'Ivy League Overseas Consulting | Study Abroad from Pune',
    description: 'Premium overseas education consulting. 10,000+ students placed, 97% visa approval. Free counselling available.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#CCFF00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Fonts — loaded via <link> so next/font/google is not needed.
            next/font/google initialises at module load time and is incompatible
            with @cloudflare/next-on-pages v1.13.16 + Next.js 15 Edge Runtime. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Bruno+Ace+SC:wght@400&family=Oswald:wght@400;500;600;700&display=swap"
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-jakarta antialiased bg-white text-slate-800" style={{ overflowX: 'hidden' }}>
        <PageTracker />
        <Navbar />
        {/*
          .site-main (globals.css): padding-top = var(--header-h) + var(--ticker-h).
          --header-h is 130px on mobile / 242px from lg up (info bar + brand
          row, + nav row at lg). --ticker-h is 0 unless the admin-enabled
          scrolling announcement ticker is currently showing (Navbar.tsx sets
          it live), so the page never sits behind the fixed header in either
          state and there's no permanent gap when the ticker is off.
          overflow-x-hidden guards every page against accidental horizontal bleed.
        */}
        <main className="site-main overflow-x-hidden">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
