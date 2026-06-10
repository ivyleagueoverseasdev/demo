'use client';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

export default function InstitutionsForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Partnership request submitted successfully. Our B2B team will contact you within 24 hours.');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">University / Institution Name</label>
        <input required type="text" className={fieldCls} placeholder="e.g. University of Technology Sydney" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Contact Person</label>
          <input required type="text" className={fieldCls} placeholder="John Doe" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
          <input required type="text" className={fieldCls} placeholder="Admissions Director" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Official Email</label>
          <input required type="email" className={fieldCls} placeholder="john@university.edu" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Country</label>
          <input required type="text" className={fieldCls} placeholder="Australia" />
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#65A30D,#3F6212)' }}
      >
        Submit Partnership Request →
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">Your information is secure and encrypted.</p>
    </form>
  );
}
