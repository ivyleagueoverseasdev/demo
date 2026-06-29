'use client';

import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring,
  useMotionValue, useInView, animate,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import { COMPANY, DEFAULT_HERO_SLIDES } from '@/lib/data';
import type { HeroSlide } from '@/lib/types';
import DemoModal from './DemoModal';
import { HEADER_HEIGHT } from '@/components/shared/Navbar';

// ─────────────────────────────────────────────────────────────────────────────
// Animation constants
// ─────────────────────────────────────────────────────────────────────────────
const CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE:      [number, number, number, number] = [0.22, 1, 0.36, 1];
// Slides advance every 4s and keep advancing regardless of cursor position
// (no pause-on-hover) — only a blocking modal pauses them.
const AUTOPLAY_MS = 4000;

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter — counts from 0 to target, fires when in viewport
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedCounter({
  target, suffix = '', prefix = '', decimals = 0, duration = 2.2, delay = 0,
}: {
  target: number; suffix?: string; prefix?: string;
  decimals?: number; duration?: number; delay?: number;
}) {
  const ref  = useRef<HTMLSpanElement>(null);
  const mv   = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18, restDelta: 0.01 });
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      animate(mv, target, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [inView, mv, target, duration, delay]);

  useEffect(() => {
    return spring.on('change', v => {
      setDisplay(
        decimals > 0
          ? v.toFixed(decimals)
          : Math.round(v).toLocaleString('en-IN')
      );
    });
  }, [spring, decimals]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shimmer CTA button
// ─────────────────────────────────────────────────────────────────────────────
function ShimmerBtn({
  children, href, onClick, external, variant = 'amber',
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  variant?: 'amber' | 'ghost';
}) {
  const cls =
    variant === 'amber'
      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-[0_8px_28px_rgba(245,158,11,0.42)]'
      : 'border border-white/30 text-white/90 hover:text-white hover:border-white/60 hover:bg-white/[0.08]';

  const inner = (
    <span className={`
      relative inline-flex items-center justify-center gap-2.5 overflow-hidden
      font-jakarta font-bold text-[15px] px-8 py-4 rounded-xl
      transition-all duration-300 group-hover:-translate-y-0.5
      group-hover:shadow-[0_14px_40px_rgba(245,158,11,0.58)]
      ${cls}
    `}>
      {/* Shimmer sweep — amber variant only */}
      {variant === 'amber' && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.30) 50%,transparent 65%)',
            backgroundSize: '250% 100%',
          }}
          animate={{ backgroundPosition: ['150% 0', '-150% 0'] }}
          transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.2 }}
        />
      )}
      {children}
    </span>
  );

  return (
    <motion.div
      className="inline-block group"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {onClick
        ? <button type="button" onClick={onClick}>{inner}</button>
        : external
        ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
        : <Link href={href ?? '/contact'}>{inner}</Link>}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating glassmorphism badge with continuous vertical float
// ─────────────────────────────────────────────────────────────────────────────
function FloatingBadge({
  children, delay = 0, floatAmp = 6, className = '',
}: {
  children: React.ReactNode; delay?: number; floatAmp?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.80, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: CINEMATIC }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -floatAmp, 0] }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        className="
          bg-white/[0.12] backdrop-blur-xl border border-white/20
          rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.22)]
        "
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Staggered text reveal — each word fades up individually
// ─────────────────────────────────────────────────────────────────────────────
function WordReveal({
  text, className = '', baseDelay = 0, highlight = false,
}: {
  text: string; className?: string; baseDelay?: number; highlight?: boolean;
}) {
  const words = text.split(' ');
  return (
    <span className={`inline ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: baseDelay + i * 0.07,
              ease: CINEMATIC,
            }}
          >
            {highlight ? (
              <motion.span
                initial={{ textShadow: '0 0 0px rgba(251,191,36,0)' }}
                animate={{ textShadow: '0 0 32px rgba(251,191,36,0.55)' }}
                transition={{ duration: 0.9, delay: baseDelay + i * 0.07 + 0.5 }}
              >
                {word}
              </motion.span>
            ) : word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide image with zoom-out reveal
// ─────────────────────────────────────────────────────────────────────────────
function ZoomRevealImage({
  src, alt, priority, accentGradient,
}: {
  src: string; alt: string; priority?: boolean; accentGradient: string;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1.10, opacity: 0 }}
      animate={{ scale: 1.00, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width:1280px) 460px, 520px"
        priority={priority}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${accentGradient} to-transparent`} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav arrow
// ─────────────────────────────────────────────────────────────────────────────
function NavArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.90 }}
      className="
        w-11 h-11 rounded-full flex items-center justify-center
        bg-white/10 hover:bg-white/22 border border-white/20 hover:border-white/45
        backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.22)]
        transition-colors duration-200
      "
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    >
      <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === 'prev' ? <path d="M12 5l-5 5 5 5" /> : <path d="M8 5l5 5-5 5" />}
      </svg>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA resolver
// ─────────────────────────────────────────────────────────────────────────────
function SlideCtaBtn({
  cta, variant, onDemoOpen,
}: {
  cta: HeroSlide['ctaPrimary'];
  variant: 'amber' | 'ghost';
  onDemoOpen: () => void;
}) {
  if (cta.action === 'demo-modal') {
    return <ShimmerBtn variant={variant} onClick={onDemoOpen}>{cta.label}</ShimmerBtn>;
  }
  if (cta.action === 'whatsapp') {
    return (
      <ShimmerBtn variant={variant} onClick={() => window.dispatchEvent(new Event('open-iloc-chat'))}>
        {cta.label}
      </ShimmerBtn>
    );
  }
  if (cta.action === 'phone') {
    return <ShimmerBtn variant={variant} href={cta.href} external>{cta.label}</ShimmerBtn>;
  }
  return <ShimmerBtn variant={variant} href={cta.href ?? '/contact'}>{cta.label}</ShimmerBtn>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stars
// ─────────────────────────────────────────────────────────────────────────────
function Stars() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="w-2.5 h-2.5 text-amber-400" fill="currentColor">
          <path d="M6 1l1.2 3.6H11l-3 2.2 1.1 3.6L6 8.5l-3.1 1.9L4 6.8l-3-2.2h3.8L6 1z" />
        </svg>
      ))}
      <span className="font-jakarta text-[10px] text-white/55 ml-1">5.0 · 48+ reviews</span>
    </div>
  );
}

const DEST_FLAGS = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇮🇪', '🇳🇿', '🇦🇪', '🇸🇬'];

// ─────────────────────────────────────────────────────────────────────────────
// Main HeroSection
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection({ slides: slidesProp }: { slides?: HeroSlide[] }) {
  const slides =
    (slidesProp?.filter(s => s.enabled) ?? []).length > 0
      ? slidesProp!.filter(s => s.enabled)
      : DEFAULT_HERO_SLIDES.filter(s => s.enabled);

  const [idx,      setIdx]      = useState(0);
  const [dir,      setDir]      = useState(1);
  const [demoOpen, setDemoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const slide = slides[idx] ?? slides[0];
  const total = slides.length;

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIdx((next + total) % total);
  }, [total]);

  const prev = useCallback(() => go(idx - 1, -1), [idx, go]);
  const next = useCallback(() => go(idx + 1,  1), [idx, go]);

  useEffect(() => {
    if (demoOpen) return;
    const t = setInterval(() => { setDir(1); setIdx(i => (i + 1) % total); }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [demoOpen, total]);

  // Parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const { scrollY }         = useScroll();
  const textY               = useTransform(scrollY, [0, 600], [0, -50]);
  const bgY                 = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const scrollHintOp        = useTransform(scrollY, [0, 200], [1, 0]);

  if (!slide) return null;

  // Per-line stagger for heading reveal
  const highlightedLines  = slide.headingLines.filter((_, i) => slide.headingHighlight[i]);
  const normalLines       = slide.headingLines.filter((_, i) => !slide.headingHighlight[i]);
  // We render all lines in order but track which needs highlight
  const headingBaseDelay  = 0.55; // starts after badge + short pause

  return (
    <>
      <section
        ref={sectionRef}
        className="w-full relative overflow-hidden flex items-center"
        style={{
          background: 'linear-gradient(160deg,#07257C 0%,#0C37A0 18%,#1249C4 55%,#1A5CE8 100%)',
          minHeight: '100vh',
          marginTop: `-${HEADER_HEIGHT}px`,
          paddingTop: `${HEADER_HEIGHT}px`,
        }}
      >
        {/* ── Decorative background layer ──────────────────────────────── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.050]" aria-hidden>
            <defs>
              <pattern id="hdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.8" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hdots)" />
          </svg>
          {/* Diagonal lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" aria-hidden>
            <defs>
              <pattern id="hlines" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hlines)" />
          </svg>
          {/* Ambient glows */}
          <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full opacity-[0.065]"
            style={{ background: 'radial-gradient(circle,#ffffff,transparent 70%)' }} />
          <div className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full opacity-[0.065]"
            style={{ background: 'radial-gradient(circle,#F59E0B,transparent 70%)' }} />
        </motion.div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <motion.div
          style={{ y: textY }}
          className="container-xl relative z-10 py-16 lg:py-24 w-full"
        >
          <div className="grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-center">

            {/* ════════════════════════════════════════════════════════════
                LEFT COLUMN — animated copy
            ════════════════════════════════════════════════════════════ */}
            <div className="relative">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={slide.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir > 0 ? 48 : -48 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir > 0 ? -48 : 48 }}
                  transition={{ duration: 0.52, ease: EASE }}
                  className="max-w-2xl"
                >
                  {/* Live badge — fade up */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: CINEMATIC }}
                    className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
                  >
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                    <span className="font-jakarta text-xs font-semibold text-white/90 tracking-wide">
                      {slide.badge}
                    </span>
                  </motion.div>

                  {/* ── Cinematic heading — line-by-line word reveal ── */}
                  <h1
                    className="font-jakarta font-extrabold text-white text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-6"
                    style={{ color: '#ffffff' }}
                  >
                    {slide.headingLines.map((line, li) => {
                      const isHighlight = slide.headingHighlight[li];
                      const lineDelay   = headingBaseDelay + li * 0.18;
                      return (
                        <span key={li} className="block" style={{ color: '#ffffff' }}>
                          {isHighlight ? (
                            <WordReveal
                              text={line}
                              baseDelay={lineDelay}
                              highlight
                              className={slide.highlightColor}
                            />
                          ) : (
                            <WordReveal text={line} baseDelay={lineDelay} className="text-white" />
                          )}
                        </span>
                      );
                    })}
                  </h1>

                  {/* Subtext — fade up after heading */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.72,
                      delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.1,
                      ease: CINEMATIC,
                    }}
                    className="font-jakarta text-white/90 text-base md:text-lg leading-relaxed mb-8"
                    style={{ maxWidth: '36rem' }}
                  >
                    {slide.subtext}
                  </motion.p>

                  {/* Trust micro-badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.22,
                      ease: CINEMATIC,
                    }}
                    className="flex flex-wrap gap-2 mb-9"
                  >
                    {slide.trustBadges.map((b, bi) => (
                      <motion.span
                        key={b}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.28 + bi * 0.06,
                          ease: CINEMATIC,
                        }}
                        className="
                          flex items-center gap-1.5 bg-white/10 text-white text-xs
                          font-jakarta font-medium px-3 py-1.5 rounded-full
                          border border-white/18 backdrop-blur-sm
                        "
                      >
                        <span className="text-amber-400 font-bold text-[10px]">✓</span>
                        {b}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* CTAs — shimmer primary, ghost secondary */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.40,
                      ease: CINEMATIC,
                    }}
                    className="flex flex-col sm:flex-row gap-3 mb-10"
                  >
                    <SlideCtaBtn
                      cta={slide.ctaPrimary}
                      variant={slide.ctaPrimary.style === 'ghost' ? 'ghost' : 'amber'}
                      onDemoOpen={() => setDemoOpen(true)}
                    />
                    <SlideCtaBtn
                      cta={slide.ctaSecondary}
                      variant="ghost"
                      onDemoOpen={() => setDemoOpen(true)}
                    />
                  </motion.div>

                  {/* ── Social proof counters ─────────────────────────── */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.52,
                      ease: CINEMATIC,
                    }}
                    className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.10] mb-6"
                  >
                    {[
                      { target: 10000, suffix: '+', label: 'Students Placed',    color: '#F59E0B', decimals: 0 },
                      { target: 97,    suffix: '%', label: 'Visa Approval Rate', color: '#34D399', decimals: 0 },
                      { target: 25,    suffix: '+', label: 'Years of Expertise', color: '#CCFF00', decimals: 0 },
                    ].map((stat, si) => (
                      <div key={stat.label} className="flex flex-col">
                        <span
                          className="font-jakarta font-extrabold text-2xl md:text-3xl leading-none"
                          style={{ color: stat.color }}
                        >
                          <AnimatedCounter
                            target={stat.target}
                            suffix={stat.suffix}
                            decimals={stat.decimals}
                            duration={2.0}
                            delay={0.3 + si * 0.15}
                          />
                        </span>
                        <span className="font-jakarta text-[11px] text-white/80 mt-1 font-medium leading-tight">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Founder strip */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.60,
                      delay: headingBaseDelay + slide.headingLines.length * 0.18 + 0.62,
                      ease: CINEMATIC,
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="
                      w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center
                      flex-shrink-0
                      shadow-[0_4px_14px_rgba(245,158,11,0.50)]
                    ">
                      <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-jakarta font-semibold text-white text-sm">{COMPANY.short} Expert Team</div>
                      <div className="font-jakarta text-xs text-white/75">Founder & Head Counsellor · 25+ yrs</div>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/15">
                      <span className="font-jakarta text-[11px] text-amber-300 font-bold">⭐ 5.0</span>
                      <span className="font-jakarta text-[10px] text-white/50">JustDial · 48+</span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* ── Slide navigation ── */}
              <div className="flex items-center gap-3 mt-10">
                <NavArrow direction="prev" onClick={prev} />
                <NavArrow direction="next" onClick={next} />
                <div className="flex items-center gap-2 ml-1">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i, i > idx ? 1 : -1)}
                      aria-label={`Slide ${i + 1}`}
                      className="flex items-center py-4 transition-all duration-300"
                      style={{ width: i === idx ? 28 : 8 }}
                    >
                      <span
                        className="h-2 rounded-full w-full block transition-all duration-300"
                        style={{ background: i === idx ? '#F59E0B' : 'rgba(255,255,255,0.28)' }}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex-1 hidden sm:block h-[3px] bg-white/10 rounded-full overflow-hidden ml-2">
                  <motion.div
                    key={`prog-${idx}`}
                    className="h-full bg-amber-400/70 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
                <span className="font-jakarta text-[11px] text-white/35 font-medium hidden sm:block">
                  {idx + 1} / {total}
                </span>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                RIGHT COLUMN — image panel with floating badges
            ════════════════════════════════════════════════════════════ */}
            <div className="hidden lg:block relative">
              {/* Ambient glow behind frame */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.3 }}
                className="absolute -inset-8 rounded-[2.5rem] blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse,rgba(255,255,255,0.12),transparent 65%)' }}
              />

              {/* Image frame — zoom-reveal */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.25, ease: CINEMATIC }}
                className="relative rounded-3xl overflow-hidden shadow-[0_48px_120px_rgba(0,0,0,0.60)]"
                style={{ aspectRatio: '3/4' }}
              >
                {/* Status badge — top glassmorphism bar */}
                <div className="absolute top-0 inset-x-0 z-20 p-4">
                  <div className="bg-white/[0.12] backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-between border border-white/[0.18]">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="font-jakarta text-xs font-semibold text-white truncate">
                        📍 {COMPANY.short} — Pune&apos;s #1 Choice
                      </span>
                    </div>
                    <span className="font-jakarta text-[10px] text-white/55 ml-2 flex-shrink-0">
                      {idx + 1}/{total}
                    </span>
                  </div>
                </div>

                {/* Gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-homeblue-900" />

                {/* Crossfading image with zoom-out reveal */}
                <AnimatePresence mode="wait">
                  <ZoomRevealImage
                    key={`img-${idx}`}
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    priority={idx === 0}
                    accentGradient={slide.accentGradient}
                  />
                </AnimatePresence>

                {/* Caption card — glassmorphism */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`cap-${idx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.40 }}
                      className="bg-white/[0.11] backdrop-blur-xl rounded-2xl p-4 border border-white/[0.15]"
                    >
                      <p className="font-jakarta text-xs text-white/88 font-medium leading-relaxed mb-2">
                        {slide.imageAlt}
                      </p>
                      <Stars />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Floating glassmorphism stat badges ─────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badges-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {slide.stats.map((s, si) => {
                    const positions = [
                      '-bottom-4 -left-12',
                      '-top-5  -right-10',
                      'bottom-24 -right-12',
                    ];
                    return (
                      <FloatingBadge
                        key={s.label}
                        delay={0.35 + si * 0.14}
                        floatAmp={si % 2 === 0 ? 6 : 5}
                        className={`absolute pointer-events-auto ${positions[si] ?? ''}`}
                      >
                        <div className="px-4 py-3 flex flex-col items-center min-w-[88px]">
                          <span
                            className="font-jakarta font-extrabold text-[1.25rem] leading-none"
                            style={{ color: s.color }}
                          >
                            {s.num}
                          </span>
                          <span className="font-jakarta text-[10px] text-white/70 mt-1 text-center leading-tight font-medium">
                            {s.label}
                          </span>
                        </div>
                      </FloatingBadge>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* ── Destination flags strip ─────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.80, delay: 1.0, ease: CINEMATIC }}
                className="
                  absolute -bottom-12 left-1/2 -translate-x-1/2 z-30
                  bg-white rounded-2xl px-4 py-2.5 whitespace-nowrap
                  shadow-[0_8px_32px_rgba(0,0,0,0.18)]
                  flex items-center gap-2.5
                "
              >
                <span className="font-jakarta text-[10px] text-slate-400 font-semibold">Destinations:</span>
                {DEST_FLAGS.map((flag, fi) => (
                  <motion.span
                    key={flag}
                    className="text-[1.1rem] leading-none"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 2.6,
                      delay: fi * 0.18,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatType: 'mirror',
                    }}
                  >
                    {flag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile image strip ───────────────────────────────────────── */}
        <div className="lg:hidden absolute bottom-0 inset-x-0 h-[200px] overflow-hidden z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-${idx}`}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.60 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-homeblue-900/96 via-homeblue-900/55 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Scroll hint ──────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: scrollHintOp }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="font-jakarta text-[9px] text-white/35 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-white/18 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-white/35" />
          </motion.div>
        </motion.div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
