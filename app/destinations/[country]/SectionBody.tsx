/**
 * Shared renderer for a country sub-page section (Why Study Here,
 * Application Procedure, …). Used by:
 *   • /destinations/[country]            — renders "Why Study Here" by default
 *   • /destinations/[country]/[section]  — renders the selected section
 */
export default function SectionBody({
  countryName, color, label, html,
}: {
  countryName: string;
  color:       string;
  label:       string;
  html:        string;
}) {
  return (
    <section className="section bg-white">
      <div className="container-xl">
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="mb-8">
            <div className="divider-amber mb-4" />
            <p className="label mb-2">{countryName} — 2026 Guide</p>
            <h2
              className="font-jakarta font-extrabold text-primary-600"
              style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}
            >
              {label}
            </h2>
          </div>

          {/* Rich content */}
          <div
            className="
              prose prose-slate max-w-none
              prose-headings:font-jakarta prose-headings:font-extrabold prose-headings:text-primary-600
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-slate-800
              prose-p:font-jakarta prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:font-jakarta prose-li:text-slate-600 prose-li:leading-relaxed
              prose-ul:my-4 prose-ol:my-4
              prose-strong:text-slate-800 prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-amber-400
              prose-blockquote:bg-amber-50 prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-3
              prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-table:text-sm prose-th:font-jakarta prose-th:font-semibold prose-th:text-primary-600
              prose-th:bg-primary-50 prose-td:font-jakarta prose-td:text-slate-600
              prose-table:border prose-table:border-slate-200 prose-td:border prose-td:border-slate-200
              prose-th:border prose-th:border-slate-200 prose-th:px-3 prose-th:py-2
              prose-td:px-3 prose-td:py-2
            "
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* ILOC CTA strip */}
          <div
            className="mt-12 rounded-2xl p-6 sm:p-8 border"
            style={{
              background:   `linear-gradient(135deg,${color}08,${color}14)`,
              borderColor:  `${color}30`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-jakarta font-bold text-slate-800 text-base mb-1">
                  Get personalised guidance for {countryName}
                </h3>
                <p className="font-jakarta text-sm text-slate-500">
                  Free 30-min session with ILOC · Zero pressure · Tailored scholarship strategy
                </p>
              </div>
              <a
                href="https://wa.me/919158577707"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 font-jakarta font-bold text-sm px-6 py-3 rounded-full text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
              >
                💬 Book via WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
