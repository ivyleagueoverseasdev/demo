'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  country:     string;
  sections:    readonly string[];
  labels:      Record<string, string>;
  accentColor: string;
}

// Distinct colour per tab so the sections are clearly separable at a glance.
// The palette cycles, so admin-added extra sections automatically get their
// own colour with no further changes here.
const TAB_COLORS = ['#2563EB', '#7C3AED', '#0D9488', '#D97706', '#DB2777', '#0891B2', '#16A34A', '#DC2626'];

export default function SubNav({ country, sections, labels }: Props) {
  const pathname = usePathname();
  const countryRoot = `/destinations/${country}`;

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-16 z-40 shadow-sm">
      <div className="container-xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {sections.map((slug, i) => {
            const href = `${countryRoot}/${slug}`;
            // "Why Study Here" is shown by default on the country landing
            // page, so it also lights up when the visitor is on the root URL.
            const active =
              pathname === href ||
              pathname.startsWith(href) ||
              (slug === 'why-study' && pathname === countryRoot);
            const color = TAB_COLORS[i % TAB_COLORS.length];

            return (
              <Link
                key={slug}
                href={href}
                prefetch={true}
                className="
                  flex-shrink-0 font-jakarta font-semibold text-xs sm:text-sm
                  px-4 sm:px-5 py-2.5 rounded-full whitespace-nowrap border
                  transition-all duration-200
                "
                style={
                  active
                    ? { background: color, color: '#ffffff', borderColor: color, boxShadow: `0 6px 18px ${color}55` }
                    : { background: `${color}14`, color, borderColor: `${color}33` }
                }
              >
                {labels[slug] ?? slug}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
