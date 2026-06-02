'use client';

import { motion, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

interface Props {
  ctaLabel: string;
  ctaUrl?:  string;
  cfg: { color: string };
}

export default function EventRegisterButton({ ctaLabel, ctaUrl, cfg }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 380, damping: 28 });
  const y = useSpring(0, { stiffness: 380, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.18);
    y.set((e.clientY - r.top  - r.height / 2) * 0.18);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const href = ctaUrl || '/contact';
  const isExternal = href.startsWith('http');

  const btnClass = 'w-full flex items-center justify-center gap-2 font-jakarta font-bold text-sm py-4 rounded-xl text-white transition-opacity hover:opacity-90 active:scale-95';
  const btnStyle = {
    background: `linear-gradient(135deg,${cfg.color},${cfg.color}CC)`,
    boxShadow:  `0 8px 28px ${cfg.color}44`,
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass} style={btnStyle}>
          {ctaLabel} →
        </a>
      ) : (
        <Link href={href} className={btnClass} style={btnStyle}>
          {ctaLabel} →
        </Link>
      )}
    </motion.div>
  );
}
