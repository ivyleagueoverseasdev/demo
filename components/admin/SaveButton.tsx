'use client';

import type { SaveState } from '@/app/admin/_hooks';

interface SaveButtonProps {
  /** State driven by useSaveButton() */
  state:      SaveState;
  onClick:    () => void;
  /** Label shown in the idle state, e.g. "💾 Save All Slides" */
  idleLabel:  string;
  /** Extra disabled guard — e.g. `loading || !form.title`. The button is
   *  always locked during 'saving' and 'saved' regardless of this prop. */
  disabled?:  boolean;
  /** Tailwind padding / sizing classes, e.g. "px-6 py-2.5" */
  className?: string;
}

/**
 * A primary save button that runs a three-phase transition:
 *
 *   idle (amber gradient)  →  saving (spinner + "Saving…")
 *                          →  saved  (green gradient + "✓ Saved", 1.5 s)
 *                          →  idle
 *
 * Drop-in replacement for any `<button style={{ background: amber-gradient }}>`.
 * Pair with `useSaveButton` from `@/app/admin/_hooks`.
 */
export default function SaveButton({
  state,
  onClick,
  idleLabel,
  disabled  = false,
  className = '',
}: SaveButtonProps) {
  const isSaving = state === 'saving';
  const isSaved  = state === 'saved';
  const isLocked = isSaving || isSaved || disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      aria-busy={isSaving}
      className={`
        font-jakarta font-bold text-sm text-white rounded-xl
        transition-all duration-300 ease-in-out
        disabled:cursor-not-allowed
        ${isSaved ? '' : 'hover:opacity-90 disabled:opacity-50'}
        ${className}
      `}
      style={{
        background: isSaved
          ? 'linear-gradient(135deg,#059669,#10B981)'
          : 'linear-gradient(135deg,#D97706,#F59E0B)',
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {isSaving && (
          <svg
            className="w-3.5 h-3.5 animate-spin flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {isSaved && (
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20"
            fill="currentColor" aria-hidden>
            <path fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd" />
          </svg>
        )}
        <span>
          {isSaving ? 'Saving…' : isSaved ? 'Saved' : idleLabel}
        </span>
      </span>
    </button>
  );
}
