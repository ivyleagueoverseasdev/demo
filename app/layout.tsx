import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, Bruno_Ace_SC } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { COMPANY } from '@/lib/data';

const jakartaFont = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '800'],
  style:    ['normal', 'italic'],
  variable: '--font-jakarta',
  display:  'swap',
  preload:  true,
});

const dmFont = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-dm',
  display:  'swap',
  preload:  false,
});

const brunoFont = Bruno_Ace_SC({
  subsets:  ['latin'],
  weight:   ['400'],
  variable: '--font-bruno',
  display:  'swap',
  preload:  false,
});

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
    <html lang="en" className={`scroll-smooth ${jakartaFont.variable} ${dmFont.variable} ${brunoFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-jakarta antialiased bg-white text-slate-800" style={{ overflowX: 'hidden' }}>
        <Navbar />
        <main style={{ paddingTop: '242px' }}>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
