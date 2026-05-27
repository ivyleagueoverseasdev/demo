export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/kv';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  // Validate Admin Token
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const authed = await validateAdminToken(String(token || ''));
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: CORS });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // OpenNext exposes R2 bindings via process.env at runtime
    const bucket = (process.env as unknown as Record<string, unknown>)['R2_BUCKET'] as
      | { put(k: string, v: unknown, opts?: { httpMetadata?: { contentType?: string } }): Promise<void> }
      | undefined;

    if (!bucket) {
      console.warn('R2_BUCKET not found, bypassing upload for local dev.');
      return NextResponse.json({ 
        url: `https://fake-r2-url.dev/${filename}`, 
        filename 
      }, { headers: CORS });
    }

    // Upload to R2
    await bucket.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // Determine the public URL (Use environment variable or fallback placeholder)
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://pub-your-r2-hash.r2.dev';
    const url = `${publicDomain.replace(/\/$/, '')}/${filename}`;

    return NextResponse.json({ url, filename }, { headers: CORS });

  } catch (err: any) {
    console.error('R2 Upload error:', err);
    return NextResponse.json({ error: 'Upload failed', details: err.message }, { status: 500, headers: CORS });
  }
}
