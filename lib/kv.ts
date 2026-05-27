/**
 * Cloudflare KV wrapper — falls back to in-memory store in local dev
 * KV Namespace binding expected: CONTENT_KV
 */

import type { CompanyDetails, DynamicPage, GlobalSettings, Lead, NewsItem, RedirectRule, SiteEvent, SiteMedia } from './types';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

// Minimal type shim — replaced by the real Cloudflare KVNamespace at runtime
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

// ── In-memory fallback for local dev ─────────────────────────────────────
const DEV_STORE = new Map<string, string>();

function getKV(): KVNamespace | null {
  try {
    // Use the official @cloudflare/next-on-pages v1.x API to access bindings.
    // getOptionalRequestContext() returns undefined outside a Worker request
    // (e.g. during Next.js local dev), so we fall through to DEV_STORE safely.
    const ctx = getOptionalRequestContext();
    const kv = ctx?.env?.CONTENT_KV;
    if (kv) return kv as unknown as KVNamespace;
    return null;
  } catch {
    return null;
  }
}

async function kvGet<T>(key: string): Promise<T | null> {
  const kv = getKV();
  try {
    const raw = kv ? await kv.get(key) : DEV_STORE.get(key) ?? null;
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function kvPut(key: string, value: unknown): Promise<void> {
  const kv = getKV();
  const serialized = JSON.stringify(value);
  if (kv) {
    await kv.put(key, serialized);
  } else {
    DEV_STORE.set(key, serialized);
  }
}

async function kvDelete(key: string): Promise<void> {
  const kv = getKV();
  if (kv) await kv.delete(key);
  else DEV_STORE.delete(key);
}

// ── Page CRUD ─────────────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<DynamicPage | null> {
  return kvGet<DynamicPage>(`page:${slug}`);
}

export async function getAllPageSlugs(): Promise<string[]> {
  return (await kvGet<string[]>('pages:index')) ?? [];
}

export async function getAllPages(): Promise<DynamicPage[]> {
  const slugs = await getAllPageSlugs();
  const pages = await Promise.all(slugs.map(s => getPage(s)));
  return pages.filter(Boolean) as DynamicPage[];
}

export async function upsertPage(page: DynamicPage): Promise<void> {
  // Update index
  const slugs = await getAllPageSlugs();
  if (!slugs.includes(page.slug)) {
    await kvPut('pages:index', [...slugs, page.slug]);
  }
  await kvPut(`page:${page.slug}`, page);
}

export async function deletePage(slug: string): Promise<void> {
  const slugs = await getAllPageSlugs();
  await kvPut('pages:index', slugs.filter(s => s !== slug));
  await kvDelete(`page:${slug}`);
}

// ── Redirect rules ────────────────────────────────────────────────────────

export async function getRedirects(): Promise<RedirectRule[]> {
  return (await kvGet<RedirectRule[]>('redirects')) ?? [];
}

export async function setRedirects(rules: RedirectRule[]): Promise<void> {
  await kvPut('redirects', rules);
}

export async function resolveRedirect(path: string): Promise<RedirectRule | null> {
  const rules = await getRedirects();
  return rules.find(r => r.active && r.from === path) ?? null;
}

// ── Admin token ───────────────────────────────────────────────────────────

export async function getAdminToken(): Promise<string | null> {
  return kvGet<string>('admin:token');
}

export async function setAdminToken(token: string): Promise<void> {
  await kvPut('admin:token', token);
}

export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const stored = await getAdminToken();
  return stored === token;
}

// ── Site content overrides ────────────────────────────────────────────────

export async function getSiteContent<T extends Record<string, unknown>>(): Promise<T | null> {
  return kvGet<T>('content:site');
}

export async function setSiteContent(content: Record<string, unknown>): Promise<void> {
  await kvPut('content:site', content);
}

// ── Events CRUD ───────────────────────────────────────────────────────────

export async function getEvents(): Promise<SiteEvent[]> {
  return (await kvGet<SiteEvent[]>('events')) ?? [];
}

export async function setEvents(events: SiteEvent[]): Promise<void> {
  await kvPut('events', events);
}

export async function upsertEvent(event: SiteEvent): Promise<void> {
  const events = await getEvents();
  const idx = events.findIndex(e => e.id === event.id);
  if (idx >= 0) events[idx] = event;
  else events.push(event);
  await setEvents(events);
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await getEvents();
  await setEvents(events.filter(e => e.id !== id));
}

// ── Site media ────────────────────────────────────────────────────────────

export async function getSiteMedia(): Promise<SiteMedia | null> {
  return kvGet<SiteMedia>('media');
}

export async function setSiteMedia(media: SiteMedia): Promise<void> {
  await kvPut('media', media);
}

// ── Leads CRM ─────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  return (await kvGet<Lead[]>('leads')) ?? [];
}

export async function setLeads(leads: Lead[]): Promise<void> {
  await kvPut('leads', leads);
}

export async function upsertLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  const idx = leads.findIndex(l => l.id === lead.id);
  if (idx >= 0) leads[idx] = lead;
  else leads.unshift(lead); // newest first
  await setLeads(leads);
}

export async function deleteLead(id: string): Promise<void> {
  const leads = await getLeads();
  await setLeads(leads.filter(l => l.id !== id));
}

// ── Media Library (R2 Uploads) ────────────────────────────────────────────

export async function getMediaLibrary(): Promise<string[]> {
  return (await kvGet<string[]>('mediaLibrary')) ?? [];
}

export async function addMediaToLibrary(url: string): Promise<void> {
  const lib = await getMediaLibrary();
  await kvPut('mediaLibrary', [url, ...lib]);
}

// ── Company details ───────────────────────────────────────────────────────

export async function getCompanyDetails(): Promise<CompanyDetails | null> {
  return kvGet<CompanyDetails>('companyDetails');
}

export async function setCompanyDetails(details: CompanyDetails): Promise<void> {
  await kvPut('companyDetails', details);
}

// ── News CMS ──────────────────────────────────────────────────────────────

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news_canada_2026',
    title: 'Canada IRCC Cap Updates 2026 — What Indian Students Must Know',
    slug: 'canada-ircc-cap-updates-2026',
    date: '2026-03-15',
    excerpt: 'IRCC has confirmed new international student cap allocations for 2026. Learn how the provincial attestation letter system affects your application timeline.',
    content: `<h2>Canada's 2026 International Student Cap</h2><p>Immigration, Refugees and Citizenship Canada (IRCC) has confirmed that the international student cap introduced in 2024 will remain in force through 2026, with province-level attestation letters (PALs) required for most study permit applications.</p><h3>Key Changes for 2026</h3><ul><li>Ontario, BC, and Alberta have updated PAL quotas — apply early</li><li>Study permits for programs under 6 months are now fully exempt</li><li>The biometrics wait time has reduced to an average of 4–6 weeks</li><li>GIC requirement remains CAD 10,000 (unchanged from 2025)</li></ul><h3>ILOC Guidance</h3><p>Book a free session with Rajib Sir to map out your 2026 application timeline before the PAL slots are exhausted.</p>`,
    imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
    published: true,
    createdAt: new Date('2026-03-15').toISOString(),
  },
  {
    id: 'news_uk_graduate_route_2026',
    title: 'UK Graduate Route Confirmed for 2026 — 2-Year PSW Stays',
    slug: 'uk-graduate-route-confirmed-2026',
    date: '2026-02-10',
    excerpt: 'The UK Home Office has officially confirmed the Graduate Route (post-study work visa) will remain open for 2026 intakes — a huge win for Indian students.',
    content: `<h2>UK Graduate Route: Official Confirmation</h2><p>The UK Home Office announced in February 2026 that the Graduate Route (formerly Tier 1 PSW) will remain available to international students graduating from 2026 onwards. This 2-year post-study work visa allows graduates to work or look for work in the UK at any skill level.</p><h3>Who is Eligible?</h3><ul><li>Students who complete a UK bachelor's, master's, or PhD degree</li><li>Must have studied in the UK for the full duration of the course</li><li>No job offer required at the time of application</li></ul><h3>Financial Requirements for 2026</h3><p>Maintenance funds: £1,334/month in London (£1,023/month outside London) for up to 9 months, proving up to £12,006 in savings.</p><blockquote>ILOC placed 180+ students into UK universities in 2025. Contact us to begin your 2026 September intake application now.</blockquote>`,
    imageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80',
    published: true,
    createdAt: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'news_australia_gst_2026',
    title: 'Australia Genuine Student Test (GST) 2026 — Replacing GTE',
    slug: 'australia-genuine-student-test-2026',
    date: '2026-01-20',
    excerpt: 'Australia replaced the Genuine Temporary Entrant (GTE) requirement with the new Genuine Student Test from March 2024. Here is what changes for 2026 applicants.',
    content: `<h2>Australia's New Genuine Student Test</h2><p>From 23 March 2024, the Department of Home Affairs replaced the Genuine Temporary Entrant (GTE) requirement with the Genuine Student (GS) test for all Student visa (subclass 500) applications. This change applies to all 2026 applications.</p><h3>What the GST Assesses</h3><ul><li>Your understanding of the course and provider you have chosen</li><li>Your English language skills and academic readiness</li><li>Your ties to India and intention to return (or migrate via proper pathways)</li><li>Financial capacity: AUD $29,710 for living costs per year</li></ul><h3>Pro Tip from ILOC</h3><p>A strong Statement of Purpose (SOP) addressing the GST criteria can significantly reduce processing delays. ILOC's SOP coaching has a 97% first-attempt approval rate for Australian student visas.</p>`,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    published: true,
    createdAt: new Date('2026-01-20').toISOString(),
  },
];

export async function getNews(): Promise<NewsItem[]> {
  return (await kvGet<NewsItem[]>('news')) ?? DEFAULT_NEWS;
}

export async function setNews(items: NewsItem[]): Promise<void> {
  await kvPut('news', items);
}

export async function upsertNews(item: NewsItem): Promise<void> {
  const news = await getNews();
  const idx = news.findIndex(n => n.id === item.id);
  if (idx >= 0) news[idx] = item;
  else news.unshift(item);
  await setNews(news);
}

export async function deleteNews(id: string): Promise<void> {
  const news = await getNews();
  await setNews(news.filter(n => n.id !== id));
}

// ── Global settings ───────────────────────────────────────────────────────

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return kvGet<GlobalSettings>('globalSettings');
}

export async function setGlobalSettings(settings: GlobalSettings): Promise<void> {
  await kvPut('globalSettings', settings);
}

// ── Country subpage KV overrides ──────────────────────────────────────────

export async function getCountryContent(country: string, section: string): Promise<string | null> {
  return kvGet<string>(`countryContent:${country}:${section}`);
}

export async function setCountryContent(country: string, section: string, html: string): Promise<void> {
  await kvPut(`countryContent:${country}:${section}`, html);
}
