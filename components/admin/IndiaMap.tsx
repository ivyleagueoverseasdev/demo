'use client';

/**
 * India state-wise traffic tile map (cartogram).
 * Each state/UT is a tile placed on a grid that approximates India's shape —
 * lightweight (no geo data) and readable at dashboard sizes. Tiles are
 * heat-coloured by visit count over the last 30 days.
 */

export interface IndiaStateStat {
  code:  string;   // ISO 3166-2:IN code e.g. "MH"
  name:  string;   // "Maharashtra"
  count: number;
  pct:   number;
}

// Grid positions (x = column, y = row) roughly matching India's outline.
const TILES: { code: string; x: number; y: number }[] = [
  { code: 'JK', x: 3, y: 0 }, { code: 'LA', x: 4, y: 0 },
  { code: 'PB', x: 3, y: 1 }, { code: 'HP', x: 4, y: 1 },
  { code: 'HR', x: 3, y: 2 }, { code: 'UK', x: 4, y: 2 }, { code: 'AR', x: 8, y: 2 },
  { code: 'RJ', x: 2, y: 3 }, { code: 'DL', x: 3, y: 3 }, { code: 'UP', x: 4, y: 3 },
  { code: 'BR', x: 5, y: 3 }, { code: 'SK', x: 6, y: 3 }, { code: 'AS', x: 7, y: 3 },
  { code: 'NL', x: 8, y: 3 },
  { code: 'GJ', x: 1, y: 4 }, { code: 'MP', x: 3, y: 4 }, { code: 'JH', x: 5, y: 4 },
  { code: 'WB', x: 6, y: 4 }, { code: 'ML', x: 7, y: 4 }, { code: 'MN', x: 8, y: 4 },
  { code: 'MH', x: 2, y: 5 }, { code: 'CG', x: 4, y: 5 }, { code: 'OR', x: 5, y: 5 },
  { code: 'TR', x: 7, y: 5 }, { code: 'MZ', x: 8, y: 5 },
  { code: 'GA', x: 1, y: 6 }, { code: 'TG', x: 3, y: 6 },
  { code: 'KA', x: 2, y: 7 }, { code: 'AP', x: 4, y: 7 },
  { code: 'TN', x: 3, y: 8 }, { code: 'PY', x: 4, y: 8 },
  { code: 'KL', x: 2, y: 9 }, { code: 'AN', x: 6, y: 9 },
];

// Alias codes that geolocation providers sometimes emit
const CODE_ALIASES: Record<string, string> = { CT: 'CG', OD: 'OR', TS: 'TG', UT: 'UK', DN: 'GJ', DD: 'GJ', CH: 'PB', LD: 'KL' };

const COLS = 9;
const ROWS = 10;

function heat(count: number, max: number): { bg: string; fg: string } {
  if (count <= 0) return { bg: '#F1F5F9', fg: '#94A3B8' };
  const t = Math.min(1, count / Math.max(1, max));
  if (t < 0.25) return { bg: '#DBEAFE', fg: '#1E40AF' };
  if (t < 0.5)  return { bg: '#93C5FD', fg: '#1E3A8A' };
  if (t < 0.75) return { bg: '#3B82F6', fg: '#FFFFFF' };
  return { bg: '#1D4ED8', fg: '#FFFFFF' };
}

export default function IndiaMap({ states }: { states: IndiaStateStat[] }) {
  // Merge alias codes into their canonical tile
  const counts = new Map<string, { count: number; name: string }>();
  for (const s of states) {
    const code = CODE_ALIASES[s.code.toUpperCase()] ?? s.code.toUpperCase();
    const cur  = counts.get(code);
    counts.set(code, { count: (cur?.count ?? 0) + s.count, name: cur?.name ?? s.name });
  }
  const max = Math.max(0, ...[...counts.values()].map(v => v.count));

  return (
    <div>
      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows:    `repeat(${ROWS}, minmax(0, 1fr))`,
          maxWidth: 340,
          aspectRatio: `${COLS}/${ROWS}`,
        }}
      >
        {TILES.map(({ code, x, y }) => {
          const stat = counts.get(code);
          const { bg, fg } = heat(stat?.count ?? 0, max);
          return (
            <div
              key={code}
              title={`${stat?.name ?? code}: ${stat?.count ?? 0} visits`}
              className="rounded-md flex flex-col items-center justify-center cursor-default transition-transform hover:scale-110"
              style={{ gridColumnStart: x + 1, gridRowStart: y + 1, background: bg }}
            >
              <span className="font-jakarta font-bold leading-none" style={{ color: fg, fontSize: 9 }}>
                {code}
              </span>
              {(stat?.count ?? 0) > 0 && (
                <span className="font-jakarta leading-none mt-0.5" style={{ color: fg, fontSize: 8 }}>
                  {stat!.count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Heat legend */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <span className="font-jakarta text-[10px] text-slate-400">Low</span>
        {['#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'].map(c => (
          <span key={c} className="w-5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
        ))}
        <span className="font-jakarta text-[10px] text-slate-400">High</span>
      </div>
    </div>
  );
}
