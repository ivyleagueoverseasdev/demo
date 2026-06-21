// ── Hero carousel CMS types ───────────────────────────────────────────────

export type HeroCtaStyle = 'amber' | 'green' | 'ghost';
export type HeroCtaAction = 'link' | 'whatsapp' | 'demo-modal' | 'phone';

export interface HeroStat {
  num:   string;   // e.g. "10,000+"
  label: string;   // e.g. "Students Placed"
  color: string;   // hex e.g. "#D97706"
}

export interface HeroCta {
  label:  string;
  style:  HeroCtaStyle;
  action: HeroCtaAction;
  href?:  string;           // for action=link|phone
}

export interface HeroSlide {
  id:               string;   // unique slug e.g. "study-abroad"
  badge:            string;   // pill text e.g. "🎓 25+ Years of Trusted Expertise"
  headingLines:     string[]; // up to 3 lines
  headingHighlight: boolean[]; // which line gets highlight colour
  highlightColor:   string;   // Tailwind class e.g. "text-amber-400"
  subtext:          string;
  trustBadges:      string[]; // short pill labels
  ctaPrimary:       HeroCta;
  ctaSecondary:     HeroCta;
  imageUrl:         string;
  imageAlt:         string;
  stats:            HeroStat[];
  accentGradient:   string;   // Tailwind from/via classes e.g. "from-lime-900/60 via-lime-800/30"
  enabled:          boolean;
}

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
export type EventType = 'webinar' | 'fair' | 'deadline' | 'workshop' | 'seminar' | 'class';

export type EventActionType = 'zoom' | 'webinar' | 'registration' | 'external' | 'whatsapp';

export interface EventActionLink {
  type:  EventActionType;  // determines icon + button label prefix
  label: string;           // button label e.g. "Join Zoom", "Register for Webinar"
  url:   string;           // destination URL
}

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
  actionLinks?: EventActionLink[]; // Zoom, webinar, registration links shown on detail page
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
  icon?: string;  // lucide icon name e.g. "GraduationCap"
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
  country:    string;   // display label e.g. "United States 🇺🇸"
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
  phone:               string;
  whatsapp:            string;  // full wa.me URL
  email:               string;
  address:             string;
  mapsLink:            string;
  contactHeroImageUrl?: string; // hero banner on the /contact page
}

export interface GlobalSettings {
  brandName:               string;   // override display name (e.g. "ILOC" → custom)
  heroImages:              string[]; // up to 3 carousel URLs
  noticeBanner:            string;   // optional top-bar text; empty = hidden
  whatsappUrl:             string;   // full wa.me URL
  whatsappMessage?:        string;   // pre-filled greeting text appended to every WhatsApp link as ?text=
  mainLogoUrl?:            string;   // custom logo image URL (optional — falls back to SVG)
  businessNameText?:       string;   // custom business name displayed in header
  headerLogoUrl?:          string;   // hero-header-specific logo URL
  headerBackgroundColor?:  string;   // hex color for hero header bg, e.g. "#4D7C0F"
  headerVerticalPadding?:  string;   // e.g. "py-16 md:py-24" or a numeric rem value
  businessNameDisplayName?: string;  // large title text in hero header

  // ── Admin-configurable grid layouts (1–6 columns, applied at md/lg) ────────
  destinationsCols?: number;  // homepage "Where will you go?" destinations grid — default 4
  eventsCols?:       number;  // /events hub — Upcoming & Past Events grids — default 3
  classesCols?:      number;  // homepage Live Classes board desktop grid — default 3
}

// ── About page settings (admin-editable via /admin/about) ─────────────────────
export interface AboutPageSettings {
  heroImageUrl?:     string;   // hero banner image — falls back to built-in Unsplash photo
  heroEyebrow:       string;   // e.g. "Est. 2000"
  heroHeadingLine1:  string;   // "Honest guidance."
  heroHeadingLine2:  string;   // "Proven results." (amber line)
  heroParagraph:     string;
  founderInitials:   string;   // avatar block, e.g. "RP"
  founderName:       string;
  founderRole:       string;
  founderMeta:       string;   // "10+ Years Experience · Pune, India"
  founderQuote:      string;
  founderParagraph1: string;
  founderParagraph2: string;
  missionTitle:      string;
  missionDesc:       string;
  visionTitle:       string;
  visionDesc:        string;
  whyHeading:        string;
  whyLabels:         string[]; // 4 recognition card labels (icons/colors fixed)
  ctaHeading:        string;
  ctaParagraph:      string;
}

// ── Services page settings (admin-editable via /admin/services) ───────────────

export interface StudentServiceCard {
  id:          string;
  title:       string;
  description: string;  // short — shown on the /services grid card
  imageUrl:    string;  // hero image for both the card and the /services/[id] detail page
  body?:       string;  // full content shown on the /services/[id] detail page (plain text, double-newline = new paragraph)
}

export interface InstituteServiceItem {
  icon:  string;   // emoji
  title: string;
  desc:  string;
}

export interface ServicesPageSettings {
  heroImageUrl?:     string;   // hero banner image — falls back to built-in Unsplash photo
  heroEyebrow:       string;
  heroHeadingLine1:  string;
  heroHeadingLine2:  string;   // amber line
  heroParagraph:     string;
  studentHeading:    string;
  studentServices:   StudentServiceCard[];   // 4×3 image-led grid — replaces old coreServices+extraServices
  extraServices:     ServiceItem[];          // legacy — kept in KV schema for backwards compat
  instituteHeading:  string;
  instituteIntro:    string;
  instituteServices: InstituteServiceItem[];
  partnerBoxHeading: string;
  partnerBoxText:    string;
  ctaHeading:        string;
  ctaParagraph:      string;
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
