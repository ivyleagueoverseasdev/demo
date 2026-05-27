/**
 * Cloudflare bindings type augmentation.
 *
 * @cloudflare/next-on-pages declares a global `CloudflareEnv` interface that
 * is intentionally empty — projects extend it here via declaration merging so
 * that `getRequestContext().env` is correctly typed everywhere.
 *
 * These types are provided by @cloudflare/workers-types (bundled with wrangler).
 */

declare global {
  interface CloudflareEnv {
    /** KV namespace bound as CONTENT_KV in wrangler.toml */
    CONTENT_KV: KVNamespace;
    /** R2 bucket bound as R2_BUCKET in wrangler.toml */
    R2_BUCKET: R2Bucket;
  }
}

export {};
