'use client';

import { useEffect, useRef, useState } from 'react';
import { UNIS_MARQUEE_DATA } from '@/lib/data';
import type { UniEntry } from '@/lib/data';

interface MarqueeSettings {
  speedRow1:  number;
  speedRow2:  number;
  speedRow3?: number;
  heading:    string;
  subheading: string;
  unis?: UniEntry[];
  rows?: number;
}

const DEFAULT_SETTINGS: MarqueeSettings = {
  speedRow1:  38,
  speedRow2:  44,
  speedRow3:  50,
  heading:    'Students Placed in Top Universities',
  subheading: "Join 10,000+ students we've placed at the world's finest institutions across 12 countries.",
  rows:       3,
};

function UniLogoCard({ uni }: { uni: UniEntry }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Treat cached-but-broken images (naturalWidth === 0) as failed too
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    // Responsive card: tight on phones so 4+ logos are visible per row at
    // once, full size from the sm breakpoint up.
    <div
      className="
        flex-shrink-0 flex items-center justify-center rounded-xl border shadow-sm
        mx-1 px-2 h-[48px] min-w-[76px] max-w-[104px]
        sm:mx-2.5 sm:px-7 sm:h-[92px] sm:min-w-[180px] sm:max-w-[240px] sm:rounded-2xl
      "
      style={{
        background: uni.darkBg ? '#003B5C' : '#ffffff',
        borderColor: uni.darkBg ? '#003B5C' : '#f1f5f9',
      }}
      title={`${uni.name} — ${uni.country}`}
    >
      {failed ? (
        /* Slim text fallback — only fires if file is genuinely missing */
        <span className="font-jakarta text-[9px] sm:text-[11px] font-semibold text-slate-400 text-center leading-tight px-1">
          {uni.name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={uni.src}
          alt={uni.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="block w-auto h-auto object-contain max-h-[28px] max-w-[64px] sm:max-h-[56px] sm:max-w-[160px]"
        />
      )}
    </div>
  );
}

function MarqueeRow({
  unis,
  reverse,
  speed,
}: {
  unis:    UniEntry[];
  reverse: boolean;
  speed:   number;
}) {
  // Duplicate the list so the CSS loop is seamless
  const doubled = [...unis, ...unis];
  const cssVar  = { '--uni-marquee-speed': `${speed}s` } as React.CSSProperties;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        maskImage:       'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      {/* w-max is load-bearing: translateX(-50%) in the marquee keyframes is a
          percentage of THIS element's own box. Without an explicit
          width:max-content, a flex row in normal document flow stretches to
          its parent's width instead of its (much wider) doubled content, so
          -50% only slides roughly half the visible strip before snapping
          back — logos jump/skip instead of scrolling all the way through.
          w-max makes the track's box exactly as wide as its content, so
          -50% always lands on precisely one full (undoubled) copy. */}
      <div
        className={`flex items-center w-max ${reverse ? 'uni-marquee-track-reverse' : 'uni-marquee-track'}`}
        style={cssVar}
        aria-hidden="true"
      >
        {doubled.map((uni, i) => (
          <UniLogoCard key={`${uni.src}-${i}`} uni={uni} />
        ))}
      </div>
    </div>
  );
}

export default function UniversityMarquee() {
  const [settings, setSettings] = useState<MarqueeSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/marquee', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((data: any) => {
        if (data?.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      })
      .catch(() => {});
  }, []);

  const validUnis = settings.unis?.filter(u => u.src?.trim()) ?? [];
  const unis  = validUnis.length ? validUnis : UNIS_MARQUEE_DATA;
  const rows  = Math.min(6, Math.max(1, Math.round(settings.rows ?? 3)));
  const chunk = Math.ceil(unis.length / rows);
  const rowGroups = Array.from({ length: rows }, (_, i) => unis.slice(i * chunk, (i + 1) * chunk))
    .filter(group => group.length > 0);

  const speeds = [settings.speedRow1, settings.speedRow2, settings.speedRow3 ?? 50];
  const speedFor = (i: number) => speeds[i] ?? 38 + i * 6;

  return (
    <section className="uni-marquee-section py-14 bg-gradient-to-b from-slate-50 to-white overflow-hidden">

      {/* ── Heading ── */}
      <div className="text-center mb-10 px-4">
        <div className="inline-flex items-center gap-2 font-jakarta text-xs font-semibold tracking-widest uppercase text-amber-500 mb-3">
          <span className="w-6 h-px bg-amber-400 inline-block" />
          Our Network
          <span className="w-6 h-px bg-amber-400 inline-block" />
        </div>
        <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl sm:text-3xl tracking-tight">
          {settings.heading}
        </h2>
        <p className="font-jakarta text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          {settings.subheading}
        </p>
      </div>

      {/* ── Scrolling rows (admin-configurable count, 1–6) ── */}
      <div className="space-y-3">
        {rowGroups.map((group, i) => (
          <MarqueeRow key={i} unis={group} reverse={i % 2 === 1} speed={speedFor(i)} />
        ))}
      </div>

      {/* ── Stats strip ── */}
      <div className="flex items-center justify-center gap-10 sm:gap-16 mt-10 flex-wrap px-4">
        {[
          { num: '400+',   label: 'Partner Universities' },
          { num: '12',     label: 'Countries' },
          { num: '10,000+', label: 'Students Placed' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-jakarta font-extrabold text-2xl text-homeblue-600">{s.num}</div>
            <div className="font-jakarta text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
