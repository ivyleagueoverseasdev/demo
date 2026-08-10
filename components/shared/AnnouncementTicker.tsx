'use client';

import { useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { TickerItem } from '@/lib/types';

interface Props {
  /** Already filtered to active items, in display order — see Navbar.tsx. */
  items:      TickerItem[];
  speedSec:   number;
  bg:         string;
  textColor:  string;
  /** true when the admin has enabled the ticker and there's at least one active item. */
  show:       boolean;
  /** true while the header is in its compact "scrolled" state — collapses the ticker. */
  collapsed:  boolean;
}

function TickerLink({ item, textColor, tabbable }: {
  item: TickerItem; textColor: string;
  /** false for the visual-only duplicate copy, AND while the bar is collapsed
   *  (0 height) — an aria-hidden ancestor must never contain a focusable
   *  descendant, or keyboard users can tab into invisible content. */
  tabbable: boolean;
}) {
  const content = (
    <>
      {item.urgent && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-white/90" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
      )}
      {item.icon && <span aria-hidden="true">{item.icon}</span>}
      <span>{item.text}</span>
    </>
  );

  const className =
    'inline-flex items-center gap-1.5 font-jakarta text-[13px] sm:text-sm font-semibold px-3 whitespace-nowrap rounded-sm ' +
    'transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/90 focus-visible:outline-offset-2';
  const style = { color: textColor };
  // Screen readers / keyboard users should only ever land on ONE copy of each
  // announcement — the second copy exists purely for the visual seamless
  // loop (see the doubled array below) and must be invisible to them.
  const a11yProps = tabbable ? {} : { 'aria-hidden': true as const, tabIndex: -1 };

  if (!item.href) {
    return <span className={className} style={style} {...a11yProps}>{content}</span>;
  }

  const isExternal = /^https?:\/\//i.test(item.href);
  if (isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} style={style} {...a11yProps}>
        {content}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} style={style} {...a11yProps}>
      {content}
    </Link>
  );
}

/**
 * Continuously-scrolling announcement strip, rendered as the last row
 * inside Navbar's fixed header (see Navbar.tsx), below the navigation row.
 * Purely presentational — Navbar owns fetching settings and the
 * scroll-collapse state, so there's a single source of truth and a single
 * /api/content request. Never pauses and has no dismiss control — it
 * scrolls continuously for as long as it's shown.
 *
 * Collapse animation uses the CSS grid-template-rows 0fr↔1fr technique
 * rather than a hardcoded pixel height: it animates smoothly to/from the
 * content's OWN natural height, which is exactly what's needed since that
 * height is itself responsive (32px mobile / 34px tablet / 38px desktop,
 * matching the --ticker-h breakpoints Navbar sets on <html>) — no JS
 * measuring, no mismatch between what's reserved and what's rendered.
 */
export default function AnnouncementTicker({ items, speedSec, bg, textColor, show, collapsed }: Props) {
  // Respects the OS/browser "reduce motion" preference: no auto-scroll, no
  // duplicated content — just a plain, natively-scrollable single-line list.
  const reduceMotion = useReducedMotion();

  if (!show) return null;

  const doubled = reduceMotion ? items : [...items, ...items];

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        collapsed ? 'grid-rows-[0fr] opacity-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100'
      }`}
      style={{ background: bg }}
      aria-hidden={collapsed}
      role="region"
      aria-label="Site announcements"
    >
      <div className="overflow-hidden">
        <div className="ticker-row flex items-center h-8 sm:h-[34px] lg:h-[38px]">
          {/* Scrolling area — edge-fades so items don't hard-cut at the boundary */}
          <div
            className={`flex-1 min-w-0 h-full flex items-center ${reduceMotion ? 'overflow-x-auto no-scrollbar' : 'overflow-hidden'}`}
            style={reduceMotion ? undefined : {
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
              maskImage:       'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            }}
          >
            <div
              className={`flex items-center ${reduceMotion ? '' : 'ticker-track w-max'}`}
              style={reduceMotion ? undefined : ({ '--ticker-speed': `${speedSec}s` } as React.CSSProperties)}
            >
              {doubled.map((item, i) => (
                <TickerLink key={`${item.id}-${i}`} item={item} textColor={textColor} tabbable={i < items.length && !collapsed} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
