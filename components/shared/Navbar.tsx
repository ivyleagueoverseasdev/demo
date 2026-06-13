'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { COMPANY, buildWhatsAppLink } from '@/lib/data';

// ── Nav data ──────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Home',         href: '/'            },
  { label: 'About',        href: '/about'        },
  { label: 'Services',     href: '/services'     },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Partners',     href: '/partners'     },
  { label: 'Events & Classes', href: '/events'   },
  { label: 'News',         href: '/news'         },
  { label: 'Contact',      href: '/contact'      },
];

const DESTINATIONS = [
  { label: '🇺🇸 United States', href: '/destinations/usa'        },
  { label: '🇬🇧 United Kingdom', href: '/destinations/uk'        },
  { label: '🇨🇦 Canada',      href: '/destinations/canada'      },
  { label: '🇦🇺 Australia',   href: '/destinations/australia'   },
  { label: '🇮🇪 Ireland',     href: '/destinations/ireland'     },
  { label: '🇳🇿 New Zealand', href: '/destinations/new-zealand' },
  { label: '🇪🇺 Europe',      href: '/destinations/europe'      },
  { label: '🇦🇪 UAE',         href: '/destinations/uae'         },
  { label: '🇯🇵 Japan',       href: '/destinations/japan'       },
  { label: '🇰🇷 South Korea', href: '/destinations/south-korea' },
  { label: '🇸🇬 Singapore',   href: '/destinations/singapore'   },
  { label: '🇷🇺 Russia',      href: '/destinations/russia'      },
];

const PARTNERS = [
  { label: '🏛️ Institutions', href: '/partners/institutions' },
  { label: '🤝 Agents',       href: '/partners/agent'        },
  { label: '🎁 Referral',     href: '/partners/referral'     },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Full expanded header height: infobar(36) + brand(148) + nav(58) = 242px
export const HEADER_HEIGHT = 242;
// Compact sticky height when scrolled
const STICKY_H = 68;

// ── Dropdown menu — rendered outside any overflow-hidden ancestor ─────────
// By placing it as `fixed` we escape any clipping context entirely.
function DestDropdown({
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
          className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100/80 py-2 z-[200]"
        >
          <div className="px-4 pt-2 pb-1.5">
            <span className="font-jakarta text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Study Destinations
            </span>
          </div>
          <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
            {DESTINATIONS.map(d => (
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

// ── Nav links — label routes, chevron toggles dropdown ───────────────────
function NavLinks({
  isActive, destOpen, partOpen, openDest, closeDest, openPart, closePart, compact,
}: {
  isActive: (h: string) => boolean;
  destOpen: boolean; partOpen: boolean;
  openDest: () => void; closeDest: () => void;
  openPart: () => void; closePart: () => void;
  compact?: boolean;
}) {
  const px = compact ? 'px-2.5 py-1.5' : 'px-3 py-2';
  const fs = compact ? 'text-[12.5px]' : 'text-[13.5px]';
  const active = 'text-lime-900 bg-slate-900/10';
  const idle   = 'text-slate-800 hover:text-slate-900 hover:bg-slate-900/5';

  return (
    <nav className="hidden lg:flex items-center gap-0">
      {NAV.map(({ label, href }) => {
        const isDestinations = href === '/destinations';
        const isPartners     = href === '/partners';

        if (isDestinations) {
          return (
            // Wrapper: relative so dropdown positions correctly; NO overflow-hidden here
            <div key={href} className="relative flex items-center" onMouseEnter={openDest} onMouseLeave={closeDest}>
              {/* Clickable label → navigates */}
              <Link href={href}
                className={`font-jakarta font-semibold ${fs} pl-3 pr-1 py-2 rounded-l-lg transition-all ${
                  isActive(href) ? active : idle
                }`}>
                {label}
              </Link>
              {/* Separate chevron → toggles dropdown only */}
              <button
                onClick={e => { e.preventDefault(); destOpen ? closeDest() : openDest(); }}
                className={`font-jakarta ${px} rounded-r-lg transition-all ${isActive(href) ? active : idle} pl-0`}
                aria-label="Toggle destinations menu"
              >
                <svg className={`w-3 h-3 transition-transform duration-200 ${destOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <DestDropdown open={destOpen} onEnter={openDest} onLeave={closeDest} />
            </div>
          );
        }

        if (isPartners) {
          return (
            <div key={href} className="relative flex items-center" onMouseEnter={openPart} onMouseLeave={closePart}>
              <Link href={href}
                className={`font-jakarta font-semibold ${fs} pl-3 pr-1 py-2 rounded-l-lg transition-all ${
                  isActive(href) ? active : idle
                }`}>
                {label}
              </Link>
              <button
                onClick={e => { e.preventDefault(); partOpen ? closePart() : openPart(); }}
                className={`font-jakarta ${px} rounded-r-lg transition-all ${isActive(href) ? active : idle} pl-0`}
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
            className={`font-jakarta font-semibold ${fs} ${px} rounded-lg transition-all ${
              isActive(href) ? active : idle
            }`}>
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
  const [logoUrl,   setLogoUrl]   = useState('/logo2.png');
  const [brandText, setBrandText] = useState('IVY LEAGUE OVERSEAS CONSULTING');
  const [contact,   setContact]   = useState<{ phone: string; email: string; wa: string }>({ phone: COMPANY.phone, email: COMPANY.email, wa: COMPANY.wa });

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

  useEffect(() => { setMOpen(false); setDestOpen(false); setPartOpen(false); }, [pathname]);

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

            {/* Business title: fade + slide from left, staggered */}
            <Link href="/" className="flex-shrink-0 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -22 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                whileHover={{
                  textShadow: '0 0 28px rgba(0,0,0,0.12)',
                  transition: { duration: 0.25 },
                }}
              >
                <motion.div
                  animate={{ fontSize: scrolled ? '1.2rem' : 'clamp(1.5rem,2.8vw,2.6rem)' }}
                  transition={{ duration: 0.32, ease: 'easeInOut' }}
                  className="font-jakarta font-black text-slate-900 leading-tight tracking-tight"
                >
                  {brandText}
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
                    className="font-jakarta font-bold text-[13px] text-white px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.38)' }}>
                    Book Free Session →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-900/5 transition-colors flex-shrink-0"
              onClick={() => setMOpen(o => !o)}
              aria-label="Toggle menu"
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
            />
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                className="font-jakarta font-medium text-sm text-slate-700 hover:text-slate-900 transition-colors px-3 py-2">
                💬 WhatsApp
              </a>
              <Link href="/contact"
                className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', boxShadow: '0 4px 14px rgba(245,158,11,0.38)' }}>
                Book Free Session →
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 z-[90] shadow-2xl"
            style={{
              top: scrolled ? `${STICKY_H}px` : `${HEADER_HEIGHT}px`,
              backgroundColor: bg,
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
            }}
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV.filter(n => n.href !== '/destinations' && n.href !== '/partners').map(({ label, href }) => (
                <Link key={href} href={href}
                  className={`font-jakarta font-medium text-sm px-4 py-3 rounded-xl transition-colors ${
                    isActive(href) ? 'text-lime-900 bg-slate-900/10' : 'text-slate-800 hover:bg-slate-900/5'
                  }`}>
                  {label}
                </Link>
              ))}
              <div className="border-t border-slate-900/10 my-2" />
              <Link href="/destinations"
                className="px-4 pb-1 font-jakarta text-[10px] font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                Destinations →
              </Link>
              <div className="grid grid-cols-2 gap-1 px-1">
                {DESTINATIONS.map(d => (
                  <Link key={d.href} href={d.href}
                    className="font-jakarta font-medium text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 transition-colors">
                    {d.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-900/10 my-2" />
              <Link href="/partners"
                className="px-4 pb-1 font-jakarta text-[10px] font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                Partners →
              </Link>
              <div className="grid grid-cols-2 gap-1 px-1">
                {PARTNERS.map(d => (
                  <Link key={d.href} href={d.href}
                    className="font-jakarta font-medium text-xs px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 transition-colors">
                    {d.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-900/10 my-2" />
              <Link href="/contact"
                className="font-jakarta font-bold text-sm text-white py-3 rounded-xl mx-1 text-center hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
                Book Free Session →
              </Link>
              <a href={contact.wa} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-4 py-3 rounded-xl text-white mx-1 hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                💬 Chat on WhatsApp
              </a>
              <p className="text-center py-2 text-xs text-slate-600 font-jakarta">📞 {contact.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
