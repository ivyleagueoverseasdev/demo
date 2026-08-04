'use client';

import { useState, useCallback } from 'react';

export interface ChartPoint {
  date:  string;
  label: string;
  views: number;
  uniqueVisitors?: number;
  newVisitors?: number;
}

// ── SVG coordinate constants ──────────────────────────────────────────────────
const W   = 600;
const H   = 200;
const PAD = { top: 8, right: 8, bottom: 30, left: 36 } as const;
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top  - PAD.bottom;

const VIEWS_COLOR  = '#1249C4';
const UNIQUE_COLOR = '#D97706';

export function TrafficChart({ data }: { data: ChartPoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const hasData = data.some(d => d.views > 0);

  // Scale both series off the SAME max so they're visually comparable —
  // Unique Visitors is always ≤ Page Views (one visitor can view many
  // pages), so this makes that relationship legible at a glance instead of
  // the two lines being independently auto-scaled and looking misleading.
  const maxV = hasData ? Math.max(...data.map(d => d.views), 1) : 1;

  const pts = data.map((d, i) => ({
    ...d,
    x:  PAD.left + (i / Math.max(data.length - 1, 1)) * CHART_W,
    y:  PAD.top  + CHART_H - (d.views / maxV) * CHART_H,
    yU: PAD.top  + CHART_H - ((d.uniqueVisitors ?? 0) / maxV) * CHART_H,
  }));

  // Build SVG path strings — Page Views (area + line)
  const lineParts = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  const linePath  = lineParts.join(' ');
  const areaPath  = [
    ...lineParts,
    `L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + CHART_H).toFixed(1)}`,
    `L${pts[0].x.toFixed(1)},${(PAD.top + CHART_H).toFixed(1)}`,
    'Z',
  ].join(' ');

  // Unique Visitors — line only (no fill), drawn on top for comparison
  const uniqueLinePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.yU.toFixed(1)}`).join(' ');

  // Y-axis: 3 evenly spaced ticks
  const yTick1 = Math.round(maxV / 2);
  const yTicks  = [0, yTick1, maxV];

  // X-axis: ~6 labels spread evenly
  const xStep  = Math.max(1, Math.floor(data.length / 6));
  const xTicks = pts.filter((_, i) => i % xStep === 0 || i === pts.length - 1);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx   = ((e.clientX - rect.left) / rect.width) * W;
      let   best = 0;
      let   dist = Infinity;
      pts.forEach((p, i) => {
        const d = Math.abs(p.x - mx);
        if (d < dist) { dist = d; best = i; }
      });
      setHoverIdx(best);
    },
    [pts],
  );

  if (!hasData) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
        <span className="text-3xl">📊</span>
        <p className="font-jakarta text-sm">No traffic data yet — check back after your first visitors.</p>
      </div>
    );
  }

  const hov  = hoverIdx !== null ? pts[hoverIdx] : null;
  // Clamp tooltip x so it stays inside the SVG
  const tipX = hov ? Math.max(50, Math.min(W - 50, hov.x)) : 0;
  // Keep tooltip above the higher of the two dots but inside the chart top
  const tipY = hov ? Math.max(PAD.top + 2, Math.min(hov.y, hov.yU) - 62) : 0;

  return (
    <div>
      {/* Legend — makes the two series unambiguous */}
      <div className="flex items-center gap-4 mb-2 px-1">
        <span className="flex items-center gap-1.5 font-jakarta text-[11px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VIEWS_COLOR }} />
          Page Views
        </span>
        <span className="flex items-center gap-1.5 font-jakarta text-[11px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: UNIQUE_COLOR }} />
          Unique Visitors
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none"
        style={{ height: 224 }}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="trafGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={VIEWS_COLOR} stopOpacity={0.2} />
            <stop offset="95%" stopColor={VIEWS_COLOR} stopOpacity={0}   />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => {
          const gy = PAD.top + CHART_H - (tick / maxV) * CHART_H;
          return (
            <line key={i}
              x1={PAD.left} y1={gy} x2={W - PAD.right} y2={gy}
              stroke="#f1f5f9" strokeWidth={1}
            />
          );
        })}

        {/* Page Views — area fill + line */}
        <path d={areaPath} fill="url(#trafGrad)" />
        <path d={linePath} fill="none"
          stroke={VIEWS_COLOR} strokeWidth={2}
          strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Unique Visitors — distinct dashed line, drawn on top */}
        <path d={uniqueLinePath} fill="none"
          stroke={UNIQUE_COLOR} strokeWidth={2} strokeDasharray="5 3"
          strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => {
          const gy = PAD.top + CHART_H - (tick / maxV) * CHART_H;
          return (
            <text key={i}
              x={PAD.left - 5} y={gy + 4}
              textAnchor="end" fontSize={10} fill="#94a3b8" fontFamily="sans-serif"
            >
              {tick}
            </text>
          );
        })}

        {/* X-axis labels */}
        {xTicks.map((p, i) => (
          <text key={i}
            x={p.x} y={H - 6}
            textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="sans-serif"
          >
            {p.label}
          </text>
        ))}

        {/* Hover layer */}
        {hov && (
          <>
            {/* Vertical cursor line */}
            <line
              x1={hov.x} y1={PAD.top}
              x2={hov.x} y2={PAD.top + CHART_H}
              stroke="#94a3b8" strokeWidth={1}
              strokeDasharray="4 3" strokeOpacity={0.35}
            />

            {/* Active dots — one per series */}
            <circle cx={hov.x} cy={hov.y} r={4} fill={VIEWS_COLOR} stroke="white" strokeWidth={2} />
            <circle cx={hov.x} cy={hov.yU} r={4} fill={UNIQUE_COLOR} stroke="white" strokeWidth={2} />

            {/* Tooltip box */}
            <rect
              x={tipX - 50} y={tipY}
              width={100} height={50}
              rx={7} ry={7}
              fill="white" stroke="#e2e8f0" strokeWidth={1}
            />
            <text
              x={tipX} y={tipY + 13}
              textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="sans-serif"
            >
              {hov.label}
            </text>
            <text
              x={tipX} y={tipY + 27}
              textAnchor="middle" fontSize={11} fontWeight="bold" fill={VIEWS_COLOR} fontFamily="sans-serif"
            >
              {hov.views.toLocaleString()} views
            </text>
            <text
              x={tipX} y={tipY + 41}
              textAnchor="middle" fontSize={11} fontWeight="bold" fill={UNIQUE_COLOR} fontFamily="sans-serif"
            >
              {(hov.uniqueVisitors ?? 0).toLocaleString()} unique
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
