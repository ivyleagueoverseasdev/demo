'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { COMPANY, buildWhatsAppLink, DEFAULT_TICKER_ITEMS } from '@/lib/data';
import AnnouncementTicker from './AnnouncementTicker';
import type { TickerItem } from '@/lib/types';

// ── Nav data ──────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Home',               href: '/'            },
  { label: 'About Us',           href: '/about'        },
  { label: 'Services',           href: '/services'     },
  { label: 'Destinations',       href: '/destinations' },
  { label: 'Test Prep & Events', href: '/events'       },
  { label: 'News',               href: '/news'         },
  { label: 'Partner With Us',    href: '/partners'     },
  { label: 'Contact',            href: '/contact'      },
];

const DESTINATIONS = [
  { label: 'United States', href: '/destinations/usa'        },
  { label: 'United Kingdom', href: '/destinations/uk'        },
  { label: 'Canada',      href: '/destinations/canada'      },
  { label: 'Australia',   href: '/destinations/australia'   },
  { label: 'Ireland',     href: '/destinations/ireland'     },
  { label: 'New Zealand', href: '/destinations/new-zealand' },
  { label: 'Europe',      href: '/destinations/europe'      },
  { label: 'United Arab Emirates', href: '/destinations/uae' },
  { label: 'Japan',       href: '/destinations/japan'       },
  { label: 'South Korea', href: '/destinations/south-korea' },
  { label: 'Singapore',   href: '/destinations/singapore'   },
  { label: 'Russia',      href: '/destinations/russia'      },
];

const PARTNERS = [
  { label: '🏛️ Institutions', href: '/partners/institutions' },
  { label: '🤝 Agents',       href: '/partners/agent'        },
  { label: '🎁 Referral',     href: '/partners/referral'     },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Default ticker look while settings are loading / if the admin leaves colours blank.
const TICKER_DEFAULT_BG   = '#D97706';
const TICKER_DEFAULT_TEXT = '#ffffff';
const TICKER_DEFAULT_SPEED = 30;
// ── Dropdown menu — rendered outside any overflow-hidden ancestor ─────────
// By placing it as `fixed` we escape any clipping context entirely.
function DestDropdown({
  open, onEnter, onLeave, items,
}: { open: boolean; onEnter: () => void; onLeave: () => void; items: { label: string; href: string }[] }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100/80 py-2 z-[200]"
        >
          <div className="px-4 pt-2 pb-1.5">
            <span className="font-jakarta text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Study Destinations
            </span>
          </div>
          <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
            {items.map(d => (
              <Link key={d.href} href={d.href}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 transition-colors font-jakarta font-medium rounded-xl">
                {d.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PartDropdown({
  open, onEnter, onLeave,
}: { open: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100/80 py-2 z-[200]"
        >
          {PARTNERS.map(d => (
            <Link key={d.href} href={d.href}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-lime-50 hover:text-lime-700 transition-colors font-jakarta font-medium">
              {d.label}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Distinct colour per public nav tab so each stands out clearly on the header.
// Indexed by tab position; cycles if tabs are added.
const PUB_TAB_COLORS = ['#1D4ED8', '#7C3AED', '#0D9488', '#D97706', '#DB2777', '#0891B2', '#15803D', '#B91C1C'];

// ── Nav links — label routes, chevron toggles dropdown ───────────────────
function NavLinks({
  isActive, destOpen, partOpen, openDest, closeDest, openPart, closePart, compact, destinations,
}: {
  isActive: (h: string) => boolean;
  destOpen: boolean; partOpen: boolean;
  openDest: () => void; closeDest: () => void;
  openPart: () => void; closePart: () => void;
  compact?: boolean;
  destinations: { label: string; href: string }[];
}) {
  const px = compact ? 'px-2 py-1.5' : 'px-2.5 py-2';
  const fs = compact ? 'text-[12.5px]' : 'text-[13.5px]';

  // Flat text, no pill/oval background — white by default; switches to the
  // tab's own accent colour only once it's the active route (i.e. once
  // clicked). A soft dark text-shadow keeps the white state legible
  // regardless of how light the admin-configurable header colour is,
  // without adding any background shape.
  const tabStyle = (color: string, active: boolean): React.CSSProperties => ({
    color: active ? color : '#ffffff',
    textShadow: active ? 'none' : '0 1px 3px rgba(0,0,0,0.32)',
  });

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV.map(({ label, href }, ti) => {
        const isDestinations = href === '/destinations';
        const isPartners     = href === '/partners';
        const color  = PUB_TAB_COLORS[ti % PUB_TAB_COLORS.length];
        const style  = tabStyle(color, isActive(href));
        const glowStyle = { ...style, ['--glow' as string]: color } as React.CSSProperties;
        const txtCls = isActive(href) ? 'font-bold' : 'font-semibold hover:opacity-80';

        if (isDestinations) {
          return (
            // Wrapper: relative so dropdown positions correctly; NO overflow-hidden here
            <div key={href} className="relative flex items-center nav-glow" style={glowStyle}
              onMouseEnter={openDest} onMouseLeave={closeDest}>
              {/* Clickable label → navigates */}
              <Link href={href}
                className={`font-jakarta ${txtCls} ${fs} pl-2.5 pr-1 py-2 transition-all`}
                style={{ color: 'inherit', textShadow: 'inherit' }}>
                {label}
              </Link>
              {/* Separate chevron → toggles dropdown only */}
              <button
                onClick={e => { e.preventDefault(); destOpen ? closeDest() : openDest(); }}
                className={`font-jakarta ${px} transition-all pl-0`}
                style={{ color: 'inherit' }}
                aria-label="Toggle destinations menu"
              >
                <svg className={`w-3 h-3 transition-transform duration-200 ${destOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <DestDropdown open={destOpen} onEnter={openDest} onLeave={closeDest} items={destinations} />
            </div>
          );
        }

        if (isPartners) {
          return (
            <div key={href} className="relative flex items-center nav-glow" style={glowStyle}
              onMouseEnter={openPart} onMouseLeave={closePart}>
              <Link href={href}
                className={`font-jakarta ${txtCls} ${fs} pl-2.5 pr-1 py-2 transition-all`}
                style={{ color: 'inherit', textShadow: 'inherit' }}>
                {label}
              </Link>
              <button
                onClick={e => { e.preventDefault(); partOpen ? closePart() : openPart(); }}
                className={`font-jakarta ${px} transition-all pl-0`}
                style={{ color: 'inherit' }}
                aria-label="Toggle partners menu"
              >
                <svg className={`w-3 h-3 transition-transform duration-200 ${partOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <PartDropdown open={partOpen} onEnter={openPart} onLeave={closePart} />
            </div>
          );
        }

        return (
          <Link key={href} href={href}
            className={`font-jakarta ${txtCls} ${fs} ${px} nav-glow transition-all`}
            style={glowStyle}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [mOpen,     setMOpen]     = useState(false);
  const [destOpen,  setDestOpen]  = useState(false);
  const [partOpen,  setPartOpen]  = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const [headerBg,  setHeaderBg]  = useState('#C7FBA0');
  const [logoUrl,   setLogoUrl]   = useState('/logo3.png');
  const [brandText, setBrandText] = useState('IVY LEAGUE OVERSEAS CONSULTING');
  const [contact,   setContact]   = useState<{ phone: string; email: string; wa: string }>({ phone: COMPANY.phone, email: COMPANY.email, wa: COMPANY.wa });
  const [destinations, setDestinations] = useState<{ label: string; href: string }[]>(DESTINATIONS);

  // Scrolling announcement ticker — admin-editable via /admin/global.
  // Starts with the default announcements (not []) so there's no flash of
  // "no ticker" on first paint — the /api/content fetch below immediately
  // overrides this the moment an admin has actually configured anything.
  const [tickerItems,     setTickerItems]     = useState<TickerItem[]>(DEFAULT_TICKER_ITEMS);
  const [tickerSpeed,     setTickerSpeed]     = useState(TICKER_DEFAULT_SPEED);
  const [tickerBg,        setTickerBg]        = useState(TICKER_DEFAULT_BG);
  const [tickerText,      setTickerText]      = useState(TICKER_DEFAULT_TEXT);
  const tickerShow = tickerItems.length > 0;

  const pathname  = usePathname();
  const destTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/content', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        const gs = d?.globalSettings;
        if (gs?.headerBackgroundColor) setHeaderBg(gs.headerBackgroundColor);
        if (gs?.mainLogoUrl)           setLogoUrl(gs.mainLogoUrl);
        // Effective destination list (admin add/hide aware)
        if (Array.isArray(d?.countries) && d.countries.length) {
          setDestinations(d.countries.map((c: { code: string; name: string }) => ({
            label: c.name,
            href:  `/destinations/${c.code}`,
          })));
        }
        // Scrolling announcement ticker — active items with real text only,
        // in their configured display order (array order = priority).
        // `tickerEnabled` being literally absent (not just falsy) means no
        // admin has ever touched /admin/global → Scrolling Ticker, so the
        // site shows sensible defaults out of the box; the moment they save
        // ANY choice there (even turning it off), that explicit choice wins.
        const hasExplicitTickerConfig = typeof gs?.tickerEnabled === 'boolean';
        const validTicker: TickerItem[] = Array.isArray(gs?.tickerItems)
          ? gs.tickerItems.filter((it: TickerItem) => it?.text?.trim() && it.active !== false)
          : [];
        const nextItems = hasExplicitTickerConfig
          ? (gs.tickerEnabled ? validTicker : [])
          : DEFAULT_TICKER_ITEMS;
        setTickerItems(nextItems);
        if (typeof gs?.tickerSpeedSec === 'number' && gs.tickerSpeedSec > 0) setTickerSpeed(gs.tickerSpeedSec);
        if (gs?.tickerBg)        setTickerBg(gs.tickerBg);
        if (gs?.tickerTextColor) setTickerText(gs.tickerTextColor);
        const name = gs?.businessNameText || gs?.businessNameDisplayName || gs?.brandName;
        if (name) setBrandText(name);
        const cd = d?.companyDetails;
        const waBase = cd?.whatsapp || gs?.whatsappUrl || COMPANY.wa;
        const waMsg  = gs?.whatsappMessage || COMPANY.whatsappMessage;
        const wa     = buildWhatsAppLink(waBase, waMsg);
        if (cd) {
          setContact(c => ({
            phone: cd.phone || c.phone,
            email: cd.email || c.email,
            wa,
          }));
        } else if (gs?.whatsappUrl || gs?.whatsappMessage) {
          setContact(c => ({ ...c, wa }));
        }
      })
      .catch(() => {});
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 60));

  // Keep the page's top padding (--ticker-h in globals.css / .site-main) and
  // HeroSection's negative-margin trick in sync with whether the ticker is
  // actually occupying space right now — so content never sits behind the
  // header, and there's no leftover gap once the ticker is off/scrolled/
  // dismissed away. A data-attribute (not an inline px value) so CSS can
  // resolve --ticker-h to a DIFFERENT height per breakpoint — 32/34/38px —
  // the same way --header-h already varies by breakpoint.
  useEffect(() => {
    document.documentElement.dataset.ticker = (tickerShow && !scrolled) ? 'on' : 'off';
  }, [tickerShow, scrolled]);

  useEffect(() => { setMOpen(false); setDestOpen(false); setPartOpen(false); }, [pathname]);

  // Body scroll lock — prevents background page from scrolling while menu is open
  useEffect(() => {
    if (mOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : (pathname?.startsWith(href) ?? false);

  const openDest  = () => { if (destTimer.current) clearTimeout(destTimer.current); setDestOpen(true); };
  const closeDest = () => { destTimer.current = setTimeout(() => setDestOpen(false), 150); };
  const openPart  = () => { if (partTimer.current) clearTimeout(partTimer.current); setPartOpen(true); };
  const closePart = () => { partTimer.current = setTimeout(() => setPartOpen(false), 150); };

  const bg = mounted ? headerBg : '#C7FBA0';

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          FIXED HEADER
          - z-[100]: above all page content
          - overflow-visible: NEVER clip children (dropdowns escape freely)
          - Solid blue always so text is readable on every route
      ══════════════════════════════════════════════════════════════════ */}
      <header
        className="fixed inset-x-0 top-0 z-[100]"
        style={{ backgroundColor: bg, overflow: 'visible' }}
      >
        {/* Blur + shadow layer on scroll */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: -1 }}
          animate={{
            backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'blur(0px)',
            boxShadow:      scrolled ? '0 2px 40px rgba(0,0,0,0.30)' : '0 1px 0 rgba(255,255,255,0.06)',
          }}
          transition={{ duration: 0.30, ease: 'easeInOut' }}
        />

        {/* ── LAYER 1: TOP INFO BAR ─────────────────────────────────── */}
        <motion.div
          animate={{ height: scrolled ? 0 : 36, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.32, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div className="container-xl flex items-center justify-between h-9 text-slate-800 text-[11.5px] font-jakarta border-b border-slate-900/[0.07]">
            <div className="flex items-center gap-6">
              <a href={`tel:${contact.phone}`}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors">
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors">
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                {contact.email}
              </a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-slate-600 font-medium">Trusted by 10,000+ Students</span>
              <span className="w-px h-3 bg-slate-900/15" />
              <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── LAYER 2: BRAND IDENTITY ───────────────────────────────── */}
        <div className="container-xl">
          <motion.div
            animate={{
              paddingTop:    scrolled ? '8px'  : '22px',
              paddingBottom: scrolled ? '8px'  : '18px',
            }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="flex items-center gap-4 md:gap-6 w-full"
          >
            {/* Logo: scale+fade entrance, glow on hover */}
            <Link href="/" aria-label="ILOC" className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.72 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.70, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                whileHover={{
                  scale: 1.06,
                  filter: 'drop-shadow(0 0 14px rgba(0,0,0,0.18))',
                  transition: { duration: 0.22, ease: 'easeOut' },
                }}
                className="flex-shrink-0"
              >
                <motion.div
                  animate={{ width: scrolled ? 48 : 112, height: scrolled ? 48 : 112 }}
                  transition={{ duration: 0.32, ease: 'easeInOut' }}
                  className="relative rounded-full overflow-hidden"
                >
                  <Image
                    src={logoUrl}
                    alt={brandText}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                    priority
                  />
                </motion.div>
              </motion.div>
            </Link>

            {/* Business title: fade + slide from left, layered green glow */}
            <Link href="/" className="min-w-0">
              {/* Layer 1 — entrance animation */}
              <motion.div
                initial={{ opacity: 0, x: -22 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
              >
                {/* Layer 2 — responsive font size (scrolled → compact) */}
                <motion.div
                  animate={{ fontSize: scrolled ? '1.1rem' : 'clamp(1.3rem,2.4vw,2.2rem)' }}
                  transition={{ duration: 0.32, ease: 'easeInOut' }}
                >
                  {/* Layer 3 — hover variant group: triggers glow + text scale */}
                  <motion.div
                    whileHover="glow"
                    initial="rest"
                    animate="rest"
                    className="relative cursor-pointer select-none"
                  >
                    {/* Layer 1 — Outer white aura: wide diffuse halo behind the black text */}
                    <motion.div
                      variants={{
                        rest: { opacity: 0.32, scale: 1.00, filter: 'blur(40px)' },
                        glow: { opacity: 0.75, scale: 1.70, filter: 'blur(52px)' },
                      }}
                      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-[-22px] inset-y-[-16px] pointer-events-none rounded-full"
                      style={{ background: '#ffffff' }}
                    />
                    {/* Layer 2 — Inner white core: tight bright centre that punches through green bg */}
                    <motion.div
                      variants={{
                        rest: { opacity: 0.50, scale: 1.00, filter: 'blur(16px)' },
                        glow: { opacity: 0.95, scale: 1.28, filter: 'blur(22px)' },
                      }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-[-10px] inset-y-[-6px] pointer-events-none rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.96)' }}
                    />
                    {/* Embossed Oswald wordmark — white halo behind boosts the raised look */}
                    <motion.span
                      variants={{
                        rest: { scale: 1 },
                        glow: { scale: 1.04 },
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="brand-emboss relative z-10 leading-tight block"
                    >
                      {brandText}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Link>

            {/* Compact nav — xl screens, scrolled only */}
            <AnimatePresence>
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.24 }}
                  className="hidden xl:flex items-center gap-0 ml-2"
                >
                  <NavLinks
                    isActive={isActive}
                    destOpen={destOpen} partOpen={partOpen}
                    openDest={openDest} closeDest={closeDest}
                    openPart={openPart} closePart={closePart}
                    destinations={destinations}
                    compact
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1" />

            {/* CTA — compact/scrolled only */}
            <AnimatePresence>
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.22 }}
                  className="hidden lg:flex items-center gap-2 flex-shrink-0"
                >
                  <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                    className="font-jakarta font-medium text-[13px] text-slate-700 hover:text-slate-900 transition-colors px-3 py-2">
                    💬 WhatsApp
                  </a>
                  <Link href="/contact"
                    className="font-jakarta font-bold text-[13px] text-white px-5 py-2.5 rounded-full hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.38)' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(245,158,11,0.60)')}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.38)')}>
                    Book Free Session →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl hover:bg-slate-900/5 transition-colors flex-shrink-0 flex items-center justify-center"
              onClick={() => setMOpen(o => !o)}
              aria-label={mOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mOpen}
            >
              <div className="w-5 space-y-1.5">
                <motion.span animate={{ rotate: mOpen ? 45 : 0, y: mOpen ? 7 : 0 }}
                  className="h-0.5 bg-slate-900 block rounded-full origin-center" />
                <motion.span animate={{ opacity: mOpen ? 0 : 1 }}
                  className="h-0.5 bg-slate-900 block rounded-full" />
                <motion.span animate={{ rotate: mOpen ? -45 : 0, y: mOpen ? -7 : 0 }}
                  className="h-0.5 bg-slate-900 block rounded-full origin-center" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* ── LAYER 3: NAVIGATION ROW ───────────────────────────────────
            CRITICAL: use visibility+pointer-events to hide, NOT
            overflow-hidden — that would clip the absolute dropdowns.
        ────────────────────────────────────────────────────────────── */}
        <motion.div
          animate={{
            height:         scrolled ? 0   : 58,
            opacity:        scrolled ? 0   : 1,
            pointerEvents:  scrolled ? 'none' : 'auto',
          }}
          transition={{ duration: 0.30, ease: 'easeInOut' }}
          style={{ overflow: 'visible' }}
        >
          <div
            className="container-xl flex items-center justify-between border-t border-slate-900/[0.07]"
            style={{ height: 58 }}
          >
            <NavLinks
              isActive={isActive}
              destOpen={destOpen} partOpen={partOpen}
              openDest={openDest} closeDest={closeDest}
              openPart={openPart} closePart={closePart}
              destinations={destinations}
            />
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                className="font-jakarta font-medium text-sm text-slate-700 hover:text-slate-900 transition-colors px-3 py-2">
                💬 WhatsApp
              </a>
              <Link href="/contact"
                className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.38)' }}>
                Book Free Session →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── SCROLLING ANNOUNCEMENT TICKER (admin-editable) ────────────
            Rendered last so it sits below the navigation row; collapses
            with the rest of the header on scroll via the same `scrolled`
            state, and scrolls continuously with no pause/dismiss control. */}
        <AnnouncementTicker
          items={tickerItems}
          speedSec={tickerSpeed}
          bg={tickerBg}
          textColor={tickerText}
          show={tickerShow}
          collapsed={scrolled}
        />
      </header>

      {/* ── Mobile drawer — full-screen takeover ──────────────────────────
          Rules:
          • fixed inset-0 + h-[100dvh]: fills the entire visual viewport,
            including behind the browser's dynamic address bar on iOS/Android.
          • z-[110]: sits above the sticky header (z-[100]) so nothing bleeds through.
          • lg:hidden: the panel never renders on desktop regardless of state.
          • Flex column: header strip (flex-shrink-0) + scrollable content (flex-1).
          • overflow-y-auto + pb-24 on the scroll container: lets users reach the
            last destination without it hiding behind the phone's home indicator.
          • Body scroll lock is handled by the useEffect above.
      ────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[110] h-[100dvh] lg:hidden flex flex-col"
            style={{
              backgroundColor: bg,
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            }}
          >
            {/* ── Drawer header strip ──────────────────────────────────── */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-900/10">
              {/* Mini logo */}
              <Link href="/" onClick={() => setMOpen(false)} aria-label="Go to homepage">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-900/10">
                  <Image src={logoUrl} alt={brandText} fill className="object-cover" unoptimized />
                </div>
              </Link>

              {/* Close button — 44×44 tap target */}
              <button
                onClick={() => setMOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/8 hover:bg-slate-900/15 active:bg-slate-900/20 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Scrollable content ─────────────────────────────────────
                Each area sits in its own white card on the tinted backdrop
                so the panels are clearly distinguishable (not one flat
                colour). Primary links reuse the same per-tab colours as
                the desktop nav. */}
            <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4">

              {/* Primary nav links — white card, colour-coded pills */}
              <nav className="bg-white/95 rounded-3xl shadow-[0_10px_36px_rgba(0,0,0,0.14)] p-3 flex flex-col gap-2" aria-label="Mobile navigation">
                {NAV.map(({ label, href }, ti) => {
                  if (href === '/destinations' || href === '/partners') return null;
                  const color  = PUB_TAB_COLORS[ti % PUB_TAB_COLORS.length];
                  const active = isActive(href);
                  return (
                    <Link key={href} href={href}
                      className="font-jakarta font-bold text-xl tracking-tight px-5 py-3.5 rounded-2xl transition-transform active:scale-[0.98] flex items-center justify-between"
                      style={active
                        ? { background: color, color: '#ffffff', boxShadow: `0 6px 18px ${color}55` }
                        : { background: `${color}14`, color, border: `1px solid ${color}30` }}
                    >
                      {label}
                      <span className="text-base opacity-60">→</span>
                    </Link>
                  );
                })}
              </nav>

              {/* ── Destinations panel — its own white card ──────────── */}
              <div className="bg-white/95 rounded-3xl shadow-[0_10px_36px_rgba(0,0,0,0.14)] p-5">
                <Link href="/destinations"
                  className="flex items-center justify-between mb-4 font-jakarta font-extrabold text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
                  style={{ color: PUB_TAB_COLORS[3 % PUB_TAB_COLORS.length] }}
                >
                  <span>🌍 Study Destinations</span>
                  <span className="text-base">→</span>
                </Link>
                {/* 2-col grid — readable and thumb-friendly */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {destinations.map(d => (
                    <Link key={d.href} href={d.href}
                      className="font-jakarta font-semibold text-[15px] px-3.5 py-2.5 rounded-xl text-slate-700 bg-slate-50 border border-slate-100 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Partners panel — its own white card ──────────────── */}
              <div className="bg-white/95 rounded-3xl shadow-[0_10px_36px_rgba(0,0,0,0.14)] p-5">
                <Link href="/partners"
                  className="flex items-center justify-between mb-4 font-jakarta font-extrabold text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
                  style={{ color: PUB_TAB_COLORS[6 % PUB_TAB_COLORS.length] }}
                >
                  <span>🤝 Partner With Us</span>
                  <span className="text-base">→</span>
                </Link>
                <div className="flex flex-col gap-2">
                  {PARTNERS.map(d => (
                    <Link key={d.href} href={d.href}
                      className="font-jakarta font-semibold text-[15px] px-3.5 py-2.5 rounded-xl text-slate-700 bg-slate-50 border border-slate-100 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── CTA buttons ──────────────────────────────────────── */}
              <div className="flex flex-col gap-3">
                <Link href="/contact"
                  className="font-jakarta font-bold text-lg text-white py-4 rounded-2xl text-center hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg,#F59E0B,#D97706)',
                    boxShadow: '0 4px 20px rgba(245,158,11,0.40)',
                  }}
                >
                  Book Free Session →
                </Link>
                <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 font-jakarta font-bold text-lg py-4 rounded-2xl text-white hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
                <a href={`tel:${contact.phone}`}
                  className="flex items-center justify-center gap-2 font-jakarta font-bold text-lg py-4 rounded-2xl text-slate-700 bg-slate-900/5 hover:bg-slate-900/8 active:bg-slate-900/12 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  {contact.phone}
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
