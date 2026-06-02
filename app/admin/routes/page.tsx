'use client';
export default function AdminRoutesPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">↗ Redirects</h1>
      <p className="font-jakarta text-sm text-slate-400">Manage 301/302 URL redirect rules stored in Cloudflare KV. Full editor coming soon.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-jakarta text-xs text-amber-700">Full module coming soon. Legacy admin remains functional.</p>
      </div>
    </div>
  );
}
