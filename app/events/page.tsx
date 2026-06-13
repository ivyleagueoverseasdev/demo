// ── Server component wrapper — fetches events SSR so no loading flash ─────────
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPublicEvents, getPublicGlobalSettings, buildPageMeta } from '@/lib/public-data';
import { DEFAULT_EVENTS } from '@/lib/data';
import type { SiteEvent } from '@/lib/types';
import EventsHubClient from './EventsHubClient';

export const metadata: Metadata = buildPageMeta({
  title:       'Upcoming Events & Live Classes | ILOC Pune',
  description: 'Free webinars, live coaching classes (GRE, IELTS, TOEFL, German), university fairs and workshops. First session always free. Register now.',
  path:        '/events',
});

function EventsPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="py-20 lg:py-28" style={{ background: 'linear-gradient(145deg,#1A2E05 0%,#4D7C0F 100%)' }} />
      <div className="section bg-slate-50">
        <div className="container-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-16 bg-slate-100 rounded-full" />
                <div className="h-5 w-3/4 bg-slate-100 rounded-lg" />
                <div className="h-3 w-full bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  // Fetch server-side so the page renders with real data immediately
  const [events, globalSettings] = await Promise.all([
    getPublicEvents({ publishedOnly: true }).catch(() => DEFAULT_EVENTS) as Promise<SiteEvent[]>,
    getPublicGlobalSettings(),
  ]);

  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <EventsHubClient initialEvents={events} gridCols={globalSettings?.eventsCols} />
    </Suspense>
  );
}
