'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Never track admin or API paths even if this component is present there
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    // Unique/new-visitor identity is determined server-side (IP + User-Agent
    // hash — see lib/analytics.ts) rather than from client-supplied flags.
    // A client flag (localStorage/sessionStorage) resets the instant someone
    // clears site data, opens a private window, or switches browsers, which
    // was inflating "new visitor" counts every time the same person was
    // simply re-tested. The server-side hash survives all of that.
    //
    // Fire-and-forget. keepalive ensures the request completes even if
    // the user navigates away before the response arrives.
    fetch('/api/track', {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      body:      JSON.stringify({ page: pathname, ref: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
