'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { requestResetAction, verifyOtpAction } from '../_actions';
import type { ResetState } from '../_actions';

function HeadingGlow() {
  return (
    <>
      <div className="absolute inset-x-[-40px] inset-y-[-30px] rounded-full pointer-events-none"
        style={{ background: '#fff', opacity: 0.06, filter: 'blur(54px)' }} />
      <div className="absolute inset-x-[-14px] inset-y-[-10px] rounded-2xl pointer-events-none"
        style={{ background: '#fff', opacity: 0.10, filter: 'blur(20px)' }} />
    </>
  );
}

export default function ResetPage() {
  const [reqState, reqAction, reqPending] =
    useActionState<ResetState, FormData>(requestResetAction, null);

  const [verState, verAction, verPending] =
    useActionState<ResetState, FormData>(verifyOtpAction, null);

  useEffect(() => {
    if (verState?.success) {
      window.location.href = '/admin';
    }
  }, [verState]);

  const codeSent = reqState?.step === 'sent';

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black flex items-center justify-center p-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md z-10">
        <div
          className="relative bg-zinc-950 rounded-3xl p-8 sm:p-10"
          style={{ border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
        >
          {/* Heading */}
          <div className="relative text-center mb-10">
            <HeadingGlow />
            <h1 className="relative z-10 font-bruno text-white text-xl sm:text-2xl tracking-[0.18em] uppercase">
              {codeSent ? 'Enter Code' : 'Reset Access'}
            </h1>
            <p className="relative z-10 font-jakarta text-zinc-500 text-[11px] mt-1.5 leading-relaxed">
              {codeSent
                ? 'Check ivyleagueoverseas@gmail.com for your 6-digit code'
                : 'A one-time code will be sent to the registered admin address'}
            </p>
          </div>

          {/* ── Step 1: Request OTP ── */}
          {!codeSent && (
            <form action={reqAction} className="space-y-5">
              <div>
                <label className="block font-jakarta text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-2">
                  Your Email <span className="text-zinc-700 normal-case tracking-normal">(reference only — not used for routing)</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition-all font-jakarta"
                  placeholder="your@email.com"
                />
                <p className="font-jakarta text-[10px] text-zinc-700 mt-1.5">
                  Reset code is always delivered to ivyleagueoverseas@gmail.com only.
                </p>
              </div>

              {reqState?.error && (
                <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-[11px] font-bold flex-shrink-0">✕</span>
                  <p className="font-jakarta text-red-400 text-xs">{reqState.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={reqPending}
                className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm tracking-wide transition-all disabled:cursor-not-allowed"
                style={{ background: reqPending ? 'rgba(255,255,255,0.08)' : '#fff', color: reqPending ? 'rgba(255,255,255,0.3)' : '#000' }}
              >
                {reqPending ? 'Sending…' : 'Send Reset Code →'}
              </button>
            </form>
          )}

          {/* ── Step 2: Verify OTP ── */}
          {codeSent && (
            <form action={verAction} className="space-y-5">
              <div>
                <label className="block font-jakarta text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-2">
                  6-Digit Code
                </label>
                <input
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  autoFocus
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white text-3xl font-bold text-center tracking-[0.6em] placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition-all"
                  placeholder="000000"
                />
                <p className="font-jakarta text-[10px] text-zinc-700 mt-1.5 text-center">
                  Valid for 10 minutes · Do not share this code
                </p>
              </div>

              {verState?.error && (
                <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-[11px] font-bold flex-shrink-0">✕</span>
                  <p className="font-jakarta text-red-400 text-xs">{verState.error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={verPending}
                className="w-full py-3.5 rounded-xl font-jakarta font-bold text-sm tracking-wide transition-all disabled:cursor-not-allowed"
                style={{ background: verPending ? 'rgba(255,255,255,0.08)' : '#fff', color: verPending ? 'rgba(255,255,255,0.3)' : '#000' }}
              >
                {verPending ? 'Verifying…' : 'Verify & Sign In →'}
              </button>
            </form>
          )}

          <div className="mt-7 text-center">
            <Link href="/admin/login" className="font-jakarta text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
