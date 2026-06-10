'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../layout';
import ImagePicker from '@/components/admin/ImagePicker';
import { apiCall } from '@/lib/edge-utils';
import type { Testimonial } from '@/lib/types';

// ── Defaults (fallback when KV is empty) ─────────────────────────────────────
// Kept minimal — matches DEFAULT_TESTIMONIALS shape from lib/data.ts
const STAR_OPTIONS = [5, 4, 3, 2, 1];

const COUNTRIES = [
  'USA 🇺🇸', 'UK 🇬🇧', 'Canada 🇨🇦', 'Australia 🇦🇺',
  'New Zealand 🇳🇿', 'Ireland 🇮🇪', 'Germany 🇩🇪', 'UAE 🇦🇪',
  'Singapore 🇸🇬', 'Japan 🇯🇵', 'South Korea 🇰🇷', 'Other',
];

function emptyTestimonial(): Omit<Testimonial, 'id'> {
  return { name: '', role: '', uni: '', country: '', quote: '', imageUrl: '', stars: 5, published: true };
}

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ items }: { items: Testimonial[] }) {
  const avg = items.length
    ? (items.reduce((s, t) => s + t.stars, 0) / items.length).toFixed(1)
    : '—';
  const stats = [
    { label: 'Total',     value: items.length,                           bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
    { label: 'Published', value: items.filter(t => t.published).length,  bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { label: 'Drafts',    value: items.filter(t => !t.published).length, bg: 'bg-slate-50 border-slate-200', text: 'text-slate-500' },
    { label: 'Avg Rating',value: avg,                                    bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`rounded-2xl border ${s.bg} px-4 py-3 text-center`}>
          <div className={`font-jakarta font-extrabold text-xl ${s.text}`}>{s.value}</div>
          <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Stars display ─────────────────────────────────────────────────────────────
function Stars({ count, size = 'sm' }: { count: number; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 12 12" className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'} ${i <= count ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor">
          <path d="M6 1l1.2 3.6H11l-3 2.2 1.1 3.6L6 8.5l-3.1 1.9L4 6.8l-3-2.2h3.8L6 1z"/>
        </svg>
      ))}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ t, size = 48 }: { t: Pick<Testimonial, 'name' | 'imageUrl'>; size?: number }) {
  const [err, setErr] = useState(false);
  const initials = t.name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-100 bg-gradient-to-br from-lime-600 to-lime-500 flex items-center justify-center font-jakarta font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.28 }}
    >
      {t.imageUrl && !err ? (
        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      ) : (
        initials || '?'
      )}
    </div>
  );
}

// ── TestimonialCard ───────────────────────────────────────────────────────────
function TestimonialCard({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item:     Testimonial;
  onEdit:   (item: Testimonial) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <Avatar t={item} size={48} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="font-jakarta font-bold text-slate-800 text-sm">{item.name}</span>
          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${item.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {item.published ? 'Live' : 'Draft'}
          </span>
          <Stars count={item.stars} />
        </div>
        <p className="font-jakarta text-xs text-slate-500 mb-1">
          {[item.role, item.uni, item.country].filter(Boolean).join(' · ')}
        </p>
        <p className="font-jakarta text-xs text-slate-500 italic leading-relaxed line-clamp-2">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
        <button
          onClick={() => onToggle(item.id)}
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

// ── StarPicker ────────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <svg viewBox="0 0 20 20" className={`w-6 h-6 transition-colors ${i <= (hover || value) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
      <span className="font-jakarta text-sm text-slate-500 ml-1">{value} star{value !== 1 ? 's' : ''}</span>
    </div>
  );
}

// ── TestimonialForm ───────────────────────────────────────────────────────────
function TestimonialForm({
  initial,
  editId,
  token,
  onSave,
  onCancel,
  busy,
}: {
  initial:  Omit<Testimonial, 'id'>;
  editId:   string | null;
  token:    string;
  onSave:   (data: Omit<Testimonial, 'id'>) => Promise<void>;
  onCancel: () => void;
  busy:     boolean;
}) {
  const [form, setForm] = useState(initial);
  useEffect(() => { setForm(initial); }, [initial]);

  function patch<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-800">
          {editId ? '✏️ Edit Testimonial' : '✚ New Testimonial'}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none">✕</button>
      </div>

      <div className="p-6 space-y-6">
        {/* Preview */}
        {form.name && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
            <Avatar t={form} size={44} />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-jakarta font-bold text-slate-800 text-sm">{form.name}</span>
                <Stars count={form.stars} />
              </div>
              <p className="font-jakarta text-xs text-slate-500">{[form.role, form.uni, form.country].filter(Boolean).join(' · ')}</p>
              {form.quote && <p className="font-jakarta text-xs text-slate-500 italic mt-1 leading-relaxed">&ldquo;{form.quote.slice(0, 120)}{form.quote.length > 120 ? '…' : ''}&rdquo;</p>}
            </div>
          </div>
        )}

        {/* Student details */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Student Details</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => patch('name', e.target.value)} className={inp} placeholder="e.g. Arjun Mehta" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Role / Degree</label>
              <input value={form.role} onChange={e => patch('role', e.target.value)} className={inp} placeholder="e.g. MS Computer Science" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">University</label>
              <input value={form.uni} onChange={e => patch('uni', e.target.value)} className={inp} placeholder="e.g. University of Toronto" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Destination Country</label>
              <input
                value={form.country}
                onChange={e => patch('country', e.target.value)}
                className={inp}
                placeholder="e.g. Canada 🇨🇦"
                list="country-suggestions"
              />
              <datalist id="country-suggestions">
                {COUNTRIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
        </section>

        {/* Avatar */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">
            Avatar Photo <span className="text-slate-300 normal-case tracking-normal font-normal">· leave blank to show initials</span>
          </h4>
          <ImagePicker value={form.imageUrl} onChange={url => patch('imageUrl', url)} token={token} label="" />
        </section>

        {/* Quote */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Quote *</h4>
          <textarea
            value={form.quote}
            onChange={e => patch('quote', e.target.value)}
            rows={4}
            className={`${inp} resize-none`}
            placeholder="What the student said about ILOC — be specific, include the outcome (e.g. visa approval, scholarship amount)."
          />
          <p className="font-jakarta text-[10px] text-slate-400 text-right">{form.quote.length} chars</p>
        </section>

        {/* Star rating */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Star Rating</h4>
          <StarPicker value={form.stars} onChange={v => patch('stars', v)} />
        </section>

        {/* Publish toggle */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => patch('published', !form.published)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.published ? 'bg-green-500' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-5' : ''}`} />
          </button>
          <span className="font-jakarta text-sm text-slate-700 font-medium">
            {form.published ? 'Published — visible on homepage' : 'Draft — hidden from visitors'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap pt-1">
          <button
            onClick={() => onSave(form)}
            disabled={busy || !form.name || !form.quote}
            className="font-jakarta font-bold text-sm text-white px-7 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            {busy ? 'Saving…' : editId ? '🚀 Update Testimonial' : '🚀 Add Testimonial'}
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
  starsFilter, setStarsFilter,
}: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  starsFilter: string; setStarsFilter: (v: string) => void;
}) {
  const active = search || statusFilter || starsFilter;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, university, or quote…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white"
        />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <select value={starsFilter} onChange={e => setStarsFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0">
        <option value="">All Ratings</option>
        {STAR_OPTIONS.map(n => <option key={n} value={n}>{'★'.repeat(n)} {n} star{n !== 1 ? 's' : ''}</option>)}
      </select>
      {active && (
        <button onClick={() => { setSearch(''); setStatusFilter(''); setStarsFilter(''); }}
          className="font-jakarta text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          Clear
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminStoriesPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [items,        setItems]        = useState<Testimonial[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busy,         setBusy]         = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [formInitial,  setFormInitial]  = useState(emptyTestimonial());
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [starsFilter,  setStarsFilter]  = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // ── Load — testimonials live inside siteContent ───────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      });
      if (res.ok) { const d = await res.json() as any; setItems(d.siteContent?.testimonials ?? []); }
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  // ── Save full list to KV ──────────────────────────────────────────────────
  async function saveList(list: Testimonial[]) {
    const { ok, error } = await apiCall({
      method: 'PUT', url: '/api/content', token, body: { testimonials: list },
    });
    if (!ok) throw new Error(error ?? 'Unknown error');
    setItems(list);
  }

  // ── Create / Update ───────────────────────────────────────────────────────
  async function handleSave(data: Omit<Testimonial, 'id'>) {
    if (!data.name || !data.quote) { flash('Name and quote are required.', 'error'); return; }
    setBusy(true);
    try {
      const next = editId
        ? items.map(t => t.id === editId ? { ...t, ...data } : t)
        : [...items, { ...data, id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }];
      await saveList(next);
      flash(editId ? '✓ Testimonial updated.' : '✓ Testimonial added.', 'success');
      closeForm();
    } catch (e: unknown) {
      flash(`Save failed: ${(e as Error).message}`, 'error');
    } finally { setBusy(false); }
  }

  // ── Toggle publish ────────────────────────────────────────────────────────
  async function handleToggle(id: string) {
    try {
      const next = items.map(t => t.id === id ? { ...t, published: !t.published } : t);
      await saveList(next);
      const t = next.find(x => x.id === id);
      flash(`Testimonial ${t?.published ? 'published' : 'unpublished'}.`, 'success');
    } catch (e: unknown) { flash(`Update failed: ${(e as Error).message}`, 'error'); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial permanently?')) return;
    try {
      await saveList(items.filter(t => t.id !== id));
      flash('Testimonial deleted.', 'info');
    } catch (e: unknown) { flash(`Delete failed: ${(e as Error).message}`, 'error'); }
  }

  function openNew() {
    setEditId(null); setFormInitial(emptyTestimonial()); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function openEdit(item: Testimonial) {
    setEditId(item.id);
    setFormInitial({ name: item.name, role: item.role, uni: item.uni, country: item.country, quote: item.quote, imageUrl: item.imageUrl, stars: item.stars, published: item.published });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeForm() { setShowForm(false); setEditId(null); setFormInitial(emptyTestimonial()); }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = items.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.quote.toLowerCase().includes(q) && !t.uni.toLowerCase().includes(q)) return false;
    }
    if (statusFilter === 'published' && !t.published) return false;
    if (statusFilter === 'draft'     &&  t.published) return false;
    if (starsFilter && t.stars !== Number(starsFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">⭐ Testimonials</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Student success stories shown on the homepage. Saved to Cloudflare KV — live immediately.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            + Add Testimonial
          </button>
        )}
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && <StatsBar items={items} />}

      {/* Form */}
      {showForm && (
        <div ref={formRef}>
          <TestimonialForm initial={formInitial} editId={editId} token={token} onSave={handleSave} onCancel={closeForm} busy={busy} />
        </div>
      )}

      {/* Filters */}
      {!loading && items.length > 0 && (
        <FilterBar
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          starsFilter={starsFilter} setStarsFilter={setStarsFilter}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-100 h-24 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">⭐</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {items.length === 0 ? 'No testimonials yet' : 'No testimonials match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400 mb-5">
            {items.length === 0
              ? 'Add your first student success story — it appears in the homepage masonry grid.'
              : 'Try clearing your filters.'}
          </p>
          {items.length === 0 && (
            <button
              onClick={openNew}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
            >
              Add First Testimonial
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <TestimonialCard key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
          ))}
          {filtered.length < items.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">
              Showing {filtered.length} of {items.length} testimonials
            </p>
          )}
        </div>
      )}
    </div>
  );
}
