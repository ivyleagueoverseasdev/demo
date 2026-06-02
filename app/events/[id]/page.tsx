import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getEvents } from '@/lib/kv';
import { DEFAULT_EVENTS } from '@/lib/data';
import type { SiteEvent, EventType } from '@/lib/types';
import EventRegisterButton from './EventRegisterButton';
import EventBodyRenderer from './EventBodyRenderer';
import type { EventActionLink } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ── Type config ────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  webinar:  { label: 'Webinar',   color: '#246DFF', bg: '#EBF4FF', border: '#BFDBFE' },
  fair:     { label: 'Fair',      color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' },
  deadline: { label: 'Deadline',  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  workshop: { label: 'Workshop',  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  seminar:  { label: 'Seminar',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
};

const COUNTRY_LABELS: Record<string, string> = {
  usa:            '🇺🇸 USA',
  uk:             '🇬🇧 UK',
  australia:      '🇦🇺 Australia',
  canada:         '🇨🇦 Canada',
  'new-zealand':  '🇳🇿 New Zealand',
  ireland:        '🇮🇪 Ireland',
  europe:         '🇪🇺 Europe',
  uae:            '🇦🇪 UAE',
  japan:          '🇯🇵 Japan',
  'south-korea':  '🇰🇷 South Korea',
  singapore:      '🇸🇬 Singapore',
  russia:         '🇷🇺 Russia',
};

async function getEvent(id: string): Promise<SiteEvent | null> {
  const kvEvents = await getEvents().catch(() => []);
  const all = kvEvents.length > 0 ? kvEvents : DEFAULT_EVENTS;
  return all.find(e => e.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return { title: 'Event Not Found | ILOC' };
  return {
    title: `${event.title} | ILOC Events`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

// ── Action link icon + colour map ─────────────────────────────────────────
const ACTION_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  zoom:         { icon: '🎥', color: '#2D8CFF', bg: '#EBF4FF', label: 'Join Zoom'           },
  webinar:      { icon: '📡', color: '#7C3AED', bg: '#F5F3FF', label: 'Join Webinar'         },
  registration: { icon: '📋', color: '#059669', bg: '#ECFDF5', label: 'Register Now'         },
  external:     { icon: '🌐', color: '#246DFF', bg: '#EBF4FF', label: 'Open Link'            },
  whatsapp:     { icon: '💬', color: '#25D366', bg: '#ECFDF5', label: 'Register via WhatsApp' },
};

function ActionLinksBlock({ links }: { links: EventActionLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-4">Join or Register</h3>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {links.map((link, i) => {
          const cfg = ACTION_CONFIG[link.type] ?? ACTION_CONFIG.external;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-jakarta font-bold text-sm px-5 py-3 rounded-xl border transition-all hover:opacity-90 hover:shadow-md active:scale-95"
              style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.color}30` }}
            >
              <span className="text-base leading-none">{cfg.icon}</span>
              {link.label || cfg.label}
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event || !event.published) notFound();

  const cfg  = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.seminar;
  const days = daysUntil(event.date);
  const past = days < 0;

  return (
    <>
      {/* ── Hero banner ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 lg:py-20"
        style={{ background: 'linear-gradient(145deg,#1249C4 0%,#246DFF 55%,#246DFF 100%)' }}
      >
        {event.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={event.imageUrl}
              alt=""
              fill
              className="object-cover opacity-[0.12]"
              sizes="100vw"
              priority
            />
          </div>
        )}
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container-xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 font-jakarta text-xs text-white/50">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white/80 transition-colors">Events</Link>
            <span>/</span>
            <span className="text-white/75 truncate max-w-[200px]">{event.title}</span>
          </div>

          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="font-jakarta text-xs font-bold px-3 py-1 rounded-full border"
                style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
              >
                {cfg.label}
              </span>
              {event.country && COUNTRY_LABELS[event.country] && (
                <span className="font-jakarta text-xs font-medium bg-white/12 text-white/85 border border-white/20 px-3 py-1 rounded-full">
                  {COUNTRY_LABELS[event.country]}
                </span>
              )}
              {!past && days <= 7 && days >= 0 && (
                <span className="font-jakarta text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/30">
                  {days === 0 ? 'Happening Today!' : `${days} day${days === 1 ? '' : 's'} left`}
                </span>
              )}
              {past && (
                <span className="font-jakarta text-xs text-white/40 italic">This event has ended</span>
              )}
            </div>

            <h1
              className="font-jakarta font-extrabold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}
            >
              {event.title}
            </h1>
            <p className="font-jakarta text-white/75 leading-relaxed text-base max-w-2xl">
              {event.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Two-column body ────────────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container-xl">
          <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

            {/* Left — rich body content */}
            <div>
              {/* Key details bar */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📅</span>
                    <div>
                      <div className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Date</div>
                      <div className="font-jakarta font-semibold text-slate-800 text-sm">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">⏰</span>
                    <div>
                      <div className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Time</div>
                      <div className="font-jakarta font-semibold text-slate-800 text-sm">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📍</span>
                    <div>
                      <div className="font-jakarta text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Location</div>
                      <div className="font-jakarta font-semibold text-slate-800 text-sm">{event.location}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <h3 className="font-jakarta font-bold text-slate-800 text-sm mb-3">Speakers</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.speakers.map(s => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 font-jakarta text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">🎤</span>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action links — Zoom, Webinar, Registration */}
              {event.actionLinks && event.actionLinks.length > 0 && (
                <ActionLinksBlock links={event.actionLinks} />
              )}

              {/* Rich body */}
              {event.body ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <EventBodyRenderer body={event.body} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-jakarta text-slate-500 text-sm">
                    Detailed agenda coming soon. Register now to receive full details via email.
                  </p>
                </div>
              )}

              {/* Back link */}
              <div className="mt-8">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 font-jakarta text-sm font-semibold text-primary-600 hover:text-amber-600 transition-colors"
                >
                  ← Back to all events
                </Link>
              </div>
            </div>

            {/* Right — sticky registration card */}
            <div className="lg:sticky lg:top-24">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(36,109,255,0.10)',
                  boxShadow: '0 8px 40px rgba(36,109,255,0.10), 0 0 0 1px rgba(255,255,255,0.9) inset',
                }}
              >
                {/* Accent top bar */}
                <div className="h-1.5" style={{ background: `linear-gradient(to right,${cfg.color},#D97706)` }} />

                <div className="p-6">
                  <h3 className="font-jakarta font-extrabold text-slate-800 text-lg mb-1">{event.ctaLabel || 'Register Free'}</h3>
                  <p className="font-jakarta text-xs text-slate-400 mb-5">Free to attend · No hidden fees · Seats limited</p>

                  {/* Event quick facts */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '📅', label: 'Date',     value: formatDate(event.date)    },
                      { icon: '⏰', label: 'Time',     value: event.time                },
                      { icon: '📍', label: 'Location', value: event.location            },
                      ...(event.seats ? [{ icon: '🪑', label: 'Seats Left', value: `${event.seats} remaining` }] : []),
                    ].map(row => (
                      <div key={row.label} className="flex items-start gap-3">
                        <span className="text-base flex-shrink-0 mt-0.5">{row.icon}</span>
                        <div>
                          <div className="font-jakarta text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{row.label}</div>
                          <div className="font-jakarta text-sm text-slate-700 font-medium">{row.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Seats urgency bar */}
                  {event.seats && event.seats <= 50 && !past && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <span className="font-jakarta text-xs font-bold text-red-600">
                          Only {event.seats} seats left
                        </span>
                      </div>
                      <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.max(10, 100 - (event.seats / 150) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA button */}
                  {!past ? (
                    <EventRegisterButton
                      ctaLabel={event.ctaLabel || 'Register for Free'}
                      ctaUrl={event.ctaUrl}
                      cfg={cfg}
                    />
                  ) : (
                    <div className="w-full text-center font-jakarta text-sm text-slate-400 py-3 border border-slate-200 rounded-xl">
                      This event has ended
                    </div>
                  )}

                  {/* Action links in sidebar */}
                  {event.actionLinks && event.actionLinks.length > 0 && !past && (
                    <div className="mt-3 space-y-2">
                      {event.actionLinks.map((link, i) => {
                        const cfg2 = ACTION_CONFIG[link.type] ?? ACTION_CONFIG.external;
                        return (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 font-jakarta font-semibold text-sm py-2.5 rounded-xl border transition-all hover:opacity-90"
                            style={{ color: cfg2.color, background: cfg2.bg, borderColor: `${cfg2.color}30` }}
                          >
                            <span>{cfg2.icon}</span>
                            {link.label || cfg2.label}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  <p className="font-jakarta text-center text-[11px] text-slate-400 mt-3">
                    No obligation · Free expert consultation
                  </p>

                  {/* Divider + secondary option */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="font-jakarta text-[11px] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>

                  <a
                    href="https://wa.me/919158577707?text=Hi!%20I%20am%20interested%20in%20registering%20for%20an%20upcoming%20ILOC%20event.%20Could%20you%20please%20share%20the%20details%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 font-jakarta font-semibold text-sm py-3 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
                  >
                    💬 Register via WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['✅ 97% Visa Approval', '🎓 10,000+ Placed', '₹0 Event Fee'].map(b => (
                  <span
                    key={b}
                    className="font-jakarta text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
