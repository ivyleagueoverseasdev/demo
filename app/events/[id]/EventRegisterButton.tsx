'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { useSpring } from 'framer-motion';

interface Props {
  ctaLabel: string;
  cfg: { color: string };
}

export default function EventRegisterButton({ ctaLabel, cfg }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 380, damping: 28 });
  const y = useSpring(0, { stiffness: 380, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.18);
    y.set((e.clientY - r.top  - r.height / 2) * 0.18);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <Link
        href="/contact"
        className="w-full flex items-center justify-center gap-2 font-jakarta font-bold text-sm py-4 rounded-xl text-white transition-opacity hover:opacity-90 active:scale-95"
        style={{
          background: `linear-gradient(135deg,${cfg.color},${cfg.color}CC)`,
          boxShadow: `0 8px 28px ${cfg.color}44`,
        }}
      >
        {ctaLabel} →
      </Link>
    </motion.div>
  );
}
