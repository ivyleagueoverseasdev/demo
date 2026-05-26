'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SectionSlug } from '@/lib/countrySubpages';

interface Props {
  country:     string;
  sections:    readonly SectionSlug[];
  labels:      Record<SectionSlug, string>;
  accentColor: string;
}

export default function SubNav({ country, sections, labels, accentColor }: Props) {
  const pathname = usePathname();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-16 z-40 shadow-sm">
      <div className="container-xl">
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar -mx-1">
          {sections.map(slug => {
            const href   = `/destinations/${country}/${slug}`;
            const active = pathname === href || pathname.startsWith(href);

            return (
              <Link
                key={slug}
                href={href}
                prefetch={true}
                className={`
                  relative flex-shrink-0 font-jakarta font-semibold text-xs sm:text-sm
                  px-4 sm:px-5 py-4 whitespace-nowrap transition-all duration-200
                  ${active
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-800'
                  }
                `}
              >
                {labels[slug]}
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: accentColor }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
