export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/kv';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { getBearerToken, CORS } from '@/lib/edge-utils';

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (!(await validateAdminToken(getBearerToken(req)))) return json({ error: 'Unauthorized' }, 401);

  // â”€â”€ Resolve CF env â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const ctx = getOptionalRequestContext();
  const env = ctx?.env as Record<string, unknown> | undefined;

  function hasBinding(key: string): boolean {
    return !!(env?.[key]);
  }

  function hasEnv(key: string): boolean {
    return !!(env?.[key] ?? process.env[key]);
  }

  // â”€â”€ KV connectivity check â€” try a direct get on a known-safe key â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let kvOk    = false;
  let kvError = '';
  const kvBinding = env?.CONTENT_KV as { get(k: string): Promise<string | null> } | undefined;
  try {
    if (kvBinding) {
      await kvBinding.get('__health_check__'); // key won't exist, but the call succeeds if KV is bound
      kvOk = true;
    } else {
      kvError = 'CONTENT_KV binding not found in env';
    }
  } catch (e: unknown) {
    kvError = (e as Error).message;
  }

  // â”€â”€ Deployment environment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const cfEnv     = (env?.['CF_PAGES_BRANCH'] as string | undefined) ?? process.env.CF_PAGES_BRANCH;
  const isPreview = cfEnv ? cfEnv !== 'main' && cfEnv !== 'master' : false;
  const deployEnv = cfEnv
    ? isPreview ? `Preview (${cfEnv})` : 'Production'
    : 'Local Dev';

  return json({
    bindings: {
      CONTENT_KV:       { ok: hasBinding('CONTENT_KV'),     label: 'KV Namespace (CONTENT_KV)'        },
      R2_BUCKET:        { ok: hasBinding('R2_BUCKET'),       label: 'R2 Bucket (R2_BUCKET)'            },
      R2_PUBLIC_DOMAIN: { ok: hasEnv('R2_PUBLIC_DOMAIN'),   label: 'R2 Public Domain'                 },
      RESEND_API_KEY:   { ok: hasEnv('RESEND_API_KEY'),     label: 'Resend API Key (email)'           },
      ADMIN_PASSWORD:   { ok: hasEnv('ADMIN_PASSWORD'),     label: 'Admin Password'                   },
    },
    kv:          { ok: kvOk, error: kvError },
    deployEnv,
    isPreview,
    cfBranch:    cfEnv ?? null,
    timestamp:   new Date().toISOString(),
    runtime:     'edge',
  });
}
