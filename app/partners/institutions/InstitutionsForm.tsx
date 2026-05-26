'use client';

export default function InstitutionsForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Partnership request submitted successfully. Our B2B team will contact you.');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">University / Institution Name</label>
        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="e.g. University of Technology Sydney" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Contact Person</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="John Doe" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="Admissions Director" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Official Email</label>
          <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="john@university.edu" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Country</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="Australia" />
        </div>
      </div>
      <button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-jakarta font-bold text-sm py-4 rounded-xl shadow-blue transition-all active:scale-[0.98]">
        Submit Partnership Request →
      </button>
      <p className="text-center text-xs text-slate-400 mt-4 font-jakarta">Your information is secure and encrypted.</p>
    </form>
  );
}
