/**
 * Edge-safe utilities shared across all API routes.
 *
 * On Cloudflare's Edge runtime:
 *  - req.json() throws when the body is empty or not valid JSON
 *  - req.text() is safe regardless of body state
 *  - req.clone() shares the underlying ReadableStream — do NOT use it
 *
 * Rule: every route reads the body ONCE using parseBody(), after auth.
 */

import { NextRequest } from 'next/server';

/**
 * Safely read + parse the request body.
 * Returns the parsed object, or {} on empty / invalid JSON.
 * Never throws.
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
 * Extract Bearer token from Authorization header — never touches the body.
 */
export function getBearerToken(req: NextRequest): string {
  return req.headers.get('Authorization')?.replace('Bearer ', '').trim() ?? '';
}

/** Standard CORS headers used on all API routes. */
export const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
} as const;
