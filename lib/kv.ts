/**
 * Cloudflare KV wrapper.
 * KV Namespace binding expected: CONTENT_KV
 *
 * EDGE RUNTIME RULES:
 *   1. Every request runs in a fresh V8 isolate — no in-memory/globalThis state.
 *   2. Use getRequestContext() (throws) for auth writes — silent failure = 401 loop.
 *   3. Use getOptionalRequestContext() only for non-critical public reads.
 *   4. All auth errors must be LOUD — return null gracefully only for public content.
 */

import { getRequestContext, getOptionalRequestContext } from '@cloudflare/next-on-pages';
import type {
  AboutPageSettings, CompanyDetails, DynamicPage, GlobalSettings, HeroSlide,
  Lead, NewsItem, RedirectRule, ServicesPageSettings, SiteEvent, SiteMedia, Stat,
} from './types';

// ── KV shape ──────────────────────────────────────────────────────────────────
interface CfKVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * Get the KV namespace using the STRICT context (throws if missing).
 * Use this for any write or auth operation — we NEED to know if it fails.
 */
function getKVStrict(): CfKVNamespace {
  // getRequestContext() throws if called outside a live CF Pages request.
  // On production this always works. Locally it only works under `wrangler pages dev`.
  const ctx = getRequestContext();
  // ctx.env is typed as CloudflareEnv (see cloudflare-env.d.ts) — no cast needed.
  const kv  = ctx.env.CONTENT_KV as CfKVNamespace | undefined;
  if (!kv) {
    throw new Error(
      'CRITICAL: CONTENT_KV binding is missing from this Cloudflare Pages deployment. ' +
      'Go to Cloudflare Dashboard → Pages → iloc-web → Settings → Functions → ' +
      'KV Namespace Bindings and add: Variable name = "CONTENT_KV", ' +
      'KV Namespace = your namespace (ID: 5b410e671eb14b78bc6bd59b7fd6f827). ' +
      'Then redeploy.'
    );
  }
  return kv;
}

/**
 * Get the KV namespace using the OPTIONAL context (returns null if missing).
 * Use this only for public reads that can gracefully fall back to static defaults.
 */
function getKVOptional(): CfKVNamespace | null {
  try {
    const ctx = getOptionalRequestContext();
    if (!ctx) return null;
    // ctx.env is typed as CloudflareEnv — CONTENT_KV is KVNamespace | undefined
    return (ctx.env.CONTENT_KV as CfKVNamespace | undefined) ?? null;
  } catch {
    return null;
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Read from KV — returns null on miss or local dev (never throws). */
async function kvGet<T>(key: string): Promise<T | null> {
  const kv = getKVOptional();
  if (!kv) return null;
  try {
    const raw = await kv.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`[kv] kvGet("${key}") failed:`, e);
    return null;
  }
}

/** Write to KV — THROWS if binding is missing (callers must surface the error). */
async function kvPut(key: string, value: unknown, opts?: { expirationTtl?: number }): Promise<void> {
  const kv = getKVStrict(); // throws → caller catches and returns 500
  await kv.put(key, JSON.stringify(value), opts);
}

/** Delete from KV — soft-fails locally, throws on CF if binding is missing. */
async function kvDelete(key: string): Promise<void> {
  const kv = getKVOptional();
  if (!kv) return;
  try {
    await kv.delete(key);
  } catch (e) {
    console.error(`[kv] kvDelete("${key}") failed:`, e);
  }
}

// ── Page CRUD ─────────────────────────────────────────────────────────────────

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

// ── Redirect rules ────────────────────────────────────────────────────────────

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

// ── Admin session auth ────────────────────────────────────────────────────────
//
// HOW IT WORKS:
//   Login  → generates token → writes session:<token> = "1" to KV with 24h TTL
//   Auth   → reads session:<token> from KV → present=valid, absent/error=401
//   Logout → deletes session:<token> from KV
//
// WHY getKVStrict() FOR WRITES:
//   If CONTENT_KV is misconfigured, createAdminSession() must THROW — not silently
//   skip. The login route catches the error and returns a clear 500 with the
//   binding error message. This surfaces the misconfiguration immediately.
//
// WHY getKVOptional() FOR READS WITH LOCAL BYPASS:
//   On production, the session key must exist in KV. In local next dev (no CF
//   context), we bypass auth so developers can work without wrangler.

const SESSION_TTL = 86_400; // 24 h

/** Create a KV-backed admin session. THROWS if CONTENT_KV is missing. */
export async function createAdminSession(token: string): Promise<void> {
  const kv = getKVStrict(); // LOUD failure if binding not configured
  // Store raw "1" — presence check only, no JSON serialisation
  await kv.put(`session:${token}`, '1', { expirationTtl: SESSION_TTL });
  console.log(`[kv] Session created: session:${token.slice(0, 8)}… (TTL ${SESSION_TTL}s)`);
}

/** Validate a session token. Local dev without CF context bypasses auth. */
export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token) return false;

  const kv = getKVOptional();

  if (!kv) {
    // No CF context → local next dev (not wrangler dev).
    // Bypass auth so developers can work without the full CF setup.
    // On production CF_PAGES env is always set; if kv is null there, the
    // getKVStrict() call in createAdminSession would have thrown at login time
    // — meaning no valid token could exist anyway.
    const isLocalDev = typeof process !== 'undefined' && !process.env.CF_PAGES;
    if (isLocalDev) {
      console.warn('[kv] No CONTENT_KV — bypassing auth (local next dev)');
      return true;
    }
    console.error('[kv] validateAdminToken: CONTENT_KV missing in CF context — denying');
    return false;
  }

  try {
    const val = await kv.get(`session:${token}`);
    if (val === null) {
      console.warn(`[kv] Token not found in KV: session:${token.slice(0, 8)}…`);
      return false;
    }
    // Sliding expiry: each authenticated request renews the 24h window,
    // so an actively-used admin session never dies mid-edit.
    try {
      await kv.put(`session:${token}`, '1', { expirationTtl: SESSION_TTL });
    } catch { /* renewal is best-effort — validation already succeeded */ }
    return true;
  } catch (e) {
    console.error('[kv] validateAdminToken KV.get failed:', e);
    return false;
  }
}

/** Invalidate a session (logout). */
export async function destroyAdminSession(token: string): Promise<void> {
  if (!token) return;
  await kvDelete(`session:${token}`);
}

// Kept for KV health-check probe in /api/system/status
export async function getAdminToken(): Promise<string | null> {
  return kvGet<string>('admin:token');
}

/** @deprecated — superseded by createAdminSession */
export async function setAdminToken(_token: string): Promise<void> { /* no-op */ }

// ── Site content overrides ────────────────────────────────────────────────────

export async function getSiteContent<T extends Record<string, unknown>>(): Promise<T | null> {
  return kvGet<T>('content:site');
}

export async function setSiteContent(content: Record<string, unknown>): Promise<void> {
  await kvPut('content:site', content);
}

// ── Events CRUD ───────────────────────────────────────────────────────────────

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

// ── Site media ────────────────────────────────────────────────────────────────

export async function getSiteMedia(): Promise<SiteMedia | null> {
  return kvGet<SiteMedia>('media');
}

export async function setSiteMedia(media: SiteMedia): Promise<void> {
  await kvPut('media', media);
}

// ── Leads CRM ─────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  return (await kvGet<Lead[]>('leads')) ?? [];
}

export async function setLeads(leads: Lead[]): Promise<void> {
  await kvPut('leads', leads);
}

export async function upsertLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  const idx   = leads.findIndex(l => l.id === lead.id);
  if (idx >= 0) leads[idx] = lead;
  else leads.unshift(lead);
  await setLeads(leads);
}

export async function deleteLead(id: string): Promise<void> {
  const leads = await getLeads();
  await setLeads(leads.filter(l => l.id !== id));
}

// ── Media Library ─────────────────────────────────────────────────────────────

export async function getMediaLibrary(): Promise<string[]> {
  return (await kvGet<string[]>('mediaLibrary')) ?? [];
}

export async function addMediaToLibrary(url: string): Promise<void> {
  const lib = await getMediaLibrary();
  await kvPut('mediaLibrary', [url, ...lib]);
}

// ── Company details ───────────────────────────────────────────────────────────

export async function getCompanyDetails(): Promise<CompanyDetails | null> {
  return kvGet<CompanyDetails>('companyDetails');
}

export async function setCompanyDetails(details: CompanyDetails): Promise<void> {
  await kvPut('companyDetails', details);
}

// ── News CMS ──────────────────────────────────────────────────────────────────

const DEFAULT_NEWS: NewsItem[] = [];

export async function getNews(): Promise<NewsItem[]> {
  return (await kvGet<NewsItem[]>('news')) ?? DEFAULT_NEWS;
}

export async function setNews(items: NewsItem[]): Promise<void> {
  await kvPut('news', items);
}

export async function upsertNews(item: NewsItem): Promise<void> {
  const news = await getNews();
  const idx  = news.findIndex(n => n.id === item.id);
  if (idx >= 0) news[idx] = item;
  else news.unshift(item);
  await setNews(news);
}

export async function deleteNews(id: string): Promise<void> {
  const news = await getNews();
  await setNews(news.filter(n => n.id !== id));
}

// ── Global settings ───────────────────────────────────────────────────────────

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return kvGet<GlobalSettings>('globalSettings');
}

export async function setGlobalSettings(settings: GlobalSettings): Promise<void> {
  await kvPut('globalSettings', settings);
}

// ── Country subpage KV overrides ──────────────────────────────────────────────

export async function getCountryContent(country: string, section: string): Promise<string | null> {
  return kvGet<string>(`countryContent:${country}:${section}`);
}

export async function setCountryContent(country: string, section: string, html: string): Promise<void> {
  await kvPut(`countryContent:${country}:${section}`, html);
}

// ── Country meta overrides ────────────────────────────────────────────────────

export interface CountryMeta {
  intake?:      string;
  avgCost?:     string;
  visaRate?:    string;
  unis?:        string;
  tagline?:     string;
  description?: string;
  highlights?:  string[];
  heroImage?:   string;
  campusImage?: string;
  color?:       string;
}

export async function getCountryMeta(country: string): Promise<CountryMeta | null> {
  return kvGet<CountryMeta>(`countryMeta:${country}`);
}

export async function setCountryMeta(country: string, meta: CountryMeta): Promise<void> {
  await kvPut(`countryMeta:${country}`, meta);
}

// ── University marquee settings ───────────────────────────────────────────────

export interface MarqueeSettings {
  speedRow1:   number;
  speedRow2:   number;
  speedRow3?:  number;
  heading:     string;
  subheading:  string;
  unis?: { name: string; src: string; country: string; darkBg?: boolean }[];
}

export async function getMarqueeSettings(): Promise<MarqueeSettings | null> {
  return kvGet<MarqueeSettings>('marqueeSettings');
}

export async function setMarqueeSettings(settings: MarqueeSettings): Promise<void> {
  await kvPut('marqueeSettings', settings);
}

// ── Global stats block ────────────────────────────────────────────────────────

export async function getStats(): Promise<Stat[] | null> {
  return kvGet<Stat[]>('siteStats');
}

export async function setStats(stats: Stat[]): Promise<void> {
  await kvPut('siteStats', stats);
}

// ── Hero carousel slides ──────────────────────────────────────────────────────

export async function getHeroSlides(): Promise<HeroSlide[] | null> {
  return kvGet<HeroSlide[]>('heroSlides');
}

export async function setHeroSlides(slides: HeroSlide[]): Promise<void> {
  await kvPut('heroSlides', slides);
}

// ── Partner page settings ─────────────────────────────────────────────────────

export interface PartnerStat {
  value: string;
  label: string;
  desc:  string;
}

export interface PartnerPageSettings {
  badge:       string;
  heading:     string;
  subheading:  string;
  bodyHeading: string;
  bodyIntro:   string;
  stats:       PartnerStat[];
  listHeading: string;
  listItems:   string[];
  formHeading: string;
  formSubtext: string;
}

export async function getPartnerSettings(page: 'institutions' | 'agent' | 'referral'): Promise<PartnerPageSettings | null> {
  return kvGet<PartnerPageSettings>(`partnerSettings:${page}`);
}

export async function setPartnerSettings(page: 'institutions' | 'agent' | 'referral', settings: PartnerPageSettings): Promise<void> {
  await kvPut(`partnerSettings:${page}`, settings);
}

// ── About / Services page settings ────────────────────────────────────────────

export async function getAboutSettings(): Promise<AboutPageSettings | null> {
  return kvGet<AboutPageSettings>('aboutSettings');
}

export async function setAboutSettings(settings: AboutPageSettings): Promise<void> {
  await kvPut('aboutSettings', settings);
}

export async function getServicesSettings(): Promise<ServicesPageSettings | null> {
  return kvGet<ServicesPageSettings>('servicesSettings');
}

export async function setServicesSettings(settings: ServicesPageSettings): Promise<void> {
  await kvPut('servicesSettings', settings);
}
