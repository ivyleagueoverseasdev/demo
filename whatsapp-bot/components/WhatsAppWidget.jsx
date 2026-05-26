"use client";

/**
 * WhatsAppWidget.jsx
 * ─────────────────────────────────────────────────────────────────
 * Two exports:
 *   default   → Floating bubble (bottom-right, auto-appears after 3s)
 *   WhatsAppCTABanner → Full-width inline section banner
 *
 * Usage:
 *   import WhatsAppWidget, { WhatsAppCTABanner } from "@/components/WhatsAppWidget";
 *   <WhatsAppWidget />          ← add once in layout.jsx
 *   <WhatsAppCTABanner />       ← drop anywhere in a page
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CONFIG ──────────────────────────────────────────────────────
const WA_NUMBER   = "919347812318"; // E.164 without + — test number
const PRE_MESSAGE = "Hi Ivy League Overseas, I want to check my study abroad options.";

function waURL() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(PRE_MESSAGE)}`;
}

// ─── WhatsApp SVG Icon ────────────────────────────────────────────
function WAIcon({ className = "w-7 h-7 fill-current" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Floating Bubble Widget
// ══════════════════════════════════════════════════════════════════
export default function WhatsAppWidget() {
  const [visible,     setVisible]     = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovered,     setHovered]     = useState(false);
  const [dismissed,   setDismissed]   = useState(false);

  // Delay appearance by 3 s so it doesn't distract on first load
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t1);
  }, []);

  // Show tooltip 1 s after bubble appears, auto-hide after 6 s
  useEffect(() => {
    if (!visible) return;
    const t2 = setTimeout(() => {
      setShowTooltip(true);
      const t3 = setTimeout(() => setShowTooltip(false), 6000);
      return () => clearTimeout(t3);
    }, 1000);
    return () => clearTimeout(t2);
  }, [visible]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed bottom-6 right-5 sm:right-6 z-[999] flex flex-col items-end gap-3"
        >
          {/* ── Tooltip bubble ── */}
          <AnimatePresence>
            {(showTooltip || hovered) && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.93 }}
                transition={{ duration: 0.18 }}
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-64"
              >
                {/* Dismiss × */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 text-xs transition-colors"
                  aria-label="Dismiss"
                >
                  ×
                </button>
                <p className="font-semibold text-gray-900 text-sm pr-4 leading-snug">
                  Check your eligibility! 🎓
                </p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Answer 3 quick questions on WhatsApp and get a personalised university shortlist.
                </p>
                {/* Arrow */}
                <div
                  className="absolute -bottom-[7px] right-7 w-3.5 h-3.5 bg-white rotate-45 border-r border-b border-gray-100"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main button ── */}
          <motion.a
            href={waURL()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl text-white cursor-pointer"
            style={{ background: "linear-gradient(145deg, #25D366, #128C7E)" }}
          >
            {/* Outer ping ring */}
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "#25D366" }}
            />
            <WAIcon className="w-8 h-8 fill-white relative z-10" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════
// NAMED EXPORT — Full-width inline CTA Banner
// ══════════════════════════════════════════════════════════════════
export function WhatsAppCTABanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-3xl overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)" }}
    >
      {/* Decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-10 sm:py-12">
        {/* Left — copy */}
        <div className="text-center sm:text-left">
          <span className="inline-block text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Free · No sign-up · Instant response
          </span>
          <h3 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-2">
            Start your journey <br className="hidden sm:block" />
            on WhatsApp 💬
          </h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm">
            3 quick questions. Personalised university shortlist.
            Our counsellor contacts you same day.
          </p>

          {/* Social proof strip */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
            <div className="flex -space-x-2">
              {["NP","GN","YB","AZ"].map((init) => (
                <div
                  key={init}
                  className="w-7 h-7 rounded-full border-2 border-emerald-700 bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white"
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-emerald-200 text-xs font-medium">
              2,500+ students helped
            </p>
          </div>
        </div>

        {/* Right — CTA button */}
        <motion.a
          href={waURL()}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 48px rgba(0,0,0,0.35)" }}
          whileTap={{ scale: 0.97 }}
          className="flex-shrink-0 flex items-center gap-3 bg-white text-emerald-800 font-bold text-sm sm:text-base px-7 sm:px-8 py-4 rounded-2xl shadow-xl cursor-pointer w-full sm:w-auto justify-center"
        >
          <WAIcon className="w-5 h-5 fill-emerald-600" />
          Check My Eligibility →
        </motion.a>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// NAMED EXPORT — Compact inline button (for nav / hero / cards)
// ══════════════════════════════════════════════════════════════════
export function WhatsAppButton({ label = "Apply via WhatsApp", className = "" }) {
  return (
    <motion.a
      href={waURL()}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2.5 font-bold text-white text-sm px-6 py-3 rounded-full cursor-pointer ${className}`}
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      <WAIcon className="w-4 h-4 fill-white" />
      {label}
    </motion.a>
  );
}
