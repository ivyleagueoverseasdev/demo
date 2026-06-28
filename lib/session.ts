/**
 * Stateless admin session tokens — signed with HMAC-SHA256.
 *
 * WHY THIS EXISTS:
 *   The previous design stored every admin session as a `session:<token>` key
 *   in Cloudflare KV. On the FREE plan (1,000 writes/day) this competed with the
 *   page-view analytics writes; once the daily write quota was exhausted, login
 *   itself failed ("KV put() limit exceeded for the day") because it could no
 *   longer write the session key.
 *
 *   Signed tokens are self-contained: the token IS the proof. Login performs
 *   ZERO KV writes, and validation performs ZERO KV reads — so admin auth is
 *   completely independent of the KV quota and can never be taken down by it.
 *
 * SECURITY MODEL:
 *   token = base64url(JSON{ exp }) + "." + base64url(HMAC-SHA256(payload, secret))
 *   - `secret` is the ADMIN_PASSWORD. Rotating the password instantly
 *     invalidates every outstanding session (a useful property).
 *   - Tamper-proof: the expiry is inside the signed payload, so a client cannot
 *     extend its own session without the secret.
 *   - Trade-off: sessions cannot be revoked individually server-side (acceptable
 *     for a single-admin CMS). To force-logout everyone, change ADMIN_PASSWORD.
 *
 * Runs in the Edge runtime AND middleware AND Node — uses only Web Crypto
 * (globalThis.crypto.subtle), which is available in all three.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToB64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function strToB64url(str: string): string {
  return bytesToB64url(enc.encode(str));
}

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  let t = s.replace(/-/g, '+').replace(/_/g, '/');
  while (t.length % 4) t += '=';
  const bin = atob(t);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * Create a signed session token valid for `ttlSeconds`.
 * Performs no I/O beyond the in-memory HMAC computation.
 */
export async function signToken(secret: string, ttlSeconds: number): Promise<string> {
  const exp     = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = strToB64url(JSON.stringify({ exp }));
  const key     = await importKey(secret);
  const sigBuf  = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return `${payload}.${bytesToB64url(new Uint8Array(sigBuf))}`;
}

/**
 * Verify a signed session token. Returns true only if the signature matches
 * AND the token has not expired. Never throws.
 */
export async function verifyToken(secret: string, token: string | undefined | null): Promise<boolean> {
  if (!token || !secret) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;

  const payload = token.slice(0, dot);
  const sig     = token.slice(dot + 1);

  try {
    const key = await importKey(secret);
    const ok  = await crypto.subtle.verify('HMAC', key, b64urlToBytes(sig), enc.encode(payload));
    if (!ok) return false;

    const data = JSON.parse(dec.decode(b64urlToBytes(payload))) as { exp?: number };
    if (typeof data.exp !== 'number') return false;
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
