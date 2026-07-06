'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// localStorage keys for visitor identification (client-side only, no cookies)
const VISITOR_KEY = 'iloc_visitor';      // set once on the very first ever visit
const LAST_SEEN_KEY = 'iloc_last_seen';  // YYYY-MM-DD of the last tracked day

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Never track admin or API paths even if this component is present there
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    // New-visitor detection: first page view ever on this browser.
    // Unique-today detection: first page view of the calendar day.
    let newVisitor = false;
    let firstToday = false;
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (!localStorage.getItem(VISITOR_KEY)) {
        newVisitor = true;
        localStorage.setItem(VISITOR_KEY, today);
      }
      if (localStorage.getItem(LAST_SEEN_KEY) !== today) {
        firstToday = true;
        localStorage.setItem(LAST_SEEN_KEY, today);
      }
    } catch { /* storage unavailable (private mode) — count as returning */ }

    // Fire-and-forget. keepalive ensures the request completes even if
    // the user navigates away before the response arrives.
    fetch('/api/track', {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      body:      JSON.stringify({ page: pathname, ref: document.referrer, nv: newVisitor, ft: firstToday }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
