import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.short} | Ivy League Overseas Consulting | Study Abroad from Pune`,
    template: `%s | ${COMPANY.short}`,
  },
  description:
    'Premium overseas education consulting from Pune. 2,500+ students placed, 97% visa approval rate. Free 30-min counselling. USA, UK, Canada, Australia & more.',
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
    description: 'Premium overseas education consulting. 2,500+ students, 97% visa approval. Free counselling available.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#1A365D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${jakartaFont.variable} ${dmFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-jakarta antialiased bg-white text-slate-800">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
