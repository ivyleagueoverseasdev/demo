'use client';

export default function AgentForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Partnership request submitted successfully. Our B2B team will contact you.');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Agency Name</label>
        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="Global Ed Consultants" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Years in Business</label>
          <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
            <option value="">Select...</option>
            <option value="0-2">0 - 2 Years</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Expected Volume (Yearly)</label>
          <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
            <option value="">Select...</option>
            <option value="1-20">1 - 20 Students</option>
            <option value="20-50">20 - 50 Students</option>
            <option value="50+">50+ Students</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Business Email</label>
          <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="contact@agency.com" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
          <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="+91 9876543210" />
        </div>
      </div>
      <button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-jakarta font-bold text-sm py-4 rounded-xl shadow-blue transition-all active:scale-[0.98]">
        Submit Agent Application →
      </button>
      <p className="text-center text-xs text-slate-400 mt-4 font-jakarta">We conduct a strict vetting process for all franchisees.</p>
    </form>
  );
}
