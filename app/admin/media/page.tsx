'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../_context';

// ── Types ─────────────────────────────────────────────────────────────────────
interface MediaItem {
  url:       string;
  key:       string;          // e.g. uploads/2026/06/1234-abc.jpg
  size?:     number;
  uploaded?: string;         // ISO date string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fileName(url: string) {
  return url.split('/').pop() ?? url;
}

function fileExt(url: string) {
  return (url.split('.').pop() ?? '').toLowerCase();
}

function isImage(url: string) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(fileExt(url));
}

function formatBytes(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── UploadZone ────────────────────────────────────────────────────────────────
function UploadZone({
  onUploaded,
  token,
}: {
  onUploaded: (item: MediaItem) => void;
  token: string;
}) {
  const { flash } = useToast();
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      flash('Only image files are accepted.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      flash('File too large — max 10 MB.', 'error');
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const fd = new FormData();
      fd.append('file', file);

      setProgress(40);
      const res = await fetch('/api/upload', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    fd,
      });
      setProgress(80);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' })) as any;
        flash(err.error ?? 'Upload failed', 'error');
        return;
      }

      const { url, key } = await res.json() as { url: string; key: string };

      // Persist URL in KV media library
      await fetch('/api/media/library', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ url }),
      });

      setProgress(100);
      onUploaded({ url, key, uploaded: new Date().toISOString() });
      flash('Image uploaded successfully.', 'success');
    } catch {
      flash('Network error during upload.', 'error');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
        transition-all duration-200 select-none
        ${dragging
          ? 'border-amber-400 bg-amber-50 scale-[1.01]'
          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
        }
        ${uploading ? 'pointer-events-none' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => void handleFiles(e.target.files)}
      />

      {uploading ? (
        <div className="space-y-3">
          <div className="text-3xl">⬆️</div>
          <p className="font-jakarta font-semibold text-slate-700 text-sm">Uploading…</p>
          <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-jakarta text-xs text-slate-400">{progress}%</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-4xl">{dragging ? '📥' : '🖼️'}</div>
          <p className="font-jakarta font-semibold text-slate-700">
            {dragging ? 'Drop to upload' : 'Drag & drop images here'}
          </p>
          <p className="font-jakarta text-xs text-slate-400">
            or click to browse · JPG, PNG, GIF, WebP · max 10 MB
          </p>
          <div className="inline-flex items-center gap-1.5 mt-1 bg-amber-500 text-white font-jakarta font-semibold text-xs px-4 py-2 rounded-xl">
            Choose Files
          </div>
        </div>
      )}
    </div>
  );
}

// ── MediaGrid ─────────────────────────────────────────────────────────────────
function MediaGrid({
  items,
  selected,
  onSelect,
  onCopy,
  onDelete,
}: {
  items:    MediaItem[];
  selected: string | null;
  onSelect: (url: string) => void;
  onCopy:   (url: string) => void;
  onDelete: (url: string) => void;
}) {
  if (!items.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">📂</div>
        <p className="font-jakarta font-semibold text-slate-600 mb-1">No media yet</p>
        <p className="font-jakarta text-sm text-slate-400">Upload your first image above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map(item => {
        const active = selected === item.url;
        return (
          <div
            key={item.url}
            onClick={() => onSelect(item.url)}
            className={`
              group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all
              ${active ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg' : 'border-transparent hover:border-slate-300'}
            `}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-slate-100 relative">
              {isImage(item.url) ? (
                <Image
                  src={item.url}
                  alt={fileName(item.url)}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">📄</div>
              )}

              {/* Active check */}
              {active && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="currentColor">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Hover action overlay */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                <button
                  onClick={e => { e.stopPropagation(); onCopy(item.url); }}
                  className="bg-white text-slate-700 font-jakarta text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
                  title="Copy URL"
                >
                  Copy
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(item.url); }}
                  className="bg-white text-red-500 font-jakarta text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  title="Remove from library"
                >
                  Del
                </button>
              </div>
            </div>

            {/* Filename */}
            <div className="px-2 py-1.5 bg-white">
              <p className="font-jakarta text-[10px] text-slate-500 truncate" title={fileName(item.url)}>
                {fileName(item.url)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  item,
  onCopy,
  onClose,
}: {
  item:    MediaItem;
  onCopy:  (url: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-0">
      {/* Preview */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        {isImage(item.url) ? (
          <Image src={item.url} alt={fileName(item.url)} fill className="object-contain" sizes="300px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📄</div>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Filename</p>
          <p className="font-jakarta text-sm text-slate-700 break-all">{fileName(item.url)}</p>
        </div>
        {item.uploaded && (
          <div>
            <p className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Uploaded</p>
            <p className="font-jakarta text-sm text-slate-600">{new Date(item.uploaded).toLocaleDateString('en-IN')}</p>
          </div>
        )}
        <div>
          <p className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">URL</p>
          <p className="font-jakarta text-[11px] text-slate-500 break-all leading-relaxed bg-slate-50 rounded-lg p-2 border border-slate-100">
            {item.url}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button
          onClick={() => onCopy(item.url)}
          className="w-full font-jakarta font-bold text-sm text-white py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
        >
          Copy URL →
        </button>
        <button
          onClick={onClose}
          className="w-full font-jakarta text-sm text-slate-500 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}

// ── Main MediaLibraryPage ─────────────────────────────────────────────────────
export default function MediaLibraryPage() {
  const { token }   = useAuth();
  const { flash }   = useToast();
  const [items,     setItems]    = useState<MediaItem[]>([]);
  const [loading,   setLoading]  = useState(true);
  const [selected,  setSelected] = useState<string | null>(null);
  const [search,    setSearch]   = useState('');

  const selectedItem = useMemo(
    () => items.find(i => i.url === selected) ?? null,
    [items, selected]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? items.filter(i => i.url.toLowerCase().includes(q)) : items;
  }, [items, search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media/library', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json() as any;
        // KV stores plain string array; normalise to MediaItem[]
        const urls: string[] = data.urls ?? [];
        setItems(urls.map(url => ({ url, key: url.split('/').pop() ?? url })));
      }
    } catch { /* stay with empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  function handleUploaded(item: MediaItem) {
    setItems(prev => [item, ...prev]);
    setSelected(item.url);
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url).then(() => flash('URL copied to clipboard!', 'success'));
  }

  async function handleDelete(url: string) {
    if (!confirm('Remove this image from the library?\n(The file stays in R2 — only the reference is removed.)')) return;
    // Reload library minus this URL — we overwrite via a fresh fetch
    const next = items.filter(i => i.url !== url).map(i => i.url);
    // The /api/media/library endpoint doesn't have a DELETE, so we rebuild
    // by posting each remaining URL... Instead use the simpler approach:
    // Optimistically update UI then call a remove endpoint if you build one.
    // For now optimistic-only (R2 file stays, reference gone from KV on next full write).
    setItems(prev => prev.filter(i => i.url !== url));
    if (selected === url) setSelected(null);
    flash('Removed from library.', 'info');
    // Persist removal: post the pruned list
    await fetch('/api/media/library', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ urls: next }),
    }).catch(() => {});
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">Media Library</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">
          Upload images and copy the public URL to use anywhere on the site.
        </p>
      </div>

      {/* Upload zone */}
      <UploadZone onUploaded={handleUploaded} token={token} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files…"
            className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-jakarta text-xs text-slate-400">{filtered.length} file{filtered.length !== 1 ? 's' : ''}</span>
          <button onClick={load} className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex gap-6 ${selectedItem ? 'items-start' : ''}`}>
        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <MediaGrid
              items={filtered}
              selected={selected}
              onSelect={url => setSelected(prev => prev === url ? null : url)}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <div className="w-64 flex-shrink-0">
            <DetailPanel
              item={selectedItem}
              onCopy={handleCopy}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
