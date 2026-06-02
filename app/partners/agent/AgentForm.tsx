'use client';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

export default function AgentForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Partnership request submitted successfully. Our B2B team will contact you within 24 hours.');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Agency Name</label>
        <input required type="text" className={fieldCls} placeholder="Global Ed Consultants" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Years in Business</label>
          <select required className={fieldCls}>
            <option value="">Select…</option>
            <option value="0-2">0 – 2 Years</option>
            <option value="3-5">3 – 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Expected Volume (Yearly)</label>
          <select required className={fieldCls}>
            <option value="">Select…</option>
            <option value="1-20">1 – 20 Students</option>
            <option value="20-50">20 – 50 Students</option>
            <option value="50+">50+ Students</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Business Email</label>
          <input required type="email" className={fieldCls} placeholder="contact@agency.com" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
          <input required type="tel" className={fieldCls} placeholder="+91 98765 43210" />
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#3B71F3,#2458D9)' }}
      >
        Submit Agent Application →
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">We conduct a strict vetting process for all franchisees.</p>
    </form>
  );
}
