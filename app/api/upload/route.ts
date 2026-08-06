export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { validateAdminToken } from '@/lib/kv';
import { bytesToBase64 } from '@/lib/edge-utils';

// R2 bucket shape — minimal surface we need
interface R2Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<void>;
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  if (!(await validateAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: CORS });
    }

    // Enforce reasonable size limit (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413, headers: CORS });
    }

    // Only allow images
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are accepted' }, { status: 415, headers: CORS });
    }

    // Generate URL-safe unique key: uploads/2026/06/timestamp-random.ext
    const ext       = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
    const now       = new Date();
    const datePath  = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const key       = `uploads/${datePath}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Resolve bindings via @cloudflare/next-on-pages context
    const ctx    = getOptionalRequestContext();
    const bucket = (ctx?.env as unknown as Record<string, unknown>)?.['R2_BUCKET'] as R2Bucket | undefined;
    const kv     = ctx?.env?.CONTENT_KV;

    if (!bucket && !kv) {
      // Neither binding is available — genuinely local `next dev` with no
      // Cloudflare context at all. Return a clearly-fake URL (never used in
      // production, where CONTENT_KV is always bound) so the local UI still
      // demonstrates the flow without crashing.
      console.warn('[upload] Neither R2_BUCKET nor CONTENT_KV bound — local dev mode');
      const fakeUrl = `https://localhost-r2-dev/${key}`;
      return NextResponse.json({ url: fakeUrl, key, dev: true }, { headers: CORS });
    }

    // ── Preferred path: R2 (if the bucket binding has been configured in
    //    the Cloudflare Pages dashboard — Settings → Functions → Bindings).
    if (bucket) {
      const cfDomain  = (ctx?.env as unknown as Record<string, string>)?.['R2_PUBLIC_DOMAIN'];
      const envDomain = process.env.R2_PUBLIC_DOMAIN ?? '';
      const domain    = (cfDomain ?? envDomain).replace(/\/$/, '');

      if (domain) {
        const bytes = await file.arrayBuffer();
        await bucket.put(key, bytes, { httpMetadata: { contentType: file.type } });
        const url = `${domain}/${key}`;
        return NextResponse.json({ url, key, storage: 'r2' }, { headers: CORS });
      }
      // R2 bucket exists but no public domain configured — fall through to
      // the KV path below rather than failing outright, so uploads keep
      // working while that gets sorted out on the Cloudflare dashboard.
      console.warn('[upload] R2_BUCKET bound but R2_PUBLIC_DOMAIN is not set — falling back to KV storage');
    }

    // ── Fallback: store the file directly in CONTENT_KV and serve it back
    //    through /api/media/blob/[...key]. This means uploads work out of
    //    the box with ZERO extra Cloudflare configuration — no R2 bucket,
    //    no public domain, nothing to set up — at the cost of consuming a
    //    little KV storage/write-quota per image. Base64 inflates size by
    //    ~33%, so the 10 MB cap above safely fits under KV's 25 MB/value
    //    limit even after encoding.
    if (kv) {
      const bytes  = await file.arrayBuffer();
      const base64 = bytesToBase64(bytes);
      await kv.put(`media:blob:${key}`, JSON.stringify({ data: base64, contentType: file.type }));
      const url = `/api/media/blob/${key}`;
      return NextResponse.json({ url, key, storage: 'kv' }, { headers: CORS });
    }

    // Unreachable given the guard above, but keeps TypeScript happy and
    // fails loudly instead of silently if it ever is.
    return NextResponse.json({ error: 'No storage binding available' }, { status: 500, headers: CORS });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[upload] error:', msg);
    return NextResponse.json({ error: 'Upload failed', details: msg }, { status: 500, headers: CORS });
  }
}
