'use client';
export default function AdminEventsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-jakarta font-extrabold text-slate-800 text-2xl">📅 Events &amp; Classes</h1>
      <p className="font-jakarta text-sm text-slate-400">Manage live classes and events shown on /events. Full editor coming in the next update.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-jakarta text-sm text-amber-800 font-semibold mb-1">Temporary</p>
        <p className="font-jakarta text-xs text-amber-700">
          Use the legacy admin tab system while this page is being migrated.{' '}
          The old admin page has been preserved at <code className="bg-amber-100 px-1 rounded">/admin-legacy</code> during the transition.
        </p>
      </div>
    </div>
  );
}
