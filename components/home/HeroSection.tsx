'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, DEFAULT_HERO_IMAGES, HERO_FALLBACK_IMAGE } from '@/lib/data';

const IMAGE_LABELS = [
  'An ambitious student building her global future',
  'Diverse students thriving on a world-class campus',
  'Expert guidance — your personalised roadmap to success',
];

const TRUST_BADGES = [
  { icon: '✓', text: '97% Visa Approval' },
  { icon: '✓', text: 'Zero Hidden Fees'  },
  { icon: '✓', text: '2,500+ Placed'     },
  { icon: '✓', text: 'Free Counselling'  },
];

const FLOATING_STATS = [
  { num: '2,500+', label: 'Students Placed', color: '#D97706', className: '-bottom-4 -left-5 lg:-left-8'   },
  { num: '97%',    label: 'Visa Approval',   color: '#059669', className: '-top-4 -right-4 lg:-right-6'    },
  { num: '400+',   label: 'Universities',    color: '#2D5A99', className: 'bottom-16 -right-4 lg:-right-6' },
];

// All 8 destination flags
const DESTINATION_FLAGS = ['🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇮🇪','🇳🇿','🇸🇬','🇪🇺'];

// ── Premium stagger variants ──────────────────────────────────────────────
const BEZIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.12 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: BEZIER },
  },
};

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 26 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: BEZIER },
});

// ── Magnetic CTA button ───────────────────────────────────────────────────
function MagneticBtn({
  href, children, primary, external, onClick,
}: {
  href?: string; children: React.ReactNode; primary?: boolean; external?: boolean;
  onClick?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 520, damping: 22 });
  const y = useSpring(0, { stiffness: 520, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.28);
    y.set((e.clientY - r.top  - r.height / 2) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const cls = primary
    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber'
    : 'border border-white/35 text-white hover:bg-white/10';

  const inner = (
    <span className={`inline-flex items-center justify-center gap-2 font-jakarta font-bold text-[15px] px-8 py-4 rounded-xl transition-colors ${cls}`}>
      {children}
    </span>
  );

  return (
    <motion.div ref={wrapRef} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {onClick
        ? <button type="button" onClick={onClick}>{inner}</button>
        : external
          ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
          : <Link href={href!}>{inner}</Link>}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function HeroSection({ heroImages: heroImagesProp }: { heroImages?: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [imgIdx, setImgIdx]         = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>(
    heroImagesProp?.length ? heroImagesProp : DEFAULT_HERO_IMAGES,
  );

  // ── Section-locked parallax (background moves 30% of section scroll distance) ──
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  });
  const parallaxY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const carouselParY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  // ── Window-scroll transforms for text + fade ──────────────────────────────
  const { scrollY } = useScroll();
  const textY       = useTransform(scrollY, [0, 500], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const scrollHintOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // If parent passes fresh SSR images after hydration, sync them
  useEffect(() => {
    if (heroImagesProp?.length) setHeroImages(heroImagesProp);
  }, [heroImagesProp]);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{ background: 'linear-gradient(145deg,#0F2247 0%,#1A365D 45%,#2D5A99 100%)' }}
    >
      {/* Parallax background texture — moves at 30% of scroll speed for depth */}
      <motion.div style={{ y: parallaxY }}
        className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=55&w=1600&auto=format&fit=crop"
          alt="" fill className="object-cover" style={{ opacity: 0.06 }}
          sizes="100vw" priority aria-hidden onError={() => {}} />
      </motion.div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle,#D97706,transparent 68%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[340px] h-[340px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle,#60A5FA,transparent 68%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" aria-hidden>
          <defs>
            <pattern id="hdots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hdots)" />
        </svg>
      </div>

      {/* Content layer */}
      <motion.div style={{ y: textY, opacity: heroOpacity }}
        className="container-xl relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">

          {/* ── Left: copy ── */}
          <div className="max-w-2xl">

            {/* Live badge */}
            <motion.div {...fadeUp(0)}
              className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="font-jakarta text-xs font-semibold text-white/90 tracking-wide">
                Trusted by 2,500+ Students Since {COMPANY.since}
              </span>
            </motion.div>

            {/* Headline — word-by-word stagger reveal */}
            <motion.h1
              variants={wordContainer}
              initial="hidden"
              animate="show"
              className="font-jakarta font-extrabold text-white leading-[1.04] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4.4rem)' }}
            >
              <motion.span variants={wordVariant} className="inline-block">Your&nbsp;</motion.span>
              <motion.span variants={wordVariant} className="inline-block">Gateway&nbsp;</motion.span>
              <motion.span variants={wordVariant} className="inline-block">to</motion.span>
              <br />
              <motion.span variants={wordVariant} className="inline-block text-amber-400">World&#8209;Class&nbsp;</motion.span>
              <br />
              <motion.span variants={wordVariant} className="inline-block">Universities.</motion.span>
            </motion.h1>

            {/* Paragraph — Phase 2 updated copy + Phase 1 contrast fix */}
            <motion.p {...fadeUp(0.32)}
              className="font-jakarta text-white/80 leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1rem,1.5vw,1.125rem)', maxWidth: '38rem' }}>
              {COMPANY.name} — Premium overseas education consulting. Rooted in Pune, guiding students globally. 97% visa approval, zero hidden fees, direct founder access. 2,500+ students placed across 400+ universities worldwide.
            </motion.p>

            {/* Trust badges */}
            <motion.div {...fadeUp(0.38)} className="flex flex-wrap gap-2.5 mb-9">
              {TRUST_BADGES.map(b => (
                <span key={b.text}
                  className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-jakarta font-medium px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                  <span className="text-amber-400 font-bold text-[10px]">{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(0.44)} className="flex flex-col sm:flex-row gap-3 mb-10">
              <MagneticBtn href="/contact" primary>Book Free Counselling →</MagneticBtn>
              <MagneticBtn onClick={() => window.dispatchEvent(new Event('open-iloc-chat'))}>
                💬 Chat on WhatsApp
              </MagneticBtn>
            </motion.div>

            {/* Founder note */}
            <motion.div {...fadeUp(0.52)}
              className="flex items-center gap-3 pt-7 border-t border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-jakarta font-bold text-xs text-white flex-shrink-0 shadow-amber">
                RP
              </div>
              <div>
                <div className="font-jakarta font-semibold text-white text-sm">{COMPANY.founder}</div>
                <div className="font-jakarta text-xs text-white/60">Founder & Head Counsellor · 7+ yrs</div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: rotating image carousel — slight parallax for depth ── */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ y: carouselParY }}
            transition={{ duration: 0.9, delay: 0.25, ease: BEZIER }}
            className="hidden lg:block relative"
          >
            {/* Main image frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
              style={{ aspectRatio: '3/4' }}>

              {/* Glassmorphic top bar */}
              <div className="absolute top-0 inset-x-0 z-20 p-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center justify-between border border-white/25">
                  <span className="font-jakarta text-xs font-semibold text-white">📍 Studying Abroad with ILOC</span>
                  <span className="font-jakarta text-[10px] text-white/70">{imgIdx + 1} / {heroImages.length}</span>
                </div>
              </div>

              {/* Rotating images — luxury fallback gradient is always visible beneath */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary-900" />
              <AnimatePresence mode="wait">
                <motion.div key={imgIdx} className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.9, ease: BEZIER }}>
                  <Image
                    src={heroImages[imgIdx] ?? HERO_FALLBACK_IMAGE}
                    alt={IMAGE_LABELS[imgIdx % IMAGE_LABELS.length]}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 480px"
                    priority={imgIdx === 0}
                    onError={() =>
                      setHeroImages(prev => {
                        const next = [...prev];
                        next[imgIdx] = HERO_FALLBACK_IMAGE;
                        return next;
                      })
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/45 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slide dots */}
              <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroImages.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === imgIdx ? 24 : 6,
                      background: i === imgIdx ? '#F59E0B' : 'rgba(255,255,255,0.35)',
                    }} />
                ))}
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-4">
                <AnimatePresence mode="wait">
                  <motion.div key={`cap${imgIdx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/20">
                    <p className="font-jakarta text-xs text-white/90 font-medium">{IMAGE_LABELS[imgIdx % IMAGE_LABELS.length]}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating stat cards */}
            {FLOATING_STATS.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.65 + i * 0.15, ease: BEZIER }}
                whileHover={{ scale: 1.06, y: -3 }}
                className={`absolute ${s.className} bg-white rounded-2xl px-4 py-3 shadow-card-hover z-30`}>
                <div className="font-jakarta font-extrabold text-2xl leading-none" style={{ color: s.color }}>{s.num}</div>
                <div className="font-jakarta text-xs text-slate-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}

            {/* Flag strip — all 8 destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 shadow-card-hover flex items-center gap-2.5 z-30 whitespace-nowrap">
              <span className="font-jakarta text-[11px] text-slate-400 font-medium">Destinations:</span>
              {DESTINATION_FLAGS.map((flag, fi) => (
                <motion.span key={flag} className="text-lg"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, delay: fi * 0.2, repeat: Infinity, ease: 'easeInOut' }}>
                  {flag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div style={{ opacity: scrollHintOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-jakarta text-[10px] text-white/50 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-white/25 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
