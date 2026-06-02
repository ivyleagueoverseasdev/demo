'use client';
export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📈 Analytics</h1>
      <p className="font-jakarta text-sm text-slate-400">Lead conversion stats and traffic insights via Cloudflare Web Analytics.</p>
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 text-white">
        <h3 className="font-jakarta font-bold text-lg mb-2 flex items-center gap-2">⚡ Cloudflare Web Analytics</h3>
        <p className="font-jakarta text-blue-100 text-sm leading-relaxed mb-4">
          Real-time page views, visitor geography, and traffic sources are tracked via Cloudflare Web Analytics — zero impact on site speed.
        </p>
        <a
          href="https://dash.cloudflare.com/?to=/:account/web-analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-indigo-900 font-jakarta font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow"
        >
          Open Dashboard ↗
        </a>
      </div>
    </div>
  );
}
