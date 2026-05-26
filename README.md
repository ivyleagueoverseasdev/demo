# Ivy League Overseas Consulting — ILOC Web App

Production-ready monorepo for **Ivy League Overseas Consulting (ILOC)**.

| Part | What it is | Stack |
|---|---|---|
| **Frontend** | Full marketing website — landing page + 5 subpages | Vite 6 · React 18 · Framer Motion 11 · Tailwind CSS v4 |
| **WhatsApp Bot** | 3-step lead-capture conversation bot | Next.js 15 Edge · Upstash Redis · Google Sheets |

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173  (HMR)
npm run build      # production bundle → dist/
npm run preview    # serve dist/ at localhost:4173
```

---

## Repository Structure

```
files (8)/
├── index.html                           # Vite HTML shell — Google Fonts preconnect
├── vite.config.js                       # Vite 6 + @tailwindcss/vite plugin
├── tailwind.config.js                   # Font families, breakpoints (v3-compat read by v4)
├── package.json
├── src/
│   ├── main.jsx                         # React 18 createRoot mount
│   ├── index.css                        # @import "tailwindcss" + @theme font vars
│   └── IvyLeagueAurora.jsx             # Entire frontend — 1,525 lines, single file
└── whatsapp-bot/
    ├── SETUP.md                         # Operator deployment runbook
    ├── google-apps-script.gs            # Google Sheets doPost endpoint
    ├── components/
    │   └── WhatsAppWidget.jsx           # 3-export React widget (bubble + banner + button)
    └── app/api/whatsapp-webhook/
        └── route.js                     # Next.js 15 Edge Route — state machine
```

---

## Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Build tool | Vite | 6.x | `@tailwindcss/vite` replaces PostCSS |
| UI framework | React | 18.3 | Strict Mode enabled |
| Animations | Framer Motion | 11.x | GPU-only transforms throughout |
| Styling | Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme` in CSS |
| Fonts | Syne + DM Sans | — | Google Fonts via `preconnect` |
| Images | flagcdn.com + picsum.photos | — | Real flag images, seeded demo campus photos |
| WhatsApp | Meta Cloud API v19 | — | Webhook-based, Edge compatible |
| State store | Upstash Redis | REST API | Edge-safe HTTP pipeline |
| Lead log | Google Apps Script | — | Sheets `doPost` — zero OAuth |
| Deployment | Vite → static CDN / WhatsApp bot → Cloudflare Pages | — | — |

---

## Sitemap & Page Routing

The app uses **client-side state routing** (`page` string state + `AnimatePresence`). No React Router — all navigation is instant with Framer Motion cross-fade. A breadcrumb on every subpage links back to Home.

```
/  (home)
├── /about              — About Us
├── /services           — Services (3-tab: Students · Institutes · Professional Programs)
├── /destinations       — Study Destinations + University Placement Record
└── /contact            — Contact Us
```

Nav links: **Services · Destinations · Testimonials · About Us · Contact**
- Clicking a page link → `goPage("pagename")` → `window.scrollTo(0,0)` + AnimatePresence
- Clicking "Testimonials" → smooth scroll to `#testimonials` on the home page

---

## Pages — Detailed Feature Map

### Home (`page = "home"`)

| Section | Description |
|---|---|
| Utility bar | Fixed at top-0. Phone, email, trust badges, "Register as Student →" pill. |
| Sticky navbar | Glass blur on scroll. Logo, 5 nav links (with active-page amber highlight), "Book Free Session" CTA. Hamburger on mobile. |
| Hero Carousel | 3 slides, 5s auto-play. `AnimatePresence` crossfade (scale 1.04 → 1). Amber gradient text, founder badge, prev/next arrows, dot indicators, linear progress bar. |
| Trust bar | 5 icon + label trust badges in a horizontal flex strip. |
| Stats grid | 8 animated stat tiles (2×4). Hover lifts card. Click opens ConsultModal. |
| Services grid | 6 service cards. Each has number watermark, icon badge, title, description, hover amber underline sweep, "Book free session →" reveal. |
| Destinations grid | 6 country cards. Real flag image (flagcdn.com) at 30% opacity + emoji overlay + country gradient. Click opens DestModal. |
| Marquee | Infinite dual-direction ticker of 16 partner university names. CSS `@keyframes mq / mqr`, `translateX(-50%)` loop. Fade-mask on edges. |
| Testimonials | Horizontal snap-scroll carousel. Hidden scrollbar. 300px fixed-width cards. Arrow buttons call `scrollBy`. 8 real student quotes. |
| CTA section | Two-column dark card. "Book Free Session" amber button + WhatsApp green button + phone link. |
| Footer | Newsletter email strip + 4-column grid (logo+WA · Quick Links · Services · Contact). Bottom bar with copyright. |

### About Us (`page = "about"`)

Two-column hero with Unsplash university photo + stat badges. Mission & Vision cards. Director's message (quote + biography). Founder initials avatar. 8-tile stats grid. 4 recognition badges.

### Services (`page = "services"`)

Sticky 3-tab bar (scrolls with page at `top:32px`):
- **For Students** — 10 service cards (the 6 core services + Document Prep, Interview Guidance, Financial Assistance, Pre-Departure Support)
- **For Institutes** — 3 B2B partnership cards + enquiry CTA block
- **Professional Programs** — 4 cards (Medicine, Pharmacy, Nursing, Law)

Tab content switches with `AnimatePresence mode="wait"`.

### Study Destinations (`page = "destinations"`)

Full-bleed destination rows — flag image + destination detail (name, university count, intake, avg cost, description, top 2 highlights). Below the rows: **University Placement Record** — 16-card grid with `picsum.photos` campus image, country flag badge, city, ranking, top 2 programs.

### Contact (`page = "contact"`)

4 info cards (Phone, Email, Office, Response Time). WhatsApp CTA panel. Right-column contact form (Name, Email, Phone, Subject, Message) with success state.

---

## Component Reference

### Shared / Root

| Component | File location | Props | Purpose |
|---|---|---|---|
| `IvyLeagueAurora` | `src/IvyLeagueAurora.jsx:1477` | — | Root. Owns `modal` state. Renders `<V1>` + global modals. |
| `ConsultModal` | `:137` | `onClose, grad, preCountry` | Full-screen booking form. Validates name/email/phone/country/program. Success state with WhatsApp CTA. Body scroll locked via `useEffect`. |
| `DestModal` | `:319` | `dest, onClose, onConsult, grad` | Destination detail modal. Shows flag, name, intake, avg cost, highlights list. Two CTAs: book counselling for that country, or WhatsApp. |
| `MobileMenu` | `:396` | `links, onConsult, onClose, accentBg, textColor, menuTop, onPageNav` | Slide-in hamburger panel. Accepts both string links (scroll) and object links `{label, go}` (page navigation). |
| `scrollTo(id)` | `:131` | `id: string` | `document.getElementById(id).scrollIntoView()` — used for in-page section scrolling. |

### V1 — Card Components

| Component | File location | Key behaviour |
|---|---|---|
| `V1HeroCarousel` | `:462` | `useState(slide)` + `setInterval(5000)`. `AnimatePresence` crossfade between 3 `V1_SLIDES`. Prev/next buttons. Dot indicators. Linear progress bar (`motion.div width 0%→100%` over 5s). |
| `V1ServiceCard` | `:552` | Own `useRef` + `useInView`. `fadeUp` variant with `custom={i}` stagger delay. Bottom amber line sweep on hover (CSS `transition width 0→100%`). |
| `V1DestCard` | `:580` | Own `useRef` + `useInView`. `scaleIn` variant. `flagcdn.com/w640/{d.code}.png` at 30% opacity. Emoji overlay with drop-shadow. Hover: `y:-6, scale:1.02`. |
| `V1TestiCard` | `:616` | Own `useRef` + `useInView`. `fadeUp` variant. Star rating row. Initials avatar with amber ring. Quote text. Role + university. |

### V1 — Subpage Components

| Component | File location | Content |
|---|---|---|
| `V1Breadcrumb` | `:668` | `Home ›  Page Label` strip. "Home" calls `goPage("home")`. |
| `V1AboutPage` | `:680` | Hero (slideL/slideR), stats grid, mission+vision cards, founder message section, recognition tiles. |
| `V1ServicesPage` | `:822` | Sticky 3-tab bar. `AnimatePresence mode="wait"` content swap. 10 service cards / 3 B2B cards + partnership CTA / 4 professional program cards. |
| `V1DestinationsPage` | `:946` | Destination detail rows with flag images. UNI_RICH placement grid (16 cards, picsum images, country flag badges). |
| `V1ContactPage` | `:1055` | 4 info tiles. WhatsApp CTA block. Contact form with success state. |
| `V1` | `:1141` | Root layout. `page` + `goPage` state. Sticky util bar + navbar. Conditional page render. Home content wrapped in `{page==="home" && <main>…</main>}`. |

---

## Data Reference

All real ILOC data lives in constants at the top of `src/IvyLeagueAurora.jsx`.

### `CO` — Company Object (line 12)

```js
CO.name        // "Ivy League Overseas Consulting"
CO.phone       // "+91-9158577707"
CO.email       // "ivyleagueoverseas@gmail.com"
CO.founder     // "Rajib Paul Choudhury"
CO.since       // "2020"
CO.stats       // 4 hero stats (2,500+, 97%, 7+, ₹0)
CO.services    // 6 core services (university admissions → free counselling)
CO.destinations// 6 countries — each with flag, name, code, unis, color, highlights, intake, avgCost, desc
CO.testimonials// 8 real student testimonials (name, role, university, quote)
```

### Other Data Constants

| Constant | Line | Description |
|---|---|---|
| `WA_URL` | 10 | Pre-filled WhatsApp deep link to `919158577707` |
| `COUNTRIES` | 82 | 10 destination countries + Germany/Singapore/Europe/Other — populates form dropdowns |
| `PROGRAMS` | 83 | 5 program levels — populates form dropdowns |
| `UNIS` | 85 | 16 partner university names — used in the marquee ticker |
| `UNI_RICH` | 94 | 16 university objects: `name, city, country, code, rank, programs[], img` — used in destinations subpage |
| `V1_STATS_ALL` | 114 | 8 trust statistics (2,500+ / 97% / 110+ / 7+ / 400+ / ₹0 / 30min / 24hr) |
| `V1_SLIDES` | 438 | 3 hero carousel slide configs (bg gradient, tag, heading lines, subheading, CTA label) |
| `V1_ALL_SERVICES` | 645 | CO.services + 4 extra (Document Prep, Interview Guidance, Financial Assistance, Pre-Departure) |
| `V1_INSTITUTE_SERVICES` | 653 | 3 B2B services for the Institutes tab |
| `V1_PROF_PROGRAMS` | 659 | 4 professional programs (Medicine, Pharmacy, Nursing, Law) |

### Animation Variants (line 126)

```js
fadeUp   // opacity 0→1, y 28→0 — scroll-triggered entry (staggered via custom={i})
scaleIn  // opacity 0→1, scale 0.92→1 — card / grid item entry
slideL   // opacity 0→1, x -32→0 — left-side content entry
slideR   // opacity 0→1, x 32→0, delay 0.15s — right-side / form card entry
```

All use `ease: [0.22, 1, 0.36, 1]` (custom cubic bezier — fast out, soft settle).

---

## Color System (V1 Amber Dark)

```js
C1.bg      = "#08080f"                      // deep space background
C1.surf    = "#0e0e1c"                      // section surface / card backgrounds
C1.card    = "rgba(255,252,235,0.04)"       // subtle card fill
C1.border  = "rgba(255,252,235,0.10)"       // cream border at low opacity
C1.amber   = "#F59E0B"                      // primary accent — all CTAs, icons, numbers
C1.amberD  = "#D97706"                      // darker amber for gradient endpoint
C1.cream   = "#FEF9EF"                      // heading / primary text
C1.muted   = "rgba(254,249,239,0.50)"       // secondary text, descriptions

G1 = "linear-gradient(135deg, #F59E0B, #D97706)"  // all buttons + text gradient clips
```

---

## Typography

| Class | Font | Weights | Used for |
|---|---|---|---|
| `font-syne` | Syne | 700 · 800 · 900 | All headings, logo, stat numbers, card titles |
| `font-dm` | DM Sans | 300 · 400 · 500 · 600 · 700 | Body copy, labels, nav, buttons, form inputs |

Fluid font sizes use CSS `clamp(min, preferred, max)` — no hard breakpoints for type.

---

## Layout Patterns

```
Navbar:    fixed, z-[300], top:32px (below 32px utility bar), glass blur on scroll
Util bar:  fixed, z-[310], top:0, height 32px
Modals:    fixed, z-[600], full-screen overlay
Mobile menu: fixed, z-[490], top:108px (clears both bars)

Max content width: max-w-6xl (72rem) centered with mx-auto px-4 sm:px-6
Sections alternate: bg = C1.bg ↔ C1.surf (creates visual rhythm without borders)
Grid columns: 1 → sm:2 → lg:3 (services, unis, stats)
Grid columns: 2 → sm:3 → lg:6 (destination country cards)
```

---

## Image Sources

| Content | Source | Example |
|---|---|---|
| Country flag images | `https://flagcdn.com/w640/{code}.png` | `/w640/us.png` → USA flag |
| Country flag badges (small) | `https://flagcdn.com/w80/{code}.png` | 30×20px inline badge |
| University campus demo photos | `https://picsum.photos/seed/{name}/600/380` | Consistent per university name seed |
| Student lifestyle (About hero) | `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700` | Free-use |
| Graduation (V3 About hero) | `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700` | Free-use |

---

## WhatsApp Bot

### Architecture

```
User clicks CTA on website
     ↓
wa.me/919158577707?text=...  (pre-filled opener)
     ↓
Meta Cloud API → POST /api/whatsapp-webhook  (Next.js 15 Edge Route)
     ↓
Upstash Redis  ←→  State Machine (3 steps)
     ↓
Lead complete → Google Sheets (Apps Script doPost)
     ↓
Confirmation WA message sent to user ✅
```

### Conversation State Machine

```
null (cold)  →  AWAITING_NAME  →  AWAITING_COUNTRY  →  AWAITING_DEGREE  →  DONE (cleared)
```

State stored as JSON at Redis key `wa:{e164phone}` with 24-hour TTL.

### WhatsApp Widget (`whatsapp-bot/components/WhatsAppWidget.jsx`)

Three named exports for different placements:

| Export | Type | Behaviour |
|---|---|---|
| `default` (WhatsAppWidget) | Floating bubble | Appears after 3s. Tooltip appears at 4s, auto-hides at 10s. Dismissable via × button. |
| `WhatsAppCTABanner` | Full-width section | Dark emerald gradient with social proof strip (2,500+ student avatars). `whileInView` fade-up entry. |
| `WhatsAppButton` | Compact inline pill | Fits inside nav, hero, or card. Green gradient, WA icon, label prop. |

```jsx
// Usage in Next.js layout.jsx
import WhatsAppWidget from "@/components/WhatsAppWidget";
// Add once inside <body>:
<WhatsAppWidget />
```

### Environment Variables (Cloudflare Pages → Settings → Variables)

```
WHATSAPP_TOKEN             Meta System User permanent access token
WHATSAPP_PHONE_ID          Phone Number ID (not display number)
WEBHOOK_VERIFY_TOKEN       Your chosen verification secret
UPSTASH_REDIS_REST_URL     https://YOUR-DB.upstash.io
UPSTASH_REDIS_REST_TOKEN   Upstash REST bearer token
SHEETS_WEBHOOK_URL         Google Apps Script web app URL
```

> **Pre-production:** Confirm `WA_NUMBER` in `WhatsAppWidget.jsx` is `"919158577707"` before go-live.

### Key Functions (route.js)

| Function | Purpose |
|---|---|
| `redis(commands[])` | Upstash HTTP pipeline — batches commands in one `fetch` |
| `getState(phone)` / `setState` / `clearState` | Redis read/write/delete for `wa:{phone}` |
| `sendText(to, body)` | POST to `graph.facebook.com/v19.0/{PHONE_ID}/messages` |
| `markRead(messageId)` | Double blue tick UX |
| `logLead(lead)` | Non-blocking POST to Google Sheets — failure never breaks WA flow |
| `parseCountry(text)` | Accepts `1–6` numbers OR free-text (`usa`, `england`, `nz`, etc.) |
| `parseDegree(text)` | Accepts `1/2`, `ug/pg`, `bachelor`, `master`, `mba`, `phd` |

**Edge runtime rules:**
- `export const runtime = "edge"` — required for Cloudflare Pages
- Zero Node.js APIs — all I/O via `fetch()`
- Webhook handler **always returns `200 OK`** — non-200 triggers Meta retry storm

---

## Build Outputs

```
dist/index.html          ~1 kB
dist/assets/index.css    ~58 kB  (9.9 kB gzip)
dist/assets/index.js     ~340 kB (102 kB gzip)
Build time: ~4–7s
```

---

## Design Decisions & Why

| Decision | Reason |
|---|---|
| Single-file architecture (`IvyLeagueAurora.jsx`) | One deliverable, zero import graph complexity, easy to hand off to client |
| `overflow-x:hidden` on `body` only | Setting it on inner divs silently clips `position:fixed` children by creating a new stacking context |
| Named card components (not inline `.map()` arrows) | React Rules of Hooks — `useRef` / `useInView` cannot be called inside `.map()` callbacks |
| `page` string state instead of React Router | No URL changes needed for a demo/preview app; `AnimatePresence` handles transitions |
| `AnimatePresence mode="wait"` on tab/page switches | Ensures exit animation completes before new content enters — prevents overlap flicker |
| `flagcdn.com` for flag images | Free, no auth, CDN-hosted, ISO 3166-1 alpha-2 code as path param |
| `picsum.photos/seed/{name}` for campus images | Deterministic per seed — same URL always returns same image, no auth required |
| `logLead()` runs non-blocking | Lead notification to Sheets must never delay the WhatsApp reply to the user |
| Google Apps Script instead of Sheets API | Zero OAuth credential management — script runs as sheet owner, URL is the only secret |
| Upstash Redis via REST API (not ioredis) | Edge runtime has no Node.js; only `fetch()` is available on Cloudflare Workers |

---

## Development Notes

- All Framer Motion animations use `transform` + `opacity` only — GPU-composited, zero layout recalculation
- `useInView({ once: true })` — elements animate once on scroll entry, never re-trigger on scroll-back
- Google Fonts loaded with `preconnect` + `display=swap` — no render blocking
- `clamp()` used for all fluid type and spacing — no JS resize listeners
- `scrollbarWidth: "none"` + `[&::-webkit-scrollbar]:hidden` on testimonials track — cross-browser scrollbar hiding
- `scrollSnapType: "x mandatory"` + `scrollSnapAlign: "start"` — native snap scroll on testimonials carousel
