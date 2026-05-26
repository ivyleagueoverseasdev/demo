# ILOC Performance & Stress Test Guide

## Running a Lighthouse Audit Locally

```bash
# 1. Build and start production server
npm run build
npm run start

# 2. In a second terminal, run Lighthouse CLI
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless" \
  --preset=desktop

# Also test mobile throttling
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-mobile.html \
  --chrome-flags="--headless"
```

Open `lighthouse-report.html` in a browser to see the full breakdown.

---

## Simulating 5,000–10,000 Concurrent Users

Install `autocannon` (fastest Node.js HTTP benchmarker):

```bash
npm install -g autocannon

# Warm up (100 req/s for 10s)
autocannon -c 100 -d 10 http://localhost:3000

# Stress test — 1,000 concurrent connections for 30s
autocannon -c 1000 -d 30 http://localhost:3000

# Test the API routes specifically
autocannon -c 500 -d 20 http://localhost:3000/api/events
autocannon -c 500 -d 20 http://localhost:3000/api/media
```

Target metrics: p99 latency < 200ms, zero errors at c=1000.

---

## Checking for Hydration Mismatches

Run the dev server and open DevTools console:

```bash
npm run dev
```

Look for: `Warning: Prop \`className\` did not match` or
`Error: Hydration failed because the initial UI does not match`.

Common causes in this project:
- `Date.now()` or `new Date()` called during render in a Client Component
- `window`/`localStorage` accessed outside `useEffect`
- Conditional rendering based on `typeof window !== 'undefined'`

---

## Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js temporarily:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
# module.exports = withBundleAnalyzer(nextConfig);

ANALYZE=true npm run build
```

Open `.next/analyze/client.html` — verify framer-motion and lucide-react
are not duplicated across chunks.

---

## Cloudflare Pages Edge Caching Verification

After deploying, test cache headers:

```bash
curl -I https://your-domain.pages.dev/api/events
# Expect: cache-control: public, s-maxage=60, stale-while-revalidate=300

curl -I https://your-domain.pages.dev/api/media
# Same headers expected

# Check CF-Cache-Status header — should show HIT on second request
curl -I https://your-domain.pages.dev/api/events
# CF-Cache-Status: HIT
```

---

## Key Metrics Targets (Core Web Vitals)

| Metric | Target | What affects it |
|--------|--------|----------------|
| LCP    | < 2.5s | Hero image `priority`, font loading |
| FID/INP | < 100ms | Framer Motion, heavy JS |
| CLS    | < 0.1  | `next/font` (eliminates FOUT), Image `fill` with parent dimensions |
| TTFB   | < 200ms | Edge runtime, KV `revalidate=60` |
