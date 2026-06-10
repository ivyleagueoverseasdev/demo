'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../layout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/admin/ImagePicker';
import { COUNTRIES_MAP } from '@/lib/data';
import { SECTION_SLUGS, SECTION_LABELS } from '@/lib/countrySubpages';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

const COUNTRY_CODES = Object.keys(COUNTRIES_MAP);

// Section list MUST mirror the public site's slugs (lib/countrySubpages.ts) —
// content saved under any other slug is never rendered.
const SECTION_ICONS: Record<string, string> = {
  'why-study':             '🎯',
  'application-procedure': '📋',
  'university-list':       '🏛',
  'salient-features':      '✨',
  'entry-criteria':        '🎓',
};
const SECTIONS = SECTION_SLUGS.map(slug => ({
  slug: slug as string,
  label: `${SECTION_ICONS[slug] ?? '📄'} ${SECTION_LABELS[slug]}`,
}));

interface CountryMetaForm {
  intake:      string;
  avgCost:     string;
  visaRate:    string;
  unis:        string;
  tagline:     string;
  description: string;
  heroImage:   string;
  campusImage: string;
  color:       string;
}

function emptyMeta(code: string): CountryMetaForm {
  const d = COUNTRIES_MAP[code];
  return {
    intake:      d?.intake      ?? '',
    avgCost:     d?.avgCost     ?? '',
    visaRate:    d?.visaRate    ?? '',
    unis:        d?.unis        ?? '',
    tagline:     d?.tagline     ?? '',
    description: d?.description ?? '',
    heroImage:   d?.heroImage   ?? '',
    campusImage: d?.campusImage ?? '',
    color:       d?.color       ?? '#65A30D',
  };
}

export default function AdminCountriesPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const hdrs   = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const router = useRouter();

  const [activeCountry, setActiveCountry] = useState(COUNTRY_CODES[0] ?? 'usa');
  const [activeSection, setActiveSection] = useState(SECTIONS[0].slug);

  const [meta,        setMeta]        = useState<CountryMetaForm>(() => emptyMeta(COUNTRY_CODES[0] ?? 'usa'));
  const [metaBusy,    setMetaBusy]    = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);

  const [html,        setHtml]        = useState('');
  const [htmlBusy,    setHtmlBusy]    = useState(false);
  const [htmlLoading, setHtmlLoading] = useState(false);

  // ── Load meta ─────────────────────────────────────────────────────────────
  const loadMeta = useCallback(async (code: string) => {
    setMetaLoading(true);
    const defaults = emptyMeta(code);
    try {
      const res = await fetch(`/api/country-meta?country=${encodeURIComponent(code)}`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as any;
        if (d?.meta) {
          setMeta({
            intake:      d.meta.intake      || defaults.intake,
            avgCost:     d.meta.avgCost     || defaults.avgCost,
            visaRate:    d.meta.visaRate    || defaults.visaRate,
            unis:        d.meta.unis        || defaults.unis,
            tagline:     d.meta.tagline     || defaults.tagline,
            description: d.meta.description || defaults.description,
            heroImage:   d.meta.heroImage   || defaults.heroImage,
            campusImage: d.meta.campusImage || defaults.campusImage,
            color:       d.meta.color       || defaults.color,
          });
        } else setMeta(defaults);
      } else setMeta(defaults);
    } finally { setMetaLoading(false); }
  }, []);

  // ── Load HTML section ─────────────────────────────────────────────────────
  const loadHtml = useCallback(async (code: string, section: string) => {
    setHtmlLoading(true);
    setHtml('');
    try {
      const res = await fetch(`/api/country-content?country=${encodeURIComponent(code)}&section=${encodeURIComponent(section)}`, { cache: 'no-store' });
      if (res.ok) { const d = await res.json() as any; setHtml(d.html ?? ''); }
    } finally { setHtmlLoading(false); }
  }, []);

  useEffect(() => { void loadMeta(activeCountry); }, [activeCountry, loadMeta]);
  useEffect(() => { void loadHtml(activeCountry, activeSection); }, [activeCountry, activeSection, loadHtml]);

  async function saveMeta() {
    setMetaBusy(true);
    try {
      const res = await fetch('/api/country-meta', {
        method: 'PUT', headers: hdrs,
        body: JSON.stringify({ country: activeCountry, meta }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Country stats saved — live immediately.', 'success');
      router.refresh();
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setMetaBusy(false); }
  }

  async function saveHtml() {
    setHtmlBusy(true);
    try {
      const res = await fetch('/api/country-content', {
        method: 'PUT', headers: hdrs,
        body: JSON.stringify({ country: activeCountry, section: activeSection, html }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string; details?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Section content saved — live immediately.', 'success');
      router.refresh();
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setHtmlBusy(false); }
  }

  const country = COUNTRIES_MAP[activeCountry];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🌍 Country Pages</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">Edit stats and rich content for each study destination. Saves to KV — live immediately.</p>
      </div>

      {/* Country selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">Select Country</label>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_CODES.map(code => {
            const c = COUNTRIES_MAP[code];
            return (
              <button key={code} onClick={() => setActiveCountry(code)}
                className={`font-jakarta text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${activeCountry === code ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {c?.flag} {c?.name ?? code.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stat blocks */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">
            {country?.flag} {country?.name ?? activeCountry.toUpperCase()} — Stat Blocks & Meta
          </h3>
          <button onClick={saveMeta} disabled={metaBusy || metaLoading}
            className="font-jakarta font-bold text-sm text-white px-5 py-2 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {metaBusy ? 'Saving…' : 'Save Stats'}
          </button>
        </div>

        {metaLoading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tagline</label>
                <input value={meta.tagline} onChange={e => setMeta(m => ({ ...m, tagline: e.target.value }))} className={inp} placeholder="e.g. The Global Leader in Higher Education" />
              </div>
              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={meta.color} onChange={e => setMeta(m => ({ ...m, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                  <input value={meta.color} onChange={e => setMeta(m => ({ ...m, color: e.target.value }))} className={`${inp} flex-1`} placeholder="#65A30D" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              {[
                { field: 'intake',   label: 'Intake',       ph: 'Aug / Jan' },
                { field: 'avgCost',  label: 'Avg Cost',     ph: '$20,000–$55,000/yr' },
                { field: 'visaRate', label: 'Visa Rate',    ph: '97%' },
                { field: 'unis',     label: 'Universities', ph: '4,000+' },
              ].map(({ field, label, ph }) => (
                <div key={field}>
                  <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <input value={meta[field as keyof CountryMetaForm]} onChange={e => setMeta(m => ({ ...m, [field]: e.target.value }))} className={`${inp} text-xs py-2`} placeholder={ph} />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Short Description</label>
              <textarea value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} rows={3} className={`${inp} resize-none`} placeholder="2–3 sentence overview shown on the destinations listing page…" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ImagePicker value={meta.heroImage}   onChange={url => setMeta(m => ({ ...m, heroImage:   url }))} token={token} label="Hero Banner Image"  />
              <ImagePicker value={meta.campusImage} onChange={url => setMeta(m => ({ ...m, campusImage: url }))} token={token} label="Campus / Card Image" />
            </div>
          </div>
        )}
      </div>

      {/* Section content editor */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-jakarta font-bold text-slate-700">Rich Content Sections</h3>
            <p className="font-jakarta text-xs text-slate-400 mt-0.5">HTML rendered on /destinations/{activeCountry}/[section]</p>
          </div>
          <button onClick={saveHtml} disabled={htmlBusy || htmlLoading}
            className="font-jakarta font-bold text-sm text-white px-5 py-2 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {htmlBusy ? 'Saving…' : 'Save Section'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Section tabs */}
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map(s => (
              <button key={s.slug} onClick={() => setActiveSection(s.slug)}
                className={`font-jakarta text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${activeSection === s.slug ? 'bg-lime-600 text-white border-lime-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {s.label}
              </button>
            ))}
          </div>

          {htmlLoading ? (
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder={`Write content for the ${SECTIONS.find(s => s.slug === activeSection)?.label ?? 'section'} section of the ${country?.name ?? activeCountry} page…`}
              minHeight={300}
            />
          )}
        </div>
      </div>
    </div>
  );
}
