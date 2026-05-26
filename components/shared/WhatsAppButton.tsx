'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const WA_NUMBER = '919158577707';

// ── Types ─────────────────────────────────────────────────────────────────
type Screen = 'menu' | 'countries' | 'country-detail' | 'visa-qa' | 'visa-answer';

interface QA {
  q:       string;
  answer:  string;
  waText:  string;
}

interface Country {
  code:      string;
  flag:      string;
  name:      string;
  highlight: string; // 2026 one-liner shown in detail view
  waText:    string;
}

// ── Static data ───────────────────────────────────────────────────────────
const COUNTRIES: Country[] = [
  {
    code: 'usa', flag: '🇺🇸', name: 'USA',
    highlight: '2026 Intakes: Jan & Aug. STEM OPT 36-month extension active. H-1B lottery opens March.',
    waText: 'Hi Rajib Sir! I want to know more about studying in the USA for 2026. Can we connect?',
  },
  {
    code: 'uk', flag: '🇬🇧', name: 'UK',
    highlight: '2026 Intakes: Jan & Sep. Graduate Route (2-yr PSW) confirmed active. Maintenance: £1,334/mo London.',
    waText: 'Hi Rajib Sir! I want to know more about studying in the UK for 2026. Can we connect?',
  },
  {
    code: 'canada', flag: '🇨🇦', name: 'Canada',
    highlight: '2026 Intakes: Jan & Sep. GIC CAD 10,000 required. Provincial Attestation Letter (PAL) mandatory.',
    waText: 'Hi Rajib Sir! I want to know more about studying in Canada for 2026. Can we connect?',
  },
  {
    code: 'australia', flag: '🇦🇺', name: 'Australia',
    highlight: '2026 Intakes: Feb & Jul. Genuine Student Test active. Living costs AUD 29,710/yr required.',
    waText: 'Hi Rajib Sir! I want to know more about studying in Australia for 2026. Can we connect?',
  },
  {
    code: 'ireland', flag: '🇮🇪', name: 'Ireland',
    highlight: '2026 Intakes: Jan & Sep. Stamp 1G: 24-month stay-back for Masters. No employer tie-in.',
    waText: 'Hi Rajib Sir! I want to know more about studying in Ireland for 2026. Can we connect?',
  },
  {
    code: 'new-zealand', flag: '🇳🇿', name: 'New Zealand',
    highlight: '2026 Intakes: Feb & Jul. Post-study open work visa up to 3 years. Living costs NZD 15,000/yr.',
    waText: 'Hi Rajib Sir! I want to know more about studying in New Zealand for 2026. Can we connect?',
  },
  {
    code: 'singapore', flag: '🇸🇬', name: 'Singapore',
    highlight: '2026 Intakes: Jan & Aug. NUS/NTU QS Top 15. Employment Pass pathway strong for Indian graduates.',
    waText: 'Hi Rajib Sir! I want to know more about studying in Singapore for 2026. Can we connect?',
  },
  {
    code: 'europe', flag: '🇪🇺', name: 'Europe',
    highlight: '2026 Intakes: Sep. Germany: €11,208 blocked account. Schengen work rights post-graduation.',
    waText: 'Hi Rajib Sir! I want to know more about studying in Europe for 2026. Can we connect?',
  },
];

const VISA_QA: QA[] = [
  {
    q: "What are Canada's 2026 fund requirements?",
    answer: "CAD 10,000 in a GIC + CAD 833/month for living costs. The Provincial Attestation Letter (PAL) is now mandatory — provincial quotas fill fast, apply early.",
    waText: "Hi Rajib Sir! I have a question about Canada's 2026 GIC and PAL fund requirements for my study permit. Can we connect?",
  },
  {
    q: "Is the UK 2-year Graduate Route still valid?",
    answer: "Yes — the UK Home Office confirmed the Graduate Route remains open for 2026 intakes. Maintenance funds: £1,334/month in London, £1,023/month outside (up to 9 months = £12,006 max).",
    waText: "Hi Rajib Sir! I want to understand the UK Graduate Route for 2026 and check my eligibility. Can we connect?",
  },
  {
    q: "USA: H-1B & 36-month STEM OPT update?",
    answer: "STEM OPT 36-month extension is active for Bachelor's+ STEM graduates. H-1B lottery opens in March. USCIS premium processing is currently 3–5 months.",
    waText: "Hi Rajib Sir! I want to understand USA STEM OPT and H-1B pathways for Indian students in 2026. Can we talk?",
  },
  {
    q: "Australia Genuine Student (GS) Test?",
    answer: "Australia replaced the GTE with the GST from March 2024. You must show genuine study intent, English readiness, and financial capacity of AUD 29,710/year for living costs.",
    waText: "Hi Rajib Sir! I need help with Australia's Genuine Student Test for my Subclass 500 visa. Can we talk?",
  },
  {
    q: "Ireland's 2-year stay-back rule?",
    answer: "Stamp 1G grants 12 months post-study for Bachelor's and 24 months for Level 9+ Masters. Full open-market work rights — no employer sponsorship required.",
    waText: "Hi Rajib Sir! I want to know about Ireland's Stamp 1G post-study work permit for 2026. Can we discuss?",
  },
  {
    q: "Can I apply without IELTS?",
    answer: "Yes — Canada, Ireland, and Europe accept PTE Academic, Duolingo, or medium-of-instruction certificates. Several UK and Australian universities offer conditional offers too.",
    waText: "Hi Rajib Sir! I want to explore 2026 study abroad options without IELTS. Can you guide me?",
  },
];

// ── Screen title map ───────────────────────────────────────────────────────
const SCREEN_TITLES: Record<Screen, string> = {
  'menu':           'Chat with Rajib Sir',
  'countries':      'Choose Destination',
  'country-detail': 'Country Guide',
  'visa-qa':        'Visa & Policies 2026',
  'visa-answer':    'Quick Answer',
};

// ── Slide transition variants ─────────────────────────────────────────────
// direction: 1 = forward (slide left), -1 = back (slide right)
const slideVariants = (dir: number) => ({
  initial: { opacity: 0, x: dir * 28 },
  animate: { opacity: 1, x: 0,        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: dir * -28, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
});

// ── SVG icons ─────────────────────────────────────────────────────────────
function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.554 4.11 1.524 5.834L0 24l6.334-1.514A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.959 16.959c-.25.702-1.46 1.34-2.008 1.424-.513.077-1.162.11-1.875-.118a17.33 17.33 0 01-1.697-.634C9.568 16.518 7.8 14.13 7.667 13.96c-.133-.17-1.083-1.437-1.083-2.742 0-1.305.683-1.947.925-2.213.242-.267.529-.334.705-.334l.51.01c.163.007.383-.062.6.457.223.538.757 1.86.824 1.996.066.136.11.294.021.471-.088.178-.132.288-.264.444-.132.157-.278.35-.397.47-.132.133-.27.277-.116.542.154.266.683 1.127 1.466 1.826.757.677 1.394.887 1.66 1.02.266.133.42.111.574-.067.155-.177.66-.77.836-1.033.177-.264.354-.22.596-.133.242.088 1.534.724 1.796.857.263.133.44.2.505.309.065.11.065.639-.184 1.34z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5l-5 5 5 5" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5l5 5-5 5" />
    </svg>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────
export default function WhatsAppButton() {
  const router = useRouter();

  const [visible,        setVisible]        = useState(false);
  const [open,           setOpen]           = useState(false);
  const [screen,         setScreen]         = useState<Screen>('menu');
  const [navDir,         setNavDir]         = useState(1);   // 1 = forward, -1 = back
  const [activeAnswer,   setActiveAnswer]   = useState<QA | null>(null);
  const [activeCountry,  setActiveCountry]  = useState<Country | null>(null);
  const [menuSelected,   setMenuSelected]   = useState(0);

  // Appear after 200px scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // External trigger: "Chat on WhatsApp" hero button
  useEffect(() => {
    const handleOpen = () => { setVisible(true); setOpen(true); goTo('menu', 1); };
    window.addEventListener('open-iloc-chat', handleOpen);
    return () => window.removeEventListener('open-iloc-chat', handleOpen);
  }, []);

  // Navigation helpers
  const goTo = (s: Screen, dir = 1) => { setNavDir(dir); setScreen(s); };
  const goBack = () => {
    if (screen === 'countries')      goTo('menu', -1);
    else if (screen === 'country-detail') goTo('countries', -1);
    else if (screen === 'visa-qa')   goTo('menu', -1);
    else if (screen === 'visa-answer') goTo('visa-qa', -1);
    else goTo('menu', -1);
  };

  const openCountry = (c: Country) => { setActiveCountry(c); goTo('country-detail', 1); };
  const openAnswer  = (qa: QA)      => { setActiveAnswer(qa); goTo('visa-answer', 1); };

  const waUrl = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  const isMenu = screen === 'menu';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: 20  }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* ── Chat card ── */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9  }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: 50, scale: 0.9  }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                className="w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] rounded-2xl flex flex-col overflow-hidden"
                style={{
                  boxShadow: '0 20px 60px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {/* ── Fixed header ── */}
                <div
                  className="flex-shrink-0 px-4 py-3.5"
                  style={{ background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Back button — shown on all non-menu screens */}
                      <AnimatePresence>
                        {!isMenu && (
                          <motion.button
                            initial={{ opacity: 0, width: 0, marginRight: 0 }}
                            animate={{ opacity: 1, width: 20, marginRight: 2 }}
                            exit={{    opacity: 0, width: 0,  marginRight: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={goBack}
                            className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center flex-shrink-0"
                            aria-label="Go back"
                          >
                            <ChevronLeft />
                          </motion.button>
                        )}
                      </AnimatePresence>
                      <WaIcon className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="font-jakarta font-bold text-sm text-white truncate">
                        {SCREEN_TITLES[screen]}
                      </span>
                    </div>
                    <button
                      onClick={() => { setOpen(false); goTo('menu', 1); }}
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center flex-shrink-0 ml-2"
                      aria-label="Close"
                    >
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 1l10 10M11 1L1 11" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    <span className="font-jakarta text-[10px] text-white/80">Online · Usually replies instantly</span>
                  </div>
                </div>

                {/* ── Fixed founder row ── */}
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-jakarta font-black text-sm text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1A365D 0%,#2D5A99 100%)' }}
                  >
                    RP
                  </div>
                  <div className="min-w-0">
                    <div className="font-jakarta font-bold text-slate-800 text-[13px] leading-tight">Rajib Paul Choudhury</div>
                    <div className="font-jakarta text-[11px] text-slate-400 mt-0.5">Head Counsellor · 7+ Years Experience</div>
                  </div>
                </div>

                {/* ── Scrollable / animated screen area ── */}
                <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'none' }}>
                  <AnimatePresence mode="wait" custom={navDir}>
                    {/* ── MENU ── */}
                    {screen === 'menu' && (
                      <motion.div
                        key="menu"
                        custom={navDir}
                        variants={slideVariants(navDir)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="px-3 pt-4 pb-4 space-y-1.5"
                      >
                        <p className="font-jakarta text-[10px] text-slate-400 px-1 pb-1 uppercase tracking-wider">What brings you here?</p>

                        {/* Book Free Session */}
                        <button
                          onClick={() => setMenuSelected(0)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border transition-all text-left"
                          style={{
                            borderColor: menuSelected === 0 ? '#25D366' : '#E2E8F0',
                            background:  menuSelected === 0 ? '#F0FDF4' : '#F8FAFC',
                            color:       menuSelected === 0 ? '#15803D' : '#475569',
                          }}
                        >
                          <span className="text-base">🎓</span>
                          <span className="font-jakarta text-sm font-semibold flex-1">Book Free Session</span>
                          {menuSelected === 0 && <span className="text-[11px] font-bold text-green-500">✓</span>}
                        </button>

                        {/* Country Enquiry — navigates into country list */}
                        <button
                          onClick={() => goTo('countries', 1)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all text-left"
                        >
                          <span className="text-base">🌍</span>
                          <span className="font-jakarta text-sm font-semibold flex-1">Country Enquiry</span>
                          <ChevronRight />
                        </button>

                        {/* Visa & Policies */}
                        <button
                          onClick={() => goTo('visa-qa', 1)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-left"
                        >
                          <span className="text-base">🛂</span>
                          <span className="font-jakarta text-sm font-semibold flex-1">Visa & Policies (2026)</span>
                          <ChevronRight />
                        </button>

                        {/* Instant Chat */}
                        <button
                          onClick={() => setMenuSelected(3)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border transition-all text-left"
                          style={{
                            borderColor: menuSelected === 3 ? '#25D366' : '#E2E8F0',
                            background:  menuSelected === 3 ? '#F0FDF4' : '#F8FAFC',
                            color:       menuSelected === 3 ? '#15803D' : '#475569',
                          }}
                        >
                          <span className="text-base">💬</span>
                          <span className="font-jakarta text-sm font-semibold flex-1">Instant Chat</span>
                          {menuSelected === 3 && <span className="text-[11px] font-bold text-green-500">✓</span>}
                        </button>

                        <div className="pt-1">
                          <a
                            href={waUrl(
                              menuSelected === 0
                                ? 'Hi Rajib Sir! I want to book a free 30-minute counselling session to discuss my study abroad options.'
                                : 'Hi Rajib Sir! I found you on your website and want to chat about my study abroad plans.'
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-jakarta font-bold text-sm text-white transition-opacity hover:opacity-90"
                            style={{
                              background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)',
                              boxShadow: '0 4px 20px rgba(37,211,102,0.30)',
                            }}
                          >
                            <WaIcon className="w-4 h-4 text-white" />
                            Start Chat on WhatsApp →
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* ── COUNTRIES LIST ── */}
                    {screen === 'countries' && (
                      <motion.div
                        key="countries"
                        custom={navDir}
                        variants={slideVariants(navDir)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="px-3 pt-4 pb-4"
                      >
                        <p className="font-jakarta text-[10px] text-slate-400 px-1 pb-2 uppercase tracking-wider">Select a destination</p>
                        <div className="grid grid-cols-2 gap-2">
                          {COUNTRIES.map(c => (
                            <button
                              key={c.code}
                              onClick={() => openCountry(c)}
                              className="flex items-center gap-2.5 px-3 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary-200 hover:bg-primary-50 transition-all text-left group"
                            >
                              <span className="text-xl leading-none flex-shrink-0">{c.flag}</span>
                              <div className="min-w-0">
                                <div className="font-jakarta text-xs font-bold text-slate-800 group-hover:text-primary-700 transition-colors truncate">{c.name}</div>
                                <div className="font-jakarta text-[10px] text-slate-400 group-hover:text-primary-500 transition-colors">2026 Guide</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ── COUNTRY DETAIL ── */}
                    {screen === 'country-detail' && activeCountry && (
                      <motion.div
                        key="country-detail"
                        custom={navDir}
                        variants={slideVariants(navDir)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="px-4 pt-4 pb-4"
                      >
                        {/* Country badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl leading-none">{activeCountry.flag}</span>
                          <div>
                            <div className="font-jakarta font-extrabold text-slate-800 text-base leading-tight">Study in {activeCountry.name}</div>
                            <div className="font-jakarta text-[11px] text-amber-600 font-semibold mt-0.5">2026 ILOC Guide</div>
                          </div>
                        </div>

                        {/* Highlight box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
                          <p className="font-jakarta text-[11px] text-slate-700 leading-relaxed font-medium">
                            {activeCountry.highlight}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2.5">
                          <button
                            onClick={() => {
                              setOpen(false);
                              router.push(`/destinations/${activeCountry.code}`);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-jakarta font-bold text-sm text-white transition-opacity hover:opacity-90"
                            style={{
                              background: 'linear-gradient(135deg,#1A365D 0%,#2D5A99 100%)',
                              boxShadow: '0 4px 16px rgba(26,54,93,0.25)',
                            }}
                          >
                            📖 Read Full {activeCountry.name} Guide
                          </button>

                          <a
                            href={waUrl(activeCountry.waText)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-jakarta font-bold text-sm text-white transition-opacity hover:opacity-90"
                            style={{
                              background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)',
                              boxShadow: '0 4px 16px rgba(37,211,102,0.28)',
                            }}
                          >
                            <WaIcon className="w-4 h-4 text-white" />
                            Chat about {activeCountry.name}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* ── VISA Q&A LIST ── */}
                    {screen === 'visa-qa' && (
                      <motion.div
                        key="visa-qa"
                        custom={navDir}
                        variants={slideVariants(navDir)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="px-3 pt-4 pb-4"
                      >
                        <p className="font-jakarta text-[10px] text-slate-400 px-1 pb-2 uppercase tracking-wider">Select a question</p>
                        <div className="space-y-1.5">
                          {VISA_QA.map(qa => (
                            <button
                              key={qa.q}
                              onClick={() => openAnswer(qa)}
                              className="w-full flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
                            >
                              <span className="font-jakarta text-xs font-semibold text-slate-700 flex-1 leading-snug group-hover:text-blue-700 transition-colors">{qa.q}</span>
                              <ChevronRight />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ── VISA ANSWER ── */}
                    {screen === 'visa-answer' && activeAnswer && (
                      <motion.div
                        key="visa-answer"
                        custom={navDir}
                        variants={slideVariants(navDir)}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="px-4 pt-4 pb-4"
                      >
                        <p className="font-jakarta text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-2">Quick Answer</p>
                        <p className="font-jakarta text-[12px] text-slate-800 leading-snug mb-3 font-semibold">{activeAnswer.q}</p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-4">
                          <p className="font-jakarta text-xs text-slate-700 leading-relaxed">{activeAnswer.answer}</p>
                        </div>
                        <a
                          href={waUrl(activeAnswer.waText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-jakarta font-bold text-sm text-white transition-opacity hover:opacity-90"
                          style={{
                            background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)',
                            boxShadow: '0 4px 20px rgba(37,211,102,0.28)',
                          }}
                        >
                          <WaIcon className="w-4 h-4 text-white" />
                          Chat with Rajib Sir to apply →
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FAB ── */}
          <motion.button
            onClick={() => { setOpen(o => !o); if (open) goTo('menu', 1); }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)' }}
            aria-label={open ? 'Close WhatsApp widget' : 'Open WhatsApp widget'}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.svg
                  key="close"
                  viewBox="0 0 14 14"
                  className="w-5 h-5"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0   }}
                  exit={{    scale: 0, rotate:  90  }}
                  transition={{ duration: 0.18 }}
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </motion.svg>
              ) : (
                <motion.div
                  key="wa"
                  initial={{ scale: 0, rotate:  90 }}
                  animate={{ scale: 1, rotate: 0   }}
                  exit={{    scale: 0, rotate: -90  }}
                  transition={{ duration: 0.18 }}
                >
                  <WaIcon className="w-7 h-7 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {!open && (
              <span
                className="absolute inset-0 rounded-full animate-ping pointer-events-none"
                style={{ background: 'rgba(37,211,102,0.28)' }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
