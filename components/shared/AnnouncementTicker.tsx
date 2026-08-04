'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { TickerItem } from '@/lib/types';

interface Props {
  items:      TickerItem[];
  speedSec:   number;
  bg:         string;
  textColor:  string;
  /** true when the admin has enabled the ticker and there's at least one item. */
  show:       boolean;
  /** true while the header is in its compact "scrolled" state — collapses the ticker to 0 height. */
  collapsed:  boolean;
}

/**
 * Continuously-scrolling announcement strip, rendered as the first row
 * inside Navbar's fixed header (see Navbar.tsx). Purely presentational —
 * Navbar owns fetching settings and the scroll-collapse state so there's a
 * single source of truth and a single /api/content request.
 */
export default function AnnouncementTicker({ items, speedSec, bg, textColor, show, collapsed }: Props) {
  if (!show) return null;

  // Duplicate the list so the CSS loop (translateX 0 → -50%) is seamless.
  const doubled = [...items, ...items];

  return (
    <motion.div
      animate={{ height: collapsed ? 0 : 34, opacity: collapsed ? 0 : 1 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      style={{ overflow: 'hidden', background: bg }}
      aria-hidden={collapsed}
    >
      <div className="h-[34px] flex items-center overflow-hidden">
        <div
          className="ticker-track flex items-center w-max whitespace-nowrap"
          style={{ '--ticker-speed': `${speedSec}s` } as React.CSSProperties}
        >
          {doubled.map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center flex-shrink-0">
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-jakarta text-[12px] font-semibold px-2 hover:underline underline-offset-2"
                  style={{ color: textColor }}
                >
                  {item.text}
                </Link>
              ) : (
                <span className="font-jakarta text-[12px] font-semibold px-2" style={{ color: textColor }}>
                  {item.text}
                </span>
              )}
              <span className="text-[9px] px-4" style={{ color: textColor, opacity: 0.45 }} aria-hidden="true">●</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
