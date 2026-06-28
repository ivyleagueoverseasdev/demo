'use client';

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export interface ChartPoint {
  date:  string;
  label: string;
  views: number;
}

interface Props { data: ChartPoint[] }

export function TrafficChart({ data }: Props) {
  const hasData = data.some(d => d.views > 0);

  if (!hasData) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
        <span className="text-3xl">📊</span>
        <p className="font-jakarta text-sm">No traffic data yet — check back after your first visitors.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1249C4" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#1249C4" stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fontFamily: 'var(--font-jakarta, sans-serif)', fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval={Math.max(0, Math.floor(data.length / 6) - 1)}
        />

        <YAxis
          tick={{ fontSize: 10, fontFamily: 'var(--font-jakarta, sans-serif)', fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '8px 14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
          labelStyle={{
            color: '#1e293b',
            fontFamily: 'var(--font-jakarta, sans-serif)',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 2,
          }}
          itemStyle={{
            color: '#1249C4',
            fontFamily: 'var(--font-jakarta, sans-serif)',
            fontSize: 13,
            fontWeight: 700,
          }}
        />

        <Area
          type="monotone"
          dataKey="views"
          name="Page Views"
          stroke="#1249C4"
          strokeWidth={2}
          fill="url(#trafficGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#1249C4', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
