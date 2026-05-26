'use client';

import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Star, Clock, Globe, ShieldCheck } from 'lucide-react';
import { STATS } from '@/lib/data';

// Icon order matches STATS array in lib/data.ts
// [Students Placed, Visa Rate, JustDial Rating, Years, Partner Unis, Hidden Fees]
const STAT_ICONS = [
  { Icon: GraduationCap, color: '#2D5A99', glow: 'rgba(45,90,153,0.40)'  },
  { Icon: TrendingUp,    color: '#059669', glow: 'rgba(5,150,105,0.40)'  },
  { Icon: Star,          color: '#D97706', glow: 'rgba(217,119,6,0.40)'  },
  { Icon: Clock,         color: '#7C3AED', glow: 'rgba(124,58,237,0.35)' },
  { Icon: Globe,         color: '#1A365D', glow: 'rgba(26,54,93,0.40)'   },
  { Icon: ShieldCheck,   color: '#059669', glow: 'rgba(5,150,105,0.40)'  },
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
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="container-xl py-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {STATS.map((s, i) => {
            const cfg = STAT_ICONS[i] ?? STAT_ICONS[0];
            const { Icon, color, glow } = cfg;
            return (
              <motion.div
                key={s.label}
                variants={item}
                className="text-center py-5 px-3 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-card transition-all duration-300 group"
              >
                {/* Glowing icon */}
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
                  className="font-jakarta font-extrabold leading-none mb-1.5 text-gradient-blue group-hover:text-gradient-amber transition-all"
                  style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}
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
