export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { validateAdminToken } from '@/lib/kv';

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

    // Resolve R2 bucket via @cloudflare/next-on-pages context
    const ctx    = getOptionalRequestContext();
    const bucket = (ctx?.env as unknown as Record<string, unknown>)?.['R2_BUCKET'] as R2Bucket | undefined;

    if (!bucket) {
      // Local dev fallback — return a fake URL so the UI doesn't break
      console.warn('[upload] R2_BUCKET not bound — local dev mode');
      const fakeUrl = `https://localhost-r2-dev/${key}`;
      return NextResponse.json({ url: fakeUrl, key, dev: true }, { headers: CORS });
    }

    // Upload to R2
    const bytes = await file.arrayBuffer();
    await bucket.put(key, bytes, { httpMetadata: { contentType: file.type } });

    // Build the public URL from the env var set in Cloudflare dashboard
    const domain = (process.env.R2_PUBLIC_DOMAIN ?? '').replace(/\/$/, '');
    if (!domain) {
      return NextResponse.json(
        { error: 'R2_PUBLIC_DOMAIN env var not set in Cloudflare Pages settings' },
        { status: 500, headers: CORS }
      );
    }

    const url = `${domain}/${key}`;
    return NextResponse.json({ url, key }, { headers: CORS });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[upload] R2 error:', msg);
    return NextResponse.json({ error: 'Upload failed', details: msg }, { status: 500, headers: CORS });
  }
}
