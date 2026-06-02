'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, useToast } from '../layout';
import ImagePicker from '@/components/admin/ImagePicker';
import { apiCall } from '@/lib/edge-utils';
import type { SiteEvent, EventType, EventActionType } from '@/lib/types';

// ── Constants ─────────────────────────────────────────────────────────────────
const EVENT_TYPES: { value: EventType; label: string; color: string }[] = [
  { value: 'webinar',  label: 'Webinar',    color: '#246DFF' },
  { value: 'fair',     label: 'Fair',       color: '#059669' },
  { value: 'workshop', label: 'Workshop',   color: '#7C3AED' },
  { value: 'seminar',  label: 'Seminar',    color: '#D97706' },
  { value: 'deadline', label: 'Deadline',   color: '#DC2626' },
  { value: 'class',    label: 'Live Class', color: '#0891B2' },
];

const COUNTRIES = [
  { value: '',             label: 'All Countries' },
  { value: 'usa',         label: '🇺🇸 USA' },
  { value: 'uk',          label: '🇬🇧 UK' },
  { value: 'australia',   label: '🇦🇺 Australia' },
  { value: 'canada',      label: '🇨🇦 Canada' },
  { value: 'new-zealand', label: '🇳🇿 New Zealand' },
  { value: 'ireland',     label: '🇮🇪 Ireland' },
  { value: 'europe',      label: '🇪🇺 Europe' },
  { value: 'uae',         label: '🇦🇪 UAE' },
  { value: 'japan',       label: '🇯🇵 Japan' },
  { value: 'south-korea', label: '🇰🇷 South Korea' },
  { value: 'singapore',   label: '🇸🇬 Singapore' },
  { value: 'russia',      label: '🇷🇺 Russia' },
];

const ACTION_TYPES: { value: EventActionType; label: string }[] = [
  { value: 'zoom',         label: '🎥 Zoom'         },
  { value: 'webinar',      label: '📡 Webinar'      },
  { value: 'registration', label: '📋 Registration' },
  { value: 'external',     label: '🌐 External Link'},
  { value: 'whatsapp',     label: '💬 WhatsApp'     },
];

function typeColor(type: EventType) {
  return EVENT_TYPES.find(t => t.value === type)?.color ?? '#64748B';
}

function typeLabel(type: EventType) {
  return EVENT_TYPES.find(t => t.value === type)?.label ?? type;
}

function emptyEvent(): Omit<SiteEvent, 'id' | 'createdAt'> {
  return {
    title:       '',
    type:        'webinar',
    date:        '',
    time:        '',
    location:    '',
    description: '',
    body:        '',
    country:     '',
    imageUrl:    '',
    ctaLabel:    'Register Free',
    ctaUrl:      '/contact',
    actionLinks: [],
    seats:       undefined,
    speakers:    [],
    published:   true,
  };
}

// ── Shared input style ────────────────────────────────────────────────────────
const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({ events }: { events: SiteEvent[] }) {
  const today    = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.published && e.date >= today).length;
  const stats = [
    { label: 'Total',     value: events.length,                               bg: 'bg-slate-50 border-slate-200',   text: 'text-slate-700' },
    { label: 'Published', value: events.filter(e => e.published).length,      bg: 'bg-green-50 border-green-200',   text: 'text-green-700' },
    { label: 'Drafts',    value: events.filter(e => !e.published).length,     bg: 'bg-slate-50 border-slate-200',   text: 'text-slate-500' },
    { label: 'Upcoming',  value: upcoming,                                     bg: 'bg-blue-50 border-blue-200',     text: 'text-blue-700'  },
    { label: 'Classes',   value: events.filter(e => e.type === 'class').length, bg: 'bg-cyan-50 border-cyan-200',   text: 'text-cyan-700'  },
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

// ── Event list row ────────────────────────────────────────────────────────────
function EventRow({
  ev,
  onEdit,
  onDelete,
  onToggle,
}: {
  ev:       SiteEvent;
  onEdit:   (ev: SiteEvent) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const color = typeColor(ev.type);
  const today = new Date().toISOString().slice(0, 10);
  const past  = ev.date < today;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        {/* Type accent bar */}
        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: color }} />

        {/* Thumbnail */}
        {ev.imageUrl && (
          <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block border border-slate-100">
            <Image src={ev.imageUrl} alt={ev.title} fill className="object-cover" sizes="64px" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-jakarta font-bold text-slate-800 text-sm">{ev.title}</span>
            <span
              className="font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ color, background: `${color}18` }}
            >
              {typeLabel(ev.type)}
            </span>
            <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${ev.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {ev.published ? 'Live' : 'Draft'}
            </span>
            {past && <span className="font-jakarta text-[10px] text-slate-400 italic">Completed</span>}
          </div>
          <div className="font-jakarta text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span>📅 {ev.date}</span>
            {ev.time     && <span>⏰ {ev.time}</span>}
            {ev.location && <span>📍 {ev.location}</span>}
            {ev.seats    && <span>🪑 {ev.seats} seats</span>}
            {ev.country  && (
              <span className="font-jakarta text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                {COUNTRIES.find(c => c.value === ev.country)?.label ?? ev.country}
              </span>
            )}
            {ev.body && <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">📝 Rich body</span>}
            {(ev.actionLinks?.length ?? 0) > 0 && (
              <span className="text-[10px] bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">
                🔗 {ev.actionLinks!.length} link{ev.actionLinks!.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          <Link
            href={`/events/${ev.id}`}
            target="_blank"
            className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Preview"
          >↗</Link>
          <button
            onClick={() => onToggle(ev.id)}
            className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${ev.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
          >
            {ev.published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onEdit(ev)}
            className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(ev.id)}
            className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Event form ────────────────────────────────────────────────────────────────
function EventForm({
  initial,
  editId,
  token,
  onSave,
  onCancel,
  busy,
}: {
  initial:  Omit<SiteEvent, 'id' | 'createdAt'>;
  editId:   string | null;
  token:    string;
  onSave:   (data: Omit<SiteEvent, 'id' | 'createdAt'>, published: boolean) => Promise<void>;
  onCancel: () => void;
  busy:     boolean;
}) {
  const [form, setForm] = useState(initial);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Sync when editing different event
  useEffect(() => { setForm(initial); }, [initial]);

  function patch<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function addSpeaker()     { patch('speakers', [...(form.speakers ?? []), '']); }
  function removeSpeaker(i: number) { patch('speakers', (form.speakers ?? []).filter((_, j) => j !== i)); }
  function setSpeaker(i: number, v: string) { patch('speakers', (form.speakers ?? []).map((s, j) => j === i ? v : s)); }

  function addLink()        { patch('actionLinks', [...(form.actionLinks ?? []), { type: 'zoom' as EventActionType, label: 'Join Zoom', url: '' }]); }
  function removeLink(i: number) { patch('actionLinks', (form.actionLinks ?? []).filter((_, j) => j !== i)); }
  function setLink(i: number, key: 'type' | 'label' | 'url', val: string) {
    patch('actionLinks', (form.actionLinks ?? []).map((l, j) => j === i ? { ...l, [key]: val } : l));
  }

  const isNew = !editId;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <h3 className="font-jakarta font-bold text-slate-800">
          {isNew ? '✚ New Event / Class' : '✏️ Edit Event'}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none">✕</button>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Basic info ── */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Basic Info</h4>

          <div>
            <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={e => patch('title', e.target.value)}
              className={inp}
              placeholder="e.g. UK Admissions Masterclass"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
              <select value={form.type} onChange={e => patch('type', e.target.value as EventType)} className={`${inp} cursor-pointer`}>
                {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Target Country</label>
              <select value={form.country ?? ''} onChange={e => patch('country', e.target.value)} className={`${inp} cursor-pointer`}>
                {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => patch('date', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Time</label>
              <input value={form.time} onChange={e => patch('time', e.target.value)} className={inp} placeholder="4:00 PM – 5:30 PM IST" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
              <input value={form.location} onChange={e => patch('location', e.target.value)} className={inp} placeholder="Online (Zoom) / Pune Office" />
            </div>
          </div>

          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Short Description (card text)</label>
            <textarea
              value={form.description}
              onChange={e => patch('description', e.target.value)}
              rows={2}
              className={`${inp} resize-none`}
              placeholder="Brief description shown on the event card…"
            />
          </div>
        </section>

        {/* ── Image ── */}
        <section className="space-y-2">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Card Image</h4>
          <ImagePicker
            value={form.imageUrl ?? ''}
            onChange={url => patch('imageUrl', url)}
            token={token}
            label=""
          />
        </section>

        {/* ── Rich body ── */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Rich Body Content</h4>
            <span className="font-jakarta text-[10px] text-slate-400">Shown on /events/[id] detail page · Markdown supported</span>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 mb-1">
            <p className="font-jakarta text-[11px] text-slate-500">
              <strong>## Section</strong> · <strong>### Sub</strong> · <strong>- List</strong> · <strong>&gt; Quote</strong> · <strong>**bold**</strong>
            </p>
          </div>
          <textarea
            ref={bodyRef}
            value={form.body ?? ''}
            onChange={e => patch('body', e.target.value)}
            rows={12}
            className={`${inp} resize-y font-mono text-xs leading-relaxed`}
            placeholder={'## About This Event\n\nDescribe the event in detail.\n\n## What You Will Learn\n\n- Point one\n- Point two\n\n> Important note for attendees.'}
          />
        </section>

        {/* ── CTA + Seats ── */}
        <section className="space-y-4">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Call to Action</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">CTA Label</label>
              <input value={form.ctaLabel} onChange={e => patch('ctaLabel', e.target.value)} className={inp} placeholder="Register Free" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">CTA URL</label>
              <input value={form.ctaUrl ?? ''} onChange={e => patch('ctaUrl', e.target.value)} className={inp} placeholder="/contact" />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Seats Available</label>
              <input
                type="number"
                value={form.seats ?? ''}
                onChange={e => patch('seats', e.target.value ? Number(e.target.value) : undefined)}
                className={inp}
                placeholder="100"
                min={0}
              />
            </div>
          </div>
        </section>

        {/* ── Action Links ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Action Links</h4>
            <span className="font-jakarta text-[10px] text-slate-400">Zoom / Webinar / Registration buttons on detail page</span>
          </div>
          {(form.actionLinks ?? []).map((link, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="grid sm:grid-cols-[140px_1fr_1fr] gap-3 mb-2">
                <div>
                  <label className="block font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Type</label>
                  <select
                    value={link.type}
                    onChange={e => setLink(i, 'type', e.target.value)}
                    className={`${inp} cursor-pointer text-xs py-2`}
                  >
                    {ACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Button Label</label>
                  <input value={link.label} onChange={e => setLink(i, 'label', e.target.value)} className={`${inp} text-xs py-2`} placeholder="Join Zoom" />
                </div>
                <div>
                  <label className="block font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">URL *</label>
                  <input value={link.url} onChange={e => setLink(i, 'url', e.target.value)} className={`${inp} text-xs py-2`} placeholder="https://zoom.us/j/…" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="font-jakarta text-xs text-red-400 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            + Add Action Link
          </button>
        </section>

        {/* ── Speakers ── */}
        <section className="space-y-3">
          <h4 className="font-jakarta font-semibold text-slate-600 text-xs uppercase tracking-wide">Speakers</h4>
          {(form.speakers ?? []).map((sp, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={sp}
                onChange={e => setSpeaker(i, e.target.value)}
                className={inp}
                placeholder="e.g. Rajib Paul Choudhury — Study Abroad Expert"
              />
              <button
                type="button"
                onClick={() => removeSpeaker(i)}
                className="px-3 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
              >✕</button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpeaker}
            className="font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            + Add Speaker
          </button>
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
            {form.published ? 'Published — visible on /events' : 'Draft — hidden from visitors'}
          </span>
        </div>

        {/* ── Save buttons ── */}
        <div className="flex gap-3 flex-wrap pt-2">
          <button
            onClick={() => onSave(form, true)}
            disabled={busy || !form.title || !form.date}
            className="font-jakarta font-bold text-sm text-white px-7 py-3 rounded-xl disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            {busy ? 'Saving…' : isNew ? '🚀 Publish Event' : '🚀 Update & Publish'}
          </button>
          <button
            onClick={() => onSave({ ...form, published: false }, false)}
            disabled={busy || !form.title || !form.date}
            className="font-jakarta font-bold text-sm px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving…' : '💾 Save as Draft'}
          </button>
          <button
            onClick={onCancel}
            className="font-jakarta text-sm px-4 py-3 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
function FilterBar({
  search, setSearch,
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
}: {
  search: string; setSearch: (v: string) => void;
  typeFilter: string; setTypeFilter: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}) {
  const active = search || typeFilter || statusFilter;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events…"
          className="w-full pl-9 pr-4 py-2.5 font-jakarta text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-400 bg-white"
        />
      </div>
      <select
        value={typeFilter}
        onChange={e => setTypeFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0"
      >
        <option value="">All Types</option>
        {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer flex-shrink-0"
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {active && (
        <button
          onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); }}
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
export default function AdminEventsPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [events,       setEvents]       = useState<SiteEvent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [busy,         setBusy]         = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [formInitial,  setFormInitial]  = useState(emptyEvent());
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      if (res.ok) { const d = await res.json() as any; setEvents(d.events ?? []); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // ── Save ──────────────────────────────────────────────────────────────────
  async function saveEvents(next: SiteEvent[]): Promise<boolean> {
    const { ok, error } = await apiCall({
      method: 'PUT', url: '/api/events', token, body: { events: next },
    });
    if (!ok) throw new Error(error ?? 'Unknown error');
    setEvents(next);
    return true;
  }

  async function handleSave(data: Omit<SiteEvent, 'id' | 'createdAt'>, published: boolean) {
    if (!data.title || !data.date) { flash('Title and date are required.', 'error'); return; }
    setBusy(true);
    try {
      const payload = { ...data, published };
      const next = editId
        ? events.map(e => e.id === editId ? { ...e, ...payload } : e)
        : [...events, { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
      await saveEvents(next);
      flash(editId ? '✓ Event updated.' : '✓ Event published.', 'success');
      closeForm();
    } catch (e: unknown) {
      flash(`Save failed: ${(e as Error).message}`, 'error');
    } finally { setBusy(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event permanently?')) return;
    try {
      await saveEvents(events.filter(e => e.id !== id));
      flash('Event deleted.', 'info');
    } catch (e: unknown) { flash(`Delete failed: ${(e as Error).message}`, 'error'); }
  }

  async function handleToggle(id: string) {
    try {
      const next = events.map(e => e.id === id ? { ...e, published: !e.published } : e);
      await saveEvents(next);
      const ev = next.find(e => e.id === id);
      flash(`Event ${ev?.published ? 'published' : 'unpublished'}.`, 'success');
    } catch (e: unknown) { flash(`Update failed: ${(e as Error).message}`, 'error'); }
  }

  function openNew() {
    setEditId(null);
    setFormInitial(emptyEvent());
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function openEdit(ev: SiteEvent) {
    setEditId(ev.id);
    setFormInitial({
      title:       ev.title,
      type:        ev.type,
      date:        ev.date,
      time:        ev.time,
      location:    ev.location,
      description: ev.description,
      body:        ev.body ?? '',
      country:     ev.country ?? '',
      imageUrl:    ev.imageUrl ?? '',
      ctaLabel:    ev.ctaLabel,
      ctaUrl:      ev.ctaUrl ?? '',
      actionLinks: ev.actionLinks ?? [],
      seats:       ev.seats,
      speakers:    ev.speakers ?? [],
      published:   ev.published,
    });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setFormInitial(emptyEvent());
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = events.filter(ev => {
    if (search && !ev.title.toLowerCase().includes(search.toLowerCase()) &&
        !ev.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter   && ev.type                          !== typeFilter)   return false;
    if (statusFilter === 'published' && !ev.published)                     return false;
    if (statusFilter === 'draft'     &&  ev.published)                     return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📅 Events &amp; Classes</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">
            Manage all events and live classes. Changes sync to KV instantly — no redeploy needed.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="font-jakarta font-bold text-sm text-white px-5 py-2.5 rounded-xl flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
          >
            + New Event
          </button>
        )}
      </div>

      {/* Stats */}
      {!loading && events.length > 0 && <StatsBar events={events} />}

      {/* Form (anchored) */}
      {showForm && (
        <div ref={formRef}>
          <EventForm
            initial={formInitial}
            editId={editId}
            token={token}
            onSave={handleSave}
            onCancel={closeForm}
            busy={busy}
          />
        </div>
      )}

      {/* Filters */}
      {!loading && events.length > 0 && (
        <FilterBar
          search={search}           setSearch={setSearch}
          typeFilter={typeFilter}   setTypeFilter={setTypeFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">📅</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-1">
            {events.length === 0 ? 'No events yet' : 'No events match your filters'}
          </h3>
          <p className="font-jakarta text-sm text-slate-400 mb-5">
            {events.length === 0
              ? 'Create your first event — it appears on /events and the homepage carousel instantly.'
              : 'Try clearing filters to see all events.'}
          </p>
          {events.length === 0 && (
            <button
              onClick={openNew}
              className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#246DFF,#1249C4)' }}
            >
              Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ev => (
            <EventRow
              key={ev.id}
              ev={ev}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
          {filtered.length < events.length && (
            <p className="font-jakarta text-xs text-slate-400 text-center pt-2">
              Showing {filtered.length} of {events.length} events
            </p>
          )}
        </div>
      )}
    </div>
  );
}
