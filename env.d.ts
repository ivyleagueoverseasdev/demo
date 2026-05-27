/**
 * Cloudflare bindings type declarations.
 *
 * @cloudflare/workers-types is NOT installed as a direct dependency (it lives
 * inside wrangler's own node_modules and is not reachable by tsc). We define
 * the minimal shapes for the bindings this project uses so the compiler is
 * satisfied without adding a new dependency.
 *
 * @cloudflare/next-on-pages declares `CloudflareEnv` as an empty global
 * interface — we augment it here via declaration merging.
 */

/** Minimal KV namespace shape used by this project. */
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Minimal R2 bucket shape used by this project. */
interface R2Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<void>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
  delete(key: string): Promise<void>;
}

declare global {
  interface CloudflareEnv {
    /** KV namespace bound as CONTENT_KV in wrangler.toml */
    CONTENT_KV: KVNamespace;
    /** R2 bucket bound as R2_BUCKET in wrangler.toml */
    R2_BUCKET: R2Bucket;
  }
}

// No `export {}` here — keeping this file as a pure ambient script (no
// imports/exports) ensures TypeScript treats it as a global declaration file.
// Adding export {} would turn it into a module, scoping all declarations to
// that module and making KVNamespace/R2Bucket invisible to other files.
