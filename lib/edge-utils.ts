/**
 * Edge-safe utilities shared across all API routes AND admin UI components.
 *
 * SERVER (Edge runtime) rules:
 *  - req.json() throws on empty body — use parseBody() which uses req.text() first
 *  - req.clone() shares the ReadableStream — NEVER use it
 *  - Always read the body ONCE, after auth
 *
 * CLIENT (admin UI) helpers:
 *  - apiCall() — fetch wrapper that surfaces exact backend error messages to the UI
 *  - getBearerToken() — header extraction with case-insensitive fallback
 */

import { NextRequest } from 'next/server';

// ── SERVER HELPERS ────────────────────────────────────────────────────────────

/**
 * Safely read + parse the request body.
 * Returns the parsed object, or {} on empty / invalid JSON. Never throws.
 */
export async function parseBody<T = Record<string, unknown>>(req: NextRequest): Promise<T> {
  try {
    const text = await req.text();
    if (!text || !text.trim()) return {} as T;
    return JSON.parse(text) as T;
  } catch (e) {
    console.error('[edge-utils] parseBody failed:', e);
    return {} as T;
  }
}

/**
 * Extract Bearer token from Authorization header.
 * Checks both title-case and lowercase forms — Cloudflare normalises to lowercase.
 * Returns empty string (never null) so callers don't need null guards.
 */
export function getBearerToken(req: NextRequest): string {
  // Cloudflare's fetch implementation normalises headers to lowercase,
  // but the HTTP spec says headers are case-insensitive. Check both.
  const header =
    req.headers.get('Authorization') ??
    req.headers.get('authorization') ??
    '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice(7).trim(); // 'Bearer '.length === 7
}

/** Standard CORS headers used on all API routes. */
export const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
} as const;

// ── CLIENT HELPERS ────────────────────────────────────────────────────────────

interface ApiCallOpts {
  method:  'GET' | 'POST' | 'PUT' | 'DELETE';
  url:     string;
  token:   string;
  body?:   unknown;
}

interface ApiCallResult<T> {
  ok:    boolean;
  data:  T | null;
  /** Human-readable error extracted from the response body — always populated on failure. */
  error: string | null;
}

/**
 * Fetch wrapper for admin UI API calls.
 *
 * - Attaches Authorization: Bearer <token> header
 * - On non-2xx: parses the JSON error body and extracts { error, details }
 * - Returns { ok, data, error } — never throws, so callers don't need try/catch
 * - Logs the full error payload to the console on failure for debugging
 *
 * Usage:
 *   const { ok, data, error } = await apiCall({ method: 'PUT', url: '/api/events', token, body: { events } });
 *   if (!ok) { flash(`Save failed: ${error}`, 'error'); return; }
 */
export async function apiCall<T = unknown>(opts: ApiCallOpts): Promise<ApiCallResult<T>> {
  try {
    const res = await fetch(opts.url, {
      method:  opts.method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${opts.token}`,
      },
      ...(opts.body !== undefined && { body: JSON.stringify(opts.body) }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => null) as T | null;
      return { ok: true, data, error: null };
    }

    // Non-2xx — extract the exact backend error message
    let errBody: Record<string, unknown> = {};
    try { errBody = await res.json(); } catch { /* body wasn't JSON */ }

    // Session expired or token invalid: clear the stored token so the admin
    // layout shows the login screen on next load instead of failing silently.
    if (res.status === 401 && typeof window !== 'undefined') {
      try { window.localStorage.removeItem('iloc_admin_token'); } catch { /* SSR / private mode */ }
      console.error(`[apiCall] ${opts.method} ${opts.url} → 401: session expired, token cleared`);
      setTimeout(() => window.location.reload(), 1800);
      return { ok: false, data: null, error: 'Session expired — signing you out, please log in again.' };
    }

    const errorMsg =
      (errBody.error  as string | undefined) ??
      (errBody.details as string | undefined) ??
      (errBody.message as string | undefined) ??
      `HTTP ${res.status}`;

    console.error(`[apiCall] ${opts.method} ${opts.url} → ${res.status}:`, errBody);
    return { ok: false, data: null, error: errorMsg };

  } catch (networkErr: unknown) {
    const msg = networkErr instanceof Error ? networkErr.message : 'Network error';
    console.error(`[apiCall] ${opts.method} ${opts.url} network error:`, networkErr);
    return { ok: false, data: null, error: msg };
  }
}
