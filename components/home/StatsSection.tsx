'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Star, Clock, Globe, ShieldCheck, Award, Users, BookOpen, Building } from 'lucide-react';
import { STATS } from '@/lib/data';
import type { Stat } from '@/lib/types';

// Icon pool — cycles through if there are more stats than icons
const ICON_POOL = [
  { Icon: GraduationCap, color: '#246DFF', glow: 'rgba(36,109,255,0.40)'  },
  { Icon: TrendingUp,    color: '#059669', glow: 'rgba(5,150,105,0.40)'  },
  { Icon: Star,          color: '#D97706', glow: 'rgba(217,119,6,0.40)'  },
  { Icon: Clock,         color: '#7C3AED', glow: 'rgba(124,58,237,0.35)' },
  { Icon: Globe,         color: '#246DFF', glow: 'rgba(36,109,255,0.40)' },
  { Icon: ShieldCheck,   color: '#059669', glow: 'rgba(5,150,105,0.40)'  },
  { Icon: Award,         color: '#D97706', glow: 'rgba(217,119,6,0.40)'  },
  { Icon: Users,         color: '#246DFF', glow: 'rgba(36,109,255,0.40)' },
  { Icon: BookOpen,      color: '#7C3AED', glow: 'rgba(124,58,237,0.35)' },
  { Icon: Building,      color: '#059669', glow: 'rgba(5,150,105,0.40)'  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};
const item = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(STATS);

  useEffect(() => {
    fetch('/api/stats', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => { if (d?.stats?.length) setStats(d.stats); })
      .catch(() => {});
  }, []);

  const cols =
    stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
    stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
    stats.length === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';

  return (
    <section className="bg-gradient-to-b from-white to-slate-50/60">
      <div className="container-xl py-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          className={`grid ${cols} gap-4`}
        >
          {stats.map((s, i) => {
            const cfg = ICON_POOL[i % ICON_POOL.length];
            const { Icon, color, glow } = cfg;
            return (
              <motion.div
                key={`stat-${i}`}
                variants={item}
                className="text-center py-5 px-3 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-[0_0_24px_rgba(217,119,6,0.16),0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                  <Icon
                    style={{
                      width: 17, height: 17, color,
                      filter: `drop-shadow(0 0 6px ${glow})`,
                    }}
                    strokeWidth={1.75}
                  />
                </div>
                <div
                  className="font-jakarta font-extrabold text-2xl md:text-3xl leading-none mb-1.5 text-gradient-homeblue group-hover:text-gradient-amber transition-all"
                >
                  {s.num}
                </div>
                <div className="font-jakarta text-xs font-medium text-slate-500 leading-snug">{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
