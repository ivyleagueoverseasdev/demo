'use client';
export default function AdminNewsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📰 News &amp; Articles</h1>
      <p className="font-jakarta text-sm text-slate-400">Write and manage articles shown on /news. Full editor coming in the next update.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-jakarta text-sm text-amber-800 font-semibold mb-1">Temporary</p>
        <p className="font-jakarta text-xs text-amber-700">Full module coming soon. Legacy admin remains functional.</p>
      </div>
    </div>
  );
}
