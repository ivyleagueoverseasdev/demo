import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface PageHeroBadge {
  value: string;
  label: string;
  color?: string; // value text color, default homeblue-700
}

export interface PageHeroProps {
  /** CSS background value, e.g. a linear-gradient() string */
  gradient:        string;
  breadcrumbLabel: string;
  eyebrow:         string;
  /** Hex color for eyebrow label + accent rule, default lime */
  eyebrowColor?:   string;
  heading:         ReactNode;
  paragraph:       string;
  image:           { src: string; alt: string };
  /** Which side the image sits on at desktop widths. Default 'right'. */
  imagePosition?:  'left' | 'right';
  /** Small overlapping stat card on the image */
  badge?:          PageHeroBadge;
  /** Decorative glow blob color (top corner), default lime */
  blobColor?:      string;
  /** Extra content rendered below the paragraph (badges, stats, etc.) */
  extra?:          ReactNode;
}

/**
 * Shared split hero used across subpages (About, Services, Contact, News,
 * Events, Partners). Each page passes its own gradient + lime/blue accent
 * mix so pages feel distinct while staying on-brand.
 */
export default function PageHero({
  gradient,
  breadcrumbLabel,
  eyebrow,
  eyebrowColor = '#CCFF00',
  heading,
  paragraph,
  image,
  imagePosition = 'right',
  badge,
  blobColor = '#CCFF00',
  extra,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden text-white" style={{ background: gradient }}>
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{ background: blobColor, transform: 'translate(30%,-35%)' }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ background: '#246DFF', transform: 'translate(-30%,35%)' }}
        aria-hidden
      />

      {/* Dot grid texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ph-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ph-dots)" />
        </svg>
      </div>

      <div className="container-xl relative z-10 py-14 lg:py-20">
        <nav className="flex items-center gap-2 text-xs text-white/50 font-jakarta mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>›</span><span className="text-white/80">{breadcrumbLabel}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <div className={imagePosition === 'left' ? 'lg:order-2' : ''}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-10 rounded-full" style={{ background: eyebrowColor }} />
              <p className="font-jakarta text-xs font-semibold tracking-widest uppercase" style={{ color: eyebrowColor }}>
                {eyebrow}
              </p>
            </div>
            <h1 className="font-jakarta font-extrabold text-white mb-5 text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
              {heading}
            </h1>
            <p className="font-jakarta text-white/75 text-base md:text-lg leading-relaxed max-w-xl">
              {paragraph}
            </p>
            {extra}
          </div>

          {/* Image column */}
          <div className={`relative ${imagePosition === 'left' ? 'lg:order-1' : ''}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white/10">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
            {badge && (
              <div className="absolute -bottom-5 left-5 sm:left-7 bg-white rounded-2xl shadow-2xl px-5 py-3.5 max-w-[200px]">
                <p className="font-jakarta font-extrabold text-2xl leading-none" style={{ color: badge.color ?? '#1249C4' }}>
                  {badge.value}
                </p>
                <p className="font-jakarta text-xs text-slate-500 mt-1 leading-snug">{badge.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
