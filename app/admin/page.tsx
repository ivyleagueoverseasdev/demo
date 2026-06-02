'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { CompanyDetails, DynamicPage, GlobalSettings, HeroSlide, Lead, NewsItem, RedirectRule, SiteEvent, EventType, EventActionLink, EventActionType, ServiceItem, ProcessStepItem, Testimonial, Stat } from '@/lib/types';
import { DEFAULT_HERO_SLIDES, DEFAULT_SERVICES, DEFAULT_PROCESS_STEPS, DEFAULT_TESTIMONIALS, COUNTRIES_MAP, COMPANY } from '@/lib/data';
import { SECTION_SLUGS, SECTION_LABELS, SectionSlug, getSubpageContent } from '@/lib/countrySubpages';
import { NewsSchema, EventSchema, TestimonialSchema } from '@/lib/schemas';
import type { AuditEntry } from '@/lib/schemas';

// ── Design tokens ─────────────────────────────────────────────────────────
const BLUE  = '#246DFF';
const AMBER = '#D97706';

// ── Slug utility ──────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Simple Rich Text Editor ───────────────────────────────────────────────
function RichTextEditor({ value, onChange, placeholder, rows = 12 }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);
  const [sourceVal, setSourceVal] = useState(value);

  // Sync external value into the editor whenever the value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    setSourceVal(value);
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const toolbarBtns: { label: string; title: string; action: () => void }[] = [
    { label: 'B',     title: 'Bold',          action: () => exec('bold') },
    { label: 'I',     title: 'Italic',        action: () => exec('italic') },
    { label: 'H2',    title: 'Heading 2',     action: () => exec('formatBlock', '<h2>') },
    { label: 'H3',    title: 'Heading 3',     action: () => exec('formatBlock', '<h3>') },
    { label: '¶',     title: 'Paragraph',     action: () => exec('formatBlock', '<p>') },
    { label: '• List',title: 'Bullet List',   action: () => exec('insertUnorderedList') },
    { label: '❝',     title: 'Blockquote',    action: () => exec('formatBlock', '<blockquote>') },
    { label: '—',     title: 'Divider',       action: () => exec('insertHTML', '<hr/>') },
  ];

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap px-3 py-2 bg-slate-50 border-b border-slate-200">
        {toolbarBtns.map(b => (
          <button key={b.label} type="button" title={b.title}
            onMouseDown={e => { e.preventDefault(); b.action(); }}
            className="font-jakarta text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-colors text-slate-700">
            {b.label}
          </button>
        ))}
        <div className="ml-auto">
          <button type="button"
            onClick={() => {
              if (!showSource) {
                setSourceVal(editorRef.current?.innerHTML ?? value);
              } else {
                if (editorRef.current) editorRef.current.innerHTML = sourceVal;
                onChange(sourceVal);
              }
              setShowSource(s => !s);
            }}
            className="font-jakarta text-[10px] font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 transition-colors">
            {showSource ? 'Visual ←' : '→ HTML'}
          </button>
        </div>
      </div>
      {/* Content area */}
      {showSource ? (
        <textarea
          value={sourceVal}
          onChange={e => { setSourceVal(e.target.value); onChange(e.target.value); }}
          rows={rows}
          className="w-full font-mono text-xs px-4 py-3 outline-none resize-none text-slate-800 bg-white"
          placeholder={placeholder}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
          style={{ minHeight: `${rows * 1.5}rem` }}
          className="px-4 py-3 text-sm text-slate-800 outline-none prose prose-sm max-w-none [&_h2]:font-bold [&_h2]:text-base [&_h3]:font-semibold [&_h3]:text-sm [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_ul]:list-disc [&_ul]:pl-5"
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
}
type Tab = 'overview' | 'pages' | 'create' | 'events' | 'stories' | 'enquiries' | 'news' | 'country-pages' | 'routes' | 'countries' | 'homepage' | 'general' | 'global' | 'settings' | 'partners' | 'analytics' | 'media-library' | 'history';

// ── Zod error formatter ───────────────────────────────────────────────────
function formatZodErrors(issues: { message: string }[]): string {
  return issues.map(i => i.message).join(' · ');
}

// ── Shared style strings ──────────────────────────────────────────────────
const blueBtn  = 'font-jakarta font-semibold text-sm px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95';
const amberBtn = 'font-jakarta font-semibold text-sm px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95';
const ghostBtn = 'font-jakarta font-medium text-sm px-4 py-2 rounded-xl border border-slate-200 transition-all hover:bg-slate-50 text-slate-600 active:scale-95';
const inp      = 'w-full font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-slate-800 placeholder-slate-400';

const EVENT_TYPES: EventType[] = ['webinar','fair','deadline','workshop','seminar'];
const EVENT_TYPE_COLORS: Record<EventType,string> = {
  webinar: '#246DFF', fair: '#059669', deadline: '#DC2626', workshop: '#7C3AED', seminar: '#D97706',
};

// ── Login screen ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const [loading, setLd] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLd(true); setErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) { setErr('Invalid password. Please try again.'); setLd(false); return; }
      const { token } = await res.json();
      localStorage.setItem('iloc_admin_token', token);
      onLogin(token);
    } catch {
      setErr('Network error. Please check your connection and try again.');
    }
    setLd(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(145deg,#1249C4,#246DFF,#246DFF)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-jakarta font-black text-sm text-white"
                style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>IL</div>
              <div>
                <div className="font-jakarta font-bold text-lg text-slate-800">ILOC Admin</div>
                <div className="font-jakarta text-xs text-slate-400">Content Management</div>
              </div>
            </div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-1">Sign in</h2>
            <p className="font-jakarta text-slate-400 text-sm mb-7">Enter your admin password to continue.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Password</label>
                <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }}
                  className={inp} placeholder="••••••••" autoFocus />
                {err && <p className="font-jakarta text-xs text-red-500 mt-1.5">{err}</p>}
              </div>
              <button type="submit" disabled={loading || !pw}
                className={`w-full ${blueBtn} py-3.5 disabled:opacity-50`}
                style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
            <p className="font-jakarta text-center text-xs text-slate-400 mt-6">
              Contact your administrator if you have forgotten your password.
            </p>
            <div className="text-center mt-3">
              <Link href="/" className="font-jakarta text-xs text-slate-400 hover:text-slate-600 transition-colors">← Back to site</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab,       setTab]       = useState<Tab>('overview');
  const [pages,     setPages]     = useState<DynamicPage[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [redirectsSaving, setRedirectsSaving] = useState(false);
  const [events,    setEvents]    = useState<SiteEvent[]>([]);
  const [toast,     setToast]     = useState('');
  const [busy,      setBusy]      = useState(false);
  const [heroUrls,     setHeroUrls]     = useState<string[]>(['','','']);
  const [countryImgs,  setCountryImgs]  = useState<Record<string,string>>({});
  const [services,      setServices]      = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [processSteps,  setProcessSteps]  = useState<ProcessStepItem[]>(DEFAULT_PROCESS_STEPS);
  const [testimonials,  setTestimonials]  = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [hpBusy,        setHpBusy]        = useState(false);

  // ── Testimonial form state ────────────────────────────────────────────
  const emptyTestimonial = (): Omit<Testimonial, 'id'> => ({
    name: '', role: '', uni: '', country: '', quote: '',
    imageUrl: '', stars: 5, published: true,
  });
  const [nt,         setNt]         = useState(emptyTestimonial());
  const [editTId,    setEditTId]    = useState<string | null>(null);
  const [showTForm,  setShowTForm]  = useState(false);
  const [tBusy,      setTBusy]      = useState(false);

  // ── Lead / CRM state ─────────────────────────────────────────────────
  const [leads,      setLeads]      = useState<Lead[]>([]);
  const [leadsBusy,  setLeadsBusy]  = useState(false);

  // ── Company details state ─────────────────────────────────────────────
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    phone:    COMPANY.phone,
    whatsapp: COMPANY.wa,
    email:    COMPANY.email,
    address:  COMPANY.address,
    mapsLink: COMPANY.mapsLink,
  });
  const [cdBusy, setCdBusy] = useState(false);

  // ── Global settings state ─────────────────────────────────────────────
  const defaultGlobalSettings = (): GlobalSettings => ({
    brandName:               COMPANY.short,
    heroImages:              ['', '', ''],
    noticeBanner:            '',
    linkedIn:                '',
    instagram:               '',
    whatsappUrl:             COMPANY.wa,
    mainLogoUrl:             '',
    businessNameText:        '',
    headerLogoUrl:           '',
    headerBackgroundColor:   '#2563FF',
    headerVerticalPadding:   '72px',
    businessNameDisplayName: '',
  });
  const [gs,         setGs]         = useState<GlobalSettings>(defaultGlobalSettings());
  const [gsBusy,     setGsBusy]     = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [heroSlideBusy, setHeroSlideBusy] = useState(false);
  const [heroSlideEditIdx, setHeroSlideEditIdx] = useState<number | null>(null);

  // ── Stats block CMS state ─────────────────────────────────────────────
  const DEFAULT_STATS_FORM: Stat[] = [
    { num: '10,000+', label: 'Students Placed'               },
    { num: '97%',     label: 'Visa Approval Rate'             },
    { num: '5.0★',   label: 'JustDial Rating (48+ Reviews)'  },
    { num: '25+',     label: 'Years in Business'              },
    { num: '400+',    label: 'Partner Universities'           },
    { num: '₹0',      label: 'Hidden Fees'                   },
  ];
  const [siteStats,     setSiteStats]     = useState<Stat[]>(DEFAULT_STATS_FORM);
  const [statsBusy,     setStatsBusy]     = useState(false);

  // ── News CMS state ────────────────────────────────────────────────────
  const emptyNews = (): Omit<NewsItem, 'id' | 'createdAt'> => ({
    title: '', slug: '', date: new Date().toISOString().slice(0, 10),
    excerpt: '', content: '', imageUrl: '', published: true,
  });
  const [news,       setNews]       = useState<NewsItem[]>([]);
  const [nn,         setNn]         = useState(emptyNews());
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsBusy,   setNewsBusy]   = useState(false);

  // ── Country Pages editor state ────────────────────────────────────────
  const countryCodes = Object.keys(COUNTRIES_MAP);
  const [cpCountry,  setCpCountry]  = useState(countryCodes[0] || 'usa');
  const [cpSection,  setCpSection]  = useState<string>(SECTION_SLUGS[0]);
  const [cpHtml,     setCpHtml]     = useState('');
  const [cpLoading,  setCpLoading]  = useState(false);
  const [cpSaving,   setCpSaving]   = useState(false);

  // ── Country Meta (stat blocks) editor state ───────────────────────────
  type CountryMetaForm = {
    intake: string; avgCost: string; visaRate: string; unis: string;
    tagline: string; description: string; heroImage: string; campusImage: string; color: string;
  };
  const emptyMeta = (code: string): CountryMetaForm => {
    const d = COUNTRIES_MAP[code];
    return {
      intake: d?.intake || '', avgCost: d?.avgCost || '', visaRate: d?.visaRate || '',
      unis: d?.unis || '', tagline: d?.tagline || '', description: d?.description || '',
      heroImage: d?.heroImage || '', campusImage: d?.campusImage || '', color: d?.color || '',
    };
  };
  const [metaCountry,  setMetaCountry]  = useState(countryCodes[0] || 'usa');
  const [metaForm,     setMetaForm]     = useState<CountryMetaForm>(() => emptyMeta(countryCodes[0] || 'usa'));
  const [metaLoading,  setMetaLoading]  = useState(false);
  const [metaSaving,   setMetaSaving]   = useState(false);

  const [partnerSection, setPartnerSection] = useState('partners:institutions');
  const [partnerHtml,    setPartnerHtml]    = useState('');
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerSaving,  setPartnerSaving]  = useState(false);

  // ── Structured partner page settings state ────────────────────────────
  type PartnerStatForm = { value: string; label: string; desc: string };
  type PartnerSettingsForm = {
    badge: string; heading: string; subheading: string;
    bodyHeading: string; bodyIntro: string;
    stats: PartnerStatForm[];
    listHeading: string; listItems: string[];
    formHeading: string; formSubtext: string;
  };
  const emptyPartnerForm = (): PartnerSettingsForm => ({
    badge: '', heading: '', subheading: '', bodyHeading: '', bodyIntro: '',
    stats: [{ value: '', label: '', desc: '' }],
    listHeading: '', listItems: [''], formHeading: '', formSubtext: '',
  });
  const [partnerPage,      setPartnerPage]      = useState<'institutions' | 'agent' | 'referral'>('institutions');
  const [partnerForm,      setPartnerForm]      = useState<PartnerSettingsForm>(emptyPartnerForm());
  const [partnerFormLoad,  setPartnerFormLoad]  = useState(false);
  const [partnerFormSave,  setPartnerFormSave]  = useState(false);

  // ── University marquee settings state ────────────────────────────────
  type UniEntryForm = { name: string; src: string; country: string };
  const DEFAULT_MARQUEE_FORM = {
    speedRow1: 38, speedRow2: 44,
    heading: 'Students Placed in Top Universities',
    subheading: "Join 10,000+ students we've placed at the world's finest institutions across 12 countries.",
    unis: [] as UniEntryForm[],
  };
  const [marqueeForm,   setMarqueeForm]   = useState(DEFAULT_MARQUEE_FORM);
  const [marqueeSaving, setMarqueeSaving] = useState(false);
  const [marqueeLoading, setMarqueeLoading] = useState(false);

  // ── New page form ─────────────────────────────────────────────────────
  const [np, setNp] = useState({
    slug: '', title: '', metaTitle: '', metaDescription: '', category: '',
    description: '', body: '', heroImageUrl: '',
    layout: 'default' as DynamicPage['layout'], published: true,
  });

  // ── New redirect form ─────────────────────────────────────────────────
  const [nr, setNr] = useState({ from: '', to: '', type: 301 as 301|302, active: true, note: '' });

  // ── New event form ────────────────────────────────────────────────────
  const emptyEvent = (): Omit<SiteEvent,'id'|'createdAt'> => ({
    title: '', type: 'webinar', date: '', time: '', location: '',
    description: '', body: '', country: '', imageUrl: '',
    ctaLabel: 'Register Free', ctaUrl: '/contact',
    actionLinks: [], seats: undefined, speakers: [], published: true,
  });
  const [ne,      setNe]      = useState(emptyEvent());
  const [editEvId,setEditEvId] = useState<string | null>(null);
  const [showEvForm,setShowEvForm] = useState(false);

  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const flash = (m: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastType(type); setToast(m); setTimeout(() => setToast(''), 3000);
  };
  const hdrs  = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const extractEditorHtml = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return undefined;
    const body = (payload as any).html ?? (payload as any).content ?? (payload as any).data ?? (payload as any).body;
    return typeof body === 'string' ? body : undefined;
  };

  // ── Fetch data ────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    const res = await fetch('/api/events', { cache: 'no-store' }).catch(() => null);
    if (!res?.ok) { setEvents([]); return; }
    const data = await res.json().catch(() => null);
    setEvents(data?.events || []);
  }, [token]);

  const fetchAll = useCallback(async () => {
    const [pRes, cRes, mRes, lRes, nRes] = await Promise.all([
      fetch('/api/pages',   { headers: hdrs, cache: 'no-store' }).catch(() => null),
      fetch('/api/content', { headers: hdrs, cache: 'no-store' }).catch(() => null),
      fetch('/api/media',   { cache: 'no-store' }).catch(() => null),
      fetch('/api/leads',   { headers: hdrs, cache: 'no-store' }).catch(() => null),
      fetch('/api/news',    { cache: 'no-store' }).catch(() => null),
    ]);
    const contentData = cRes?.ok ? await cRes.json() : null;
    const mappedSiteContent = contentData ? (contentData.siteContent ?? contentData.content ?? contentData.data ?? {}) : {};
    if (pRes) {
      const d = pRes.ok ? await pRes.json() : null;
      setPages(d?.pages || []);
    }
    if (contentData) { setRedirects(contentData.redirects || []); }
    if (mRes?.ok)  {
      const d = await mRes.json();
      if (d.heroImages?.length) setHeroUrls(d.heroImages.concat(['','','']).slice(0,3));
      if (d.countryImages)      setCountryImgs(d.countryImages);
    }
    if (mappedSiteContent) {
      if ('services' in mappedSiteContent)      setServices((mappedSiteContent as any).services || []);
      if ('processSteps' in mappedSiteContent)  setProcessSteps((mappedSiteContent as any).processSteps || []);
      if ('testimonials' in mappedSiteContent)  setTestimonials((mappedSiteContent as any).testimonials || []);
    }
    if (lRes?.ok) { const d = await lRes.json(); setLeads(d.leads || []); }
    if (nRes?.ok) { const d = await nRes.json(); setNews(d.news || []); }
    if (contentData) {
      if (contentData.companyDetails)  setCompanyDetails(contentData.companyDetails);
      if (contentData.globalSettings)  setGs({
        brandName:               contentData.globalSettings.brandName               || COMPANY.short,
        heroImages:              (contentData.globalSettings.heroImages              || ['','','']).concat(['','','']).slice(0,3),
        noticeBanner:            contentData.globalSettings.noticeBanner            || '',
        linkedIn:                contentData.globalSettings.linkedIn                || '',
        instagram:               contentData.globalSettings.instagram               || '',
        whatsappUrl:             contentData.globalSettings.whatsappUrl             || COMPANY.wa,
        mainLogoUrl:             contentData.globalSettings.mainLogoUrl             || '',
        businessNameText:        contentData.globalSettings.businessNameText        || '',
        headerLogoUrl:           contentData.globalSettings.headerLogoUrl           || '',
        headerBackgroundColor:   contentData.globalSettings.headerBackgroundColor   || '#2563FF',
        headerVerticalPadding:   contentData.globalSettings.headerVerticalPadding   || '72px',
        businessNameDisplayName: contentData.globalSettings.businessNameDisplayName || '',
      });
    }
    await fetchEvents();
    // Hero slides
    const hsRes = await fetch('/api/hero-slides', { cache: 'no-store' }).catch(() => null);
    if (hsRes?.ok) {
      const hsd = await hsRes.json().catch(() => null);
      if (hsd?.slides?.length) setHeroSlides(hsd.slides);
    }
    // Stats block
    const statsRes = await fetch('/api/stats', { cache: 'no-store' }).catch(() => null);
    if (statsRes?.ok) {
      const sd = await statsRes.json().catch(() => null);
      if (sd?.stats?.length) setSiteStats(sd.stats);
    }
  }, [fetchEvents, token]);

  const fetchLeads = useCallback(async () => {
    const res = await fetch('/api/leads', { headers: hdrs }).catch(() => null);
    if (res?.ok) {
      const d = await res.json();
      setLeads(d.leads || []);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (tab === 'events') {
      fetchEvents();
    }
  }, [tab, fetchEvents]);

  useEffect(() => {
    if (tab === 'enquiries') {
      fetchLeads();
      const interval = setInterval(fetchLeads, 20000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [tab, fetchLeads]);

  // ── Page helpers ──────────────────────────────────────────────────────
  const buildBlocks = () => {
    const blocks: any[] = [];
    if (np.description || np.category) {
      blocks.push({ id: crypto.randomUUID(), type: 'hero', props: { headline: np.title, subtext: np.description, category: np.category } });
    }
    if (np.body.trim()) blocks.push({ id: crypto.randomUUID(), type: 'text', props: { body: np.body } });
    blocks.push({ id: crypto.randomUUID(), type: 'cta', props: { heading: 'Ready to begin?', subtext: 'Book a free counselling session.', buttonLabel: 'Book Free Session →', buttonHref: '/contact' } });
    return blocks;
  };

  const createPage = async () => {
    if (!np.title) { flash('Page title is required.', 'error'); return; }
    if (!np.slug) { flash('Could not generate URL — please enter a title.', 'error'); return; }
    setBusy(true);
    const page: Partial<DynamicPage> = {
      id: crypto.randomUUID(),
      slug: np.slug.toLowerCase().replace(/[^a-z0-9-/]/g, '-'),
      title: np.title, metaTitle: np.metaTitle || np.title,
      metaDescription: np.metaDescription, layout: np.layout,
      heroImageUrl: np.heroImageUrl || undefined,
      blocks: buildBlocks(), published: np.published,
    };
    const res = await fetch('/api/pages', { method: 'POST', headers: hdrs, body: JSON.stringify(page) }).catch(() => null);
    if (res?.ok) {
      flash(`✓ Page /${page.slug} live!`);
      setNp({ slug:'',title:'',metaTitle:'',metaDescription:'',category:'',description:'',body:'',heroImageUrl:'',layout:'default',published:true });
      fetchAll(); setTab('pages');
    } else flash('Failed to create page.', 'error');
    setBusy(false);
  };

  const deletePage = async (slug: string) => {
    if (!confirm(`Delete /${slug}?`)) return;
    await fetch('/api/pages', { method: 'DELETE', headers: hdrs, body: JSON.stringify({ slug }) });
    flash(`Deleted /${slug}`); fetchAll();
  };

  // ── Media helpers ──────────────────────────────────────────────────────
  const saveHeroImages = async () => {
    setBusy(true);
    const images = heroUrls.map(u => u.trim()).filter(Boolean);
    await fetch('/api/media', { method: 'PUT', headers: hdrs, body: JSON.stringify({ heroImages: images }) }).catch(() => null);
    flash('Hero images saved — live immediately.'); setBusy(false);
  };

  const saveCountryImages = async () => {
    setBusy(true);
    await fetch('/api/media', { method: 'PUT', headers: hdrs, body: JSON.stringify({ countryImages: countryImgs }) }).catch(() => null);
    flash('Country images saved — live on next page load.'); setBusy(false);
  };

  // ── Homepage content helpers ──────────────────────────────────────────
  const saveHomepageContent = async (field: 'services' | 'processSteps', data: ServiceItem[] | ProcessStepItem[]) => {
    setHpBusy(true);
    await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ [field]: data }) }).catch(() => null);
    flash(`✓ ${field === 'services' ? 'Services' : 'Process steps'} saved — live immediately.`);
    setHpBusy(false);
  };

  const updateService = (idx: number, field: keyof ServiceItem, val: string) =>
    setServices(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const addService = () =>
    setServices(prev => [...prev, { id: crypto.randomUUID(), icon: '✨', title: 'New Service', desc: 'Describe the service here.' }]);

  const removeService = (idx: number) =>
    setServices(prev => prev.filter((_, i) => i !== idx));

  const updateStep = (idx: number, field: keyof ProcessStepItem, val: string | number) =>
    setProcessSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const addStep = () =>
    setProcessSteps(prev => [...prev, { step: prev.length + 1, icon: '📌', title: 'New Step', desc: 'Describe this step.' }]);

  const removeStep = (idx: number) =>
    setProcessSteps(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 })));

  // ── Testimonial helpers ───────────────────────────────────────────────
  const saveTestimonials = async (list: Testimonial[]) => {
    await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ testimonials: list }) }).catch(() => null);
    setTestimonials(list);
    await fetchAll();
  };

  const submitTestimonial = async (publishedOverride?: boolean) => {
    const payload = publishedOverride !== undefined ? { ...nt, published: publishedOverride } : nt;
    const result = TestimonialSchema.safeParse(payload);
    if (!result.success) {
      flash(formatZodErrors(result.error.issues), 'error');
      return;
    }
    const validatedT = result.data;
    setTBusy(true);
    let list: Testimonial[];
    if (editTId) {
      list = testimonials.map(t => t.id === editTId ? { ...t, ...validatedT } : t);
    } else {
      list = [...testimonials, { ...validatedT, id: crypto.randomUUID() }];
    }
    await saveTestimonials(list);
    flash(editTId ? '✓ Testimonial updated.' : '✓ Testimonial added.');
    setNt(emptyTestimonial()); setEditTId(null); setShowTForm(false);
    setTBusy(false);
  };

  const editTestimonial = (t: Testimonial) => {
    setNt({ name: t.name, role: t.role, uni: t.uni, country: t.country,
      quote: t.quote, imageUrl: t.imageUrl, stars: t.stars, published: t.published });
    setEditTId(t.id); setShowTForm(true);
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await saveTestimonials(testimonials.filter(t => t.id !== id));
    flash('Testimonial deleted.');
  };

  const toggleTestimonialPublished = async (id: string) => {
    await saveTestimonials(testimonials.map(t => t.id === id ? { ...t, published: !t.published } : t));
    flash('Visibility updated.');
  };

  // ── Redirect helpers ──────────────────────────────────────────────────
  const saveRedirects = async (rules: RedirectRule[]) => {
    setRedirectsSaving(true);
    try {
      const res = await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ redirects: rules }) }).catch(() => null);
      if (res && !res.ok) flash('Failed to save redirects.', 'error');
    } finally {
      setRedirects(rules);
      flash('Redirects saved.');
      setRedirectsSaving(false);
    }
  };
  const addRedirect = () => {
    if (!nr.from || !nr.to) { flash('From and To are required.', 'error'); return; }
    saveRedirects([...redirects, { ...nr, id: crypto.randomUUID() }]);
    setNr({ from:'', to:'', type:301, active:true, note:'' });
  };

  // ── Lead helpers ──────────────────────────────────────────────────────
  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeadsBusy(true);
    try {
      const res = await fetch('/api/leads', { method: 'PUT', headers: hdrs, body: JSON.stringify({ id, status }) }).catch(() => null);
      if (res?.ok) {
        await fetchAll();
        flash('Status updated.');
      } else {
        flash('Failed to update status.', 'error');
      }
    } finally {
      setLeadsBusy(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead permanently?')) return;
    setLeadsBusy(true);
    try {
      const res = await fetch('/api/leads', { method: 'PUT', headers: hdrs, body: JSON.stringify({ id, delete: true }) }).catch(() => null);
      if (res?.ok) {
        await fetchAll();
        flash('Lead deleted.');
      } else {
        flash('Failed to delete lead.', 'error');
      }
    } finally {
      setLeadsBusy(false);
    }
  };

  // ── Company details helpers ───────────────────────────────────────────
  const saveCompanyDetails = async () => {
    setCdBusy(true);
    await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ companyDetails }) }).catch(() => null);
    flash('✓ Company details saved — live immediately.');
    setCdBusy(false);
  };

  // ── Hero slides helpers ───────────────────────────────────────────────
  const saveStats = async () => {
    setStatsBusy(true);
    const res = await fetch('/api/stats', { method: 'PUT', headers: hdrs, body: JSON.stringify({ stats: siteStats }) }).catch(() => null);
    if (res?.ok) flash('✓ Stats block saved — live immediately.');
    else flash('Failed to save stats.', 'error');
    setStatsBusy(false);
  };

  const saveHeroSlides = async () => {
    setHeroSlideBusy(true);
    const res = await fetch('/api/hero-slides', {
      method: 'PUT', headers: hdrs, body: JSON.stringify({ slides: heroSlides }),
    }).catch(() => null);
    if (res?.ok) flash('✓ Hero slides saved — live immediately.');
    else flash('Failed to save hero slides.', 'error');
    setHeroSlideBusy(false);
  };

  const updateSlide = (i: number, patch: Partial<HeroSlide>) =>
    setHeroSlides(prev => prev.map((s, si) => si === i ? { ...s, ...patch } : s));

  // ── Global settings helpers ───────────────────────────────────────────
  const saveGlobalSettings = async () => {
    setGsBusy(true);
    const payload: GlobalSettings = {
      ...gs,
      heroImages: gs.heroImages.map(u => u.trim()).filter(Boolean),
    };
    await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ globalSettings: payload }) }).catch(() => null);
    flash('✓ Global settings saved — live within 1 hour (CDN cache).');
    setGsBusy(false);
  };

  // ── News helpers ──────────────────────────────────────────────────────
  const submitNews = async (publishedOverride?: boolean) => {
    const payload = publishedOverride !== undefined ? { ...nn, published: publishedOverride } : nn;
    const result = NewsSchema.safeParse(payload);
    if (!result.success) {
      flash(formatZodErrors(result.error.issues), 'error');
      return;
    }
    const validatedNews = result.data;
    setNewsBusy(true);
    const method = editNewsId ? 'PUT' : 'POST';
    const body = editNewsId
      ? { ...validatedNews, id: editNewsId }
      : { ...validatedNews, id: `news_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() };
    const res = await fetch('/api/news', { method, headers: hdrs, body: JSON.stringify(body) }).catch(() => null);
    if (res?.ok) {
      flash(editNewsId
        ? (validatedNews.published ? '✓ Article updated & published.' : '✓ Draft saved.')
        : (validatedNews.published ? '✓ Article published.' : '✓ Draft saved.'));
      setNn(emptyNews()); setEditNewsId(null); setShowNewsForm(false);
      fetchAll();
    } else flash('Failed to save article.', 'error');
    setNewsBusy(false);
  };

  const editNewsItem = (item: NewsItem) => {
    // Keep original slug when editing — only auto-generate on new articles
    setNn({ title: item.title, slug: item.slug, date: item.date, excerpt: item.excerpt,
      content: item.content, imageUrl: item.imageUrl, published: item.published });
    setEditNewsId(item.id); setShowNewsForm(true);
    // Scroll to form
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const deleteNewsItem = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    await fetch('/api/news', { method: 'PUT', headers: hdrs, body: JSON.stringify({ id, delete: true }) }).catch(() => null);
    await fetchAll();
    flash('Article deleted.');
  };

  const toggleNewsPublished = async (item: NewsItem) => {
    const res = await fetch('/api/news', { method: 'PUT', headers: hdrs, body: JSON.stringify({ ...item, published: !item.published }) }).catch(() => null);
    if (res?.ok) {
      await fetchAll();
      flash('Visibility updated.');
    } else {
      flash('Failed to update visibility.', 'error');
    }
  };

  // ── Country pages helpers ─────────────────────────────────────────────
  const loadCountrySection = useCallback(async (country: string, section: string) => {
    setCpLoading(true); setCpHtml('');
    const res = await fetch(`/api/country-content?country=${encodeURIComponent(country)}&section=${encodeURIComponent(section)}`).catch(() => null);
    let html: string | undefined = undefined;
    if (res?.ok) {
      const d = await res.json().catch(() => null);
      html = extractEditorHtml(d);
    }
    if (html === undefined) {
      html = getSubpageContent(country, section as SectionSlug) || '';
    }
    setCpHtml(html);
    setCpLoading(false);
  }, [token]);

  const saveCountrySection = async (country?: string) => {
    const targetCountry = country ?? cpCountry;
    if (!targetCountry || !cpSection) {
      flash('Please select a country and section before saving.', 'error');
      return;
    }
    setCpSaving(true);
    const res = await fetch('/api/country-content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ country: targetCountry, section: cpSection, html: cpHtml }) }).catch(() => null);
    if (res?.ok) {
      flash('✓ Country section saved — live on next page load.');
      await loadCountrySection(targetCountry, cpSection);
    } else {
      flash('Failed to save content.', 'error');
    }
    setCpSaving(false);
  };

  // ── Country meta (stat blocks) helpers ───────────────────────────────
  const loadCountryMeta = useCallback(async (code: string) => {
    setMetaLoading(true);
    // Start with static defaults so fields are always pre-filled
    const defaults = emptyMeta(code);
    const res = await fetch(`/api/country-meta?country=${encodeURIComponent(code)}`).catch(() => null);
    if (res?.ok) {
      const d = await res.json().catch(() => null);
      if (d?.meta) {
        setMetaForm({
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
      } else {
        setMetaForm(defaults);
      }
    } else {
      setMetaForm(defaults);
    }
    setMetaLoading(false);
  }, [token]);

  const saveCountryMeta = async () => {
    if (!metaCountry) { flash('Select a country first.', 'error'); return; }
    setMetaSaving(true);
    const payload = {
      country: metaCountry,
      meta: {
        intake:      metaForm.intake      || undefined,
        avgCost:     metaForm.avgCost     || undefined,
        visaRate:    metaForm.visaRate    || undefined,
        unis:        metaForm.unis        || undefined,
        tagline:     metaForm.tagline     || undefined,
        description: metaForm.description || undefined,
        heroImage:   metaForm.heroImage   || undefined,
        campusImage: metaForm.campusImage || undefined,
        color:       metaForm.color       || undefined,
      },
    };
    const res = await fetch('/api/country-meta', { method: 'PUT', headers: hdrs, body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) {
      flash('✓ Stat blocks saved — live on next page load.');
    } else {
      flash('Failed to save stat blocks.', 'error');
    }
    setMetaSaving(false);
  };

  const resetCountryMeta = () => {
    setMetaForm(emptyMeta(metaCountry));
    flash('Reset to defaults — click Save to apply.', 'info');
  };

  const loadMarqueeSettings = useCallback(async () => {
    setMarqueeLoading(true);
    const res = await fetch('/api/marquee', { cache: 'no-store' }).catch(() => null);
    if (res?.ok) {
      const d = await res.json().catch(() => null);
      if (d?.settings) {
        setMarqueeForm({
          speedRow1:  d.settings.speedRow1  ?? DEFAULT_MARQUEE_FORM.speedRow1,
          speedRow2:  d.settings.speedRow2  ?? DEFAULT_MARQUEE_FORM.speedRow2,
          heading:    d.settings.heading    || DEFAULT_MARQUEE_FORM.heading,
          subheading: d.settings.subheading || DEFAULT_MARQUEE_FORM.subheading,
          unis:       d.settings.unis       ?? [],
        });
      }
    }
    setMarqueeLoading(false);
  }, []);

  const saveMarqueeSettings = async () => {
    setMarqueeSaving(true);
    const payload = {
      speedRow1:  marqueeForm.speedRow1,
      speedRow2:  marqueeForm.speedRow2,
      heading:    marqueeForm.heading,
      subheading: marqueeForm.subheading,
      unis:       marqueeForm.unis.length > 0 ? marqueeForm.unis : undefined,
    };
    const res = await fetch('/api/marquee', { method: 'PUT', headers: hdrs, body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) {
      flash('✓ Marquee settings saved — live on next page load.');
    } else {
      flash('Failed to save marquee settings.', 'error');
    }
    setMarqueeSaving(false);
  };

  const loadPartnerSection = useCallback(async (section: string) => {
    setPartnerLoading(true); setPartnerHtml('');
    const res = await fetch(`/api/country-content?country=${encodeURIComponent('global')}&section=${encodeURIComponent(section)}`).catch(() => null);
    let html = '';
    if (res?.ok) {
      const d = await res.json().catch(() => null);
      html = extractEditorHtml(d) ?? '';
    }
    setPartnerHtml(html);
    setPartnerLoading(false);
  }, [token]);

  const savePartnerSection = async () => {
    if (!partnerSection) {
      flash('Please select a partner page before saving.', 'error');
      return;
    }
    setPartnerSaving(true);
    const res = await fetch('/api/country-content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ country: 'global', section: partnerSection, html: partnerHtml }) }).catch(() => null);
    if (res?.ok) {
      flash('✓ Partners content saved — live on next page load.');
      await loadPartnerSection(partnerSection);
    } else if (res?.status === 401) {
      flash('Unauthorized. Please sign in again.', 'error');
      onLogout();
    } else {
      flash('Failed to save content.', 'error');
    }
    setPartnerSaving(false);
  };

  const loadPartnerForm = useCallback(async (page: 'institutions' | 'agent' | 'referral') => {
    setPartnerFormLoad(true);
    const res = await fetch(`/api/partner-settings?page=${page}`).catch(() => null);
    if (res?.ok) {
      const d = await res.json().catch(() => null);
      const s = d?.settings;
      if (s) {
        setPartnerForm({
          badge:       s.badge       ?? '',
          heading:     s.heading     ?? '',
          subheading:  s.subheading  ?? '',
          bodyHeading: s.bodyHeading ?? '',
          bodyIntro:   s.bodyIntro   ?? '',
          stats:       s.stats?.length ? s.stats : [{ value: '', label: '', desc: '' }],
          listHeading: s.listHeading ?? '',
          listItems:   s.listItems?.length ? s.listItems : [''],
          formHeading: s.formHeading ?? '',
          formSubtext: s.formSubtext ?? '',
        });
      } else {
        setPartnerForm({ badge: '', heading: '', subheading: '', bodyHeading: '', bodyIntro: '', stats: [{ value: '', label: '', desc: '' }], listHeading: '', listItems: [''], formHeading: '', formSubtext: '' });
      }
    } else {
      setPartnerForm({ badge: '', heading: '', subheading: '', bodyHeading: '', bodyIntro: '', stats: [{ value: '', label: '', desc: '' }], listHeading: '', listItems: [''], formHeading: '', formSubtext: '' });
    }
    setPartnerFormLoad(false);
  }, [token]);

  const savePartnerForm = async () => {
    setPartnerFormSave(true);
    const res = await fetch('/api/partner-settings', {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify({ page: partnerPage, settings: partnerForm }),
    }).catch(() => null);
    if (res?.ok) {
      flash('✓ Partner page settings saved — live on next page load.');
    } else if (res?.status === 401) {
      flash('Unauthorized. Please sign in again.', 'error');
      onLogout();
    } else {
      flash('Failed to save partner settings.', 'error');
    }
    setPartnerFormSave(false);
  };

  useEffect(() => {
    if (tab === 'partners') {
      if (partnerSection) {
        loadPartnerSection(partnerSection);
      } else {
        setPartnerHtml('');
      }
    }
  }, [tab, partnerSection, loadPartnerSection]);

  useEffect(() => {
    if (tab === 'partners') loadPartnerForm(partnerPage);
  }, [tab, partnerPage, loadPartnerForm]);

  useEffect(() => {
    if (tab === 'country-pages') {
      if (cpCountry && cpSection) {
        loadCountrySection(cpCountry, cpSection);
      } else {
        setCpHtml('');
      }
    }
  }, [tab, cpCountry, cpSection, loadCountrySection]);

  useEffect(() => {
    if (tab === 'country-pages') {
      loadCountryMeta(metaCountry);
    }
  }, [tab, metaCountry, loadCountryMeta]);

  useEffect(() => {
    if (tab === 'homepage') {
      loadMarqueeSettings();
    }
  }, [tab, loadMarqueeSettings]);

  // ── Event helpers ─────────────────────────────────────────────────────
  const saveEvents = async (evs: SiteEvent[]): Promise<boolean> => {
    const res = await fetch('/api/events', { method: 'PUT', headers: hdrs, body: JSON.stringify({ events: evs }) }).catch(() => null);
    if (res?.ok) {
      await fetchEvents();
      return true;
    }
    setEvents(evs);
    flash('Failed to save event — please try again.', 'error');
    return false;
  };

  const submitEvent = async (publishedOverride?: boolean) => {
    const payload = publishedOverride !== undefined ? { ...ne, published: publishedOverride } : ne;
    const result = EventSchema.safeParse(payload);
    if (!result.success) {
      flash(formatZodErrors(result.error.issues), 'error');
      return;
    }
    const validatedEvent = result.data;
    setBusy(true);
    let evs: SiteEvent[];
    if (editEvId) {
      evs = events.map(e => e.id === editEvId ? { ...e, ...validatedEvent } : e);
    } else {
      const newEv: SiteEvent = { ...validatedEvent, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      evs = [...events, newEv];
    }
    const ok = await saveEvents(evs);
    if (ok) {
      flash(editEvId
        ? (validatedEvent.published ? '✓ Event updated & published.' : '✓ Event draft saved.')
        : (validatedEvent.published ? '✓ Event created & published.' : '✓ Event draft saved.'));
      setNe(emptyEvent()); setEditEvId(null); setShowEvForm(false);
      await fetchAll();
    }
    setBusy(false);
  };

  const editEvent = (ev: SiteEvent) => {
    setNe({
      title: ev.title, type: ev.type, date: ev.date, time: ev.time,
      location: ev.location, description: ev.description,
      body: ev.body || '', country: ev.country || '',
      imageUrl: ev.imageUrl || '', ctaLabel: ev.ctaLabel,
      ctaUrl: ev.ctaUrl || '', actionLinks: ev.actionLinks || [],
      seats: ev.seats, speakers: ev.speakers || [], published: ev.published,
    });
    setEditEvId(ev.id); setShowEvForm(true);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await saveEvents(events.filter(e => e.id !== id));
    await fetchAll();
    flash('Event deleted.');
  };

  const toggleEventPublished = async (id: string) => {
    const evs = events.map(e => e.id === id ? { ...e, published: !e.published } : e);
    await saveEvents(evs);
    await fetchAll();
    flash('Visibility updated.');
  };

  // ── Media Library state ───────────────────────────────────────────────
  const [mediaLib, setMediaLib] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // ── Audit log / History state ─────────────────────────────────────────
  const [auditLog,     setAuditLog]     = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditRestoring, setAuditRestoring] = useState<string | null>(null);

  // ── Tab definitions ───────────────────────────────────────────────────
  const TABS: { id: Tab; icon: string; label: string }[] = [
    { id:'overview',  icon:'📊', label:'Overview'        },
    { id:'analytics', icon:'📈', label:'Analytics'       },
    { id:'pages',     icon:'📄', label:'Pages'           },
    { id:'create',    icon:'✚',  label:'Create Page'     },
    { id:'events',    icon:'📅', label:'Events'          },
    { id:'stories',   icon:'⭐', label:'Success Stories' },
    { id:'enquiries', icon:'📬', label:'Enquiries'       },
    { id:'news',      icon:'📰', label:'News'            },
    { id:'country-pages',icon:'🌍', label:'Country Pages'  },
    { id:'partners',  icon:'🤝', label:'Partners B2B'    },
    { id:'routes',    icon:'↗',  label:'Routes'         },
    { id:'countries', icon:'🌍', label:'Countries'       },
    { id:'homepage',  icon:'🏠', label:'Homepage'        },
    { id:'general',   icon:'🏢', label:'General'         },
    { id:'global',    icon:'⚙️', label:'Global Settings' },
    { id:'settings',  icon:'🖼', label:'Hero & BG'  },
    { id:'media-library', icon:'🖼️', label:'Media Library' },
    { id:'history',   icon:'🕒', label:'History'         },
  ];

  // ── Media Library helpers ─────────────────────────────────────────────
  const fetchMediaLib = useCallback(async () => {
    // Optionally fetch from KV if you want to store history, or a separate API route.
    // For this implementation, we will assume an API exists or we just manage state.
    const res = await fetch('/api/media/library').catch(() => null);
    if (res?.ok) {
      const d = await res.json();
      setMediaLib(d.urls || []);
    }
  }, []);

  useEffect(() => {
    if (tab === 'media-library') fetchMediaLib();
  }, [tab, fetchMediaLib]);

  // ── Audit log helpers ─────────────────────────────────────────────────
  const fetchAuditLog = useCallback(async () => {
    setAuditLoading(true);
    const res = await fetch('/api/admin/audit', { headers: hdrs }).catch(() => null);
    if (res?.ok) { const d = await res.json(); setAuditLog(d.log || []); }
    setAuditLoading(false);
  }, [token]);

  useEffect(() => {
    if (tab === 'history') fetchAuditLog();
  }, [tab, fetchAuditLog]);

  const clearHistory = async () => {
    if (!confirm('Clear all audit history? This cannot be undone.')) return;
    await fetch('/api/admin/audit', { method: 'DELETE', headers: hdrs }).catch(() => null);
    setAuditLog([]); flash('History cleared.');
  };

  const restoreSnapshot = async (entry: AuditEntry) => {
    if (!entry.before) { flash('No previous snapshot to restore.', 'error'); return; }
    if (!confirm(`Restore "${entry.entityName}" to its state before this action?`)) return;
    setAuditRestoring(entry.id);
    try {
      let res: Response | null = null;
      const snapshot = entry.before as Record<string, unknown>;
      if (entry.entity === 'news') {
        res = await fetch('/api/news', { method: 'PUT', headers: hdrs, body: JSON.stringify(snapshot) }).catch(() => null);
      } else if (entry.entity === 'event') {
        const allEvents = events.map(e => e.id === entry.entityId ? snapshot : e) as SiteEvent[];
        res = await fetch('/api/events', { method: 'PUT', headers: hdrs, body: JSON.stringify({ events: allEvents }) }).catch(() => null);
      } else if (entry.entity === 'testimonials') {
        res = await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ testimonials: snapshot }) }).catch(() => null);
      } else if (entry.entity === 'services') {
        res = await fetch('/api/content', { method: 'PUT', headers: hdrs, body: JSON.stringify({ services: snapshot }) }).catch(() => null);
      }
      if (res?.ok) {
        flash(`✓ Restored "${entry.entityName}" to previous state.`);
        fetchAll(); fetchAuditLog();
      } else {
        flash('Restore failed — please try again.', 'error');
      }
    } finally {
      setAuditRestoring(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).catch(() => null);

    if (res?.ok) {
      const d = await res.json();
      if (d.url) {
        setMediaLib(prev => [d.url, ...prev]);
        // Also save to KV
        await fetch('/api/media/library', {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify({ url: d.url }),
        }).catch(() => null);
        flash('✓ Image uploaded successfully.');
      }
    } else {
      flash('Failed to upload image.', 'error');
    }
    setUploading(false);
  };

  // ── Media Selector Component ──────────────────────────────────────────
  const MediaSelector = ({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localUpload, setLocalUpload] = useState(false);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setLocalUpload(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }).catch(() => null);

      if (res?.ok) {
        const d = await res.json();
        if (d.url) {
          onChange(d.url);
          flash('✓ Image uploaded and attached.');
        }
      } else {
        flash('Upload failed.', 'error');
      }
      setLocalUpload(false);
    };

    return (
      <div>
        <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">{label}</label>
        <div className="flex gap-2 items-center">
          <input value={value} onChange={e => onChange(e.target.value)} className={inp} placeholder="https://..." />
          <button type="button" onClick={() => fileInputRef.current?.click()} className={ghostBtn} disabled={localUpload}>
            {localUpload ? 'Uploading…' : 'Upload File'}
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
        </div>
        {value && (
          <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-slate-200">
            <Image src={value} alt="preview" fill className="object-cover" sizes="600px" onError={() => {}} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-jakarta font-black text-xs text-white"
              style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>IL</div>
            <span className="font-jakarta font-bold text-slate-800">ILOC Admin</span>
            <span className="hidden sm:block text-xs text-slate-400 ml-1">· Content Management</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className={ghostBtn}>↗ View Site</Link>
            <button onClick={onLogout}
              className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-100 sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 font-jakarta font-medium text-xs px-4 py-3.5 border-b-2 whitespace-nowrap transition-all ${
                  tab === t.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ══ OVERVIEW ══ */}
        {tab === 'overview' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-6">Dashboard</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label:'Total Pages',      val: pages.length, icon:'📄', color:BLUE  },
                { label:'Draft Pages',       val: pages.filter(p=>!p.published).length, icon:'📝', color:'#64748B' },
                { label:'Total Events',      val: events.length, icon:'📅', color:AMBER },
                { label:'Active Redirects',  val: redirects.filter(r=>r.active).length, icon:'↗', color:'#059669' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{s.icon}</div>
                    <div className="font-jakarta font-extrabold text-2xl" style={{ color: s.color }}>{s.val}</div>
                  </div>
                  <div className="font-jakarta text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {([['✚ Create Page',()=>setTab('create')],['📅 Manage Events',()=>setTab('events')],['↗ Manage Routes',()=>setTab('routes')]] as [string,()=>void][]).map(([lbl,fn])=>(
                    <button key={lbl} onClick={fn}
                      className="w-full text-left font-jakarta text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all text-slate-700">
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-3">Zero-Redeployment Engine</h3>
                <p className="font-jakarta text-xs text-slate-500 leading-relaxed mb-3">
                  All pages, events and routes are served from Cloudflare KV at the edge. Create a page → live instantly at <code className="bg-slate-100 px-1 rounded">/{'{slug}'}</code>. Update events → reflected in carousel immediately.
                </p>
                <span className="badge-blue text-[10px]">Powered by Cloudflare KV Edge</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {tab === 'analytics' && (() => {
          const today = new Date().toISOString().slice(0, 10);
          const newToday = leads.filter(l => l.createdAt?.startsWith(today)).length;
          const closed = leads.filter(l => l.status === 'closed').length;
          const convRate = leads.length > 0 ? Math.round((closed / leads.length) * 100) : 0;

          return (
            <div>
              <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">Lead Analytics 📈</h2>
              <p className="font-jakarta text-sm text-slate-500 mb-6">Overview of CRM conversions and enquiry volume.</p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="font-jakarta text-sm text-slate-500 mb-1">Total Enquiries</div>
                  <div className="font-jakarta font-extrabold text-3xl text-primary-900">{leads.length}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="font-jakarta text-sm text-slate-500 mb-1">New Leads Today</div>
                  <div className="font-jakarta font-extrabold text-3xl text-amber-500">+{newToday}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="font-jakarta text-sm text-slate-500 mb-1">Lead Conversion Rate</div>
                  <div className="font-jakarta font-extrabold text-3xl text-emerald-600">{convRate}%</div>
                </div>
              </div>

              {/* Traffic Metrics Redirect Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div>
                    <h3 className="font-jakarta font-extrabold text-xl sm:text-2xl mb-2 flex items-center gap-2">
                      <span className="text-2xl">⚡</span> Cloudflare Web Analytics
                    </h3>
                    <p className="font-jakarta text-blue-100 text-sm leading-relaxed max-w-2xl">
                      Real-time page views, visitor geography, and traffic sources are securely tracked via Cloudflare Web Analytics to protect the Edge KV write limits and ensure absolute zero impact on site speed.
                    </p>
                  </div>
                  <a
                    href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-indigo-900 font-jakarta font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap flex-shrink-0"
                  >
                    Open Web Analytics ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ B2B PARTNERS EDITOR ══ */}
        {tab === 'partners' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">B2B Partners Editor</h2>
            <p className="font-jakarta text-sm text-slate-500 mb-6">Edit all content for the Institutions, Agent, and Referral partner pages. Changes go live on the next page load.</p>

            {/* Page selector */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
              <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Select Partner Page</label>
              <div className="flex gap-3 flex-wrap">
                {(['institutions', 'agent', 'referral'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPartnerPage(p)}
                    className={`font-jakarta font-semibold text-sm px-5 py-2.5 rounded-xl border transition-all capitalize ${partnerPage === p ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {p === 'institutions' ? '🏛️ Institutions' : p === 'agent' ? '🤝 Agent' : '🎁 Referral'}
                  </button>
                ))}
              </div>
              {partnerFormLoad && (
                <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-300 border-t-amber-500 animate-spin" />
                  Loading settings…
                </div>
              )}
            </div>

            {!partnerFormLoad && (
              <div className="space-y-6">

                {/* ── Hero section ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-jakarta font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="text-amber-500">◆</span> Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Badge Text (small pill above heading)</label>
                      <input className={inp} value={partnerForm.badge} onChange={e => setPartnerForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Global University Network" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Heading — wrap a word in **double asterisks** for amber gradient</label>
                      <input className={inp} value={partnerForm.heading} onChange={e => setPartnerForm(f => ({ ...f, heading: e.target.value }))} placeholder="e.g. Recruit **High-Intent** Indian Students." />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Subheading</label>
                      <textarea className={`${inp} resize-none`} rows={3} value={partnerForm.subheading} onChange={e => setPartnerForm(f => ({ ...f, subheading: e.target.value }))} placeholder="Paragraph below the heading…" />
                    </div>
                  </div>
                </div>

                {/* ── Body section ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-jakarta font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="text-amber-500">◆</span> Body Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Section Heading</label>
                      <input className={inp} value={partnerForm.bodyHeading} onChange={e => setPartnerForm(f => ({ ...f, bodyHeading: e.target.value }))} placeholder="e.g. Why Partner with ILOC?" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Intro Paragraph</label>
                      <textarea className={`${inp} resize-none`} rows={4} value={partnerForm.bodyIntro} onChange={e => setPartnerForm(f => ({ ...f, bodyIntro: e.target.value }))} placeholder="Opening paragraph for the body section…" />
                    </div>
                  </div>
                </div>

                {/* ── Stats / Steps cards ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-jakarta font-bold text-slate-700 mb-1 flex items-center gap-2"><span className="text-amber-500">◆</span> Stat / Step Cards</h3>
                  <p className="font-jakarta text-xs text-slate-400 mb-4">For Agent & Institutions: use stat values like "97%" or "400+". For Referral: use step numbers "1", "2", "3".</p>
                  <div className="space-y-4">
                    {partnerForm.stats.map((stat, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-jakarta text-xs font-semibold text-slate-400 uppercase">Card {i + 1}</span>
                          <button type="button" onClick={() => setPartnerForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))}
                            className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors">✕ Remove</button>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-jakarta text-xs text-slate-400 mb-1">Value / Number</label>
                            <input className={inp} value={stat.value} onChange={e => setPartnerForm(f => ({ ...f, stats: f.stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s) }))} placeholder="97%" />
                          </div>
                          <div>
                            <label className="block font-jakarta text-xs text-slate-400 mb-1">Label / Title</label>
                            <input className={inp} value={stat.label} onChange={e => setPartnerForm(f => ({ ...f, stats: f.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) }))} placeholder="Visa Success Rate" />
                          </div>
                          <div>
                            <label className="block font-jakarta text-xs text-slate-400 mb-1">Description</label>
                            <input className={inp} value={stat.desc} onChange={e => setPartnerForm(f => ({ ...f, stats: f.stats.map((s, j) => j === i ? { ...s, desc: e.target.value } : s) }))} placeholder="Supporting sentence…" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => setPartnerForm(f => ({ ...f, stats: [...f.stats, { value: '', label: '', desc: '' }] }))}
                      className={`${ghostBtn} text-xs`}>
                      + Add Card
                    </button>
                  </div>
                </div>

                {/* ── List / Benefits ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-jakarta font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="text-amber-500">◆</span> Benefits / Steps List</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">List Heading</label>
                      <input className={inp} value={partnerForm.listHeading} onChange={e => setPartnerForm(f => ({ ...f, listHeading: e.target.value }))} placeholder="e.g. Partner Benefits" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">List Items — format: <code className="bg-slate-100 px-1 rounded text-amber-600">Bold Title: description text</code></label>
                      <div className="space-y-2">
                        {partnerForm.listItems.map((item, i) => (
                          <div key={i} className="flex gap-2">
                            <input className={inp} value={item} onChange={e => setPartnerForm(f => ({ ...f, listItems: f.listItems.map((x, j) => j === i ? e.target.value : x) }))} placeholder="Title: Description of this benefit…" />
                            <button type="button" onClick={() => setPartnerForm(f => ({ ...f, listItems: f.listItems.filter((_, j) => j !== i) }))}
                              className="px-3 py-2 rounded-xl border border-slate-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors text-sm flex-shrink-0">✕</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setPartnerForm(f => ({ ...f, listItems: [...f.listItems, ''] }))}
                          className={`${ghostBtn} text-xs`}>+ Add Item</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Form card ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-jakarta font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="text-amber-500">◆</span> Form Card (right column)</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Form Heading</label>
                      <input className={inp} value={partnerForm.formHeading} onChange={e => setPartnerForm(f => ({ ...f, formHeading: e.target.value }))} placeholder="e.g. Initiate Partnership" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Form Subtext</label>
                      <input className={inp} value={partnerForm.formSubtext} onChange={e => setPartnerForm(f => ({ ...f, formSubtext: e.target.value }))} placeholder="e.g. Our team will contact you within 24 hours." />
                    </div>
                  </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { void savePartnerForm(); }}
                    disabled={partnerFormSave}
                    className={`${amberBtn} disabled:opacity-50`}
                    style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
                  >
                    {partnerFormSave ? 'Saving…' : `Save ${partnerPage.charAt(0).toUpperCase() + partnerPage.slice(1)} Page →`}
                  </button>
                  <span className="font-jakarta text-xs text-slate-400">Saves to KV · live on next page load</span>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ══ PAGES LIST ══ */}
        {tab === 'pages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">Pages ({pages.length})</h2>
              <button onClick={() => setTab('create')} className={amberBtn} style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>+ Create Page</button>
            </div>
            {pages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No pages yet</h3>
                <button onClick={() => setTab('create')} className={`${blueBtn} mt-3`} style={{ background: BLUE }}>Create First Page</button>
              </div>
            ) : (
              <div className="space-y-3">
                {pages.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-jakarta font-bold text-slate-800 text-sm truncate">{p.title}</span>
                        <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${p.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {p.published ? 'Live' : 'Draft'}
                        </span>
                        {p.heroImageUrl && <span className="badge-amber text-[9px] flex-shrink-0">🖼 Image set</span>}
                      </div>
                      <div className="font-jakarta text-xs text-slate-400 flex items-center gap-3">
                        <span>/{p.slug}</span><span>·</span><span>{p.layout}</span><span>·</span><span>{p.blocks?.length || 0} blocks</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/${p.slug}`} target="_blank" className={`${ghostBtn} text-xs`}>Preview ↗</Link>
                      <button onClick={() => deletePage(p.slug)}
                        className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ CREATE PAGE ══ */}
        {tab === 'create' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-6">Create New Page</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-7 sm:p-9 space-y-5">

              {/* Title (slug auto-generated) */}
              <div>
                <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Page Title *</label>
                <input value={np.title} onChange={e => {
                  const title = e.target.value;
                  setNp(p => ({ ...p, title, slug: slugify(title) }));
                }} className={inp} placeholder="e.g. Scholarship Guide 2026" />
                {np.slug && (
                  <p className="font-jakarta text-[10px] text-slate-400 mt-1">
                    Page URL: <code className="bg-slate-100 px-1 rounded">/{np.slug}</code>
                  </p>
                )}
              </div>

              {/* SEO */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">SEO Meta Title</label>
                  <input value={np.metaTitle} onChange={e => setNp(p => ({ ...p, metaTitle: e.target.value }))} className={inp} placeholder="Leave blank to use page title" />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">SEO Meta Description</label>
                  <input value={np.metaDescription} onChange={e => setNp(p => ({ ...p, metaDescription: e.target.value }))} className={inp} placeholder="~155 chars" />
                </div>
              </div>

              {/* Category + Layout */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Category Badge</label>
                  <input value={np.category} onChange={e => setNp(p => ({ ...p, category: e.target.value }))} className={inp} placeholder="e.g. Scholarship" />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Layout</label>
                  <select value={np.layout} onChange={e => setNp(p => ({ ...p, layout: e.target.value as any }))} className={`${inp} cursor-pointer`}>
                    {['default','article','landing','country'].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Hero image URL */}
              <div>
                <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                  🖼 Hero Banner Image URL <span className="text-slate-400 normal-case lowercase tracking-normal">(optional — overrides default)</span>
                </label>
                <input value={np.heroImageUrl} onChange={e => setNp(p => ({ ...p, heroImageUrl: e.target.value }))} className={inp}
                  placeholder="https://images.unsplash.com/..." />
                {np.heroImageUrl && (
                  <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-slate-200">
                    <Image src={np.heroImageUrl} alt="preview" fill className="object-cover" sizes="600px"
                      onError={() => {}} />
                    <div className="absolute inset-0 flex items-end p-2">
                      <span className="font-jakarta text-[10px] text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded">Preview</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description + body */}
              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Hero Subtext</label>
                <input value={np.description} onChange={e => setNp(p => ({ ...p, description: e.target.value }))} className={inp} placeholder="Appears under the headline in the hero section" />
              </div>
              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Body Content (Markdown)</label>
                <div className="bg-slate-50 rounded-xl p-3 mb-2 border border-slate-200">
                  <p className="font-jakarta text-[11px] text-slate-500">
                    Supported: <strong># Heading</strong> · <strong>## Sub</strong> · <strong>- List</strong> · <strong>&gt; Quote</strong> · Plain paragraphs
                  </p>
                </div>
                <textarea value={np.body} onChange={e => setNp(p => ({ ...p, body: e.target.value }))} rows={12}
                  className={`${inp} resize-none font-mono text-xs`}
                  placeholder={'# Introduction\n\nYour content here.\n\n## Section\n\n- Point one\n- Point two'} />
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <button onClick={() => setNp(p => ({ ...p, published: !p.published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${np.published ? 'bg-green-500' : 'bg-slate-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${np.published ? 'translate-x-5' : ''}`} />
                </button>
                <span className="font-jakarta text-sm text-slate-700">{np.published ? 'Published — live immediately' : 'Draft — hidden from visitors'}</span>
              </div>

              {np.slug && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-jakarta text-xs text-amber-700">
                    <strong>Live URL:</strong> <code>/{np.slug}</code> — accessible instantly via KV edge routing, no redeploy needed.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={createPage} disabled={busy || !np.title}
                  className={`${amberBtn} px-7 py-3 disabled:opacity-50`}
                  style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                  {busy ? 'Publishing…' : np.published ? 'Publish Page' : 'Save Draft'}
                </button>
                <button onClick={() => setNp({ slug:'',title:'',metaTitle:'',metaDescription:'',category:'',description:'',body:'',heroImageUrl:'',layout:'default',published:true })}
                  className={ghostBtn}>Clear Form</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ EVENTS ══ */}
        {tab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">Events ({events.length})</h2>
                <p className="font-jakarta text-sm text-slate-400 mt-1">Manage events shown on /events and detail pages. Syncs to KV instantly.</p>
              </div>
              {!showEvForm && (
                <button onClick={() => { setNe(emptyEvent()); setEditEvId(null); setShowEvForm(true); }}
                  className={amberBtn} style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                  + Add Event
                </button>
              )}
            </div>

            {/* Stats bar */}
            {events.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total', value: events.length, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
                  { label: 'Published', value: events.filter(e => e.published).length, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                  { label: 'Drafts', value: events.filter(e => !e.published).length, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
                  { label: 'Upcoming', value: events.filter(e => e.published && new Date(e.date) >= new Date()).length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3 text-center`}>
                    <div className={`font-jakarta font-extrabold text-xl ${s.color}`}>{s.value}</div>
                    <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}


            {/* Event form */}
            {showEvForm && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-5">
                  {editEvId ? '✏️ Edit Event' : '✚ New Event'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Event Title *</label>
                    <input value={ne.title} onChange={e => setNe(p => ({ ...p, title: e.target.value }))} className={inp} placeholder="e.g. UK Admissions Masterclass" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Type</label>
                    <select value={ne.type} onChange={e => setNe(p => ({ ...p, type: e.target.value as EventType }))} className={`${inp} cursor-pointer`}>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Date *</label>
                    <input type="date" value={ne.date} onChange={e => setNe(p => ({ ...p, date: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Time</label>
                    <input value={ne.time} onChange={e => setNe(p => ({ ...p, time: e.target.value }))} className={inp} placeholder="4:00 PM – 5:30 PM IST" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Location</label>
                    <input value={ne.location} onChange={e => setNe(p => ({ ...p, location: e.target.value }))} className={inp} placeholder="Online (Zoom) / Pune Office" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">🌍 Target Country</label>
                    <select value={ne.country || ''} onChange={e => setNe(p => ({ ...p, country: e.target.value }))} className={`${inp} cursor-pointer`}>
                      <option value="">All Countries</option>
                      <option value="usa">🇺🇸 USA</option>
                      <option value="uk">🇬🇧 UK</option>
                      <option value="australia">🇦🇺 Australia</option>
                      <option value="canada">🇨🇦 Canada</option>
                      <option value="new-zealand">🇳🇿 New Zealand</option>
                      <option value="ireland">🇮🇪 Ireland</option>
                      <option value="europe">🇪🇺 Europe</option>
                      <option value="uae">🇦🇪 UAE</option>
                      <option value="japan">🇯🇵 Japan</option>
                      <option value="south-korea">🇰🇷 South Korea</option>
                      <option value="singapore">🇸🇬 Singapore</option>
                      <option value="russia">🇷🇺 Russia</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Short Description</label>
                    <textarea value={ne.description} onChange={e => setNe(p => ({ ...p, description: e.target.value }))} rows={2}
                      className={`${inp} resize-none`} placeholder="Short description shown on the event card..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                      📝 Rich Body Content (Markdown) — shown on the /events/[id] detail page
                    </label>
                    <div className="bg-slate-50 rounded-xl p-3 mb-2 border border-slate-200">
                      <p className="font-jakarta text-[11px] text-slate-500">
                        Supported: <strong>## Section Heading</strong> · <strong>### Sub-heading</strong> · <strong>- Bullet list</strong> · <strong>&gt; Blockquote</strong> · <strong>**bold**</strong> · Plain paragraphs
                      </p>
                    </div>
                    <textarea
                      value={ne.body || ''}
                      onChange={e => setNe(p => ({ ...p, body: e.target.value }))}
                      rows={12}
                      className={`${inp} resize-none font-mono text-xs`}
                      placeholder={'## About This Event\n\nDescribe the event in detail here.\n\n## What You Will Learn\n\n- Point one\n- Point two\n\n> Important note for attendees.'}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">🖼 Card Image URL (optional)</label>
                    <input value={ne.imageUrl} onChange={e => setNe(p => ({ ...p, imageUrl: e.target.value }))} className={inp}
                      placeholder="https://images.unsplash.com/..." />
                    {ne.imageUrl && (
                      <div className="mt-2 relative h-24 rounded-xl overflow-hidden border border-slate-200">
                        <Image src={ne.imageUrl} alt="preview" fill className="object-cover" sizes="500px" onError={() => {}} />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="font-jakarta text-[10px] text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded">Image preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">CTA Label</label>
                    <input value={ne.ctaLabel} onChange={e => setNe(p => ({ ...p, ctaLabel: e.target.value }))} className={inp} placeholder="Register Free" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">CTA URL</label>
                    <input value={ne.ctaUrl} onChange={e => setNe(p => ({ ...p, ctaUrl: e.target.value }))} className={inp} placeholder="/contact" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Seats Available</label>
                    <input type="number" value={ne.seats || ''} onChange={e => setNe(p => ({ ...p, seats: e.target.value ? Number(e.target.value) : undefined }))} className={inp} placeholder="100" />
                  </div>
                  <div className="flex items-center gap-3 self-end pb-2.5">
                    <button onClick={() => setNe(p => ({ ...p, published: !p.published }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${ne.published ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${ne.published ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className="font-jakarta text-sm text-slate-700">{ne.published ? 'Published' : 'Draft'}</span>
                  </div>
                  {/* Speakers */}
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">🎤 Speakers (shown on detail page)</label>
                    <div className="space-y-2">
                      {(ne.speakers || []).map((sp, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={sp}
                            onChange={e => setNe(p => ({ ...p, speakers: (p.speakers || []).map((s, j) => j === i ? e.target.value : s) }))}
                            className={inp}
                            placeholder="e.g. Rajib Paul, Study Abroad Expert"
                          />
                          <button type="button"
                            onClick={() => setNe(p => ({ ...p, speakers: (p.speakers || []).filter((_, j) => j !== i) }))}
                            className="px-3 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors text-sm flex-shrink-0">✕</button>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setNe(p => ({ ...p, speakers: [...(p.speakers || []), ''] }))}
                        className={`${ghostBtn} text-xs`}>+ Add Speaker</button>
                    </div>
                  </div>

                  {/* Action Links — Zoom, Webinar, Registration etc. */}
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                      🔗 Action Links — Zoom / Webinar / Registration
                    </label>
                    <p className="font-jakarta text-[11px] text-slate-400 mb-3">
                      Add clickable buttons on the event detail page (e.g. "Join Zoom", "Register for Webinar"). Visible on the event detail page registration card.
                    </p>
                    <div className="space-y-3">
                      {(ne.actionLinks || []).map((link, i) => (
                        <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
                          <div className="grid sm:grid-cols-[140px_1fr_1fr] gap-3 mb-3">
                            <div>
                              <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Type</label>
                              <select
                                value={link.type}
                                onChange={e => setNe(p => ({ ...p, actionLinks: (p.actionLinks || []).map((l, j) => j === i ? { ...l, type: e.target.value as EventActionType } : l) }))}
                                className={`${inp} cursor-pointer text-xs`}
                              >
                                <option value="zoom">🎥 Zoom</option>
                                <option value="webinar">📡 Webinar</option>
                                <option value="registration">📋 Registration</option>
                                <option value="external">🌐 External Link</option>
                                <option value="whatsapp">💬 WhatsApp</option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Button Label</label>
                              <input
                                value={link.label}
                                onChange={e => setNe(p => ({ ...p, actionLinks: (p.actionLinks || []).map((l, j) => j === i ? { ...l, label: e.target.value } : l) }))}
                                className={inp}
                                placeholder="Join Zoom / Register Now"
                              />
                            </div>
                            <div>
                              <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">URL *</label>
                              <input
                                value={link.url}
                                onChange={e => setNe(p => ({ ...p, actionLinks: (p.actionLinks || []).map((l, j) => j === i ? { ...l, url: e.target.value } : l) }))}
                                className={inp}
                                placeholder="https://zoom.us/j/..."
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button type="button"
                              onClick={() => setNe(p => ({ ...p, actionLinks: (p.actionLinks || []).filter((_, j) => j !== i) }))}
                              className="font-jakarta text-xs text-red-400 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors border border-red-100">
                              Remove Link
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setNe(p => ({ ...p, actionLinks: [...(p.actionLinks || []), { type: 'zoom', label: 'Join Zoom', url: '' }] }))}
                        className={`${ghostBtn} text-xs`}>
                        + Add Action Link
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5 flex-wrap">
                  <button onClick={() => submitEvent(true)} disabled={busy}
                    className={`${amberBtn} px-6 disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                    {busy ? 'Saving…' : editEvId ? '🚀 Update & Publish' : '🚀 Publish Event'}
                  </button>
                  <button onClick={() => submitEvent(false)} disabled={busy}
                    className={`${ghostBtn} disabled:opacity-50`}>
                    {busy ? 'Saving…' : '💾 Save as Draft'}
                  </button>
                  <button onClick={() => { setShowEvForm(false); setNe(emptyEvent()); setEditEvId(null); }}
                    className={ghostBtn}>Cancel</button>
                </div>
              </div>
            )}

            {/* Event list */}
            {events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No events yet</h3>
                <p className="font-jakarta text-sm text-slate-400 mb-4">Create your first event to show it in the homepage carousel.</p>
                <button onClick={() => { setNe(emptyEvent()); setEditEvId(null); setShowEvForm(true); }}
                  className={`${blueBtn}`} style={{ background: BLUE }}>Add First Event</button>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      {/* Color accent */}
                      <div className="w-1.5 self-stretch rounded-full flex-shrink-0"
                        style={{ background: EVENT_TYPE_COLORS[ev.type] || AMBER }} />

                      {/* Image thumbnail */}
                      {ev.imageUrl && (
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block">
                          <Image src={ev.imageUrl} alt={ev.title} fill className="object-cover" sizes="80px" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-jakarta font-bold text-slate-800 text-sm truncate">{ev.title}</span>
                          <span className="font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color: EVENT_TYPE_COLORS[ev.type], background: `${EVENT_TYPE_COLORS[ev.type]}18` }}>
                            {ev.type.charAt(0).toUpperCase()+ev.type.slice(1)}
                          </span>
                          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${ev.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {ev.published ? 'Live' : 'Draft'}
                          </span>
                        </div>
                        <div className="font-jakarta text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                          <span>📅 {ev.date}</span>
                          <span>⏰ {ev.time}</span>
                          <span>📍 {ev.location}</span>
                          {ev.seats && <span>🪑 {ev.seats} seats</span>}
                          {ev.country && (
                            <span className="font-jakarta text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                              🌍 {ev.country.toUpperCase()}
                            </span>
                          )}
                          {ev.body && (
                            <span className="font-jakarta text-[10px] font-medium bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">
                              📝 Rich body
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/events/${ev.id}`} target="_blank"
                          className="font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                          ↗
                        </Link>
                        <button onClick={() => toggleEventPublished(ev.id)}
                          className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${ev.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                          {ev.published ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => editEvent(ev)} className={`${ghostBtn} text-xs px-3 py-1.5`}>Edit</button>
                        <button onClick={() => deleteEvent(ev.id)}
                          className="font-jakarta text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SUCCESS STORIES ══ */}
        {tab === 'stories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">Success Stories ({testimonials.length})</h2>
                <p className="font-jakarta text-sm text-slate-400 mt-1">Manage student testimonials shown in the homepage masonry grid. Changes sync to KV instantly.</p>
              </div>
              {!showTForm && (
                <button onClick={() => { setNt(emptyTestimonial()); setEditTId(null); setShowTForm(true); }}
                  className={amberBtn} style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                  + Add Testimonial
                </button>
              )}
            </div>

            {/* Testimonial form */}
            {showTForm && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-5">
                  {editTId ? '✏️ Edit Testimonial' : '✚ New Testimonial'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Full Name *</label>
                    <input value={nt.name} onChange={e => setNt(p => ({ ...p, name: e.target.value }))}
                      className={inp} placeholder="e.g. Arjun Mehta" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Role / Degree</label>
                    <input value={nt.role} onChange={e => setNt(p => ({ ...p, role: e.target.value }))}
                      className={inp} placeholder="e.g. MS Computer Science" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">University</label>
                    <input value={nt.uni} onChange={e => setNt(p => ({ ...p, uni: e.target.value }))}
                      className={inp} placeholder="e.g. University of Toronto" />
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Country (with flag)</label>
                    <input value={nt.country} onChange={e => setNt(p => ({ ...p, country: e.target.value }))}
                      className={inp} placeholder="e.g. Canada 🇨🇦" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Quote *</label>
                    <textarea value={nt.quote} onChange={e => setNt(p => ({ ...p, quote: e.target.value }))}
                      rows={3} className={`${inp} resize-none`}
                      placeholder="What the student said about ILOC..." />
                    <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{nt.quote.length} chars</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Avatar Image URL</label>
                    <input value={nt.imageUrl} onChange={e => setNt(p => ({ ...p, imageUrl: e.target.value }))}
                      className={inp} placeholder="https://images.unsplash.com/... (leave blank to show initials)" />
                    {nt.imageUrl && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200 flex-shrink-0">
                          <Image src={nt.imageUrl} alt="preview" fill className="object-cover" sizes="48px" onError={() => {}} />
                        </div>
                        <span className="font-jakarta text-xs text-slate-500">Avatar preview</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Star Rating</label>
                    <select value={nt.stars} onChange={e => setNt(p => ({ ...p, stars: Number(e.target.value) }))}
                      className={`${inp} cursor-pointer`}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 self-end pb-2.5">
                    <button onClick={() => setNt(p => ({ ...p, published: !p.published }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${nt.published ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${nt.published ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className="font-jakarta text-sm text-slate-700">{nt.published ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-5 flex-wrap">
                  <button onClick={() => submitTestimonial(true)} disabled={tBusy}
                    className={`${amberBtn} px-6 disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                    {tBusy ? 'Saving…' : editTId ? '🚀 Update & Publish' : '🚀 Publish Testimonial'}
                  </button>
                  <button onClick={() => submitTestimonial(false)} disabled={tBusy}
                    className={`${ghostBtn} disabled:opacity-50`}>
                    {tBusy ? 'Saving…' : '💾 Save as Draft'}
                  </button>
                  <button onClick={() => { setShowTForm(false); setNt(emptyTestimonial()); setEditTId(null); }}
                    className={ghostBtn}>Cancel</button>
                </div>
              </div>
            )}

            {/* Testimonial list */}
            {testimonials.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No testimonials yet</h3>
                <p className="font-jakarta text-sm text-slate-400 mb-4">Add your first success story to display it on the homepage.</p>
                <button onClick={() => { setNt(emptyTestimonial()); setEditTId(null); setShowTForm(true); }}
                  className={blueBtn} style={{ background: BLUE }}>Add First Testimonial</button>
              </div>
            ) : (
              <div className="space-y-3">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      {/* Avatar */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-100 bg-gradient-to-br from-primary-600 to-primary-500">
                        {t.imageUrl ? (
                          <Image src={t.imageUrl} alt={t.name} fill className="object-cover" sizes="48px" onError={() => {}} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-jakarta font-bold text-xs text-white">
                            {t.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-jakarta font-bold text-slate-800 text-sm">{t.name}</span>
                          <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${t.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {t.published ? 'Live' : 'Draft'}
                          </span>
                          {/* Star display */}
                          <span className="font-jakarta text-[10px] text-amber-500 font-semibold">{'★'.repeat(t.stars)}</span>
                        </div>
                        <div className="font-jakarta text-xs text-slate-500 mb-1">
                          {t.role}{t.uni ? ` · ${t.uni}` : ''}{t.country ? ` · ${t.country}` : ''}
                        </div>
                        <p className="font-jakarta text-xs text-slate-500 italic leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleTestimonialPublished(t.id)}
                          className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${t.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                          {t.published ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => editTestimonial(t)} className={`${ghostBtn} text-xs px-3 py-1.5`}>Edit</button>
                        <button onClick={() => deleteTestimonial(t.id)}
                          className="font-jakarta text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reset to defaults */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-jakarta text-sm font-semibold text-amber-800 mb-1">Reset to Defaults</p>
                <p className="font-jakarta text-xs text-amber-700 leading-relaxed mb-3">
                  Overwrites all testimonials in KV with the original 10 hardcoded defaults.
                </p>
                <button
                  onClick={async () => {
                    if (!confirm('Reset all testimonials to defaults? This cannot be undone.')) return;
                    setTestimonials(DEFAULT_TESTIMONIALS);
                    await saveTestimonials(DEFAULT_TESTIMONIALS);
                  }}
                  className="font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ NEWS ══ */}
        {tab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">News & Updates ({news.length})</h2>
                <p className="font-jakarta text-sm text-slate-400 mt-1">Manage articles shown on /news and /news/[slug]. Syncs to KV instantly.</p>
              </div>
              {!showNewsForm && (
                <button onClick={() => { setNn(emptyNews()); setEditNewsId(null); setShowNewsForm(true); }}
                  className={amberBtn} style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                  + Add Article
                </button>
              )}
            </div>

            {/* Stats bar */}
            {news.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Total Articles', value: news.length, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
                  { label: 'Published', value: news.filter(n => n.published).length, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                  { label: 'Drafts', value: news.filter(n => !n.published).length, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3 text-center`}>
                    <div className={`font-jakarta font-extrabold text-xl ${s.color}`}>{s.value}</div>
                    <div className="font-jakarta text-xs text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}


            {/* News form */}
            {showNewsForm && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-5">
                  {editNewsId ? '✏️ Edit Article' : '✚ New Article'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Article Title *</label>
                    <input value={nn.title} onChange={e => {
                      const title = e.target.value;
                      setNn(p => ({ ...p, title, slug: editNewsId ? p.slug : slugify(title) }));
                    }} className={inp} placeholder="e.g. Canada IRCC Cap Updates 2026" />
                    {nn.slug && (
                      <p className="font-jakarta text-[10px] text-slate-400 mt-1">
                        URL: <code className="bg-slate-100 px-1 rounded">/news/{nn.slug}</code>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Publish Date</label>
                    <input type="date" value={nn.date} onChange={e => setNn(p => ({ ...p, date: e.target.value }))} className={inp} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Excerpt (~160 chars)</label>
                    <textarea value={nn.excerpt} onChange={e => setNn(p => ({ ...p, excerpt: e.target.value }))} rows={2} className={`${inp} resize-none`} placeholder="Short summary shown on the news card..." />
                    <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{nn.excerpt.length} chars</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">🖼 Hero Image URL</label>
                    <input value={nn.imageUrl} onChange={e => setNn(p => ({ ...p, imageUrl: e.target.value }))} className={inp} placeholder="https://images.unsplash.com/..." />
                    {nn.imageUrl && (
                      <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-slate-200">
                        <Image src={nn.imageUrl} alt="preview" fill className="object-cover" sizes="600px" onError={() => {}} />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="font-jakarta text-[10px] text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded">Image preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Article Body</label>
                    <RichTextEditor
                      value={nn.content}
                      onChange={html => setNn(p => ({ ...p, content: html }))}
                      placeholder="Start writing your article here. Use the toolbar above for formatting."
                      rows={14}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setNn(p => ({ ...p, published: !p.published }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${nn.published ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${nn.published ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className="font-jakarta text-sm text-slate-700">{nn.published ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-5 flex-wrap">
                  <button onClick={() => submitNews(true)} disabled={newsBusy}
                    className={`${amberBtn} px-6 disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                    {newsBusy ? 'Saving…' : editNewsId ? '🚀 Update & Publish' : '🚀 Publish Now'}
                  </button>
                  <button onClick={() => submitNews(false)} disabled={newsBusy}
                    className={`${ghostBtn} disabled:opacity-50`}>
                    {newsBusy ? 'Saving…' : '💾 Save as Draft'}
                  </button>
                  <button onClick={() => { setShowNewsForm(false); setNn(emptyNews()); setEditNewsId(null); }} className={ghostBtn}>Cancel</button>
                </div>
              </div>
            )}

            {/* News list */}
            {news.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No articles yet</h3>
                <p className="font-jakarta text-sm text-slate-400 mb-4">Create your first article — it will appear on /news instantly.</p>
                <button onClick={() => { setNn(emptyNews()); setEditNewsId(null); setShowNewsForm(true); }}
                  className={blueBtn} style={{ background: BLUE }}>Add First Article</button>
              </div>
            ) : (
              <div className="space-y-3">
                {news.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-start gap-4">
                    {item.imageUrl && (
                      <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block border border-slate-100">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-jakarta font-bold text-slate-800 text-sm truncate">{item.title}</span>
                        <span className={`font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${item.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {item.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <div className="font-jakarta text-xs text-slate-400">/news/{item.slug} · {item.date}</div>
                      {item.excerpt && <p className="font-jakarta text-xs text-slate-400 mt-0.5 line-clamp-1 italic">{item.excerpt}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={`/news/${item.slug}`} target="_blank" rel="noopener noreferrer" className={`${ghostBtn} text-xs`}>↗</a>
                      <button onClick={() => toggleNewsPublished(item)}
                        className={`font-jakarta text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${item.published ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                        {item.published ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => editNewsItem(item)} className={`${ghostBtn} text-xs px-3 py-1.5`}>Edit</button>
                      <button onClick={() => deleteNewsItem(item.id)}
                        className="font-jakarta text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ COUNTRY PAGES ══ */}
        {tab === 'country-pages' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">Country Page Editor</h2>
            <p className="font-jakarta text-sm text-slate-500 mb-6">
              Override any country section content via KV. Leave blank to use the default from <code className="bg-slate-100 px-1 rounded">lib/countrySubpages.ts</code>. Changes are live on the next page load.
            </p>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Select Country</label>
                  <select
                    value={cpCountry}
                    onChange={e => { setCpCountry(e.target.value); setCpHtml(''); }}
                    className={`${inp} cursor-pointer`}
                  >
                    <option value="">Select a country</option>
                    {Object.values(COUNTRIES_MAP).map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Select Section</label>
                  <select
                    value={cpSection}
                    onChange={e => { setCpSection(e.target.value); setCpHtml(''); }}
                    className={`${inp} cursor-pointer`}
                  >
                    <option value="">Select section</option>
                    {SECTION_SLUGS.map(s => (
                      <option key={s} value={s}>{SECTION_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 text-slate-500 text-xs flex items-center gap-2">
                {cpLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-300 border-t-amber-500 animate-spin" />
                    Loading section content automatically...
                  </span>
                ) : cpCountry && cpSection ? (
                  <span>Content loads automatically when you select a country or section.</span>
                ) : (
                  <span>Select a country and section to begin.</span>
                )}
              </div>

              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Content — {Object.values(COUNTRIES_MAP).find(c => c.code === cpCountry)?.name} / {SECTION_LABELS[cpSection as keyof typeof SECTION_LABELS] || cpSection}
                </label>
                <RichTextEditor
                  value={cpHtml}
                  onChange={setCpHtml}
                  placeholder="Selected section content will appear here once loaded. Leave empty to revert to default content."
                  rows={18}
                />
                {!cpLoading && cpHtml.trim() === '' && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 text-sm mt-3">
                    {cpCountry && cpSection
                      ? 'No saved content yet for this selection. Start typing to create it.'
                      : 'Select a country and section to begin editing.'}
                  </div>
                )}
                <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{cpHtml.length} chars</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { void saveCountrySection(); }}
                  disabled={!cpCountry || !cpSection || cpSaving}
                  className={`${amberBtn} px-8 disabled:opacity-50`}
                  style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}
                >
                  {cpSaving ? 'Saving…' : 'Save to KV →'}
                </button>
                <a
                  href={cpCountry && cpSection ? `/destinations/${cpCountry}/${cpSection}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ghostBtn} ${!(cpCountry && cpSection) ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  Preview ↗
                </a>
                <button
                  onClick={() => { setCpHtml(''); flash('Content cleared — save to revert to default.'); }}
                  className={ghostBtn}
                >
                  Clear (use default)
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="font-jakarta text-sm font-semibold text-amber-800 mb-1">How KV overrides work</p>
                <p className="font-jakarta text-xs text-amber-700 leading-relaxed">
                  When a student visits <code className="bg-amber-100 px-1 rounded">/destinations/{'{country}'}/{'{section}'}</code>, the page first checks KV for an override. If found, it renders that HTML. If not, it falls back to the bundled content in <code className="bg-amber-100 px-1 rounded">lib/countrySubpages.ts</code>. Changes via this editor are live on the next page load (respects the 1-hour revalidate window).
                </p>
              </div>
            </div>

            {/* ── Stat Blocks Editor ─────────────────────────────────────── */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${BLUE},#1249C4)` }}>📊</div>
                <div>
                  <h3 className="font-jakarta font-extrabold text-slate-800 text-lg leading-tight">Stat Block Editor</h3>
                  <p className="font-jakarta text-xs text-slate-400">Edit the 4 hero tiles (Intake · Cost · Visa Rate · Universities) + tagline, description, and images for each country.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                {/* Country picker */}
                <div className="mb-5">
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Select Country</label>
                  <select
                    value={metaCountry}
                    onChange={e => { setMetaCountry(e.target.value); }}
                    className={`${inp} cursor-pointer max-w-xs`}
                  >
                    {Object.values(COUNTRIES_MAP).map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                {metaLoading ? (
                  <div className="flex items-center gap-2 py-6 text-slate-400 font-jakarta text-sm">
                    <span className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-amber-500 animate-spin" />
                    Loading current values…
                  </div>
                ) : (
                  <>
                    {/* Live preview of stat tiles */}
                    <div className="mb-5 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                      <p className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Live preview (as seen on destination hero)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          ['📅 Intake',       metaForm.intake],
                          ['💰 Avg Cost',     metaForm.avgCost],
                          ['✅ Visa Rate',    metaForm.visaRate],
                          ['🏛️ Universities', metaForm.unis],
                        ].map(([label, value]) => (
                          <div key={label}
                            className="rounded-xl px-3 py-3 text-center text-white"
                            style={{ background: `linear-gradient(135deg,${metaForm.color || COUNTRIES_MAP[metaCountry]?.color || BLUE}CC,${metaForm.color || COUNTRIES_MAP[metaCountry]?.color || BLUE}99)` }}
                          >
                            <div className="font-jakarta text-[9px] text-white/70 uppercase tracking-widest mb-1">{label}</div>
                            <div className="font-jakarta font-extrabold text-white text-xs leading-tight">{value || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stat fields */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">📅 Intake</label>
                        <input
                          value={metaForm.intake}
                          onChange={e => setMetaForm(f => ({ ...f, intake: e.target.value }))}
                          className={inp}
                          placeholder={COUNTRIES_MAP[metaCountry]?.intake || 'e.g. Aug / Jan'}
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">💰 Avg Cost</label>
                        <input
                          value={metaForm.avgCost}
                          onChange={e => setMetaForm(f => ({ ...f, avgCost: e.target.value }))}
                          className={inp}
                          placeholder={COUNTRIES_MAP[metaCountry]?.avgCost || 'e.g. $20,000–$55,000/yr'}
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">✅ Visa Rate</label>
                        <input
                          value={metaForm.visaRate}
                          onChange={e => setMetaForm(f => ({ ...f, visaRate: e.target.value }))}
                          className={inp}
                          placeholder={COUNTRIES_MAP[metaCountry]?.visaRate || 'e.g. 94%'}
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">🏛️ Universities</label>
                        <input
                          value={metaForm.unis}
                          onChange={e => setMetaForm(f => ({ ...f, unis: e.target.value }))}
                          className={inp}
                          placeholder={COUNTRIES_MAP[metaCountry]?.unis || 'e.g. 4,000+'}
                        />
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="mb-4">
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Hero Tagline</label>
                      <input
                        value={metaForm.tagline}
                        onChange={e => setMetaForm(f => ({ ...f, tagline: e.target.value }))}
                        className={inp}
                        placeholder={COUNTRIES_MAP[metaCountry]?.tagline || 'Short hero tagline…'}
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Page Description</label>
                      <textarea
                        value={metaForm.description}
                        onChange={e => setMetaForm(f => ({ ...f, description: e.target.value }))}
                        rows={3}
                        className={`${inp} resize-none`}
                        placeholder={COUNTRIES_MAP[metaCountry]?.description?.slice(0, 80) + '…' || 'Short country description shown on destination cards…'}
                      />
                    </div>

                    {/* Images + color */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Hero Image URL</label>
                        <input
                          value={metaForm.heroImage}
                          onChange={e => setMetaForm(f => ({ ...f, heroImage: e.target.value }))}
                          className={inp}
                          placeholder="https://images.unsplash.com/…"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Campus Image URL</label>
                        <input
                          value={metaForm.campusImage}
                          onChange={e => setMetaForm(f => ({ ...f, campusImage: e.target.value }))}
                          className={inp}
                          placeholder="https://images.unsplash.com/…"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Accent Color (hex)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={metaForm.color || COUNTRIES_MAP[metaCountry]?.color || BLUE}
                          onChange={e => setMetaForm(f => ({ ...f, color: e.target.value }))}
                          className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                        />
                        <input
                          value={metaForm.color}
                          onChange={e => setMetaForm(f => ({ ...f, color: e.target.value }))}
                          className={`${inp} flex-1`}
                          placeholder={COUNTRIES_MAP[metaCountry]?.color || '#246DFF'}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => { void saveCountryMeta(); }}
                        disabled={metaSaving}
                        className={`${amberBtn} px-8 disabled:opacity-50`}
                        style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}
                      >
                        {metaSaving ? 'Saving…' : 'Save Stat Blocks →'}
                      </button>
                      <a
                        href={`/destinations/${metaCountry}/why-study`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={ghostBtn}
                      >
                        Preview page ↗
                      </a>
                      <button
                        onClick={resetCountryMeta}
                        className={ghostBtn}
                      >
                        Reset to defaults
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ ROUTES ══ */}
        {tab === 'routes' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">Route Manager</h2>
            <p className="font-jakarta text-sm text-slate-500 mb-6">301/302 redirects — apply instantly, no redeploy.</p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
              <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">Add Redirect</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  ['From Path *', 'from', '/old-path',            'text'],
                  ['To Path / URL *','to','/new-path or https://','text'],
                ].map(([lbl,key,ph,type]) => (
                  <div key={key as string}>
                    <label className="block font-jakarta text-xs font-semibold text-slate-500 mb-1.5">{lbl as string}</label>
                    <input type={type as string} value={(nr as any)[key as string]}
                      onChange={e => setNr(p => ({ ...p, [key as string]: e.target.value }))}
                      className={inp} placeholder={ph as string} />
                  </div>
                ))}
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-500 mb-1.5">Type</label>
                  <select value={nr.type} onChange={e => setNr(p => ({ ...p, type: Number(e.target.value) as 301|302 }))} className={`${inp} cursor-pointer`}>
                    <option value={301}>301 Permanent</option>
                    <option value={302}>302 Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-500 mb-1.5">Note</label>
                  <input value={nr.note} onChange={e => setNr(p => ({ ...p, note: e.target.value }))} className={inp} placeholder="Optional note" />
                </div>
              </div>
              <button onClick={addRedirect} disabled={redirectsSaving} className={`${blueBtn} mt-4 px-6 ${redirectsSaving ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ background: BLUE }}>
                {redirectsSaving ? 'Saving…' : 'Add Redirect'}
              </button>
            </div>
            {redirects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <p className="font-jakarta text-slate-400 text-sm">No redirects configured.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {redirects.map((r, i) => (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-100 shadow-card px-5 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-jakarta text-xs font-bold px-2 py-0.5 rounded ${r.type === 301 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{r.type}</span>
                      <code className="font-mono text-xs text-slate-700 truncate">{r.from}</code>
                      <span className="text-slate-400 flex-shrink-0">→</span>
                      <code className="font-mono text-xs text-primary-600 truncate">{r.to}</code>
                      {r.note && <span className="font-jakarta text-xs text-slate-400 truncate hidden md:block">{r.note}</span>}
                    </div>
                    <button onClick={() => saveRedirects(redirects.filter((_,ri) => ri !== i))} disabled={redirectsSaving}
                      className={`font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors flex-shrink-0 ${redirectsSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {redirectsSaving ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ COUNTRIES ══ */}
        {tab === 'countries' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">Country Pages</h2>
            <p className="font-jakarta text-sm text-slate-500 mb-6">Pre-built with 2026 content. Create a dynamic page with matching slug to override any section.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {code:'usa',name:'USA',flag:'🇺🇸'},
                {code:'uk',name:'UK',flag:'🇬🇧'},
                {code:'australia',name:'Australia',flag:'🇦🇺'},
                {code:'canada',name:'Canada',flag:'🇨🇦'},
                {code:'new-zealand',name:'New Zealand',flag:'🇳🇿'},
                {code:'ireland',name:'Ireland',flag:'🇮🇪'},
                {code:'europe',name:'Europe',flag:'🇪🇺'},
                {code:'uae',name:'UAE',flag:'🇦🇪'},
                {code:'japan',name:'Japan',flag:'🇯🇵'},
                {code:'south-korea',name:'South Korea',flag:'🇰🇷'},
                {code:'singapore',name:'Singapore',flag:'🇸🇬'},
                {code:'russia',name:'Russia',flag:'🇷🇺'},
              ].map(c => (
                <div key={c.code} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{c.flag}</span>
                    <div>
                      <div className="font-jakarta font-bold text-slate-800">{c.name}</div>
                      <div className="font-jakarta text-xs text-slate-400">/destinations/{c.code}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/destinations/${c.code}`} target="_blank" className={`${ghostBtn} text-xs flex-1 justify-center`}>Preview ↗</Link>
                    <button onClick={() => { setTab('create'); setNp(p => ({ ...p, slug:`destinations/${c.code}/2026-update`, title:`${c.name} 2026 Update` })); }}
                      className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">Update</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ HOMEPAGE CONTENT ══ */}
        {tab === 'homepage' && (
          <div className="space-y-10">
            <div>
              <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-1">Homepage Content</h2>
              <p className="font-jakarta text-sm text-slate-500 mb-8">Edit Stats, Services and Process Steps. Changes save to Cloudflare KV and go live immediately — no redeployment needed.</p>

              {/* ── Stats Block ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-800">Stats Block</h3>
                    <p className="font-jakarta text-xs text-slate-400 mt-0.5">
                      The 6 stat cards shown below the hero section. Edit the number (e.g. "10,000+") and label for each card.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSiteStats(p => [...p, { num: '0+', label: 'New Stat' }])}
                      className={`${ghostBtn} text-xs`}>+ Add Stat</button>
                    <button onClick={saveStats} disabled={statsBusy}
                      className={`${blueBtn} text-xs disabled:opacity-50`}
                      style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                      {statsBusy ? 'Saving…' : 'Save Stats →'}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {siteStats.map((s, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50/60">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-jakarta text-xs font-bold text-slate-400 w-5 text-center">{i + 1}</span>
                        <button
                          onClick={() => setSiteStats(p => p.filter((_, j) => j !== i))}
                          className="ml-auto font-jakarta text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                          ✕
                        </button>
                      </div>
                      <div className="mb-2">
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Number / Value</label>
                        <input
                          value={s.num}
                          onChange={e => setSiteStats(p => p.map((st, j) => j === i ? { ...st, num: e.target.value } : st))}
                          className={`${inp} font-bold text-center text-lg`}
                          placeholder="10,000+"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Label</label>
                        <input
                          value={s.label}
                          onChange={e => setSiteStats(p => p.map((st, j) => j === i ? { ...st, label: e.target.value } : st))}
                          className={inp}
                          placeholder="Students Placed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {siteStats.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="font-jakarta text-sm">No stats yet. Click "+ Add Stat" to add one.</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => { setSiteStats(DEFAULT_STATS_FORM); flash('Reset to defaults — click Save to apply.', 'info'); }}
                    className={`${ghostBtn} text-xs`}>
                    Reset to Defaults
                  </button>
                  <button onClick={saveStats} disabled={statsBusy}
                    className={`${blueBtn} disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                    {statsBusy ? 'Saving…' : 'Save Stats →'}
                  </button>
                </div>
              </div>

              {/* ── Services ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-800">Services Section</h3>
                    <p className="font-jakarta text-xs text-slate-400 mt-0.5">Displayed as cards on the homepage. Keep descriptions under 160 characters for best layout.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addService}
                      className={`${ghostBtn} text-xs`}>+ Add Card</button>
                    <button onClick={() => saveHomepageContent('services', services)} disabled={hpBusy}
                      className={`${amberBtn} text-xs disabled:opacity-50`}
                      style={{ background: `linear-gradient(135deg,${AMBER},#B45309)` }}>
                      {hpBusy ? 'Saving…' : 'Save Services →'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {services.map((s, i) => (
                    <div key={s.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/60">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-jakarta text-xs font-bold text-slate-400 w-5 text-center">{i + 1}</span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[56px_1fr] gap-2">
                          {/* Icon */}
                          <div>
                            <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Icon</label>
                            <input
                              value={s.icon}
                              onChange={e => updateService(i, 'icon', e.target.value)}
                              className={`${inp} text-center text-xl`}
                              maxLength={4}
                              placeholder="🎓"
                            />
                          </div>
                          {/* Title */}
                          <div>
                            <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Title</label>
                            <input
                              value={s.title}
                              onChange={e => updateService(i, 'title', e.target.value)}
                              className={inp}
                              placeholder="Service title"
                            />
                          </div>
                        </div>
                        <button onClick={() => removeService(i)}
                          className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 flex-shrink-0">
                          ✕
                        </button>
                      </div>
                      {/* Description */}
                      <div className="ml-7">
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</label>
                        <textarea
                          value={s.desc}
                          onChange={e => updateService(i, 'desc', e.target.value)}
                          rows={3}
                          className={`${inp} resize-none`}
                          placeholder="Describe the service in 1–2 sentences."
                        />
                        <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{s.desc.length} chars</p>
                      </div>
                    </div>
                  ))}
                </div>

                {services.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="font-jakarta text-sm">No services yet. Click "+ Add Card" to begin.</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button onClick={() => saveHomepageContent('services', services)} disabled={hpBusy}
                    className={`${amberBtn} disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${AMBER},#B45309)` }}>
                    {hpBusy ? 'Saving…' : 'Save Services →'}
                  </button>
                </div>
              </div>

              {/* ── Process Steps ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-800">Process Steps ("How It Works")</h3>
                    <p className="font-jakarta text-xs text-slate-400 mt-0.5">Displayed as glassmorphic step cards on the deep-blue section. Steps are auto-numbered.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addStep}
                      className={`${ghostBtn} text-xs`}>+ Add Step</button>
                    <button onClick={() => saveHomepageContent('processSteps', processSteps)} disabled={hpBusy}
                      className={`${blueBtn} text-xs disabled:opacity-50`}
                      style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                      {hpBusy ? 'Saving…' : 'Save Steps →'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {processSteps.map((s, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50/60">
                      <div className="flex items-center gap-2 mb-3">
                        {/* Step badge */}
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-jakarta font-black text-xs text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                          {s.step}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[56px_1fr] gap-2">
                          {/* Icon */}
                          <div>
                            <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Icon</label>
                            <input
                              value={s.icon}
                              onChange={e => updateStep(i, 'icon', e.target.value)}
                              className={`${inp} text-center text-xl`}
                              maxLength={4}
                              placeholder="✈️"
                            />
                          </div>
                          {/* Title */}
                          <div>
                            <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Step Title</label>
                            <input
                              value={s.title}
                              onChange={e => updateStep(i, 'title', e.target.value)}
                              className={inp}
                              placeholder="Step title"
                            />
                          </div>
                        </div>
                        <button onClick={() => removeStep(i)}
                          className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 flex-shrink-0">
                          ✕
                        </button>
                      </div>
                      {/* Description */}
                      <div className="ml-9">
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</label>
                        <textarea
                          value={s.desc}
                          onChange={e => updateStep(i, 'desc', e.target.value)}
                          rows={3}
                          className={`${inp} resize-none`}
                          placeholder="Describe what happens in this step."
                        />
                        <p className="font-jakarta text-[10px] text-slate-400 mt-1 text-right">{s.desc.length} chars</p>
                      </div>
                    </div>
                  ))}
                </div>

                {processSteps.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="font-jakarta text-sm">No steps yet. Click "+ Add Step" to begin.</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button onClick={() => saveHomepageContent('processSteps', processSteps)} disabled={hpBusy}
                    className={`${blueBtn} disabled:opacity-50`}
                    style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                    {hpBusy ? 'Saving…' : 'Save Steps →'}
                  </button>
                </div>
              </div>

              {/* Reset to defaults */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <p className="font-jakarta text-sm font-semibold text-amber-800 mb-1">Reset to Defaults</p>
                  <p className="font-jakarta text-xs text-amber-700 leading-relaxed mb-3">
                    This will overwrite your saved services and process steps in KV with the original hardcoded defaults. Use this if you want to start fresh.
                  </p>
                  <button
                    onClick={async () => {
                      if (!confirm('Reset services and process steps to defaults? This cannot be undone.')) return;
                      setServices(DEFAULT_SERVICES);
                      setProcessSteps(DEFAULT_PROCESS_STEPS);
                      await Promise.all([
                        saveHomepageContent('services', DEFAULT_SERVICES),
                        saveHomepageContent('processSteps', DEFAULT_PROCESS_STEPS),
                      ]);
                    }}
                    className="font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-100 transition-colors">
                    Reset to Defaults
                  </button>
                </div>
              </div>

              {/* ── University Marquee Settings ── */}
              <div className="mt-10 bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-800">University Marquee</h3>
                    <p className="font-jakarta text-xs text-slate-400 mt-0.5">
                      Controls the scrolling logo strip on the homepage. Leave university list empty to use the 25 built-in logos.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href="/" target="_blank" rel="noopener noreferrer"
                      className={`${ghostBtn} text-xs`}>Preview ↗</a>
                    <button onClick={saveMarqueeSettings} disabled={marqueeSaving}
                      className={`${blueBtn} text-xs disabled:opacity-50`}
                      style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                      {marqueeSaving ? 'Saving…' : 'Save Marquee →'}
                    </button>
                  </div>
                </div>

                {marqueeLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-jakarta text-xs text-slate-400 mt-2">Loading marquee settings…</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Text fields */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Section Heading</label>
                        <input
                          value={marqueeForm.heading}
                          onChange={e => setMarqueeForm(f => ({ ...f, heading: e.target.value }))}
                          className={inp}
                          placeholder="Students Placed in Top Universities"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Sub-heading</label>
                        <input
                          value={marqueeForm.subheading}
                          onChange={e => setMarqueeForm(f => ({ ...f, subheading: e.target.value }))}
                          className={inp}
                          placeholder="Join 10,000+ students…"
                        />
                      </div>
                    </div>

                    {/* Speed controls */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Row 1 Speed (seconds) — lower = faster
                        </label>
                        <input
                          type="number" min={10} max={120} step={1}
                          value={marqueeForm.speedRow1}
                          onChange={e => setMarqueeForm(f => ({ ...f, speedRow1: Number(e.target.value) }))}
                          className={inp}
                        />
                        <p className="font-jakarta text-[10px] text-slate-400 mt-1">Forward scroll. Default: 38s</p>
                      </div>
                      <div>
                        <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Row 2 Speed (seconds) — lower = faster
                        </label>
                        <input
                          type="number" min={10} max={120} step={1}
                          value={marqueeForm.speedRow2}
                          onChange={e => setMarqueeForm(f => ({ ...f, speedRow2: Number(e.target.value) }))}
                          className={inp}
                        />
                        <p className="font-jakarta text-[10px] text-slate-400 mt-1">Reverse scroll. Default: 44s</p>
                      </div>
                    </div>

                    {/* Custom university list */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                            Custom University List
                          </label>
                          <p className="font-jakarta text-[10px] text-slate-400 mt-0.5">
                            {marqueeForm.unis.length === 0
                              ? 'Using built-in 25-university defaults. Add entries below to override.'
                              : `${marqueeForm.unis.length} custom ${marqueeForm.unis.length === 1 ? 'entry' : 'entries'} — overrides the defaults.`}
                          </p>
                        </div>
                        <button
                          onClick={() => setMarqueeForm(f => ({ ...f, unis: [...f.unis, { name: '', src: '', country: '' }] }))}
                          className={`${ghostBtn} text-xs`}>+ Add University</button>
                      </div>

                      {marqueeForm.unis.length > 0 && (
                        <div className="space-y-3">
                          {marqueeForm.unis.map((u, i) => (
                            <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50/60">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-jakarta text-xs font-bold text-slate-400 w-5 text-center">{i + 1}</span>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">University Name</label>
                                    <input
                                      value={u.name}
                                      onChange={e => setMarqueeForm(f => ({
                                        ...f, unis: f.unis.map((x, j) => j === i ? { ...x, name: e.target.value } : x)
                                      }))}
                                      className={inp}
                                      placeholder="Harvard University"
                                    />
                                  </div>
                                  <div>
                                    <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Logo path (e.g. /logos/harvard.png)</label>
                                    <input
                                      value={u.src}
                                      onChange={e => setMarqueeForm(f => ({
                                        ...f, unis: f.unis.map((x, j) => j === i ? { ...x, src: e.target.value } : x)
                                      }))}
                                      className={inp}
                                      placeholder="/logos/harvard-university.png"
                                    />
                                  </div>
                                  <div>
                                    <label className="block font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Country</label>
                                    <input
                                      value={u.country}
                                      onChange={e => setMarqueeForm(f => ({
                                        ...f, unis: f.unis.map((x, j) => j === i ? { ...x, country: e.target.value } : x)
                                      }))}
                                      className={inp}
                                      placeholder="USA"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => setMarqueeForm(f => ({ ...f, unis: f.unis.filter((_, j) => j !== i) }))}
                                  className="font-jakarta text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 flex-shrink-0">
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {marqueeForm.unis.length > 0 && (
                        <button
                          onClick={() => { if (confirm('Clear custom list and revert to built-in defaults?')) setMarqueeForm(f => ({ ...f, unis: [] })); }}
                          className="mt-3 font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                          Clear custom list (use defaults)
                        </button>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button onClick={saveMarqueeSettings} disabled={marqueeSaving}
                        className={`${blueBtn} disabled:opacity-50`}
                        style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                        {marqueeSaving ? 'Saving…' : 'Save Marquee Settings →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ ENQUIRIES / CRM ══ */}
        {tab === 'enquiries' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">Enquiries ({leads.length})</h2>
                <p className="font-jakarta text-xs text-slate-400 mt-0.5">Leads from Quick Enquiry and Contact forms</p>
              </div>
              <button onClick={fetchAll} disabled={leadsBusy}
                className={`${ghostBtn} text-xs`}>
                {leadsBusy ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            {/* Summary badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {([
                { label:'New',       status:'new',       color:'#246DFF', bg:'#EBF4FF'  },
                { label:'Contacted', status:'contacted', color:'#D97706', bg:'#FFFBEB'  },
                { label:'Closed',    status:'closed',    color:'#059669', bg:'#ECFDF5'  },
              ] as { label:string; status:Lead['status']; color:string; bg:string }[]).map(s => (
                <div key={s.status} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 text-center">
                  <div className="font-jakarta font-extrabold text-2xl mb-1" style={{ color: s.color }}>
                    {leads.filter(l => l.status === s.status).length}
                  </div>
                  <div className="font-jakarta text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No enquiries yet</h3>
                <p className="font-jakarta text-xs text-slate-400">Leads from your website forms will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-jakarta font-bold text-slate-800 text-sm">{lead.name}</span>
                          <span className={`font-jakarta text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.status === 'new'       ? 'bg-blue-50  text-blue-700'  :
                            lead.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                                                         'bg-green-50 text-green-700'
                          }`}>
                            {lead.status === 'new' ? '🔵 New' : lead.status === 'contacted' ? '🟡 Contacted' : '🟢 Closed'}
                          </span>
                          {lead.source && (
                            <span className="font-jakarta text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              {lead.source}
                            </span>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-0.5 mt-1">
                          <span className="font-jakarta text-xs text-slate-500">📞 {lead.phone}</span>
                          {lead.email && <span className="font-jakarta text-xs text-slate-500 truncate">✉ {lead.email}</span>}
                          {lead.country && <span className="font-jakarta text-xs text-slate-500">🌍 {lead.country}</span>}
                          {lead.program && <span className="font-jakarta text-xs text-slate-500 truncate">🎓 {lead.program}</span>}
                        </div>
                        {lead.message && (
                          <p className="font-jakarta text-xs text-slate-400 mt-1.5 italic line-clamp-2">&quot;{lead.message}&quot;</p>
                        )}
                        <div className="font-jakarta text-[10px] text-slate-300 mt-1">
                          {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${lead.name}! This is the ILOC counselling team. We received your enquiry about studying in ${lead.country || 'abroad'}. When would be a good time for a free consultation call?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl text-white"
                          style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                          💬 WhatsApp
                        </a>
                        <select
                          value={lead.status}
                          onChange={e => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                          disabled={leadsBusy}
                          className="font-jakarta text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 text-slate-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button onClick={() => deleteLead(lead.id)}
                          disabled={leadsBusy}
                          className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ GENERAL SETTINGS ══ */}
        {tab === 'general' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-2">General Settings</h2>
            <p className="font-jakarta text-sm text-slate-500 mb-6">
              Edit company contact details. Changes save to Cloudflare KV and go live immediately — no redeploy needed.
            </p>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Phone Number</label>
                  <input
                    value={companyDetails.phone}
                    onChange={e => setCompanyDetails(p => ({ ...p, phone: e.target.value }))}
                    className={inp}
                    placeholder="+91-9158577707"
                  />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Email Address</label>
                  <input
                    type="email"
                    value={companyDetails.email}
                    onChange={e => setCompanyDetails(p => ({ ...p, email: e.target.value }))}
                    className={inp}
                    placeholder="ivyleagueoverseas@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">WhatsApp Deep-Link URL</label>
                <input
                  value={companyDetails.whatsapp}
                  onChange={e => setCompanyDetails(p => ({ ...p, whatsapp: e.target.value }))}
                  className={inp}
                  placeholder="https://wa.me/919158577707?text=..."
                />
                <p className="font-jakarta text-[10px] text-slate-400 mt-1">Full URL including pre-filled message text.</p>
              </div>

              <div>
                <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Office Address</label>
                <textarea
                  value={companyDetails.address}
                  onChange={e => setCompanyDetails(p => ({ ...p, address: e.target.value }))}
                  rows={3}
                  className={`${inp} resize-none`}
                  placeholder="1st Floor, Govind Chambers, Karve Rd..."
                />
              </div>

              <div>
                <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                  📍 Google Maps Link
                </label>
                <input
                  value={companyDetails.mapsLink}
                  onChange={e => setCompanyDetails(p => ({ ...p, mapsLink: e.target.value }))}
                  className={inp}
                  placeholder="https://share.google/..."
                />
                {companyDetails.mapsLink && (
                  <a href={companyDetails.mapsLink} target="_blank" rel="noopener noreferrer"
                    className="font-jakarta text-[11px] text-primary-600 hover:underline mt-1 inline-block">
                    Test link ↗
                  </a>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveCompanyDetails}
                  disabled={cdBusy}
                  className={`${amberBtn} px-8 disabled:opacity-50`}
                  style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}
                >
                  {cdBusy ? 'Saving…' : 'Save Company Details →'}
                </button>
                <button
                  onClick={() => setCompanyDetails({ phone: COMPANY.phone, whatsapp: COMPANY.wa, email: COMPANY.email, address: COMPANY.address, mapsLink: COMPANY.mapsLink })}
                  className={ghostBtn}
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="font-jakarta text-sm font-semibold text-blue-800 mb-1">How KV company details work</p>
                <p className="font-jakarta text-xs text-blue-700 leading-relaxed">
                  The frontend checks KV for overrides on every request. If a KV value exists it takes priority over <code className="bg-blue-100 px-1 rounded">lib/data.ts</code>. This lets you update phone numbers, addresses, and WhatsApp links instantly without a code redeploy.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ GLOBAL SETTINGS ══ */}
        {tab === 'global' && (
          <div>
            <div className="mb-6">
              <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl">Global Settings ⚙️</h2>
              <p className="font-jakarta text-sm text-slate-400 mt-1">Brand identity, hero carousel, notice banner, and social links. Saved to KV under <code className="bg-slate-100 px-1 rounded text-xs">globalSettings</code>.</p>
            </div>

            {/* Brand & Banner */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">Brand Identity</h3>

              {/* ── Hero Header CMS Controls ── */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-xl p-5 mb-4 space-y-5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg">🏠</span>
                  <h4 className="font-jakarta font-bold text-blue-800 text-xs uppercase tracking-widest">Hero Header Branding</h4>
                  <span className="ml-auto font-jakarta text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">Pre-loaded from KV</span>
                </div>

                {/* headerLogoUrl */}
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                    Header Logo URL <span className="text-slate-400 normal-case font-normal lowercase tracking-normal">(blank = built-in seal SVG)</span>
                  </label>
                  <input
                    value={gs.headerLogoUrl ?? ''}
                    onChange={e => setGs(p => ({ ...p, headerLogoUrl: e.target.value }))}
                    className={inp}
                    placeholder="https://your-cdn.com/iloc-logo.png"
                  />
                  {gs.headerLogoUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shadow">
                        <Image src={gs.headerLogoUrl} alt="Logo preview" fill className="object-contain" sizes="64px" unoptimized onError={() => {}} />
                      </div>
                      <span className="font-jakarta text-xs text-slate-400">Live logo preview</span>
                    </div>
                  )}
                  <p className="font-jakarta text-[10px] text-slate-400 mt-1">Used in both the hero header and sticky nav. Leave blank to use the pixel-perfect built-in ILOC seal.</p>
                </div>

                {/* businessNameDisplayName */}
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                    Large Business Name <span className="text-slate-400 normal-case font-normal lowercase tracking-normal">(blank = IVY LEAGUE OVERSEAS CONSULTING)</span>
                  </label>
                  <input
                    value={gs.businessNameDisplayName ?? ''}
                    onChange={e => setGs(p => ({ ...p, businessNameDisplayName: e.target.value }))}
                    className={inp}
                    placeholder="IVY LEAGUE OVERSEAS CONSULTING"
                  />
                  <p className="font-jakarta text-[10px] text-slate-400 mt-1">Displayed as a giant hero-level title with word-by-word entrance animation. All caps recommended.</p>
                </div>

                {/* headerBackgroundColor + headerVerticalPadding side by side */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                      Header Background Color
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={gs.headerBackgroundColor ?? '#2563FF'}
                        onChange={e => setGs(p => ({ ...p, headerBackgroundColor: e.target.value }))}
                        className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-1 flex-shrink-0"
                      />
                      <input
                        value={gs.headerBackgroundColor ?? '#2563FF'}
                        onChange={e => setGs(p => ({ ...p, headerBackgroundColor: e.target.value }))}
                        className={`${inp} font-mono`}
                        placeholder="#2563FF"
                        maxLength={9}
                      />
                    </div>
                    <p className="font-jakarta text-[10px] text-slate-400 mt-1">Plain solid color. Default: <code className="bg-slate-100 px-1 rounded">#2563FF</code> (vibrant brand blue)</p>
                    {(gs.headerBackgroundColor ?? '#2563FF') && (
                      <div
                        className="mt-2 h-6 rounded-lg border border-slate-200 shadow-sm"
                        style={{ backgroundColor: gs.headerBackgroundColor ?? '#2563FF' }}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                      Vertical Padding (top & bottom)
                    </label>
                    <input
                      value={gs.headerVerticalPadding ?? '72px'}
                      onChange={e => setGs(p => ({ ...p, headerVerticalPadding: e.target.value }))}
                      className={`${inp} font-mono`}
                      placeholder="72px"
                    />
                    <p className="font-jakarta text-[10px] text-slate-400 mt-1">
                      Controls the height of the hero header. Any CSS unit: <code className="bg-slate-100 px-1 rounded">72px</code>, <code className="bg-slate-100 px-1 rounded">5rem</code>, <code className="bg-slate-100 px-1 rounded">80px</code>
                    </p>
                    <input
                      type="range" min="24" max="180" step="4"
                      value={parseInt(gs.headerVerticalPadding ?? '72') || 72}
                      onChange={e => setGs(p => ({ ...p, headerVerticalPadding: `${e.target.value}px` }))}
                      className="w-full mt-2 accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between font-jakarta text-[9px] text-slate-400 mt-0.5">
                      <span>Compact (24px)</span><span>Massive (180px)</span>
                    </div>
                  </div>
                </div>

                {/* Live preview strip */}
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <span className="font-jakarta text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Live Preview</span>
                  </div>
                  <div
                    className="flex items-center gap-4 px-5"
                    style={{
                      backgroundColor: gs.headerBackgroundColor ?? '#2563FF',
                      paddingTop: Math.min(parseInt(gs.headerVerticalPadding ?? '72') || 72, 40) + 'px',
                      paddingBottom: Math.min(parseInt(gs.headerVerticalPadding ?? '72') || 72, 40) + 'px',
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-jakarta font-black text-white text-xs">LOGO</span>
                    </div>
                    <div>
                      <p className="font-jakarta text-white/60 text-[10px] tracking-widest uppercase mb-0.5">Est. 2000 · Pune, India</p>
                      <p className="font-jakarta font-black text-white text-sm leading-tight">
                        {gs.businessNameDisplayName || 'IVY LEAGUE OVERSEAS CONSULTING'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Brand Name (navbar compact)</label>
                  <input value={gs.brandName}
                    onChange={e => setGs(p => ({ ...p, brandName: e.target.value }))}
                    className={inp} placeholder={COMPANY.short} />
                  <p className="font-jakarta text-[10px] text-slate-400 mt-1">Short name in sticky nav. Default: {COMPANY.short}</p>
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">WhatsApp URL</label>
                  <input value={gs.whatsappUrl}
                    onChange={e => setGs(p => ({ ...p, whatsappUrl: e.target.value }))}
                    className={inp} placeholder="https://wa.me/91..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Global Notice Banner
                    <span className="ml-2 font-normal normal-case text-slate-400">(leave blank to hide)</span>
                  </label>
                  <input value={gs.noticeBanner}
                    onChange={e => setGs(p => ({ ...p, noticeBanner: e.target.value }))}
                    className={inp}
                    placeholder="e.g. 🎉 Canada SDS applications are open — Book your free counselling now →" />
                  {gs.noticeBanner && (
                    <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 font-jakarta text-xs text-amber-800 font-medium">
                      Preview: {gs.noticeBanner}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Hero Carousel Quick Image URLs ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm">🖼 Hero Slide Images — Quick Edit</h3>
                <button
                  onClick={saveHeroSlides}
                  disabled={heroSlideBusy}
                  className="font-jakarta text-xs font-bold text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}
                >
                  {heroSlideBusy ? 'Saving…' : '💾 Save Images'}
                </button>
              </div>
              <p className="font-jakarta text-xs text-slate-400 mb-5">
                Update the background image for each hero carousel slide. Paste any Unsplash URL or hosted image URL. Changes go live immediately.
              </p>
              <div className="space-y-4">
                {heroSlides.map((slide, si) => (
                  <div key={slide.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <label className="block font-jakarta text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                      Slide {si + 1} Image {!slide.enabled && <span className="text-slate-400 normal-case font-normal">(slide hidden)</span>}
                    </label>
                    <div className="flex gap-3 items-start">
                      <input
                        value={slide.imageUrl}
                        onChange={e => updateSlide(si, { imageUrl: e.target.value })}
                        className={`${inp} flex-1`}
                        placeholder="https://images.unsplash.com/photo-XXXXXXXXXX?q=80&w=1600&auto=format&fit=crop"
                      />
                      {slide.imageUrl && (
                        <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 relative flex-shrink-0">
                          <Image src={slide.imageUrl} alt={`Slide ${si + 1} preview`} fill className="object-cover" sizes="80px" unoptimized onError={() => {}} />
                        </div>
                      )}
                    </div>
                    <p className="font-jakarta text-[10px] text-slate-400 mt-1.5">{slide.imageAlt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Hero Carousel Full CMS Editor ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm">Hero Carousel — Full Slide Editor</h3>
                <button
                  onClick={saveHeroSlides}
                  disabled={heroSlideBusy}
                  className="font-jakarta text-xs font-bold text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#1249C4,#2563FF)' }}
                >
                  {heroSlideBusy ? 'Saving…' : '💾 Save Slides'}
                </button>
              </div>
              <p className="font-jakarta text-xs text-slate-400 mb-5">
                Edit heading, subtext, image, stats and CTAs for each of the 3 hero slides. Changes go live immediately.
              </p>

              {/* Slide tab switcher */}
              <div className="flex gap-2 mb-5 border-b border-slate-100 pb-3">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setHeroSlideEditIdx(heroSlideEditIdx === i ? null : i)}
                    className={`font-jakarta text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${heroSlideEditIdx === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                  >
                    Slide {i + 1} {!s.enabled && '(hidden)'}
                  </button>
                ))}
              </div>

              {heroSlides.map((slide, si) => heroSlideEditIdx !== si ? null : (
                <div key={slide.id} className="space-y-4 animate-fadeIn">

                  {/* Enable toggle + badge */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => updateSlide(si, { enabled: !slide.enabled })}
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${slide.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${slide.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="font-jakarta text-xs font-semibold text-slate-600">{slide.enabled ? 'Visible' : 'Hidden'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Badge Text (pill)</label>
                    <input value={slide.badge} onChange={e => updateSlide(si, { badge: e.target.value })} className={inp} placeholder="🎓 25+ Years of Trusted Expertise" />
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Heading Lines (one per line, max 3)</label>
                    {slide.headingLines.map((line, li) => (
                      <div key={li} className="flex gap-2 mb-2 items-center">
                        <button
                          onClick={() => {
                            const hl = [...slide.headingHighlight];
                            hl[li] = !hl[li];
                            updateSlide(si, { headingHighlight: hl });
                          }}
                          title="Toggle highlight colour on this line"
                          className={`flex-shrink-0 w-8 h-8 rounded-lg border text-xs font-bold transition-all ${slide.headingHighlight[li] ? 'bg-amber-400 border-amber-400 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                        >A</button>
                        <input
                          value={line}
                          onChange={e => {
                            const lines = [...slide.headingLines];
                            lines[li] = e.target.value;
                            updateSlide(si, { headingLines: lines });
                          }}
                          className={inp}
                          placeholder={`Heading line ${li + 1}`}
                        />
                      </div>
                    ))}
                    <p className="font-jakarta text-[11px] text-slate-400 mt-1">Click <strong>A</strong> to toggle amber/green highlight on that line.</p>
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Subtext Paragraph</label>
                    <textarea value={slide.subtext} onChange={e => updateSlide(si, { subtext: e.target.value })} rows={3} className={`${inp} resize-none`} placeholder="Join 10,000+ students who fulfilled…" />
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Trust Badges (comma-separated)</label>
                    <input
                      value={slide.trustBadges.join(', ')}
                      onChange={e => updateSlide(si, { trustBadges: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className={inp}
                      placeholder="97% Visa Approval, ₹0 Hidden Fees, Free Counselling"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Primary CTA Label</label>
                      <input value={slide.ctaPrimary.label} onChange={e => updateSlide(si, { ctaPrimary: { ...slide.ctaPrimary, label: e.target.value } })} className={inp} placeholder="Book a Free Consultation →" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Primary CTA Action</label>
                      <select value={slide.ctaPrimary.action} onChange={e => updateSlide(si, { ctaPrimary: { ...slide.ctaPrimary, action: e.target.value as HeroSlide['ctaPrimary']['action'] } })} className={inp}>
                        <option value="link">Link to page</option>
                        <option value="whatsapp">Open WhatsApp chat</option>
                        <option value="demo-modal">Open IELTS Demo Modal</option>
                        <option value="phone">Phone call</option>
                      </select>
                    </div>
                  </div>
                  {(slide.ctaPrimary.action === 'link' || slide.ctaPrimary.action === 'phone') && (
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Primary CTA URL / href</label>
                      <input value={slide.ctaPrimary.href ?? ''} onChange={e => updateSlide(si, { ctaPrimary: { ...slide.ctaPrimary, href: e.target.value } })} className={inp} placeholder="/contact or tel:+919158577707" />
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Secondary CTA Label</label>
                      <input value={slide.ctaSecondary.label} onChange={e => updateSlide(si, { ctaSecondary: { ...slide.ctaSecondary, label: e.target.value } })} className={inp} placeholder="💬 Chat on WhatsApp" />
                    </div>
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Secondary CTA Action</label>
                      <select value={slide.ctaSecondary.action} onChange={e => updateSlide(si, { ctaSecondary: { ...slide.ctaSecondary, action: e.target.value as HeroSlide['ctaSecondary']['action'] } })} className={inp}>
                        <option value="link">Link to page</option>
                        <option value="whatsapp">Open WhatsApp chat</option>
                        <option value="demo-modal">Open IELTS Demo Modal</option>
                        <option value="phone">Phone call</option>
                      </select>
                    </div>
                  </div>
                  {(slide.ctaSecondary.action === 'link' || slide.ctaSecondary.action === 'phone') && (
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Secondary CTA URL / href</label>
                      <input value={slide.ctaSecondary.href ?? ''} onChange={e => updateSlide(si, { ctaSecondary: { ...slide.ctaSecondary, href: e.target.value } })} className={inp} placeholder="/about or tel:+919158577707" />
                    </div>
                  )}

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Slide Image URL</label>
                    <div className="flex gap-3 items-start">
                      <input value={slide.imageUrl} onChange={e => updateSlide(si, { imageUrl: e.target.value })} className={`${inp} flex-1`} placeholder="https://images.unsplash.com/…" />
                      {slide.imageUrl && (
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-200 relative flex-shrink-0">
                          <Image src={slide.imageUrl} alt="preview" fill className="object-cover" sizes="64px" unoptimized onError={() => {}} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Image Alt Text</label>
                    <input value={slide.imageAlt} onChange={e => updateSlide(si, { imageAlt: e.target.value })} className={inp} placeholder="Students celebrating admission" />
                  </div>

                  {/* Stat chips */}
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Floating Stat Chips (3)</label>
                    <div className="space-y-2">
                      {slide.stats.map((stat, sti) => (
                        <div key={sti} className="flex gap-2 items-center">
                          <input value={stat.num} onChange={e => { const s=[...slide.stats]; s[sti]={...s[sti],num:e.target.value}; updateSlide(si,{stats:s}); }} className={`${inp} w-28`} placeholder="10,000+" />
                          <input value={stat.label} onChange={e => { const s=[...slide.stats]; s[sti]={...s[sti],label:e.target.value}; updateSlide(si,{stats:s}); }} className={`${inp} flex-1`} placeholder="Students Placed" />
                          <input type="color" value={stat.color} onChange={e => { const s=[...slide.stats]; s[sti]={...s[sti],color:e.target.value}; updateSlide(si,{stats:s}); }} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={saveHeroSlides} disabled={heroSlideBusy}
                      className="font-jakarta text-xs font-bold text-white px-6 py-2.5 rounded-xl disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg,#1249C4,#2563FF)' }}>
                      {heroSlideBusy ? 'Saving…' : '💾 Save All Slides'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">Social Media Links</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">LinkedIn URL</label>
                  <input value={gs.linkedIn}
                    onChange={e => setGs(p => ({ ...p, linkedIn: e.target.value }))}
                    className={inp} placeholder="https://linkedin.com/company/..." />
                </div>
                <div>
                  <label className="block font-jakarta text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Instagram URL</label>
                  <input value={gs.instagram}
                    onChange={e => setGs(p => ({ ...p, instagram: e.target.value }))}
                    className={inp} placeholder="https://instagram.com/..." />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={saveGlobalSettings} disabled={gsBusy}
                className={`${amberBtn} px-8 disabled:opacity-50`}
                style={{ background: `linear-gradient(135deg,${AMBER},#F59E0B)` }}>
                {gsBusy ? 'Saving…' : 'Save Global Settings →'}
              </button>
              <button onClick={() => setGs(defaultGlobalSettings())} className={ghostBtn}>
                Reset to Defaults
              </button>
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚡</span>
              <div>
                <p className="font-jakarta text-sm font-semibold text-blue-800 mb-1">How Global Settings propagate</p>
                <p className="font-jakarta text-xs text-blue-700 leading-relaxed">
                  Saved to KV key <code className="bg-blue-100 px-1 rounded">globalSettings</code>. The homepage Server Component reads this on every request and passes hero images / brand name / notice banner to the relevant components. Propagation is near-instant on the next page visit, subject to the 1-hour CDN edge cache window.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ SETTINGS (Media / Images) ══ */}
        {tab === 'settings' && (
          <div>
            <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-6">Settings</h2>

            {/* Hero image manager */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-1">Hero Rotating Images</h3>
              <p className="font-jakarta text-xs text-slate-400 mb-4">Paste Unsplash or any image URLs. Changes go live immediately on the homepage.</p>
              <div className="space-y-3 mb-4">
                {heroUrls.map((url, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-jakarta text-xs font-bold text-slate-400 w-4 mt-3 flex-shrink-0">{i+1}</span>
                    <div className="flex-1">
                      <input
                        value={url}
                        onChange={e => { const a = [...heroUrls]; a[i] = e.target.value; setHeroUrls(a); }}
                        className={inp}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    {url && (
                      <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative">
                        <Image src={url} alt={`Hero ${i+1}`} fill className="object-cover" sizes="56px" unoptimized />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={saveHeroImages} disabled={busy}
                className={`${blueBtn} disabled:opacity-50`}
                style={{ background: `linear-gradient(135deg,${BLUE},#246DFF)` }}>
                {busy ? 'Saving…' : 'Save Hero Images →'}
              </button>
            </div>

            {/* Country background image manager */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-5">
              <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-1">Country Card & Hero Images</h3>
              <p className="font-jakarta text-xs text-slate-400 mb-4">Override the background campus photo for each destination card and country hero. Paste any Unsplash URL. Leave blank to use the default.</p>
              <div className="space-y-3 mb-4">
                {[
                  { code:'usa',         name:'USA',          flag:'🇺🇸' },
                  { code:'uk',          name:'UK',           flag:'🇬🇧' },
                  { code:'australia',   name:'Australia',    flag:'🇦🇺' },
                  { code:'canada',      name:'Canada',       flag:'🇨🇦' },
                  { code:'new-zealand', name:'New Zealand',  flag:'🇳🇿' },
                  { code:'ireland',     name:'Ireland',      flag:'🇮🇪' },
                  { code:'europe',      name:'Europe',       flag:'🇪🇺' },
                  { code:'uae',         name:'UAE',          flag:'🇦🇪' },
                  { code:'japan',       name:'Japan',        flag:'🇯🇵' },
                  { code:'south-korea', name:'South Korea',  flag:'🇰🇷' },
                  { code:'singapore',   name:'Singapore',    flag:'🇸🇬' },
                  { code:'russia',      name:'Russia',       flag:'🇷🇺' },
                ].map(c => (
                  <div key={c.code} className="flex gap-3 items-center">
                    <span className="text-xl w-7 flex-shrink-0">{c.flag}</span>
                    <span className="font-jakarta text-xs font-semibold text-slate-600 w-24 flex-shrink-0">{c.name}</span>
                    <div className="flex-1">
                      <input
                        value={countryImgs[c.code] || ''}
                        onChange={e => setCountryImgs(prev => ({ ...prev, [c.code]: e.target.value }))}
                        className={inp}
                        placeholder={`https://images.unsplash.com/... (leave blank for default)`}
                      />
                    </div>
                    {countryImgs[c.code] && (
                      <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative">
                        <Image src={countryImgs[c.code]} alt={c.name} fill className="object-cover" sizes="56px" unoptimized />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={saveCountryImages} disabled={busy}
                className={`${amberBtn} disabled:opacity-50`}
                style={{ background: `linear-gradient(135deg,${AMBER},#B45309)` }}>
                {busy ? 'Saving…' : 'Save Country Images →'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">System Info</h3>
                <dl className="space-y-3 font-jakarta text-sm">
                  {[['Total pages',pages.length.toString()],['Live pages',pages.filter(p=>p.published).length.toString()],['Total events',events.length.toString()],['Live events',events.filter(e=>e.published).length.toString()],['Active redirects',redirects.filter(r=>r.active).length.toString()],['Runtime','Cloudflare KV Edge']].map(([k,v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="font-semibold text-slate-700">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-3">Production Deployment</h3>
                <div className="space-y-2 font-jakarta text-xs text-slate-500 leading-relaxed">
                  <p><strong className="text-slate-700">1.</strong> Run <code className="bg-slate-100 px-1 rounded">npm run cf-build</code> to build for Cloudflare Pages.</p>
                  <p><strong className="text-slate-700">2.</strong> Set <code className="bg-slate-100 px-1 rounded">ADMIN_PASSWORD</code> in Cloudflare Pages → Settings.</p>
                  <p><strong className="text-slate-700">3.</strong> Bind KV namespace <code className="bg-slate-100 px-1 rounded">CONTENT_KV</code> in your Pages project settings.</p>
                  <p><strong className="text-slate-700">4.</strong> Point domain via Spaceship DNS → Cloudflare nameservers.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {tab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-jakarta font-extrabold text-slate-800 text-2xl mb-1">Change History 🕒</h2>
                <p className="font-jakarta text-sm text-slate-500">Every save is logged. Restore any item to its previous state.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchAuditLog} disabled={auditLoading}
                  className={`${ghostBtn} disabled:opacity-50`}>
                  {auditLoading ? 'Loading…' : '↻ Refresh'}
                </button>
                <button onClick={clearHistory}
                  className="font-jakarta text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  🗑 Clear All
                </button>
              </div>
            </div>

            {auditLoading ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <div className="font-jakarta text-slate-400">Loading history…</div>
              </div>
            ) : auditLog.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <div className="text-5xl mb-4">🕒</div>
                <h3 className="font-jakarta font-bold text-slate-700 mb-2">No history yet</h3>
                <p className="font-jakarta text-sm text-slate-400">Changes to events, news, and content will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditLog.map(entry => {
                  const d = new Date(entry.timestamp);
                  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                  const entityColors: Record<string, string> = {
                    news: '#246DFF', event: '#059669', testimonials: '#7C3AED',
                    services: '#D97706', processSteps: '#DC2626', companyDetails: '#64748B', globalSettings: '#64748B',
                  };
                  const color = entityColors[entry.entity] || '#246DFF';
                  const isDeleted = entry.action.toLowerCase().includes('deleted');
                  const isDraft   = !entry.published;
                  const canRestore = !!entry.before && !isDeleted;

                  return (
                    <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
                      <div className="flex items-start gap-4 p-5">
                        <div className="w-1.5 self-stretch rounded-full flex-shrink-0" style={{ background: color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-jakarta font-semibold text-sm text-slate-800">{entry.action}</span>
                                {isDraft && (
                                  <span className="font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">DRAFT</span>
                                )}
                                {isDeleted && (
                                  <span className="font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">DELETED</span>
                                )}
                                {entry.published && !isDeleted && (
                                  <span className="font-jakarta text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">PUBLISHED</span>
                                )}
                              </div>
                              <div className="font-jakarta text-xs text-slate-500">
                                <span className="font-medium text-slate-600">{entry.entityName}</span>
                                <span className="mx-1.5 text-slate-300">·</span>
                                <span className="capitalize text-slate-400">{entry.entity}</span>
                                <span className="mx-1.5 text-slate-300">·</span>
                                <span>{dateStr} at {timeStr}</span>
                              </div>
                            </div>
                            {canRestore && (
                              <button
                                onClick={() => restoreSnapshot(entry)}
                                disabled={auditRestoring === entry.id}
                                className={`font-jakarta text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50 flex-shrink-0`}>
                                {auditRestoring === entry.id ? 'Restoring…' : '↩ Restore'}
                              </button>
                            )}
                          </div>

                          {/* Before/After diff summary */}
                          {(entry.before !== null || entry.after !== null) && (
                            <details className="mt-3">
                              <summary className="font-jakarta text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors select-none">
                                View snapshot →
                              </summary>
                              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                                {entry.before !== null && (
                                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                                    <div className="font-jakarta text-[10px] font-bold text-red-400 uppercase tracking-wide mb-1.5">Before</div>
                                    <pre className="font-mono text-[10px] text-red-700 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                                      {JSON.stringify(entry.before, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {entry.after !== null && (
                                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                    <div className="font-jakarta text-[10px] font-bold text-green-500 uppercase tracking-wide mb-1.5">After</div>
                                    <pre className="font-mono text-[10px] text-green-700 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                                      {JSON.stringify(entry.after, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[700] font-jakarta font-semibold text-sm px-5 py-3 rounded-xl shadow-2xl text-white flex items-center gap-2.5 animate-[slideUp_0.25s_ease-out]"
          style={{
            background: toastType === 'error'
              ? 'linear-gradient(135deg,#DC2626,#B91C1C)'
              : toastType === 'info'
              ? `linear-gradient(135deg,${BLUE},#246DFF)`
              : 'linear-gradient(135deg,#059669,#047857)',
          }}>
          <span className="text-base leading-none">
            {toastType === 'error' ? '✕' : toastType === 'info' ? 'ℹ' : '✓'}
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token,    setToken]    = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('iloc_admin_token'));
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const logout = () => { localStorage.removeItem('iloc_admin_token'); setToken(null); };

  if (!token) return <LoginScreen onLogin={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
