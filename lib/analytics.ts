/**
 * Shared helpers for /api/track and /api/traffic (both Edge routes).
 *
 * WHY THIS EXISTS:
 *  1. Timezone — the business operates out of Pune, India. All "today" /
 *     "this week" boundaries must land on IST (UTC+5:30) calendar days, not
 *     UTC ones, or a visit at 1am IST (7:30pm UTC the day before) gets
 *     bucketed into the wrong day.
 *  2. Visitor identity — "new" and "unique" visitor counts must NOT rely on
 *     anything the client can trivially reset (localStorage, a fresh
 *     incognito window, clearing site data). Every one of those wipes a
 *     client-side flag and reports the same real person as a brand-new
 *     visitor again. Instead we derive a stable identity server-side from
 *     the request's IP + User-Agent, hashed (never stored in the clear).
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** IST calendar date (YYYY-MM-DD) for the given instant (defaults to now). */
export function istDateStr(d: Date = new Date()): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** IST calendar date N days before now. */
export function istDaysAgo(n: number): string {
  return istDateStr(new Date(Date.now() - n * 86_400_000));
}

// Fixed application-level salt — NOT a secret requiring rotation. Its only
// purpose is to stop the stored hash being a trivially-reversible IP+UA
// lookup; it does not need to be unguessable to anyone with repo access.
const HASH_SALT = 'iloc-analytics-v1';

/**
 * One-way visitor fingerprint from IP + User-Agent. Deliberately NOT
 * rotated per day/session — a stable hash is what lets us tell "the same
 * device visited again" across day boundaries (needed for both "unique
 * today" and "new in the last 30 days"). Nothing reversible to the original
 * IP/UA is ever written to KV — only this hex digest.
 */
export async function hashVisitor(ip: string, ua: string): Promise<string> {
  const data   = new TextEncoder().encode(`${HASH_SALT}|${ip}|${ua}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex    = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 20); // 80 bits — far more than enough to avoid collisions at this scale
}

/** Best-effort real client IP from Cloudflare / standard proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  );
}
