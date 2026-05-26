'use client';

export default function ReferralForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Referral submitted successfully. Thank you!');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="You (The Referrer)" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Friend's Name</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="Friend's Full Name" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Friend's Phone</label>
          <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="+91 9876543210" />
        </div>
      </div>
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Target Country (Optional)</label>
        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all">
          <option value="">Select a country...</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other / Not Sure</option>
        </select>
      </div>
      <button type="submit" className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-jakarta font-bold text-sm py-4 rounded-xl shadow-amber transition-all active:scale-[0.98]">
        Submit Referral →
      </button>
      <p className="text-center text-xs text-slate-400 mt-4 font-jakarta">We respect privacy. No spam, just a professional introduction.</p>
    </form>
  );
}
