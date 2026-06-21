'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppButton from './WhatsAppButton';

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 16V4M4 10l6-6 6 6" />
    </svg>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3">

      {/* ── Scroll-to-top ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.5, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{  scale: 0.90 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{
              background:  'linear-gradient(135deg,#1249C4,#246DFF)',
              boxShadow:   '0 4px 20px rgba(18,73,196,0.35)',
              minWidth: 48, minHeight: 48,
            }}
            aria-label="Scroll to top"
          >
            <ArrowUpIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── WhatsApp widget (FAB + chat popup) ── */}
      <WhatsAppButton />
    </div>
  );
}
