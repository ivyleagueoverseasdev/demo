'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../_context';
import { useSaveButton } from '../_hooks';
import ImagePicker from '@/components/admin/ImagePicker';
import SaveButton from '@/components/admin/SaveButton';
import { SkeletonContentRow } from '@/components/admin/SkeletonCard';
import { apiCall } from '@/lib/edge-utils';
import type { HeroSlide, HeroCta, HeroCtaStyle, HeroCtaAction, HeroStat } from '@/lib/types';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

function emptySlide(): HeroSlide {
  return {
    id:               crypto.randomUUID(),
    badge:            '',
    headingLines:     ['', '', ''],
    headingHighlight: [false, false, false],
    highlightColor:   'text-amber-400',
    subtext:          '',
    trustBadges:      [''],
    ctaPrimary:       { label: 'Book a Free Consultation →', style: 'amber', action: 'link', href: '/contact' },
    ctaSecondary:     { label: '💬 Chat on WhatsApp', style: 'ghost', action: 'whatsapp' },
    imageUrl:         '',
    imageAlt:         '',
    stats:            [{ num: '10,000+', label: 'Students Placed', color: '#D97706' }],
    accentGradient:   'from-lime-900/60 via-lime-800/30',
    enabled:          true,
  };
}

const CTA_ACTIONS: { value: HeroCtaAction; label: string }[] = [
  { value: 'link',       label: 'Internal Link' },
  { value: 'whatsapp',   label: 'WhatsApp Chat' },
  { value: 'demo-modal', label: 'Demo Modal'    },
  { value: 'phone',      label: 'Phone Call'    },
];

const CTA_STYLES: { value: HeroCtaStyle; label: string }[] = [
  { value: 'amber', label: 'Amber (primary)' },
  { value: 'ghost', label: 'Ghost (outline)' },
  { value: 'green', label: 'Green'           },
];

const HIGHLIGHT_COLORS = [
  { value: 'text-amber-400',   label: 'Amber'   },
  { value: 'text-emerald-400', label: 'Emerald' },
  { value: 'text-lime-300',    label: 'Neon Lime' },
  { value: 'text-rose-400',    label: 'Rose'    },
];

// ── CtaEditor ─────────────────────────────────────────────────────────────────
function CtaEditor({ cta, onChange, label }: { cta: HeroCta; onChange: (c: HeroCta) => void; label: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
      <p className="font-jakarta text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Button Label</label>
          <input value={cta.label} onChange={e => onChange({ ...cta, label: e.target.value })} className={`${inp} py-2 text-xs`} />
        </div>
        <div>
          <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Action</label>
          <select value={cta.action} onChange={e => onChange({ ...cta, action: e.target.value as HeroCtaAction })} className={`${inp} py-2 text-xs cursor-pointer`}>
            {CTA_ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Style</label>
          <select value={cta.style} onChange={e => onChange({ ...cta, style: e.target.value as HeroCtaStyle })} className={`${inp} py-2 text-xs cursor-pointer`}>
            {CTA_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        {(cta.action === 'link' || cta.action === 'phone') && (
          <div>
            <label className="block font-jakarta text-[10px] text-slate-400 mb-1">URL / href</label>
            <input value={cta.href ?? ''} onChange={e => onChange({ ...cta, href: e.target.value })} className={`${inp} py-2 text-xs`} placeholder="/contact or tel:+91..." />
          </div>
        )}
      </div>
    </div>
  );
}

// ── SlideForm ─────────────────────────────────────────────────────────────────
function SlideForm({ slide, index, token, onChange, onRemove, total }: {
  slide:    HeroSlide;
  index:    number;
  token:    string;
  onChange: (s: HeroSlide) => void;
  onRemove: () => void;
  total:    number;
}) {
  const [open, setOpen] = useState(index === 0);

  function p<K extends keyof HeroSlide>(key: K, val: HeroSlide[K]) {
    onChange({ ...slide, [key]: val });
  }

  function setStat(i: number, field: keyof HeroStat, val: string) {
    const stats = slide.stats.map((s, j) => j === i ? { ...s, [field]: val } : s);
    p('stats', stats);
  }

  const previewImg = slide.imageUrl;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div
          className={`w-2 h-10 rounded-full flex-shrink-0 ${slide.enabled ? 'bg-amber-400' : 'bg-slate-200'}`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-jakarta font-bold text-slate-800 text-sm truncate">
            Slide {index + 1}{slide.badge ? ` — ${slide.badge.slice(0, 50)}` : ''}
          </p>
          <p className="font-jakarta text-xs text-slate-400 truncate">
            {slide.headingLines.filter(Boolean).join(' · ') || 'No heading yet'}
          </p>
        </div>
        {previewImg && (
          <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
            <Image src={previewImg} alt="Slide preview" fill className="object-cover" sizes="56px" />
          </div>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); p('enabled', !slide.enabled); }}
            className={`font-jakarta text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${slide.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
          >
            {slide.enabled ? 'Active' : 'Hidden'}
          </button>
          {total > 1 && (
            <button onClick={e => { e.stopPropagation(); onRemove(); }}
              className="font-jakarta text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors border border-red-100">
              Remove
            </button>
          )}
          <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 p-5 space-y-5">
          {/* Badge */}
          <div>
            <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Badge Pill Text</label>
            <input value={slide.badge} onChange={e => p('badge', e.target.value)} className={inp} placeholder="🎓 25+ Years of Trusted Expertise — Pune's #1 Choice" />
          </div>

          {/* Heading lines */}
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Heading Lines (up to 3)</label>
            <div className="space-y-2">
              {slide.headingLines.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={line}
                    onChange={e => { const hl = [...slide.headingLines]; hl[i] = e.target.value; p('headingLines', hl); }}
                    className={`${inp} flex-1`}
                    placeholder={`Line ${i + 1}`}
                  />
                  <label className="flex items-center gap-1.5 font-jakarta text-xs text-slate-500 flex-shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.headingHighlight[i] ?? false}
                      onChange={e => { const hh = [...slide.headingHighlight]; hh[i] = e.target.checked; p('headingHighlight', hh); }}
                      className="w-3.5 h-3.5 accent-amber-500"
                    />
                    Highlight
                  </label>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <label className="font-jakarta text-xs text-slate-400">Highlight colour:</label>
                <select
                  value={slide.highlightColor}
                  onChange={e => p('highlightColor', e.target.value)}
                  className="font-jakarta text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-amber-400 text-slate-700 bg-white cursor-pointer"
                >
                  {HIGHLIGHT_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Subtext */}
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subtext Paragraph</label>
            <textarea value={slide.subtext} onChange={e => p('subtext', e.target.value)} rows={3} className={`${inp} resize-none`} placeholder="Supporting paragraph below the heading…" />
          </div>

          {/* Trust badges */}
          <div>
            <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Trust Badges (pills below subtext)</label>
            <div className="space-y-2">
              {slide.trustBadges.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={b}
                    onChange={e => { const tb = [...slide.trustBadges]; tb[i] = e.target.value; p('trustBadges', tb); }}
                    className={`${inp} flex-1 text-xs py-2`}
                    placeholder="e.g. 97% Visa Approval"
                  />
                  {slide.trustBadges.length > 1 && (
                    <button onClick={() => p('trustBadges', slide.trustBadges.filter((_, j) => j !== i))}
                      className="px-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors flex-shrink-0 text-sm">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => p('trustBadges', [...slide.trustBadges, ''])}
                className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                + Add Badge
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <CtaEditor cta={slide.ctaPrimary}   onChange={c => p('ctaPrimary', c)}   label="Primary CTA" />
            <CtaEditor cta={slide.ctaSecondary} onChange={c => p('ctaSecondary', c)} label="Secondary CTA" />
          </div>

          {/* Image */}
          <div>
            <h5 className="font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Slide Image</h5>
            <ImagePicker value={slide.imageUrl} onChange={url => p('imageUrl', url)} token={token} label="" />
            <div className="mt-2">
              <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Image Alt Text (SEO)</label>
              <input value={slide.imageAlt} onChange={e => p('imageAlt', e.target.value)} className={`${inp} text-xs py-2`} placeholder="Students celebrating admission with ILOC" />
            </div>
          </div>

          {/* Stats badges */}
          <div>
            <h5 className="font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Floating Stat Badges</h5>
            <div className="space-y-3">
              {slide.stats.map((stat, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={stat.num}   onChange={e => setStat(i, 'num',   e.target.value)} className={`${inp} w-24 text-xs py-2`} placeholder="97%"    />
                  <input value={stat.label} onChange={e => setStat(i, 'label', e.target.value)} className={`${inp} flex-1 text-xs py-2`} placeholder="Visa Approval" />
                  <input value={stat.color} onChange={e => setStat(i, 'color', e.target.value)} className="w-8 h-9 rounded-lg border border-slate-200 cursor-pointer flex-shrink-0" type="color" title="Badge colour" />
                  {slide.stats.length > 1 && (
                    <button onClick={() => p('stats', slide.stats.filter((_, j) => j !== i))}
                      className="px-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors text-sm flex-shrink-0">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => p('stats', [...slide.stats, { num: '', label: '', color: '#65A30D' }])}
                className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                + Add Stat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminHeroPage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [slides,  setSlides]  = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const { state: saveState, run: runSave, isBusy } = useSaveButton();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero-slides', { cache: 'no-store' });
      if (res.ok) { const d = await res.json() as any; setSlides(d.slides ?? []); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    await runSave(async () => {
      const { ok, error } = await apiCall({
        method: 'PUT', url: '/api/hero-slides', token, body: { slides },
      });
      if (!ok) { flash(`Save failed: ${error}`, 'error'); return false; }
      flash('✓ Hero slides saved — live immediately.', 'success');
      return true;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🎠 Hero Slides</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">Manage the homepage hero carousel. Changes go live immediately via KV.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSlides(prev => [...prev, emptySlide()])}
            className="font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            + Add Slide
          </button>
          <SaveButton
            state={saveState}
            onClick={save}
            disabled={loading}
            idleLabel="💾 Save All Slides"
            className="px-6 py-2.5"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonContentRow key={i} />)}
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="text-5xl mb-3">🎠</div>
          <h3 className="font-jakarta font-bold text-slate-700 mb-2">No slides yet</h3>
          <button onClick={() => setSlides([emptySlide()])}
            className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl mt-2"
            style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}>
            Create First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <SlideForm
              key={slide.id}
              slide={slide}
              index={i}
              token={token}
              onChange={updated => setSlides(prev => prev.map((s, j) => j === i ? updated : s))}
              onRemove={() => setSlides(prev => prev.filter((_, j) => j !== i))}
              total={slides.length}
            />
          ))}
        </div>
      )}

      {slides.length > 0 && (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 -mx-6 px-6 py-4 flex items-center justify-between">
          <p className="font-jakarta text-xs text-slate-400">{slides.length} slide{slides.length !== 1 ? 's' : ''} · {slides.filter(s => s.enabled).length} active</p>
          <SaveButton
            state={saveState}
            onClick={save}
            idleLabel="💾 Save All Slides"
            className="px-6 py-2.5"
          />
        </div>
      )}
    </div>
  );
}
