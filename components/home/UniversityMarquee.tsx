import { UNIS_MARQUEE } from '@/lib/data';

export default function UniversityMarquee() {
  const doubled = [...UNIS_MARQUEE, ...UNIS_MARQUEE];

  return (
    <section className="py-10 bg-primary-50 border-y border-primary-100 overflow-hidden" aria-hidden="true">
      <p className="text-center font-jakarta text-xs font-semibold tracking-widest uppercase text-primary-400 mb-5">
        Our students have enrolled at
      </p>
      <div className="relative"
        style={{ WebkitMaskImage: 'linear-gradient(to right,transparent,black 6%,black 94%,transparent)', maskImage: 'linear-gradient(to right,transparent,black 6%,black 94%,transparent)' }}>
        <div className="flex gap-6 items-center whitespace-nowrap marquee-track">
          {doubled.map((u, i) => (
            <span key={i} className="flex-shrink-0 flex items-center gap-2 font-jakarta text-xs font-medium text-primary-600/70">
              <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
              {u}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
