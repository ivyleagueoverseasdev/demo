export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';
import { validateAdminToken } from '@/lib/kv';
import { getBearerToken, CORS } from '@/lib/edge-utils';

// ── Types ──────────────────────────────────────────────────────────────────────
interface TrafficDay {
  v: number;
  c: Record<string, number>;
  s: Record<string, number>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const COUNTRY_NAMES: Record<string, string> = {
  IN: 'India',          US: 'United States',  GB: 'United Kingdom',
  CA: 'Canada',         AU: 'Australia',      AE: 'UAE',
  SG: 'Singapore',      DE: 'Germany',        FR: 'France',
  NL: 'Netherlands',    JP: 'Japan',          NZ: 'New Zealand',
  IE: 'Ireland',        ZA: 'South Africa',   MY: 'Malaysia',
  PK: 'Pakistan',       BD: 'Bangladesh',     LK: 'Sri Lanka',
  NG: 'Nigeria',        KE: 'Kenya',          SA: 'Saudi Arabia',
  QA: 'Qatar',          KW: 'Kuwait',         BH: 'Bahrain',
  OM: 'Oman',           SE: 'Sweden',         NO: 'Norway',
  DK: 'Denmark',        CH: 'Switzerland',    IT: 'Italy',
  ES: 'Spain',          PT: 'Portugal',       BE: 'Belgium',
  AT: 'Austria',        PL: 'Poland',         RU: 'Russia',
  CN: 'China',          KR: 'South Korea',    HK: 'Hong Kong',
  XX: 'Unknown',
};

const SOURCE_LABELS: Record<string, string> = {
  direct:    'Direct',        google:    'Google',
  bing:      'Bing',          yahoo:     'Yahoo',
  facebook:  'Facebook',      instagram: 'Instagram',
  linkedin:  'LinkedIn',      twitter:   'Twitter / X',
  youtube:   'YouTube',       whatsapp:  'WhatsApp',
  referral:  'Other Referral',
};

function utcDate(daysBack: number): string {
  return new Date(Date.now() - daysBack * 86_400_000).toISOString().slice(0, 10);
}

function pctChange(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

function emptyPayload(days: string[]) {
  return {
    live: 0, today: 0, yesterday: 0,
    week: 0, lastWeek: 0, month: 0, lastMonth: 0,
    todayTrend: 0, weekTrend: 0, monthTrend: 0,
    chart: days.slice(-30).map(date => ({
      date, views: 0,
      label: new Date(date + 'T00:00:00Z').toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short',
      }),
    })),
    countries: [],
    sources: [],
  };
}

export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token || !(await validateAdminToken(token))) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const kv = getOptionalRequestContext()?.env?.CONTENT_KV;
  if (!kv) {
    // Local dev without Wrangler — return an empty scaffold
    const days = Array.from({ length: 62 }, (_, i) => utcDate(61 - i));
    return json(emptyPayload(days));
  }

  // ── Build the 62-day date list (oldest → newest) ────────────────────────────
  const days = Array.from({ length: 62 }, (_, i) => utcDate(61 - i));

  // Fetch all daily keys in parallel
  const rawValues = await Promise.all(days.map(d => kv.get(`traffic:day:${d}`)));
  const dayData   = new Map<string, TrafficDay>();
  rawValues.forEach((raw, i) => {
    if (raw) dayData.set(days[i], JSON.parse(raw) as TrafficDay);
  });

  // ── Reference dates ─────────────────────────────────────────────────────────
  const today       = utcDate(0);
  const yesterday   = utcDate(1);
  const weekStart   = utcDate(6);   // 7-day window: today back 6 days
  const prevWkStart = utcDate(13);  // prior 7 days
  const prevWkEnd   = utcDate(7);
  const monthStart  = utcDate(29);  // 30-day window: today back 29 days
  const prevMoStart = utcDate(59);  // prior 30 days
  const prevMoEnd   = utcDate(30);

  const viewsFor = (d: string) => dayData.get(d)?.v ?? 0;

  function rangeViews(from: string, to: string): number {
    let total = 0;
    for (const [d, day] of dayData) {
      if (d >= from && d <= to) total += day.v;
    }
    return total;
  }

  const todayViews    = viewsFor(today);
  const yesterdayViews = viewsFor(yesterday);
  const weekViews     = rangeViews(weekStart,   today);
  const lastWeekViews = rangeViews(prevWkStart, prevWkEnd);
  const monthViews    = rangeViews(monthStart,  today);
  const lastMonthViews = rangeViews(prevMoStart, prevMoEnd);

  // ── Live visitors: sum last 5 per-minute KV buckets ─────────────────────────
  const now      = new Date();
  const liveKeys = Array.from({ length: 5 }, (_, i) => {
    const t = new Date(now.getTime() - i * 60_000);
    return `traffic:live:${t.toISOString().slice(0, 16)}`;
  });
  const liveVals = await Promise.all(liveKeys.map(k => kv.get(k)));
  const live     = liveVals.reduce((sum, v) => sum + (v ? parseInt(v, 10) : 0), 0);

  // ── Chart: last 30 days ascending ───────────────────────────────────────────
  const chart = days.slice(-30).map(date => ({
    date,
    views: dayData.get(date)?.v ?? 0,
    label: new Date(date + 'T00:00:00Z').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short',
    }),
  }));

  // ── Aggregate countries + sources over the last 30 days ─────────────────────
  const countryTotals: Record<string, number> = {};
  const sourceTotals:  Record<string, number> = {};
  let totalViews30 = 0;

  for (const [d, day] of dayData) {
    if (d >= monthStart && d <= today) {
      totalViews30 += day.v;
      for (const [loc, n] of Object.entries(day.c)) {
        // Heal fragmented keys written by the previous middleware version:
        // "IN|Unknown" / "IN|null" / "IN|" all collapse to bare "IN" so they
        // merge with old-format entries and don't appear as duplicate rows.
        const sepIdx   = loc.indexOf('|');
        const city     = sepIdx >= 0 ? loc.slice(sepIdx + 1) : '';
        const cleanLoc = (city && city !== 'Unknown' && city !== 'null')
          ? loc                                              // valid "IN|Pune"
          : (sepIdx >= 0 ? loc.slice(0, sepIdx) : loc);    // collapse to "IN"
        countryTotals[cleanLoc] = (countryTotals[cleanLoc] ?? 0) + n;
      }
      for (const [src,  n] of Object.entries(day.s)) sourceTotals[src]   = (sourceTotals[src]   ?? 0) + n;
    }
  }

  const countries = Object.entries(countryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([locationKey, count]) => {
      // Backwards-compatible: old entries are bare "IN"; new entries are "IN|Pune"
      const sep  = locationKey.indexOf('|');
      const code = sep >= 0 ? locationKey.slice(0, sep) : locationKey;
      const city = sep >= 0 ? locationKey.slice(sep + 1) : null;
      return {
        locationKey, code, city, count,
        name: city && city !== 'Unknown'
          ? `${city}, ${code}`
          : (COUNTRY_NAMES[code] ?? code),
        pct: totalViews30 > 0 ? Math.round((count / totalViews30) * 100) : 0,
      };
    });

  const sources = Object.entries(sourceTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => ({
      key, count,
      // For known platforms use the display label; for dynamic domains the key IS the display name
      name: SOURCE_LABELS[key] ?? key,
      pct:  totalViews30 > 0 ? Math.round((count / totalViews30) * 100) : 0,
    }));

  return json({
    live,
    today:       todayViews,
    yesterday:   yesterdayViews,
    week:        weekViews,
    lastWeek:    lastWeekViews,
    month:       monthViews,
    lastMonth:   lastMonthViews,
    todayTrend:  pctChange(todayViews,    yesterdayViews),
    weekTrend:   pctChange(weekViews,     lastWeekViews),
    monthTrend:  pctChange(monthViews,    lastMonthViews),
    chart,
    countries,
    sources,
  });
}
