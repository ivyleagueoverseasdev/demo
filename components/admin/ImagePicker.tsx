'use client';

/**
 * ImagePicker — reusable image input used throughout the admin.
 *
 * Features:
 *  - Paste a URL directly
 *  - Upload a file to R2 via /api/upload
 *  - Browse the KV media library in a modal
 *  - Live preview of the selected image
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  value:     string;
  onChange:  (url: string) => void;
  label?:    string;
  token:     string;
  /** Show 'Browse Library' button (default true) */
  library?:  boolean;
}

// ── Library modal ─────────────────────────────────────────────────────────────
function LibraryModal({
  token,
  onPick,
  onClose,
}: {
  token:   string;
  onPick:  (url: string) => void;
  onClose: () => void;
}) {
  const [urls,    setUrls]    = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState('');

  useEffect(() => {
    fetch('/api/media/library', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : { urls: [] })
      .then(d => setUrls(d.urls ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = q
    ? urls.filter(u => u.toLowerCase().includes(q.toLowerCase()))
    : urls;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-jakarta font-bold text-slate-800">Media Library</h3>
          <div className="flex items-center gap-3">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search…"
              className="font-jakarta text-sm border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-amber-400 w-44 text-slate-700 placeholder-slate-300"
            />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-jakarta text-slate-400 text-sm">
                {urls.length === 0 ? 'No images in library yet. Upload some first.' : 'No matches.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {filtered.map(url => (
                <button
                  key={url}
                  onClick={() => { onPick(url); onClose(); }}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-400 transition-all"
                >
                  <Image
                    src={url}
                    alt={url.split('/').pop() ?? ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="font-jakarta text-xs text-slate-400">
            {filtered.length} image{filtered.length !== 1 ? 's' : ''} · Go to{' '}
            <a href="/admin/media" target="_blank" className="text-amber-600 hover:underline">Media Library</a>
            {' '}to upload new images.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ImagePicker ───────────────────────────────────────────────────────────────
export default function ImagePicker({
  value,
  onChange,
  label = 'Image',
  token,
  library = true,
}: Props) {
  const [uploading, setUploading]  = useState(false);
  const [showLib,   setShowLib]    = useState(false);
  const [imgError,  setImgError]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset error when value changes
  useEffect(() => { setImgError(false); }, [value]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    fd,
      });
      if (!res.ok) return;
      const { url } = await res.json();
      onChange(url);
      // Persist to library
      await fetch('/api/media/library', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ url }),
      });
    } finally {
      setUploading(false);
    }
  }, [token, onChange]);

  return (
    <>
      <div className="space-y-2">
        {label && (
          <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}
          </label>
        )}

        {/* URL input row */}
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://… or upload / browse below"
            className="flex-1 font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white"
          />

          {/* Upload file */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {uploading ? '⬆ …' : '⬆ Upload'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); }}
          />

          {/* Browse library */}
          {library && (
            <button
              type="button"
              onClick={() => setShowLib(true)}
              className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors whitespace-nowrap"
            >
              🖼 Library
            </button>
          )}

          {/* Clear */}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="font-jakarta text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>

        {/* Preview */}
        {value && !imgError && (
          <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <Image
              src={value}
              alt="preview"
              fill
              className="object-cover"
              sizes="600px"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 flex items-end p-2 pointer-events-none">
              <span className="font-jakarta text-[10px] text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
          </div>
        )}
        {value && imgError && (
          <p className="font-jakarta text-xs text-red-500">⚠ Image could not be loaded from this URL.</p>
        )}
      </div>

      {/* Library modal */}
      {showLib && (
        <LibraryModal
          token={token}
          onPick={onChange}
          onClose={() => setShowLib(false)}
        />
      )}
    </>
  );
}
