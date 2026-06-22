'use client';

import { useActionState } from 'react';
import { loginAction } from '../_actions';
import type { LoginState } from '../_actions';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Email — UI field only; authentication uses only the password */}
      <div>
        <label className="block font-jakarta text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition-all font-jakarta"
          placeholder="admin@ivyleagueoverseas.com"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-jakarta text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition-all font-jakarta"
          placeholder="••••••••••••"
        />
      </div>

      {/* Error banner */}
      {state?.error && (
        <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-3">
          <span className="text-red-400 text-[11px] mt-px flex-shrink-0 font-bold">✕</span>
          <p className="font-jakarta text-red-400 text-xs leading-relaxed">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="relative w-full mt-1 py-3.5 rounded-xl font-jakarta font-bold text-sm tracking-wide overflow-hidden transition-all duration-200 disabled:cursor-not-allowed"
        style={{
          background: pending ? 'rgba(255,255,255,0.08)' : '#ffffff',
          color:      pending ? 'rgba(255,255,255,0.4)'  : '#000000',
        }}
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Verifying…
          </span>
        ) : (
          'Sign In →'
        )}
      </button>
    </form>
  );
}
