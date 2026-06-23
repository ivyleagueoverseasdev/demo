'use client';

import { useState, useRef } from 'react';

export type SaveState = 'idle' | 'saving' | 'saved';

/**
 * Manages the three-phase save button lifecycle:
 *   idle  →  saving  →  saved (1.5 s)  →  idle
 *
 * Usage:
 *   const { state, run, isBusy } = useSaveButton();
 *
 *   async function save() {
 *     const ok = await run(async () => {
 *       const { ok, error } = await apiCall({ ... });
 *       if (!ok) { flash(error, 'error'); return false; }
 *       flash('Saved!', 'success');
 *       return true;
 *     });
 *     if (ok) { closeForm(); await reload(); }  // post-success side-effects
 *   }
 *
 * The action passed to `run` must return `true` on success, `false` on failure.
 * All error handling (flash, logging) stays with the caller — the hook is
 * purely state-machine logic.
 */
export function useSaveButton() {
  const [state, setState] = useState<SaveState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function run(action: () => Promise<boolean>): Promise<boolean> {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setState('saving');
    try {
      const succeeded = await action();
      if (succeeded) {
        setState('saved');
        timer.current = setTimeout(() => setState('idle'), 1500);
        return true;
      }
      setState('idle');
      return false;
    } catch {
      setState('idle');
      return false;
    }
  }

  return {
    state,
    run,
    isBusy: state === 'saving',
  };
}
