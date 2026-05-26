'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { COMPANY } from '@/lib/data';

const NAV = [
  { label: 'Home',         href: '/'             },
  { label: 'About',        href: '/about'         },
  { label: 'Services',     href: '/services'      },
  { label: 'Destinations', href: '/destinations'  },
  { label: 'Partners',     href: '/partners'      },
  { label: 'Events',       href: '/events'        },
  { label: 'News',         href: '/news'          },
  { label: 'Contact',      href: '/contact'       },
];

const DESTINATIONS = [
  { label: '🇺🇸 USA',       href: '/destinations/usa'       },
  { label: '🇬🇧 UK',        href: '/destinations/uk'        },
  { label: '🇨🇦 Canada',    href: '/destinations/canada'    },
  { label: '🇦🇺 Australia', href: '/destinations/australia' },
  { label: '🇮🇪 Ireland',   href: '/destinations/ireland'   },
];

const PARTNERS = [
  { label: '🏛️ Institutions', href: '/partners/institutions' },
  { label: '🤝 Agents',       href: '/partners/agent'        },
  { label: '🎁 Referral',     href: '/partners/referral'     },
];

// ── Magnetic logo hook ────────────────────────────────────────────────────
function useMagneticLogo() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 600, damping: 28 });
  const y = useSpring(0, { stiffness: 600, damping: 28 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.22);
    y.set((e.clientY - r.top  - r.height / 2) * 0.22);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return { ref, x, y, onMove, onLeave };
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [mOpen,     setMOpen]     = useState(false);
  const [destOpen,  setDestOpen]  = useState(false);
  const [partOpen,  setPartOpen]  = useState(false);
  const pathname = usePathname();
  const logo = useMagneticLogo();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18);
    fn(); // run on mount so SSR/hydration don't flash
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMOpen(false); setDestOpen(false); setPartOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : (pathname?.startsWith(href) ?? false);

  return (
    <>
      {/* ── Top utility bar ── */}
      <div className="hidden md:flex bg-primary-600 text-white/80 text-xs font-jakarta">
        <div className="container-xl flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span>📞</span>{COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span>✉</span>{COMPANY.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">Trusted by 2,500+ Students Since 2020</span>
            <span className="w-px h-3 bg-white/20" />
            <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors">
              <span>💬</span>WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100/80'
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="container-xl flex items-center justify-between h-16">
          {/* Logo — magnetic motion */}
          <motion.a
            ref={logo.ref}
            href="/"
            style={{ x: logo.x, y: logo.y }}
            onMouseMove={logo.onMove}
            onMouseLeave={logo.onLeave}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer select-none"
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-blue"
            >
              <span className="font-jakarta font-black text-white text-[11px]">IL</span>
            </motion.div>
            <div>
              <div className="font-jakarta font-extrabold text-primary-600 leading-none"
                style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', letterSpacing: '-0.02em' }}>
                ILOC
              </div>
              <div className="font-jakarta text-[8px] tracking-widest uppercase text-slate-400 hidden sm:block">Ivy League Overseas</div>
            </div>
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ label, href }) => (
              href === '/destinations' ? (
                <div key={href} className="relative">
                  <button
                    onMouseEnter={() => setDestOpen(true)}
                    onMouseLeave={() => setDestOpen(false)}
                    className={`flex items-center gap-1 font-jakarta font-medium text-sm px-3.5 py-2 rounded-lg transition-all hover:bg-slate-50 ${
                      isActive(href) ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600'
                    }`}
                  >
                    {label}
                    <svg className={`w-3 h-3 transition-transform ${destOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {destOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setDestOpen(true)}
                        onMouseLeave={() => setDestOpen(false)}
                        className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-card-hover border border-slate-100 py-2 overflow-hidden"
                      >
                        {DESTINATIONS.map(d => (
                          <Link key={d.href} href={d.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-jakarta font-medium">
                            {d.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : href === '/partners' ? (
                <div key={href} className="relative">
                  <button
                    onMouseEnter={() => setPartOpen(true)}
                    onMouseLeave={() => setPartOpen(false)}
                    className={`flex items-center gap-1 font-jakarta font-medium text-sm px-3.5 py-2 rounded-lg transition-all hover:bg-slate-50 ${
                      isActive(href) ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600'
                    }`}
                  >
                    {label}
                    <svg className={`w-3 h-3 transition-transform ${partOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {partOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setPartOpen(true)}
                        onMouseLeave={() => setPartOpen(false)}
                        className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-card-hover border border-slate-100 py-2 overflow-hidden"
                      >
                        {PARTNERS.map(d => (
                          <Link key={d.href} href={d.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-jakarta font-medium">
                            {d.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={href} href={href}
                  className={`font-jakarta font-medium text-sm px-3.5 py-2 rounded-lg transition-all hover:bg-slate-50 ${
                    isActive(href) ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600'
                  }`}>
                  {label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-jakarta font-medium text-sm text-slate-600 hover:text-green-600 transition-colors px-3 py-2">
              💬 WhatsApp
            </a>
            <Link href="/contact"
              className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              Book Free Session →
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors"
            onClick={() => setMOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1.5">
              <motion.span animate={{ rotate: mOpen ? 45 : 0, y: mOpen ? 7 : 0 }}
                className="h-0.5 bg-slate-700 block rounded-full transition-all origin-center" />
              <motion.span animate={{ opacity: mOpen ? 0 : 1 }}
                className="h-0.5 bg-slate-700 block rounded-full transition-all" />
              <motion.span animate={{ rotate: mOpen ? -45 : 0, y: mOpen ? -7 : 0 }}
                className="h-0.5 bg-slate-700 block rounded-full transition-all origin-center" />
            </div>
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed top-[calc(36px+64px)] inset-x-0 z-40 bg-white border-b border-slate-100 shadow-xl overflow-hidden"
            style={{ top: '64px' }}
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV.filter(n => n.href !== '/destinations' && n.href !== '/partners').map(({ label, href }) => (
                <Link key={href} href={href}
                  className={`font-jakarta font-medium text-sm px-4 py-3 rounded-xl transition-colors ${
                    isActive(href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                  }`}>
                  {label}
                </Link>
              ))}
              <div className="border-t border-slate-100 my-2" />
              <div className="px-4 pb-1 font-jakarta text-xs font-bold text-slate-400 uppercase tracking-wider">Destinations</div>
              <div className="grid grid-cols-2 gap-2 px-1">
                {DESTINATIONS.map(d => (
                  <Link key={d.href} href={d.href}
                    className="font-jakarta font-medium text-xs px-3 py-2 rounded-lg text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    {d.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-100 my-2" />
              <div className="px-4 pb-1 font-jakarta text-xs font-bold text-slate-400 uppercase tracking-wider">Partners</div>
              <div className="grid grid-cols-2 gap-2 px-1">
                {PARTNERS.map(d => (
                  <Link key={d.href} href={d.href}
                    className="font-jakarta font-medium text-xs px-3 py-2 rounded-lg text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    {d.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-100 my-2" />
              <Link href="/contact"
                className="btn-primary text-sm justify-center py-3 rounded-xl mx-1">
                Book Free Session →
              </Link>
              <a href={COMPANY.wa} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 font-jakarta font-semibold text-sm px-4 py-3 rounded-xl text-white mx-1"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                💬 Chat on WhatsApp
              </a>
              <div className="text-center py-2 text-xs text-slate-400 font-jakarta">
                📞 {COMPANY.phone}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
