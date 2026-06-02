'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../layout';
import ImagePicker from '@/components/admin/ImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { apiCall } from '@/lib/edge-utils';
import { useRouter } from 'next/navigation';
import type { NewsItem } from '@/lib/types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function emptyNews(): Omit<NewsItem, 'id' | 'createdAt'> {
  return {
    title:     '',
    slug:      '',
    date:      new Date().toISOString().slice(0, 10),
    excerpt:   '',
    content:   '',
    imageUrl:  '',
    published: true,
  };
}

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ items }: { items: NewsItem[] }) {
  const stats = [
    { label: 'Total',     value: items.length,                          bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
    { label: 'Published', value: items.filter(n => n.published).length, bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { label: 'Drafts',    value: items.filter(n => !n.published).length, bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-2xl border ${s.bg} px-4 py-3 text-center`}>
          <div className={`font-jakarta font-extrabold text-xl ${s.text}`}>{s.value}</div>
          <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── NewsRow ───────────────────────────────────────────────────────────────────
function NewsRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item:     NewsItem;
  onEdit:   (item: NewsItem) => void;
  onDelete: (id: string) => void;
  onToggle: (item: NewsItem) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      {item.imageUrl ? (
        <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 hidden sm:block">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
        </div>
      ) : (
        <div className="w-16 h-14 rounded-xl bg-slate-100 flex-shrink-0 hidden sm:flex items-center justify-center text-2xl">📰</div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-jakarta font-bold text-slate-800 text-sm truncate">{item.title}</span>
          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${item.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {item.published ? 'Live' : 'Draft'}
          </span>
        </div>
        <div className="font-jakarta text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <span>/news/{item.slug}</span>
          <span>·</span>
          <span>{item.date}</span>
          {item.excerpt && (
            <>
              <span>·</span>
              <span className="italic truncate max-w-xs">{item.excerpt.slice(0, 80)}{item.excerpt.length > 80 ? '…' : ''}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
        <a
          href={`/news/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          title="Preview"
        >↗</a>
        <button
          onClick={() => onToggle(item)}
          className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${item.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
        >
          {item.published ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={() => onEdit(item)}
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          Del
        </button>
      </div>
    </div>
  );
}

// ── NewsForm ──────────────────────────────────────────────────────────────────
function NewsForm({
  initial,
  editId,
  token,
  onSave,
  onCancel,
  busy,
}: {
  initial:  Omit<NewsItem, 'id' | 'createdAt'>;
  editId:   string | null;
  token:    string;
  onSave:   (data: Omit<NewsItem, 'id' | 'createdAt'>, published: boolean) => Promise<void>;
  onCancel: () => void;
  busy:     boolean;
}) {
  const [form, setForm] = useState(initial);
  const [slugManual, setSlugManual] = useState(!!editId); // lock slug when editing

  useEffect(() => {
    setForm(initial);
    setSlugManual(!!editId);
  }, [initial, editId]);

  function patch<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(title: string) {
    patch('title', title);
    if (!slugManual) patch('slug', slugify(title));
  }

  const isNew = !editId;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-800">
          {isNew ? '✚ New Article' : '✏️ Edit Article'}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none">✕</button>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Title + slug ── */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Article Details</h4>
          <div>
            <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              className={inp}
              placeholder="e.g. Canada IRCC Cap Updates 2026 — What Indian Students Must Know"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                URL Slug *
                {!slugManual && <span className="text-slate-300 normal-case tracking-normal ml-2 font-normal">(auto-generated)</span>}
              </label>
              <div className="flex items-center gap-2">
                <span className="font-jakarta text-xs text-slate-400 flex-shrink-0">/news/</span>
                <input
                  value={form.slug}
                  onChange={e => { setSlugManual(true); patch('slug', slugify(e.target.value)); }}
                  className={`${inp} flex-1`}
                  placeholder="canada-ircc-cap-updates-2026"
                />
              </div>
              {form.slug && (
                <p className="font-jakarta text-[10px] text-slate-400 mt-1">
                  Live at: <code className="bg-slate-100 px-1 rounded">/news/{form.slug}</code>
                </p>
              )}
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Publish Date</label>
              <input type="date" value={form.date} onChange={e => patch('date', e.target.value)} className={inp} />
            </div>
          </div>

          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Excerpt <span className="text-slate-300 normal-case tracking-normal font-normal">· ~160 chars, shown on news card and SEO</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={e => patch('excerpt', e.target.value)}
              rows={2}
              className={`${inp} resize-none`}
              placeholder="Short summary shown on the /news listing page and in search results…"
              maxLength={300}
            />
            <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{form.excerpt.length} / 300</p>
          </div>
        </section>

        {/* ── Cover image ── */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Cover Image</h4>
          <ImagePicker
            value={form.imageUrl}
            onChange={url => patch('imageUrl', url)}
            token={token}
            label=""
          />
        </section>

        {/* ── Body content ── */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Article Body *</h4>
          <RichTextEditor
            value={form.content}
            onChange={html => patch('content', html)}
            placeholder="Start writing the article here. Use the toolbar above to add headings, lists, and emphasis."
            minHeight={320}
          />
        </section>

        {/* ── Publish toggle ── */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => patch('published', !form.published)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.published ? 'bg-green-500' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : ''}`} />
          </button>
          <span className="font-jakarta text-sm text-slate-700 font-medium">
            {form.published ? 'Published — visible at /news/[slug]' : 'Draft — hidden from visitors'}
          </span>
        </div>

        {/* ── Save buttons ── */}
        <div className="flex gap-3 flex-wrap pt-1">
          <button
            onClick={() => onSave(form, true)}
            disabled={busy || !form.title || !form.slug}
            className="font-jakarta font-bold text-sm text-white px-7 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            {busy ? 'Saving…' : isNew ? '🚀 Publish Article' : '🚀 Update & Publish'}
          </button>
          <button
            onClick={() => onSave({ ...form, published: false }, false)}
            disabled={busy || !form.title || !form.slug}
            className="font-jakarta font-bold text-sm px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving…' : '💾 Save as Draft'}
          </button>
          <button onClick={onCancel} className="font-jakarta text-sm px-4 py-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
}: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or excerpt…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white"
        />
      </div>
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0"
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {(search || statusFilter) && (
        <button
          onClick={() => { setSearch(''); setStatusFilter(''); }}
          className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          Clear
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const router    = useRouter();

  const [items,        setItems]        = useState<NewsItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busy,         setBusy]         = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [formInitial,  setFormInitial]  = useState(emptyNews());
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (res.ok) { const d = await res.json() as any; setItems(d.news ?? []); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // ── Save (create or update) ───────────────────────────────────────────────
  async function handleSave(data: Omit<NewsItem, 'id' | 'createdAt'>, published: boolean) {
    if (!data.title || !data.slug) { flash('Title and slug are required.', 'error'); return; }
    setBusy(true);
    const payload = { ...data, published };
    const { ok, error } = editId
      ? await apiCall({ method: 'PUT',  url: '/api/news', token, body: { ...payload, id: editId } })
      : await apiCall({ method: 'POST', url: '/api/news', token, body: { ...payload, id: `news_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() } });

    if (!ok) { flash(`Save failed: ${error}`, 'error'); setBusy(false); return; }
    flash(editId ? '✓ Article updated — live immediately.' : '✓ Article published — live immediately.', 'success');
    closeForm();
    await load();
    router.refresh(); // clear Next.js client cache so /news reflects new content
    setBusy(false);
  }

  // ── Toggle publish ────────────────────────────────────────────────────────
  async function handleToggle(item: NewsItem) {
    const { ok, error } = await apiCall({
      method: 'PUT', url: '/api/news', token,
      body: { ...item, published: !item.published },
    });
    if (!ok) { flash(`Update failed: ${error}`, 'error'); return; }
    flash(`Article ${!item.published ? 'published' : 'unpublished'} — live immediately.`, 'success');
    await load();
    router.refresh();
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Delete this article permanently?')) return;
    const { ok, error } = await apiCall({
      method: 'PUT', url: '/api/news', token, body: { id, delete: true },
    });
    if (!ok) { flash(`Delete failed: ${error}`, 'error'); return; }
    flash('Article deleted.', 'info');
    await load();
  }

  function openNew() {
    setEditId(null);
    setFormInitial(emptyNews());
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function openEdit(item: NewsItem) {
    setEditId(item.id);
    setFormInitial({ title: item.title, slug: item.slug, date: item.date, excerpt: item.excerpt, content: item.content, imageUrl: item.imageUrl, published: item.published });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeForm() { setShowForm(false); setEditId(null); setFormInitial(emptyNews()); }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = items.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'published' && !item.published) return false;
    if (statusFilter === 'draft'     &&  item.published) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📰 News &amp; Articles</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">Write and publish articles shown on /news. Changes sync to KV instantly.</p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            + New Article
          </button>
        )}
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && <StatsBar items={items} />}

      {/* Form */}
      {showForm && (
        <div ref={formRef}>
          <NewsForm initial={formInitial} editId={editId} token={token} onSave={handleSave} onCancel={closeForm} busy={busy} />
        </div>
      )}

      {/* Filters */}
      {!loading && items.length > 0 && (
        <FilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">📰</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {items.length === 0 ? 'No articles yet' : 'No articles match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400 mb-5">
            {items.length === 0 ? 'Create your first article — it appears on /news instantly.' : 'Try clearing your filters.'}
          </p>
          {items.length === 0 && (
            <button
              onClick={openNew}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#246DFF,#1249C4)' }}
            >
              Write First Article
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <NewsRow key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
          {filtered.length < items.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">
              Showing {filtered.length} of {items.length} articles
            </p>
          )}
        </div>
      )}
    </div>
  );
}
