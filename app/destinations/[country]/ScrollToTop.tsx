'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls the window to the very top whenever the COUNTRY changes — so landing
 * on a country guide always starts on the hero picture. Switching sub-sections
 * within the same country does NOT scroll (the country segment is unchanged),
 * so reading position is preserved while tab-switching.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  // /destinations/<country>/<section> → segment index 2 is the country
  const country = pathname.split('/')[2] ?? '';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [country]);

  return null;
}
