'use client';

// Admin layout — persistent sidebar + main content area.
// The sidebar is client-only (uses localStorage for auth check).
// Individual tab pages are rendered as {children}.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext, ToastContext } from './_context';

// ── Nav item definition ───────────────────────────────────────────────────────
interface NavItem {
  id:    string;
  label: string;
  icon:  string;
  href:  string;
  group: 'content' | 'site' | 'system';
}

const NAV: NavItem[] = [
  // Content
  { id: 'overview',      label: 'Overview',        icon: '◉',  href: '/admin',                group: 'content' },
  { id: 'media',         label: 'Media Library',   icon: '🖼',  href: '/admin/media',           group: 'content' },
  { id: 'pages',         label: 'Pages',           icon: '📄',  href: '/admin/pages',           group: 'content' },
  { id: 'events',        label: 'Events & Classes',icon: '📅',  href: '/admin/events',          group: 'content' },
  { id: 'news',          label: 'News',            icon: '📰',  href: '/admin/news',            group: 'content' },
  { id: 'stories',       label: 'Testimonials',    icon: '⭐',  href: '/admin/stories',         group: 'content' },
  { id: 'enquiries',     label: 'Enquiries',       icon: '📬',  href: '/admin/enquiries',       group: 'content' },
  // Site
  { id: 'homepage',      label: 'Homepage',        icon: '🏠',  href: '/admin/homepage',        group: 'site'    },
  { id: 'hero',          label: 'Hero Slides',     icon: '🎠',  href: '/admin/hero',            group: 'site'    },
  { id: 'marquee',       label: 'University Logos',icon: '🎓',  href: '/admin/marquee',         group: 'site'    },
  { id: 'about',         label: 'About Page',      icon: 'ℹ️',  href: '/admin/about',           group: 'site'    },
  { id: 'services',      label: 'Services Page',   icon: '🛠',  href: '/admin/services',        group: 'site'    },
  { id: 'partners',      label: 'Partners B2B',    icon: '🤝',  href: '/admin/partners',        group: 'site'    },
  { id: 'countries',     label: 'Country Pages',   icon: '🌍',  href: '/admin/countries',       group: 'site'    },
  { id: 'general',       label: 'General Info',    icon: '🏢',  href: '/admin/general',         group: 'site'    },
  { id: 'global',        label: 'Global Settings', icon: '⚙️',  href: '/admin/global',          group: 'site'    },
  // System
  { id: 'analytics',     label: 'Analytics',       icon: '📈',  href: '/admin/analytics',       group: 'system'  },
  { id: 'routes',        label: 'Redirects',       icon: '↗',   href: '/admin/routes',          group: 'system'  },
  { id: 'history',       label: 'Audit Log',       icon: '🕒',  href: '/admin/history',         group: 'system'  },
];

const GROUP_LABELS: Record<NavItem['group'], string> = {
  content: 'Content',
  site:    'Site Config',
  system:  'System',
};

// Distinct colour per sidebar tab so each is easy to tell apart at a glance.
// Indexed by the item's position in NAV; cycles if more items are added.
const NAV_TAB_COLORS = [
  '#60A5FA', '#A78BFA', '#F472B6', '#FBBF24', '#34D399', '#22D3EE',
  '#FB923C', '#A3E635', '#F87171', '#818CF8', '#2DD4BF', '#E879F9',
  '#FACC15', '#4ADE80', '#38BDF8', '#FB7185', '#C084FC', '#5EEAD4',
];
const colorForNav = (id: string) =>
  NAV_TAB_COLORS[Math.max(0, NAV.findIndex(n => n.id === id)) % NAV_TAB_COLORS.length];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const groups = (['content', 'site', 'system'] as const);

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <aside
      className="flex-shrink-0 flex flex-col bg-slate-900 transition-all duration-200"
      style={{ width: collapsed ? 60 : 220 }}
    >
      {/* Logo row */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-slate-700/60">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              IL
            </div>
            <span className="font-jakarta font-bold text-white text-sm truncate">ILOC Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-xs text-white mx-auto">
            IL
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800 flex-shrink-0 ml-1"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {collapsed
              ? <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              : <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            }
          </svg>
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-5">
        {groups.map(group => {
          const items = NAV.filter(n => n.group === group);
          return (
            <div key={group}>
              {!collapsed && (
                <p className="font-jakarta text-[9px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-1.5">
                  {GROUP_LABELS[group]}
                </p>
              )}
              <ul className="space-y-0.5 px-2">
                {items.map(item => {
                  const active = isActive(item.href);
                  const color  = colorForNav(item.id);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`
                          flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-150
                          ${active
                            ? 'text-white font-semibold'
                            : 'text-slate-300 hover:text-white'
                          }
                        `}
                        style={
                          active
                            ? { background: `${color}33`, boxShadow: `inset 3px 0 0 ${color}` }
                            : { background: `${color}14` }
                        }
                      >
                        <span className="text-base flex-shrink-0 w-5 text-center leading-none" style={{ color }}>{item.icon}</span>
                        {!collapsed && (
                          <span className="font-jakarta truncate text-[13px]">{item.label}</span>
                        )}
                        {active && !collapsed && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/60 p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          title={collapsed ? 'View site' : undefined}
        >
          <span className="text-base flex-shrink-0 w-5 text-center">↗</span>
          {!collapsed && <span className="font-jakarta text-[13px]">View Site</span>}
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all text-sm"
          title={collapsed ? 'Sign out' : undefined}
        >
          <span className="text-base flex-shrink-0 w-5 text-center">⏻</span>
          {!collapsed && <span className="font-jakarta text-[13px]">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        // Surface the exact backend error (e.g. "CONTENT_KV binding is missing")
        const body = await res.json().catch(() => ({})) as { error?: string; details?: string };
        const msg  = body.error ?? body.details ?? `HTTP ${res.status}`;
        setErr(msg);
        console.error('[login] failed:', body);
        setBusy(false);
        return;
      }
      const data = await res.json() as { token?: string };
      if (!data.token) {
        setErr('Login response missing token — check server logs.');
        setBusy(false);
        return;
      }
      localStorage.setItem('iloc_admin_token', data.token);
      onLogin(data.token);
    } catch (networkErr: unknown) {
      const msg = networkErr instanceof Error ? networkErr.message : 'Network error';
      setErr(`Network error: ${msg}`);
      console.error('[login] network error:', networkErr);
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
        <div className="p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-sm text-white">IL</div>
            <div>
              <div className="font-jakarta font-bold text-slate-800">ILOC Admin</div>
              <div className="font-jakarta text-xs text-slate-400">Content Management</div>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-jakarta text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setErr(''); }}
                className="w-full font-jakarta text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 text-slate-800 placeholder-slate-300"
                placeholder="••••••••"
                autoFocus
              />
              {err && <p className="font-jakarta text-xs text-red-500 mt-1.5">{err}</p>}
            </div>
            <button
              type="submit"
              disabled={busy || !pw}
              className="w-full font-jakarta font-bold text-sm text-white py-3 rounded-xl disabled:opacity-50 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
            >
              {busy ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
          <div className="text-center mt-5">
            <Link href="/" className="font-jakarta text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root layout ───────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const isLoginPage = pathname.startsWith('/admin/login');

  // All hooks must be declared unconditionally before any early returns.
  const [token,     setToken]     = useState('');
  const [mounted,   setMounted]   = useState(false);
  const [checking,  setChecking]  = useState(true);
  const [toast,     setToast]     = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    // Skip auth bootstrap on the login / reset pages.
    if (isLoginPage) return;
    setMounted(true);
    const stored = localStorage.getItem('iloc_admin_token');
    if (!stored) { setChecking(false); return; }

    // Verify the stored token is still a live KV session BEFORE showing the
    // dashboard — otherwise an expired session looks logged-in but every
    // save fails with "Unauthorized".
    fetch('/api/system/status', { headers: { Authorization: `Bearer ${stored}` }, cache: 'no-store' })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('iloc_admin_token');
          setToken('');
        } else {
          // 200 (valid) or transient 5xx (don't log out on server hiccups)
          setToken(stored);
        }
      })
      .catch(() => setToken(stored)) // network blip — keep the session
      .finally(() => setChecking(false));
  }, [isLoginPage]);

  function handleLogin(t: string) { setToken(t); }

  function handleLogout() {
    localStorage.removeItem('iloc_admin_token');
    setToken('');
  }

  function flash(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  // Login / reset pages render without the admin shell.
  if (isLoginPage) return <>{children}</>;

  if (!mounted) return null;
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="font-jakarta text-sm text-slate-400 animate-pulse">Verifying session…</p>
      </div>
    );
  }
  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const toastColors = {
    success: 'bg-emerald-600',
    error:   'bg-red-600',
    info:    'bg-lime-600',
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ToastContext.Provider value={{ flash }}>
        <div className="flex h-screen bg-slate-50 overflow-hidden font-jakarta">
          {/* Sidebar */}
          <AdminSidebar onLogout={handleLogout} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top bar */}
            <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="font-jakarta text-xs text-slate-400">
                  Cloudflare KV Edge CMS · changes go live immediately
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-jakarta text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live on Edge
                </span>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[9999] ${toastColors[toastType]} text-white font-jakarta font-semibold text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2`}>
            <span>{toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ'}</span>
            {toast}
          </div>
        )}
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}
