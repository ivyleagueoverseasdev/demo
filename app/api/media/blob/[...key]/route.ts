export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { base64ToBytes } from '@/lib/edge-utils';

/**
 * Serves images uploaded via /api/upload's KV-storage fallback (used when
 * no R2_BUCKET binding is configured on this Cloudflare Pages project).
 * The URL shape mirrors the R2 key exactly — /api/media/blob/uploads/2026/
 * 08/xxxx.jpg — so it's a drop-in replacement wherever an image URL is
 * expected across the site and admin, no R2 or extra domain config needed.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: keyParts } = await params;
  const key = keyParts.join('/');

  const ctx = getOptionalRequestContext();
  const kv  = ctx?.env?.CONTENT_KV;
  if (!kv) return new NextResponse('Not found', { status: 404 });

  const raw = await kv.get(`media:blob:${key}`);
  if (!raw) return new NextResponse('Not found', { status: 404 });

  let parsed: { data: string; contentType: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new NextResponse('Corrupt image data', { status: 500 });
  }

  const bytes = base64ToBytes(parsed.data);
  // Wrapped in a Blob rather than passed as a raw Uint8Array — newer TS DOM
  // lib typings don't accept Uint8Array<ArrayBufferLike> as a BodyInit even
  // though it's valid per the Fetch spec at runtime.
  return new NextResponse(new Blob([bytes]), {
    headers: {
      'Content-Type':  parsed.contentType || 'application/octet-stream',
      // Content-addressed by timestamp+random — safe to cache indefinitely.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
