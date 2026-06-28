'use server';

import { cookies } from 'next/headers';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { signToken } from '@/lib/session';

// ─── Types ────────────────────────────────────────────────────────────────────
// `token` is returned to the client so it can be stored in localStorage as the
// API Bearer token — the same signed token is also set as the HttpOnly cookie
// that gates /admin pages. One login seeds both → no second password prompt.
export type LoginState = { error?: string; success?: boolean; token?: string } | null;
export type ResetState = { error?: string; step?: 'sent'; success?: boolean; token?: string } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CFEnv = { kv?: KVNamespace; adminPassword?: string; gasUrl?: string };

function getCFEnv(): CFEnv {
  const ctx = getOptionalRequestContext();
  const env = ctx?.env as Record<string, unknown> | undefined;
  return {
    kv:            env?.CONTENT_KV      as KVNamespace | undefined,
    adminPassword: (env?.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD) as string | undefined,
    gasUrl:        (env?.GOOGLE_SCRIPT_URL ?? process.env.GOOGLE_SCRIPT_URL) as string | undefined,
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = (formData.get('password') as string | null)?.trim();
  if (!password) return { error: 'Password is required.' };

  const { adminPassword } = getCFEnv();

  // Constant-time delay prevents password timing-analysis
  await new Promise<void>(r => setTimeout(r, 280));

  if (!adminPassword || password !== adminPassword) {
    return { error: 'Invalid credentials. Please try again.' };
  }

  // Stateless signed session — NO KV write, so login can never be blocked by the
  // Cloudflare KV daily write limit. The same token is set as the page cookie
  // and returned for the client to store as the API Bearer token.
  const token = await signToken(adminPassword, 86_400);

  // HTTP-only secure cookie — gates /admin pages via middleware.
  const jar = await cookies();
  jar.set('iloc_admin', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   86400,  // 24 hours
    path:     '/admin',
  });

  // Return success + token — client stores the token and navigates.
  // redirect() from next/navigation throws NEXT_REDIRECT which
  // @cloudflare/next-on-pages v1.13.16 does not handle in Edge Server Actions.
  return { success: true, token };
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
  _formData: FormData,   // ← user-provided email intentionally ignored for routing
): Promise<ResetState> {
  const { kv, gasUrl } = getCFEnv();

  if (!kv)     return { error: 'Session store unavailable.' };
  if (!gasUrl) return { error: 'Email not configured (add GOOGLE_SCRIPT_URL to CF Pages env vars).' };

  // 6-digit numeric OTP — stored in KV for 10 minutes, single-use
  const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
  await kv.put('admin_reset_otp', otp, { expirationTtl: 600 });

  // Send via Google Apps Script webhook.
  // STRICT RULE: `to` is always the hardcoded admin address — never the form input.
  // The GAS doPost() handler reads e.postData.contents and routes the email.
  let gasOk = false;
  try {
    const res = await Promise.race<Response>([
      fetch(gasUrl, {
        method:   'POST',
        redirect: 'follow',                // GAS web-app URLs redirect once
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendAdminOTP',
          otp,
          to: ADMIN_RESET_RECIPIENT,       // ← ALWAYS hardcoded — never the form input
        }),
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('GAS timeout')), 8000),
      ),
    ]);
    gasOk = res.ok;
    if (!gasOk) console.error('[requestReset] GAS responded', res.status);
  } catch (err) {
    console.error('[requestReset] GAS fetch failed:', err);
    return { error: 'Failed to send reset code. Check GAS_WEB_APP_URL.' };
  }

  if (!gasOk) return { error: 'Email delivery failed. Check GAS_WEB_APP_URL.' };

  return { step: 'sent' };
}

// ─── Password Reset — Step 2: Verify OTP ─────────────────────────────────────

export async function verifyOtpAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const otp = (formData.get('otp') as string | null)?.trim();
  if (!otp || !/^\d{6}$/.test(otp)) return { error: 'Enter the 6-digit code.' };

  const { kv, adminPassword } = getCFEnv();
  if (!kv) return { error: 'Session store unavailable.' };

  const stored = await kv.get('admin_reset_otp');
  if (!stored || stored !== otp) {
    return { error: 'Invalid or expired code — request a new one.' };
  }

  // Consume OTP — one-time use
  await kv.delete('admin_reset_otp');

  if (!adminPassword) return { error: 'Server misconfiguration — ADMIN_PASSWORD not set.' };

  // Grant a short-lived signed bypass session (15 min) — NO KV write.
  // IMPORTANT: immediately update ADMIN_PASSWORD in Cloudflare Pages
  // → Settings → Environment Variables and re-deploy to rotate credentials.
  const token = await signToken(adminPassword, 900);

  const jar = await cookies();
  jar.set('iloc_admin', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    maxAge:   900,   // 15 minutes
    path:     '/admin',
  });

  return { success: true, token };
}
