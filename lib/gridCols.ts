/**
 * Predefined Tailwind grid-column class maps.
 *
 * Tailwind's JIT compiler only generates classes it can see as complete
 * literal strings during its content scan — it cannot purge dynamically
 * concatenated classes like `grid-cols-${cols}`. Every class below is
 * written out in full so Tailwind generates it at build time; components
 * pick the right one via object lookup at runtime using an admin-supplied
 * column count.
 */

export const GRID_COLS_MD: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export const GRID_COLS_LG: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

/** Clamp an admin-supplied column count to the supported 1–6 range. */
export function clampCols(value: number | undefined, fallback: number): number {
  const n = Math.round(value ?? fallback);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(6, Math.max(1, n));
}
