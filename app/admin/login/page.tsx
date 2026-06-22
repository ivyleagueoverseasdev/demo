// Standalone dark-theme admin login page.
// The admin layout (app/admin/layout.tsx) bypasses its auth shell for
// any path that starts with /admin/login — see the 3-line patch there.

import type { Metadata } from 'next';
import LoginForm from './_components/LoginForm';

export const runtime  = 'edge';
export const metadata: Metadata = { title: 'Sign In | ILOC Admin' };

// ── Dual-layer white eclipse glow ─────────────────────────────────────────────
// Outer aura: wide, diffuse, 5% white — visible against black background
// Inner core: tight, near-solid white — creates the bright "window" behind text
function HeadingGlow() {
  return (
    <>
      <div
        className="absolute inset-x-[-40px] inset-y-[-30px] rounded-full pointer-events-none"
        style={{ background: '#fff', opacity: 0.06, filter: 'blur(54px)' }}
      />
      <div
        className="absolute inset-x-[-14px] inset-y-[-10px] rounded-2xl pointer-events-none"
        style={{ background: '#fff', opacity: 0.10, filter: 'blur(20px)' }}
      />
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black flex items-center justify-center p-4">

      {/* Subtle radial ambient on the canvas */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md z-10">

        {/* Card */}
        <div
          className="relative bg-zinc-950 rounded-3xl p-8 sm:p-10"
          style={{
            border:     '1px solid rgba(255,255,255,0.07)',
            boxShadow:  '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >

          {/* ── Heading block ── */}
          <div className="relative text-center mb-10">
            <HeadingGlow />
            <h1 className="relative z-10 font-bruno text-white text-2xl sm:text-3xl tracking-[0.2em] uppercase">
              ILOC Admin
            </h1>
            <p className="relative z-10 font-jakarta text-zinc-500 text-[11px] mt-1.5 tracking-[0.12em] uppercase">
              Authorized access only
            </p>
          </div>

          {/* ── Login form (client component — uses useActionState + Server Action) ── */}
          <LoginForm />

          {/* ── Footer links ── */}
          <div className="mt-7 flex items-center justify-between text-[11px] font-jakarta">
            <a
              href="/admin/login/reset"
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              Forgot password?
            </a>
            <a
              href="/"
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              ← Public site
            </a>
          </div>
        </div>

        {/* Version label */}
        <p className="text-center font-jakarta text-[10px] text-zinc-800 mt-4 tracking-widest uppercase">
          Ivy League Overseas Consulting · CMS v2
        </p>
      </div>
    </div>
  );
}
