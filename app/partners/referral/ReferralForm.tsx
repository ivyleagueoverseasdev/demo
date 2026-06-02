'use client';

const fieldCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-jakarta focus:ring-2 focus:ring-partner-300 focus:border-partner-500 outline-none transition-all placeholder-slate-400 text-slate-800';

export default function ReferralForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.alert('Referral submitted successfully. Thank you! We will be in touch shortly.');
      }}
    >
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
        <input required type="text" className={fieldCls} placeholder="You (The Referrer)" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Friend's Name</label>
          <input required type="text" className={fieldCls} placeholder="Friend's Full Name" />
        </div>
        <div>
          <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Friend's Phone</label>
          <input required type="tel" className={fieldCls} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div>
        <label className="block font-jakarta text-sm font-semibold text-slate-700 mb-1.5">Target Country <span className="font-normal text-slate-400">(Optional)</span></label>
        <select className={fieldCls}>
          <option value="">Select a country…</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other / Not Sure</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full mt-2 text-white font-jakarta font-bold text-sm py-4 rounded-xl transition-all active:scale-[0.98] hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#3B71F3,#2458D9)' }}
      >
        Submit Referral →
      </button>
      <p className="text-center text-xs text-slate-400 font-jakarta">We respect privacy. No spam, just a professional introduction.</p>
    </form>
  );
}
