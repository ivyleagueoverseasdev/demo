// ── Content block types for admin page builder ───────────────────────────
export type BlockType =
  | 'hero' | 'text' | 'grid' | 'stats' | 'cta'
  | 'image' | 'testimonials' | 'faq' | 'timeline' | 'country_hero';

export interface ContentBlock {
  id:    string;
  type:  BlockType;
  props: Record<string, unknown>;
}

// ── Dynamic page stored in KV ─────────────────────────────────────────────
export interface DynamicPage {
  id:              string;
  slug:            string;
  title:           string;
  metaTitle:       string;
  metaDescription: string;
  layout:          'default' | 'country' | 'article' | 'landing';
  blocks:          ContentBlock[];
  heroImageUrl?:   string;   // ← admin can set per-page hero background
  published:       boolean;
  createdAt:       string;
  updatedAt:       string;
}

// ── Redirect rule ─────────────────────────────────────────────────────────
export interface RedirectRule {
  id:       string;
  from:     string;
  to:       string;
  type:     301 | 302;
  active:   boolean;
  note?:    string;
}

// ── Site events (admin-managed, shown in EventsCarousel) ──────────────────
export type EventType = 'webinar' | 'fair' | 'deadline' | 'workshop' | 'seminar';

export interface SiteEvent {
  id:          string;
  title:       string;
  type:        EventType;
  date:        string;         // ISO date e.g. "2026-06-14"
  time:        string;         // e.g. "4:00 PM – 5:30 PM IST"
  location:    string;
  description: string;
  body?:       string;         // Rich Markdown body for the /events/[id] detail page
  country?:    string;         // Target country for frontend filter (e.g. "usa", "uk")
  imageUrl?:   string;         // Optional card background image
  ctaLabel:    string;         // e.g. "Register Free"
  ctaUrl?:     string;         // Link for the CTA (legacy — detail page is /events/[id])
  seats?:      number;
  speakers?:   string[];       // Optional list of speaker names
  published:   boolean;
  createdAt:   string;
}

// ── Site media (global image overrides) ───────────────────────────────────
export interface SiteMedia {
  heroImages:     string[];     // Rotating hero images (up to 3)
  aboutImage?:    string;
  officeImage?:   string;
  customImages:   { key: string; url: string; alt: string }[];
  countryImages?: Record<string, string>; // countryCode → override campusImage URL
}

// ── KV store top-level keys ───────────────────────────────────────────────
export interface KVStore {
  'pages:index':    string[];
  [key: `page:${string}`]: DynamicPage;
  'redirects':      RedirectRule[];
  'events':         SiteEvent[];
  'media':          SiteMedia;
  'content:site':   Partial<SiteContent>;
  'admin:token':    string;
}

// ── Site content override ─────────────────────────────────────────────────
export interface SiteContent {
  companyName:   string;
  phone:         string;
  email:         string;
  founder:       string;
  tagline:       string;
  heroHeadline:  string;
  heroSubtext:   string;
  stats:         Stat[];
  services:      ServiceItem[];
  processSteps:  ProcessStepItem[];
  testimonials:  Testimonial[];
}

export interface Stat {
  num:   string;
  label: string;
}

// Editable service card — admin can change icon, title, desc without redeploy
export interface ServiceItem {
  id:    string;
  icon:  string;   // emoji
  title: string;
  desc:  string;
}

// Editable process step — admin can update copy without redeploy
export interface ProcessStepItem {
  step:  number;
  icon:  string;   // emoji
  title: string;
  desc:  string;
}

// ── Country page 2026 data ────────────────────────────────────────────────
export interface Country2026 {
  code:        string;
  name:        string;
  flag:        string;
  heroImage:   string;
  campusImage: string;   // card-level campus/landmark photo
  color:       string;
  tagline:     string;
  intake:      string;
  avgCost:     string;
  visaRate:    string;
  unis:        string;
  visa2026:    string[];
  scholarships: Scholarship[];
  careers:     string[];
  highlights:  string[];
  process:     ProcessStep[];
  description: string;
}

export interface Scholarship {
  name:     string;
  amount:   string;
  type:     string;
  deadline?: string;
}

export interface ProcessStep {
  step:  number;
  title: string;
  desc:  string;
}

export interface Testimonial {
  id:         string;
  name:       string;
  role:       string;
  uni:        string;
  country:    string;   // display label e.g. "USA 🇺🇸"
  quote:      string;
  imageUrl:   string;   // avatar URL — empty string = show initials
  stars:      number;   // 1–5
  published:  boolean;
}

export interface Lead {
  id:        string;
  name:      string;
  phone:     string;
  email:     string;
  country:   string;
  program:   string;
  message:   string;
  status:    'new' | 'contacted' | 'closed';
  source:    string;   // e.g. "quick-enquiry" | "contact-page"
  createdAt: string;   // ISO timestamp
}

export interface CompanyDetails {
  phone:     string;
  whatsapp:  string;  // full wa.me URL
  email:     string;
  address:   string;
  mapsLink:  string;
}

export interface GlobalSettings {
  brandName:      string;   // override display name (e.g. "ILOC" → custom)
  heroImages:     string[]; // up to 3 carousel URLs
  noticeBanner:   string;   // optional top-bar text; empty = hidden
  linkedIn:       string;   // full URL
  instagram:      string;   // full URL
  whatsappUrl:    string;   // full wa.me URL
}

export interface NewsItem {
  id:        string;
  title:     string;
  slug:      string;
  date:      string;      // ISO date e.g. "2026-05-01"
  excerpt:   string;      // ~160 chars for cards and SEO
  content:   string;      // Full HTML/Markdown body
  imageUrl:  string;      // Optional hero image URL
  published: boolean;
  createdAt: string;      // ISO timestamp
}
