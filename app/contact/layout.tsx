import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Free Counselling | Contact ILOC',
  description:
    'Book a free 30-minute overseas education counselling session with ILOC experts. Zero pressure, personalised advice. Serving students from Pune across USA, UK, Canada, Australia and more.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
