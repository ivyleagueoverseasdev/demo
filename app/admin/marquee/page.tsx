'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '../layout';
import ImagePicker from '@/components/admin/ImagePicker';
import { apiCall } from '@/lib/edge-utils';
import { UNIS_MARQUEE_DATA, type UniEntry } from '@/lib/data';

const inp = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300 bg-white';

interface MarqueeSettings {
  speedRow1:  number;
  speedRow2:  number;
  speedRow3?: number;
  heading:    string;
  subheading: string;
  unis?: UniEntry[];
  rows?: number;
}

const DEFAULT_SETTINGS: MarqueeSettings = {
  speedRow1:  38,
  speedRow2:  44,
  speedRow3:  50,
  heading:    'Students Placed in Top Universities',
  subheading: "Join 10,000+ students we've placed at the world's finest institutions across 12 countries.",
  rows:       3,
};

function emptyUni(): UniEntry {
  return { name: '', src: '', country: '', darkBg: false };
}

// ── UniRow ────────────────────────────────────────────────────────────────────
function UniRow({ uni, index, token, total, onChange, onRemove, onMove }: {
  uni:      UniEntry;
  index:    number;
  token:    string;
  total:    number;
  onChange: (u: UniEntry) => void;
  onRemove: () => void;
  onMove:   (dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);

  function p<K extends keyof UniEntry>(key: K, val: UniEntry[K]) {
    onChange({ ...uni, [key]: val });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onMove(-1); }}
            disabled={index === 0}
            className="w-5 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs leading-none"
          >▲</button>
          <button
            onClick={e => { e.stopPropagation(); onMove(1); }}
            disabled={index === total - 1}
            className="w-5 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs leading-none"
          >▼</button>
        </div>

        <div
          className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center"
          style={{ background: uni.darkBg ? '#003B5C' : '#ffffff' }}
        >
          {uni.src ? (
            <Image src={uni.src} alt="" fill className="object-contain p-1" sizes="56px" />
          ) : (
            <span className="text-slate-300 text-lg">🎓</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-jakarta font-bold text-slate-800 text-sm truncate">{uni.name || `University ${index + 1}`}</p>
          <p className="font-jakarta text-xs text-slate-400 truncate">{uni.country || 'No country set'}{uni.darkBg ? ' · Dark card' : ''}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
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
        <div className="border-t border-slate-100 p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-jakarta text-[10px] text-slate-400 mb-1">University Name</label>
              <input value={uni.name} onChange={e => p('name', e.target.value)} className={`${inp} py-2 text-xs`} placeholder="University of Michigan" />
            </div>
            <div>
              <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Country</label>
              <input value={uni.country} onChange={e => p('country', e.target.value)} className={`${inp} py-2 text-xs`} placeholder="USA" />
            </div>
          </div>

          <ImagePicker value={uni.src} onChange={url => p('src', url)} token={token} label="Logo Image" />

          <label className="flex items-center gap-2 font-jakarta text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={uni.darkBg ?? false}
              onChange={e => p('darkBg', e.target.checked)}
              className="w-3.5 h-3.5 accent-amber-500"
            />
            Dark card background (enable if the logo is hard to see on white)
          </label>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminMarqueePage() {
  const { token } = useAuth();
  const { flash } = useToast();

  const [settings, setSettings] = useState<MarqueeSettings>(DEFAULT_SETTINGS);
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marquee', { cache: 'no-store' });
      const d = res.ok ? await res.json() as any : null;
      const s = d?.settings ?? {};
      setSettings({
        ...DEFAULT_SETTINGS,
        ...s,
        unis: (s.unis?.length ? s.unis : UNIS_MARQUEE_DATA) as UniEntry[],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function p<K extends keyof MarqueeSettings>(key: K, val: MarqueeSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: val }));
  }

  function setUnis(unis: UniEntry[]) {
    p('unis', unis);
  }

  function moveUni(index: number, dir: -1 | 1) {
    const unis = [...(settings.unis ?? [])];
    const target = index + dir;
    if (target < 0 || target >= unis.length) return;
    [unis[index], unis[target]] = [unis[target], unis[index]];
    setUnis(unis);
  }

  async function save() {
    setBusy(true);
    const { ok, error } = await apiCall({ method: 'PUT', url: '/api/marquee', token, body: settings });
    if (!ok) { flash(`Save failed: ${error}`, 'error'); setBusy(false); return; }
    flash('✓ University marquee saved — live immediately.', 'success');
    setBusy(false);
  }

  const unis = settings.unis ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">🎓 University Logos</h1>
          <p className="font-jakarta text-sm text-slate-400 mt-1">Manage the scrolling partner-university marquee on the homepage. Changes go live immediately via KV.</p>
        </div>
        <button
          onClick={save}
          disabled={busy || loading}
          className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
        >
          {busy ? 'Saving…' : '💾 Save Changes'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse border border-slate-100" />)}</div>
      ) : (
        <>
          {/* Heading / subheading / speeds */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-jakarta font-bold text-slate-800 text-sm">Section Text</h2>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Heading</label>
              <input value={settings.heading} onChange={e => p('heading', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subheading</label>
              <textarea value={settings.subheading} onChange={e => p('subheading', e.target.value)} rows={2} className={`${inp} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Scrolling Rows</label>
                <select value={settings.rows ?? 3} onChange={e => p('rows', Number(e.target.value))} className={`${inp} py-2 text-xs`}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Row 1 Speed (sec, lower = faster)</label>
                <input type="number" value={settings.speedRow1} onChange={e => p('speedRow1', Number(e.target.value))} className={`${inp} py-2 text-xs`} />
              </div>
              <div>
                <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Row 2 Speed (sec)</label>
                <input type="number" value={settings.speedRow2} onChange={e => p('speedRow2', Number(e.target.value))} className={`${inp} py-2 text-xs`} />
              </div>
              <div>
                <label className="block font-jakarta text-[10px] text-slate-400 mb-1">Row 3 Speed (sec)</label>
                <input type="number" value={settings.speedRow3 ?? 50} onChange={e => p('speedRow3', Number(e.target.value))} className={`${inp} py-2 text-xs`} />
              </div>
            </div>
            <p className="font-jakarta text-[11px] text-slate-400">
              Rows beyond 3 reuse a default speed progression. Universities are split evenly across all rows.
            </p>
          </div>

          {/* University list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-jakarta font-bold text-slate-800 text-sm">Universities ({unis.length})</h2>
              <button onClick={() => setUnis([...unis, emptyUni()])}
                className="font-jakarta text-xs font-semibold px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                + Add University
              </button>
            </div>

            {unis.map((uni, i) => (
              <UniRow
                key={i}
                uni={uni}
                index={i}
                token={token}
                total={unis.length}
                onChange={updated => setUnis(unis.map((u, j) => j === i ? updated : u))}
                onRemove={() => setUnis(unis.filter((_, j) => j !== i))}
                onMove={dir => moveUni(i, dir)}
              />
            ))}
          </div>
        </>
      )}

      {!loading && (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 -mx-6 px-6 py-4 flex items-center justify-between">
          <p className="font-jakarta text-xs text-slate-400">{unis.length} universit{unis.length !== 1 ? 'ies' : 'y'} in marquee</p>
          <button onClick={save} disabled={busy}
            className="font-jakarta font-bold text-sm text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}>
            {busy ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
