'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useToast } from '../_context';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/admin/ImagePicker';
import { COUNTRIES_MAP } from '@/lib/data';
import { SECTION_SLUGS, SECTION_LABELS } from '@/lib/countrySubpages';
import { SkeletonFormBlock } from '@/components/admin/SkeletonCard';
import type { CustomCountry, CountrySection } from '@/lib/types';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

const STATIC_CODES = Object.keys(COUNTRIES_MAP);

// Built-in section list MUST mirror the public site's slugs (lib/countrySubpages.ts).
const SECTION_ICONS: Record<string, string> = {
  'why-study':             '🎯',
  'application-procedure': '📋',
  'university-list':       '🏛',
  'salient-features':      '✨',
  'entry-criteria':        '🎓',
};
const BUILTIN_SECTIONS = SECTION_SLUGS.map(slug => ({
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

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCountriesPage() {
  const { token } = useAuth();
  const { flash } = useToast();
  const hdrs   = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const router = useRouter();

  // ── Country list state (built-in + custom + hidden) ──────────────────────
  const [custom,  setCustom]  = useState<CustomCountry[]>([]);
  const [hidden,  setHidden]  = useState<string[]>([]);
  const [listBusy, setListBusy] = useState(false);

  const allCodes = [...STATIC_CODES, ...custom.map(c => c.code).filter(c => !STATIC_CODES.includes(c))];

  const [activeCountry, setActiveCountry] = useState(STATIC_CODES[0] ?? 'usa');
  const [activeSection, setActiveSection] = useState(BUILTIN_SECTIONS[0].slug);

  const customEntry = custom.find(c => c.code === activeCountry) ?? null;
  const isCustomCountry = !!customEntry && !STATIC_CODES.includes(activeCountry);
  const isHidden = hidden.includes(activeCountry);

  const displayName = (code: string) =>
    COUNTRIES_MAP[code]?.name ?? custom.find(c => c.code === code)?.name ?? code;

  function emptyMeta(code: string): CountryMetaForm {
    const d = COUNTRIES_MAP[code] ?? custom.find(c => c.code === code);
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

  const [meta,        setMeta]        = useState<CountryMetaForm>({
    intake: '', avgCost: '', visaRate: '', unis: '', tagline: '',
    description: '', heroImage: '', campusImage: '', color: '#65A30D',
  });
  const [metaBusy,    setMetaBusy]    = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);

  const [html,        setHtml]        = useState('');
  const [htmlBusy,    setHtmlBusy]    = useState(false);
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [isDefault,   setIsDefault]   = useState(false);

  // ── Custom sections (extra sub-page buttons) for the active country ──────
  const [customSections, setCustomSections] = useState<CountrySection[]>([]);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [sectionsBusy, setSectionsBusy] = useState(false);

  // ── Add-country form ──────────────────────────────────────────────────────
  const [showAdd, setShowAdd] = useState(false);
  const [newCountry, setNewCountry] = useState({ name: '', color: '#1249C4' });

  // ── Load custom/hidden lists ──────────────────────────────────────────────
  const loadCountryList = useCallback(async () => {
    try {
      const res = await fetch('/api/countries', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as { custom?: CustomCountry[]; hidden?: string[] };
        setCustom(d.custom ?? []);
        setHidden(d.hidden ?? []);
      }
    } catch { /* keep defaults */ }
  }, []);

  useEffect(() => { void loadCountryList(); }, [loadCountryList]);

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
  }, [custom]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load custom sections list ─────────────────────────────────────────────
  const loadSections = useCallback(async (code: string) => {
    try {
      const res = await fetch(`/api/country-content?country=${encodeURIComponent(code)}&list=1`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as { sections?: CountrySection[] };
        setCustomSections(d.sections ?? []);
      } else setCustomSections([]);
    } catch { setCustomSections([]); }
  }, []);

  // ── Load HTML section ─────────────────────────────────────────────────────
  const loadHtml = useCallback(async (code: string, section: string) => {
    setHtmlLoading(true);
    setHtml('');
    try {
      const res = await fetch(`/api/country-content?country=${encodeURIComponent(code)}&section=${encodeURIComponent(section)}`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json() as any;
        setHtml(d.html ?? '');
        setIsDefault(!!d.isDefault);
      }
    } finally { setHtmlLoading(false); }
  }, []);

  useEffect(() => { void loadMeta(activeCountry); void loadSections(activeCountry); }, [activeCountry, loadMeta, loadSections]);
  useEffect(() => { void loadHtml(activeCountry, activeSection); }, [activeCountry, activeSection, loadHtml]);

  // Reset section tab when switching country (a custom tab may not exist there)
  useEffect(() => { setActiveSection(BUILTIN_SECTIONS[0].slug); }, [activeCountry]);

  async function saveMeta() {
    setMetaBusy(true);
    try {
      const res = await fetch('/api/country-meta', {
        method: 'PUT', headers: hdrs,
        body: JSON.stringify({ country: activeCountry, meta }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      // Keep the custom-country base record in sync so listings show the same data
      if (isCustomCountry && customEntry) {
        const updated = custom.map(c => c.code === activeCountry ? {
          ...c,
          intake: meta.intake, avgCost: meta.avgCost, visaRate: meta.visaRate,
          unis: meta.unis, tagline: meta.tagline, description: meta.description,
          heroImage: meta.heroImage, campusImage: meta.campusImage, color: meta.color,
        } : c);
        await saveCountryList({ custom: updated });
      }
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
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      flash('✓ Section content saved — live immediately.', 'success');
      setIsDefault(false);
      router.refresh();
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setHtmlBusy(false); }
  }

  // ── Country list mutations ────────────────────────────────────────────────
  async function saveCountryList(patch: { custom?: CustomCountry[]; hidden?: string[] }) {
    const res = await fetch('/api/countries', { method: 'PUT', headers: hdrs, body: JSON.stringify(patch) });
    if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
    if (patch.custom) setCustom(patch.custom);
    if (patch.hidden) setHidden(patch.hidden);
  }

  async function addCountry() {
    const name = newCountry.name.trim();
    if (!name) { flash('Enter a country name first.', 'error'); return; }
    const code = slugify(name);
    if (!code) { flash('Country name must contain letters or numbers.', 'error'); return; }
    if (allCodes.includes(code)) { flash(`"${name}" already exists.`, 'error'); return; }
    setListBusy(true);
    try {
      const entry: CustomCountry = {
        code, name, tagline: '', intake: '', avgCost: '', visaRate: '', unis: '',
        description: '', highlights: [], heroImage: '', campusImage: '',
        color: newCountry.color || '#1249C4',
      };
      await saveCountryList({ custom: [...custom, entry] });
      flash(`✓ ${name} added — fill in its stats, images and content below.`, 'success');
      setShowAdd(false);
      setNewCountry({ name: '', color: '#1249C4' });
      setActiveCountry(code);
      router.refresh();
    } catch (e) { flash(`Add failed: ${(e as Error).message}`, 'error'); }
    finally { setListBusy(false); }
  }

  async function deleteCustomCountry(code: string) {
    if (!window.confirm(`Delete ${displayName(code)} from Destinations? Its saved content stays in KV but the page goes offline.`)) return;
    setListBusy(true);
    try {
      await saveCountryList({ custom: custom.filter(c => c.code !== code) });
      flash('✓ Country deleted from the site.', 'success');
      if (activeCountry === code) setActiveCountry(STATIC_CODES[0] ?? 'usa');
      router.refresh();
    } catch (e) { flash(`Delete failed: ${(e as Error).message}`, 'error'); }
    finally { setListBusy(false); }
  }

  async function toggleHidden(code: string) {
    setListBusy(true);
    try {
      const next = hidden.includes(code) ? hidden.filter(h => h !== code) : [...hidden, code];
      await saveCountryList({ hidden: next });
      flash(next.includes(code) ? '✓ Country hidden from the public site.' : '✓ Country visible again.', 'success');
      router.refresh();
    } catch (e) { flash(`Update failed: ${(e as Error).message}`, 'error'); }
    finally { setListBusy(false); }
  }

  // ── Custom section mutations ──────────────────────────────────────────────
  async function saveSections(next: CountrySection[]) {
    setSectionsBusy(true);
    try {
      const res = await fetch('/api/country-content', {
        method: 'PUT', headers: hdrs,
        body: JSON.stringify({ country: activeCountry, sections: next }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})) as { error?: string }; throw new Error(e.error ?? `HTTP ${res.status}`); }
      setCustomSections(next);
      router.refresh();
    } catch (e) { flash(`Save failed: ${(e as Error).message}`, 'error'); }
    finally { setSectionsBusy(false); }
  }

  async function addSection() {
    const label = newSectionLabel.trim();
    if (!label) { flash('Enter a button label first.', 'error'); return; }
    const slug = slugify(label);
    if (!slug) { flash('Label must contain letters or numbers.', 'error'); return; }
    if ((SECTION_SLUGS as readonly string[]).includes(slug) || customSections.some(s => s.slug === slug)) {
      flash('A button with that name already exists.', 'error'); return;
    }
    await saveSections([...customSections, { slug, label }]);
    setNewSectionLabel('');
    setActiveSection(slug);
    flash(`✓ "${label}" button added — write its content below and hit Save Section.`, 'success');
  }

  async function removeSection(slug: string) {
    if (!window.confirm('Remove this button from the country page?')) return;
    await saveSections(customSections.filter(s => s.slug !== slug));
    if (activeSection === slug) setActiveSection(BUILTIN_SECTIONS[0].slug);
  }

  const sectionTabs = [
    ...BUILTIN_SECTIONS,
    ...customSections.map(s => ({ slug: s.slug, label: `➕ ${s.label}` })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🌍 Country Pages</h1>
        <p className="font-jakarta text-sm text-slate-400 mt-1">Add or remove destinations, edit stats and rich content for each country. Saves to KV — live immediately.</p>
      </div>

      {/* Country selector + add/hide/delete */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide">Select Country</label>
          <button onClick={() => setShowAdd(v => !v)}
            className="font-jakarta text-xs font-bold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
            {showAdd ? '✕ Cancel' : '＋ Add Country'}
          </button>
        </div>

        {showAdd && (
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 grid sm:grid-cols-[1fr_170px_auto] gap-3 items-end">
            <div>
              <label className="block font-jakarta text-[11px] font-semibold text-slate-500 mb-1">Country Name</label>
              <input value={newCountry.name} onChange={e => setNewCountry(c => ({ ...c, name: e.target.value }))}
                className={inp} placeholder="e.g. Germany" />
              {newCountry.name.trim() && (
                <p className="font-jakarta text-[10px] text-slate-400 mt-1">URL: /destinations/{slugify(newCountry.name)}</p>
              )}
            </div>
            <div>
              <label className="block font-jakarta text-[11px] font-semibold text-slate-500 mb-1">Accent Colour</label>
              <div className="flex items-center gap-2">
                <input type="color" value={newCountry.color} onChange={e => setNewCountry(c => ({ ...c, color: e.target.value }))}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer" />
                <input value={newCountry.color} onChange={e => setNewCountry(c => ({ ...c, color: e.target.value }))}
                  className={`${inp} flex-1 text-xs py-2`} />
              </div>
            </div>
            <button onClick={addCountry} disabled={listBusy}
              className="font-jakarta text-sm font-bold px-5 py-2.5 rounded-xl text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
              {listBusy ? 'Adding…' : 'Add Country'}
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {allCodes.map(code => {
            const isH = hidden.includes(code);
            return (
              <button key={code} onClick={() => setActiveCountry(code)}
                className={`font-jakarta text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${
                  activeCountry === code ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                } ${isH ? 'opacity-50' : ''}`}>
                {displayName(code)}
                {isH && <span className="ml-1.5 text-[9px] font-bold uppercase">(hidden)</span>}
              </button>
            );
          })}
        </div>

        {/* Visibility / delete controls for the selected country */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 flex-wrap">
          <span className="font-jakarta text-xs text-slate-500">
            <strong>{displayName(activeCountry)}</strong> — {isCustomCountry ? 'added by admin' : 'built-in destination'}
            {isHidden && ' · currently hidden from the public site'}
          </span>
          <div className="flex-1" />
          <button onClick={() => toggleHidden(activeCountry)} disabled={listBusy}
            className="font-jakarta text-xs font-bold px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">
            {isHidden ? '👁 Show on Site' : '🙈 Hide from Site'}
          </button>
          {isCustomCountry && (
            <button onClick={() => deleteCustomCountry(activeCountry)} disabled={listBusy}
              className="font-jakarta text-xs font-bold px-4 py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors">
              🗑 Delete Country
            </button>
          )}
        </div>
      </div>

      {/* Stat blocks */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h3 className="font-jakarta font-bold text-slate-700">
            {displayName(activeCountry)} — Stat Blocks & Meta
          </h3>
          <button onClick={saveMeta} disabled={metaBusy || metaLoading}
            className="font-jakarta font-bold text-sm text-white px-5 py-2 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>
            {metaBusy ? 'Saving…' : 'Save Stats'}
          </button>
        </div>

        {metaLoading ? (
          <div className="p-6"><SkeletonFormBlock rows={3} /></div>
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
          <div className="flex flex-wrap gap-2 items-center">
            {sectionTabs.map(s => {
              const isExtra = customSections.some(cs => cs.slug === s.slug);
              return (
                <span key={s.slug} className="inline-flex items-center">
                  <button onClick={() => setActiveSection(s.slug)}
                    className={`font-jakarta text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      activeSection === s.slug ? 'bg-lime-600 text-white border-lime-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    } ${isExtra ? 'rounded-r-none border-r-0' : ''}`}>
                    {s.label}
                  </button>
                  {isExtra && (
                    <button onClick={() => removeSection(s.slug)} disabled={sectionsBusy}
                      title="Remove this button"
                      className="font-jakarta text-xs px-2 py-1.5 rounded-r-lg border border-slate-200 text-red-400 hover:bg-red-50 disabled:opacity-50 transition-colors">
                      ✕
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          {/* Add new section button */}
          <div className="flex items-center gap-2 border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/40">
            <input value={newSectionLabel} onChange={e => setNewSectionLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') void addSection(); }}
              className={`${inp} text-xs py-2 max-w-xs`}
              placeholder='New button label, e.g. "Cost of Living"' />
            <button onClick={addSection} disabled={sectionsBusy}
              className="font-jakarta text-xs font-bold px-4 py-2 rounded-xl border border-lime-300 text-lime-700 hover:bg-lime-50 disabled:opacity-50 transition-colors whitespace-nowrap">
              ＋ Add Button
            </button>
            <span className="font-jakarta text-[10px] text-slate-400 hidden sm:block">
              Adds a new tab under Study in {displayName(activeCountry)} — its content is editable here.
            </span>
          </div>

          {!htmlLoading && isDefault && (
            <div className="bg-lime-50 border border-lime-200 rounded-xl px-4 py-2.5">
              <p className="font-jakarta text-xs text-lime-800">
                ℹ Showing the built-in content currently live on the site. Edit and hit <strong>Save Section</strong> to override it.
              </p>
            </div>
          )}
          {htmlLoading ? (
            <div className="bg-slate-100 rounded-xl animate-pulse h-48" />
          ) : (
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder={`Write content for this section of the ${displayName(activeCountry)} page…`}
              minHeight={300}
            />
          )}
        </div>
      </div>
    </div>
  );
}
