'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Never track admin or API paths even if this component is present there
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

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
