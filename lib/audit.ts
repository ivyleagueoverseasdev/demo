/**
 * Audit log helpers — append-only KV log, capped at 50 entries.
 * Called from API routes after successful saves.
 */
import type { AuditEntry } from './schemas';

// Re-use the same KV accessor pattern as kv.ts but imported here to avoid circular deps.
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface CfKVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

function getKV(): CfKVNamespace | null {
  try {
    const ctx = getCloudflareContext();
    return (ctx?.env as any)?.CONTENT_KV || null;
  } catch {
    return null;
  }
}

const AUDIT_KEY = 'cms_audit_log';
const MAX_ENTRIES = 50;

export async function appendAuditLog(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void> {
  const kv = getKV();
  if (!kv) return; // No-op in local dev

  try {
    const raw = await kv.get(AUDIT_KEY);
    const existing: AuditEntry[] = raw ? JSON.parse(raw) : [];

    const newEntry: AuditEntry = {
      ...entry,
      id:        `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    // Prepend (newest first) and cap at MAX_ENTRIES
    const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
    await kv.put(AUDIT_KEY, JSON.stringify(updated));
  } catch {
    // Audit failure must never break the main save operation
  }
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  const kv = getKV();
  if (!kv) return [];
  try {
    const raw = await kv.get(AUDIT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function clearAuditLog(): Promise<void> {
  const kv = getKV();
  if (!kv) return;
  await kv.put(AUDIT_KEY, '[]');
}
