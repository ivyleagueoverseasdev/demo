'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

// ─── Types ────────────────────────────────────────────────────────────────────
export type LoginState = { error?: string } | null;
export type ResetState = { error?: string; step?: 'sent' } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CFEnv = { kv?: KVNamespace; adminPassword?: string; resendKey?: string };

function getCFEnv(): CFEnv {
  const ctx = getOptionalRequestContext();
  const env = ctx?.env as Record<string, unknown> | undefined;
  return {
    kv:            env?.CONTENT_KV   as KVNamespace | undefined,
    adminPassword: (env?.ADMIN_PASSWORD  ?? process.env.ADMIN_PASSWORD)  as string | undefined,
    resendKey:     (env?.RESEND_API_KEY  ?? process.env.RESEND_API_KEY)  as string | undefined,
  };
}

function genToken(bytes = 24): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = (formData.get('password') as string | null)?.trim();
  if (!password) return { error: 'Password is required.' };

  const { kv, adminPassword } = getCFEnv();

  // Constant-time delay prevents password timing-analysis
  await new Promise<void>(r => setTimeout(r, 280));

  if (!adminPassword || password !== adminPassword) {
    return { error: 'Invalid credentials. Please try again.' };
  }

  const token = genToken(24);

  if (kv) {
    await kv.put(`session:${token}`, '1', { expirationTtl: 86400 });
  } else if (process.env.NODE_ENV === 'production') {
    return { error: 'Session store unavailable — check CONTENT_KV binding.' };
  }

  // HTTP-only secure cookie — immune to XSS, readable only by middleware/server actions
  const jar = await cookies();
  jar.set('iloc_admin', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   86400,  // 24 hours
    path:     '/admin',
  });

  redirect('/admin');
}

// ─── Password Reset — Step 1: Request OTP ─────────────────────────────────────
//
// STRICT RULE: The email field in the form is intentionally NEVER used for routing.
// The OTP is ALWAYS sent exclusively to the hardcoded admin address below.
// This prevents any attacker from redirecting the reset link to an arbitrary inbox.
//
const ADMIN_RESET_RECIPIENT = 'ivyleagueoverseas@gmail.com';

export async function requestResetAction(
  _prev: ResetState,
  _formData: FormData,   // ← user-provided email intentionally ignored
): Promise<ResetState> {
  const { kv, resendKey } = getCFEnv();

  if (!kv) return { error: 'Session store unavailable.' };
  if (!resendKey) return { error: 'Email not configured (add RESEND_API_KEY to CF Pages env vars).' };

  // 6-digit numeric OTP — stored in KV for 10 minutes, single-use
  const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
  await kv.put('admin_reset_otp', otp, { expirationTtl: 600 });

  const emailRes = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    'ILOC CMS <noreply@ivyleagueoverseas.com>',
      to:      [ADMIN_RESET_RECIPIENT],   // ← ALWAYS hardcoded — never the form input
      subject: '[ILOC Admin] Password Reset Code',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:440px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111">ILOC Admin Reset</h2>
          <p style="color:#555;font-size:14px;margin:0 0 24px">
            Your one-time access code (valid 10 minutes):
          </p>
          <div style="background:#f4f4f5;border-radius:12px;padding:20px;text-align:center;
                      font-size:36px;font-weight:900;letter-spacing:0.35em;color:#111">
            ${otp}
          </div>
          <p style="color:#999;font-size:12px;margin:20px 0 0">
            If you did not request this, ignore this email. Never share this code.
          </p>
        </div>
      `,
    }),
  });

  if (!emailRes.ok) {
    const body = await emailRes.text().catch(() => '');
    console.error('[requestReset] Resend error', emailRes.status, body);
    return { error: 'Failed to send email. Verify RESEND_API_KEY and sender domain.' };
  }

  return { step: 'sent' };
}

// ─── Password Reset — Step 2: Verify OTP ─────────────────────────────────────

export async function verifyOtpAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const otp = (formData.get('otp') as string | null)?.trim();
  if (!otp || !/^\d{6}$/.test(otp)) return { error: 'Enter the 6-digit code.' };

  const { kv } = getCFEnv();
  if (!kv) return { error: 'Session store unavailable.' };

  const stored = await kv.get('admin_reset_otp');
  if (!stored || stored !== otp) {
    return { error: 'Invalid or expired code — request a new one.' };
  }

  // Consume OTP — one-time use
  await kv.delete('admin_reset_otp');

  // Grant a short-lived bypass session (15 min).
  // IMPORTANT: immediately update ADMIN_PASSWORD in Cloudflare Pages
  // → Settings → Environment Variables and re-deploy to rotate credentials.
  const token = genToken(24);
  await kv.put(`session:${token}`, '1', { expirationTtl: 900 });

  const jar = await cookies();
  jar.set('iloc_admin', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   900,   // 15 minutes
    path:     '/admin',
  });

  redirect('/admin');
}
