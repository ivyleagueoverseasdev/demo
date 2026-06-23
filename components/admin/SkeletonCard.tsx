// Skeleton loading primitives for admin pages.
//
// Architecture: small primitives (SkeletonLine, SkeletonAvatar, SkeletonCard)
// that compose into page-specific variants (SkeletonLeadRow, SkeletonContentRow,
// SkeletonStatsBar). Use the pre-built variants in page loading states — reach
// for primitives only when you need a one-off shape.

// ── Primitives ─────────────────────────────────────────────────────────────────

/** A single pulsing text-placeholder bar. */
export function SkeletonLine({
  width,
  height = 13,
}: {
  width:   number | string;
  height?: number;
}) {
  return (
    <div
      className="bg-slate-200 rounded-md animate-pulse"
      style={{
        width:  typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
      }}
    />
  );
}

/** Square avatar / icon placeholder with configurable size and border-radius. */
export function SkeletonAvatar({
  size   = 36,
  radius = 12,
}: {
  size?:   number;
  radius?: number;
}) {
  return (
    <div
      className="bg-slate-200 animate-pulse flex-shrink-0"
      style={{ width: size, height: size, borderRadius: radius }}
    />
  );
}

/** White card shell — matches the `rounded-2xl border border-slate-100` card
 *  style used across all admin pages. */
export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
      {children}
    </div>
  );
}

// ── Composed variants ──────────────────────────────────────────────────────────

/**
 * Mimics the LeadRow card shape used in the Enquiries CRM:
 *   [avatar] [name + badge] [contact line] [timestamp]  |  [dropdown] [action]
 */
export function SkeletonLeadRow() {
  return (
    <SkeletonCard>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <SkeletonAvatar />

        {/* Name / contact / timestamp */}
        <div className="flex-1 space-y-2.5 pt-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <SkeletonLine width={128} height={13} />
            <SkeletonLine width={52}  height={18} />
          </div>
          <SkeletonLine width="52%" height={11} />
          <SkeletonLine width={88}  height={9}  />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-slate-100 rounded-lg animate-pulse"
            style={{ width: 96, height: 30 }} />
          <div className="bg-slate-100 rounded-lg animate-pulse"
            style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </SkeletonCard>
  );
}

/**
 * Mimics a generic content-list row (news, events, pages, hero slides):
 *   [icon block] [title line] [sub line]  |  [status chip] [edit] [delete]
 */
export function SkeletonContentRow() {
  return (
    <SkeletonCard>
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={40} radius={12} />
        <div className="flex-1 space-y-2 min-w-0">
          <SkeletonLine width="58%" height={13} />
          <SkeletonLine width="38%" height={10} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-slate-100 rounded-full animate-pulse"
            style={{ width: 60, height: 22 }} />
          <div className="bg-slate-100 rounded-lg  animate-pulse"
            style={{ width: 44, height: 30 }} />
          <div className="bg-slate-100 rounded-lg  animate-pulse"
            style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </SkeletonCard>
  );
}

/**
 * Settings / form-editor skeleton — a white card shell with a header bar,
 * labeled input rows, and a save-button placeholder.
 * Used for About, Services, General, Global, Partners, Homepage pages.
 */
export function SkeletonFormBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="bg-slate-200 rounded-md animate-pulse h-4 w-40" />
      </div>
      {/* Labeled input rows */}
      <div className="p-6 space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="bg-slate-200 rounded animate-pulse h-3 w-24" />
            <div className="bg-slate-100 rounded-xl animate-pulse h-10 w-full" />
          </div>
        ))}
        {/* Save-button placeholder */}
        <div className="pt-2 border-t border-slate-100">
          <div className="bg-slate-200 rounded-xl animate-pulse h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * Analytics page skeleton — title bar + 4-column stats grid.
 * Mirrors the `grid-cols-2 lg:grid-cols-4` layout of the real analytics view.
 */
export function SkeletonAnalyticsGrid() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-200 rounded-xl animate-pulse h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="bg-slate-200 rounded animate-pulse h-3 w-20" />
            <div className="bg-slate-200 rounded-md animate-pulse h-8 w-16" />
            <div className="bg-slate-100 rounded-full animate-pulse h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Stats grid skeleton — matches the StatsBar used on Enquiries, News, etc.
 * `cols` must be 3, 4, or 5 (maps to known Tailwind classes; no dynamic purge risk).
 */
const SM_GRID: Record<number, string> = {
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
};

export function SkeletonStatsBar({ cols = 5 }: { cols?: 3 | 4 | 5 }) {
  const smClass = SM_GRID[cols] ?? 'sm:grid-cols-5';
  return (
    <div className={`grid grid-cols-2 ${smClass} gap-3`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i}
          className="bg-white rounded-2xl border border-slate-100 px-4 py-3 text-center space-y-2">
          <div className="bg-slate-200 rounded-md animate-pulse h-6 w-10 mx-auto" />
          <div className="bg-slate-100 rounded-md animate-pulse h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}
