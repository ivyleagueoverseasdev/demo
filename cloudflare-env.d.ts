/**
 * Cloudflare bindings type declarations.
 *
 * This file augments the CloudflareEnv interface from @cloudflare/next-on-pages
 * so that ctx.env.CONTENT_KV and ctx.env.R2_BUCKET are fully typed throughout
 * the codebase — no more (ctx.env as any) casts needed.
 *
 * Binding names here MUST match exactly what is declared in wrangler.json.
 * Mismatches between this file and wrangler.json will cause runtime 401/500 errors
 * because getRequestContext().env won't have the expected property.
 */

/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    /** KV namespace for all site content — pages, events, leads, settings, sessions */
    CONTENT_KV: KVNamespace;

    /** R2 bucket for uploaded media (images) */
    R2_BUCKET?: R2Bucket;

    /** Public CDN URL for R2 — e.g. https://pub-f74f15b9dd0a41edb6ed7e9535846bcf.r2.dev */
    R2_PUBLIC_DOMAIN?: string;

    /** Resend API key for email notifications on new leads */
    RESEND_API_KEY?: string;

    /** Admin password for /admin login — set in CF Pages environment variables */
    ADMIN_PASSWORD?: string;

    /** Set by Cloudflare Pages build environment — used to detect production vs local dev */
    CF_PAGES?: string;

    /** Branch name set by CF Pages — e.g. "main" (production) or feature branch name */
    CF_PAGES_BRANCH?: string;
  }
}

export {};
