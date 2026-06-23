'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth, useToast } from '../_context';
import { apiCall } from '@/lib/edge-utils';
import ImagePicker from '@/components/admin/ImagePicker';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { SkeletonContentRow } from '@/components/admin/SkeletonCard';
import { useRouter } from 'next/navigation';
import type { DynamicPage } from '@/lib/types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s/-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

function emptyPage(): Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt' | 'blocks'> {
  return {
    slug:            '',
    title:           '',
    metaTitle:       '',
    metaDescription: '',
    layout:          'default',
    published:       true,
    heroImageUrl:    '',
  };
}

const LAYOUTS: DynamicPage['layout'][] = ['default', 'article', 'landing', 'country'];
const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ pages }: { pages: DynamicPage[] }) {
  const layouts = LAYOUTS.reduce<Record<string, number>>((acc, l) => {
    acc[l] = pages.filter(p => p.layout === l).length;
    return acc;
  }, {});
  const stats = [
    { label: 'Total',     value: pages.length,                            bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
    { label: 'Published', value: pages.filter(p => p.published).length,   bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { label: 'Drafts',    value: pages.filter(p => !p.published).length,  bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500' },
    { label: 'Articles',  value: layouts.article ?? 0,                    bg: 'bg-lime-50 border-lime-200',   text: 'text-lime-700'  },
    { label: 'Landing',   value: layouts.landing  ?? 0,                   bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-2xl border ${s.bg} px-4 py-3 text-center`}>
          <div className={`font-jakarta font-extrabold text-xl ${s.text}`}>{s.value}</div>
          <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── PageRow ───────────────────────────────────────────────────────────────────
function PageRow({ page, onEdit, onDelete, onToggle }: {
  page:     DynamicPage;
  onEdit:   (p: DynamicPage) => void;
  onDelete: (slug: string) => void;
  onToggle: (p: DynamicPage) => void;
}) {
  const layoutColors: Record<string, string> = {
    default: 'bg-slate-100 text-slate-600',
    article: 'bg-lime-50 text-lime-600',
    landing: 'bg-violet-50 text-violet-600',
    country: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">📄</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-jakarta font-bold text-slate-800 text-sm">{page.title}</span>
          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${page.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {page.published ? 'Live' : 'Draft'}
          </span>
          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full ${layoutColors[page.layout] ?? 'bg-slate-100 text-slate-600'}`}>
            {page.layout}
          </span>
          {page.heroImageUrl && <span className="font-jakarta text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">🖼 Hero</span>}
        </div>
        <div className="font-jakarta text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <span>/{page.slug}</span>
          {page.blocks?.length > 0 && <span>· {page.blocks.length} block{page.blocks.length !== 1 ? 's' : ''}</span>}
          {page.metaDescription && <span className="italic truncate max-w-xs">· {page.metaDescription.slice(0, 60)}{page.metaDescription.length > 60 ? '…' : ''}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
        <Link href={`/${page.slug}`} target="_blank"
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          title="Preview">↗</Link>
        <button onClick={() => onToggle(page)}
          className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${page.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
          {page.published ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => onEdit(page)}
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(page.slug)}
          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          Del
        </button>
      </div>
    </div>
  );
}

// ── PageForm ──────────────────────────────────────────────────────────────────
function PageForm({ initial, editSlug, token, onSave, onCancel, busy }: {
  initial:  Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt' | 'blocks'>;
  editSlug: string | null;
  token:    string;
  onSave:   (data: Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt'>, published: boolean) => Promise<void>;
  onCancel: () => void;
  busy:     boolean;
}) {
  const [form, setForm]         = useState(initial);
  const [slugManual, setSlugManual] = useState(!!editSlug);
  const bodyKey = `page_body_${editSlug ?? 'new'}`;

  // Body stored separately (not in DynamicPage schema — goes into blocks[0].props.body)
  const [body, setBody] = useState<string>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem(bodyKey) ?? '';
    return '';
  });

  useEffect(() => {
    setForm(initial);
    setSlugManual(!!editSlug);
  }, [initial, editSlug]);

  useEffect(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem(bodyKey, body);
  }, [body, bodyKey]);

  function patch<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(title: string) {
    patch('title', title);
    if (!slugManual) patch('slug', slugify(title));
  }

  // Build blocks from body
  function buildBlocks(): DynamicPage['blocks'] {
    const blocks: DynamicPage['blocks'] = [];
    if (body.trim()) {
      blocks.push({ id: crypto.randomUUID(), type: 'text', props: { body } });
    }
    blocks.push({ id: crypto.randomUUID(), type: 'cta', props: { heading: 'Ready to begin?', subtext: 'Book a free counselling session.', buttonLabel: 'Book Free Session →', buttonHref: '/contact' } });
    return blocks;
  }

  const isNew = !editSlug;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-800">{isNew ? '✚ New Page' : '✏️ Edit Page'}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Basic ── */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Page Details</h4>

          <div>
            <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Page Title *</label>
            <input value={form.title} onChange={e => handleTitleChange(e.target.value)} className={inp} placeholder="e.g. Scholarship Guide 2026" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                URL Slug *
                {!slugManual && <span className="text-slate-300 font-normal normal-case tracking-normal ml-2">(auto)</span>}
              </label>
              <div className="flex items-center gap-2">
                <span className="font-jakarta text-xs text-slate-400 flex-shrink-0">/</span>
                <input
                  value={form.slug}
                  onChange={e => { setSlugManual(true); patch('slug', slugify(e.target.value)); }}
                  className={`${inp} flex-1`}
                  placeholder="scholarship-guide-2026"
                />
              </div>
              {form.slug && (
                <p className="font-jakarta text-[10px] text-slate-400 mt-1">
                  Live at: <code className="bg-slate-100 px-1 rounded">/{form.slug}</code> · no redeploy needed
                </p>
              )}
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Layout</label>
              <select value={form.layout} onChange={e => patch('layout', e.target.value as DynamicPage['layout'])} className={`${inp} cursor-pointer`}>
                {LAYOUTS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* ── SEO ── */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">SEO</h4>
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Meta Title <span className="text-slate-300 font-normal normal-case tracking-normal">(defaults to page title)</span></label>
            <input value={form.metaTitle} onChange={e => patch('metaTitle', e.target.value)} className={inp} placeholder="Scholarship Guide 2026 | ILOC" />
          </div>
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Meta Description <span className="text-slate-300 font-normal normal-case tracking-normal">· ~155 chars</span></label>
            <textarea value={form.metaDescription} onChange={e => patch('metaDescription', e.target.value)} rows={2} className={`${inp} resize-none`} placeholder="Complete guide to scholarships for Indian students studying abroad in 2026…" maxLength={300} />
            <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{form.metaDescription.length} / 300</p>
          </div>
        </section>

        {/* ── Hero image ── */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Hero Banner Image</h4>
          <ImagePicker value={form.heroImageUrl ?? ''} onChange={url => patch('heroImageUrl', url)} token={token} label="" />
        </section>

        {/* ── Body ── */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Body Content</h4>
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Write the page content here. Use the toolbar to add headings, bullet lists, and emphasis."
            minHeight={300}
          />
        </section>

        {/* ── Publish ── */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button type="button" onClick={() => patch('published', !form.published)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.published ? 'bg-green-500' : 'bg-slate-200'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : ''}`} />
          </button>
          <span className="font-jakarta text-sm text-slate-700 font-medium">
            {form.published ? 'Published — live at /slug immediately' : 'Draft — hidden from visitors'}
          </span>
        </div>

        {/* ── Buttons ── */}
        <div className="flex gap-3 flex-wrap pt-1">
          <button
            onClick={() => onSave({ ...form, blocks: buildBlocks() }, true)}
            disabled={busy || !form.title || !form.slug}
            className="font-jakarta font-bold text-sm text-white px-7 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            {busy ? 'Saving…' : isNew ? '🚀 Publish Page' : '🚀 Update & Publish'}
          </button>
          <button
            onClick={() => onSave({ ...form, published: false, blocks: buildBlocks() }, false)}
            disabled={busy || !form.title || !form.slug}
            className="font-jakarta font-bold text-sm px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
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
function FilterBar({ search, setSearch, statusFilter, setStatusFilter, layoutFilter, setLayoutFilter }: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  layoutFilter: string; setLayoutFilter: (v: string) => void;
}) {
  const active = search || statusFilter || layoutFilter;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or slug…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white" />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <select value={layoutFilter} onChange={e => setLayoutFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Layouts</option>
        {LAYOUTS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
      </select>
      {active && (
        <button onClick={() => { setSearch(''); setStatusFilter(''); setLayoutFilter(''); }}
          className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 flex-shrink-0 flex items-center gap-1.5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          Clear
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminPagesPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const router    = useRouter();

  const [pages,        setPages]        = useState<DynamicPage[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busy,         setBusy]         = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editSlug,     setEditSlug]     = useState<string | null>(null);
  const [formInitial,  setFormInitial]  = useState(emptyPage());
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [layoutFilter, setLayoutFilter] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const hdrs = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages', { headers: hdrs, cache: 'no-store' });
      if (res.ok) { const d = await res.json() as any; setPages(d.pages ?? []); }
      else { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; flash(e.error ?? 'Failed to load pages', 'error'); }
    } finally { setLoading(false); }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(); }, [load]);

  async function handleSave(data: Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt'>, published: boolean) {
    if (!data.title || !data.slug) { flash('Title and slug are required.', 'error'); return; }
    setBusy(true);
    try {
      const payload = { ...data, published };
      let res: Response;
      if (editSlug) {
        res = await fetch('/api/pages', { method: 'PUT', headers: hdrs, body: JSON.stringify({ ...payload, slug: editSlug }) });
      } else {
        res = await fetch('/api/pages', { method: 'POST', headers: hdrs, body: JSON.stringify({ ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() }) });
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({})) as { error?: string; details?: string };
        throw new Error(e.error ?? `HTTP ${res.status}`);
      }
      flash(editSlug ? '✓ Page updated — live immediately.' : '✓ Page published — live immediately.', 'success');
      closeForm();
      await load();
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? (e as Error).message : String(e);
      flash(`Save failed: ${msg}`, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete /${slug} permanently?`)) return;
    const { ok, error } = await apiCall({ method: 'DELETE', url: '/api/pages', token, body: { slug } });
    if (!ok) { flash(`Delete failed: ${error}`, 'error'); return; }
    setPages(prev => prev.filter(p => p.slug !== slug));
    flash('Page deleted.', 'info');
  }

  async function handleToggle(page: DynamicPage) {
    const { ok, error } = await apiCall({
      method: 'PUT', url: '/api/pages', token,
      body: { ...page, published: !page.published },
    });
    if (!ok) { flash(`Update failed: ${error}`, 'error'); return; }
    setPages(prev => prev.map(p => p.slug === page.slug ? { ...p, published: !p.published } : p));
    flash(`Page ${!page.published ? 'published' : 'unpublished'}.`, 'success');
  }

  function openNew() {
    setEditSlug(null); setFormInitial(emptyPage()); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function openEdit(page: DynamicPage) {
    setEditSlug(page.slug);
    setFormInitial({ slug: page.slug, title: page.title, metaTitle: page.metaTitle ?? '', metaDescription: page.metaDescription ?? '', layout: page.layout, published: page.published, heroImageUrl: page.heroImageUrl ?? '' });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeForm() { setShowForm(false); setEditSlug(null); setFormInitial(emptyPage()); }

  const filtered = pages.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.slug.includes(search.toLowerCase())) return false;
    if (statusFilter === 'published' && !p.published) return false;
    if (statusFilter === 'draft' && p.published) return false;
    if (layoutFilter && p.layout !== layoutFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📄 Pages</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            KV-powered dynamic pages — live at /slug with no redeploy required.
          </p>
        </div>
        {!showForm && (
          <button onClick={openNew}
            className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            + New Page
          </button>
        )}
      </div>

      {!loading && pages.length > 0 && <StatsBar pages={pages} />}

      {showForm && (
        <div ref={formRef}>
          <PageForm initial={formInitial} editSlug={editSlug} token={token} onSave={handleSave} onCancel={closeForm} busy={busy} />
        </div>
      )}

      {!loading && pages.length > 0 && (
        <FilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} layoutFilter={layoutFilter} setLayoutFilter={setLayoutFilter} />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonContentRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">📄</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {pages.length === 0 ? 'No pages yet' : 'No pages match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400 mb-5">
            {pages.length === 0 ? 'Create your first page — it\'s live at /slug without any build step.' : 'Try clearing your filters.'}
          </p>
          {pages.length === 0 && (
            <button onClick={openNew}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}>
              Create First Page
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(page => (
            <PageRow key={page.slug} page={page} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
          {filtered.length < pages.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">
              Showing {filtered.length} of {pages.length} pages
            </p>
          )}
        </div>
      )}
    </div>
  );
}
