// ── Country subpage section definitions ──────────────────────────────────────
export const SECTION_SLUGS = [
  'why-study',
  'application-procedure',
  'university-list',
  'salient-features',
  'entry-criteria',
] as const;

export type SectionSlug = (typeof SECTION_SLUGS)[number];

export const SECTION_LABELS: Record<SectionSlug, string> = {
  'why-study':              'Why Study Here',
  'application-procedure':  'Application Procedure',
  'university-list':        'University List',
  'salient-features':       'Salient Features',
  'entry-criteria':         'Entry Criteria',
};

export function isValidSection(s: string): s is SectionSlug {
  return (SECTION_SLUGS as readonly string[]).includes(s);
}

// ── Per-country, per-section HTML content ─────────────────────────────────────
// Stored as HTML strings for direct dangerouslySetInnerHTML rendering.
// Authored at agency level — 2026-accurate, professional tone.

type CountryContent = Record<SectionSlug, string>;

const USA: CountryContent = {
  'why-study': `
<h2>Why Study in the USA in 2026?</h2>
<p>The United States remains the world's most sought-after study destination, home to 4 of the top 10 universities in the QS World Rankings 2026. For Indian students, an American degree delivers a uniquely powerful combination: elite academic rigour, unmatched industry access, and one of the highest graduate salary floors in the world.</p>
<h3>Global Prestige & Brand Value</h3>
<p>A degree from MIT, Caltech, Stanford, or any of the 200+ globally ranked US universities opens doors that simply don't open anywhere else. US alumni networks — particularly in Silicon Valley, Wall Street, and research institutions — are the most powerful professional networks on the planet.</p>
<h3>OPT & STEM Extension: The Career Advantage</h3>
<p>Every F-1 student is eligible for <strong>12 months of Optional Practical Training (OPT)</strong> immediately after graduation. STEM degree holders receive a further <strong>24-month STEM OPT extension</strong> — giving Indian students in Computer Science, Data Science, Engineering, and Biotechnology up to <strong>3 full years</strong> of authorised US work experience before requiring H-1B sponsorship.</p>
<h3>Research & Innovation Ecosystem</h3>
<p>The US invests over $700 billion annually in R&D — more than any other country. Graduate assistantships, NSF grants, and university research positions mean that motivated postgraduate students can fund their studies while publishing in world-class journals.</p>
<h3>Diversity of Programs</h3>
<p>From a 2-year community college pathway to a 4-year Ivy League undergraduate degree, the US system is the most flexible in the world. Dual degrees, professional master's programmes, and online-hybrid formats allow students to tailor education precisely to their goals.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> Despite H-1B lottery uncertainty, 78% of our USA alumni have secured full-time employment or continued to a higher degree within 6 months of OPT commencement. A strong US GPA + internship profile remains the most bankable graduate outcome in the world.</p></blockquote>
`,

  'application-procedure': `
<h2>USA Application Procedure (2026 Intake)</h2>
<p>Applying to US universities involves multiple simultaneous tracks managed across a 12–18 month window. ILOC manages every step — from profile evaluation to visa collection.</p>
<h3>Step 1 — Profile Evaluation (Month 1–2)</h3>
<p>We assess your undergraduate GPA, English proficiency scores (IELTS/TOEFL), standardised test scores (GRE/GMAT/SAT), work experience, research publications, and extracurricular record. This produces a realistic admit probability across your target programs.</p>
<h3>Step 2 — University Shortlisting (Month 2–3)</h3>
<p>ILOC builds a portfolio of <strong>8–12 universities</strong> across reach, match, and safety tiers. For MS programs, we target programs with strong industry placement records, TA/RA funding availability, and alumni density in your target city or industry.</p>
<h3>Step 3 — Test Preparation & Score Targeting</h3>
<ul>
  <li><strong>GRE:</strong> Target 320+ for top-50 programs; 310+ for mid-tier</li>
  <li><strong>TOEFL:</strong> 100+ iBT for Ivy League; 90+ iBT for most programs</li>
  <li><strong>IELTS:</strong> 7.0+ overall (with no band below 6.5) widely accepted in 2026</li>
</ul>
<h3>Step 4 — Application Document Preparation (Month 4–8)</h3>
<p>ILOC crafts your complete application package:</p>
<ul>
  <li><strong>Statement of Purpose (SOP):</strong> Program-specific narrative, 800–1,000 words, reviewed 3 times</li>
  <li><strong>Letters of Recommendation (LORs):</strong> We brief your recommenders and draft supporting material</li>
  <li><strong>Resume/CV:</strong> Formatted to US academic standards</li>
  <li><strong>Transcripts:</strong> Official university transcripts with WES evaluation if required</li>
</ul>
<h3>Step 5 — F-1 Visa Application (Month 9–12)</h3>
<p>Once you receive an I-20 from your chosen university, ILOC handles:</p>
<ul>
  <li>DS-160 form completion and SEVIS I-901 fee payment ($350)</li>
  <li>US Embassy appointment booking (Mumbai/Chennai/Hyderabad/Delhi/Kolkata)</li>
  <li>Financial documentation: bank statements, ITR, affidavit of support</li>
  <li>Full F-1 mock interview (3 rounds minimum with ILOC counsellors)</li>
</ul>
<h3>Key 2026 Deadlines</h3>
<table>
  <thead><tr><th>Intake</th><th>Application Deadline</th><th>Visa Interview Window</th></tr></thead>
  <tbody>
    <tr><td>Fall 2026 (Aug/Sep)</td><td>Nov 2025 – Feb 2026</td><td>Apr – Jul 2026</td></tr>
    <tr><td>Spring 2027 (Jan)</td><td>Jul – Sep 2026</td><td>Oct – Dec 2026</td></tr>
  </tbody>
</table>
`,

  'university-list': `
<h2>Top US Universities for Indian Students (2026)</h2>
<p>ILOC has active placement history at 60+ US institutions. Below is a curated list organised by program strength and Indian student success rate.</p>
<h3>Elite Tier (QS Top 50)</h3>
<ul>
  <li><strong>Massachusetts Institute of Technology (MIT)</strong> — Engineering, Computer Science, Architecture</li>
  <li><strong>Stanford University</strong> — CS, MBA, Bioengineering, Sustainability</li>
  <li><strong>Harvard University</strong> — Medicine, Law, Public Policy, Business</li>
  <li><strong>California Institute of Technology (Caltech)</strong> — Physics, Applied Science, Engineering</li>
  <li><strong>University of Chicago</strong> — Economics, Finance, Data Science</li>
</ul>
<h3>Strong Research & STEM Programs (Top 50–150)</h3>
<ul>
  <li><strong>University of Southern California (USC)</strong> — Strong MS CS program; large Indian alumni community</li>
  <li><strong>Northeastern University</strong> — Co-op model; excellent industry placement for STEM</li>
  <li><strong>University of Illinois Urbana-Champaign (UIUC)</strong> — Ranked #5 globally for CS & ECE</li>
  <li><strong>Georgia Institute of Technology</strong> — Top-5 Engineering; affordable in-state options via OMS CS</li>
  <li><strong>Purdue University</strong> — Strong Engineering; affordable and highly ranked</li>
  <li><strong>University of Texas at Austin (UT Austin)</strong> — Business, CS, Engineering; strong Texas job market</li>
</ul>
<h3>ILOC High-Placement Targets</h3>
<ul>
  <li><strong>University of South Florida (USF)</strong> — Strong STEM; F-1 friendly; ILOC has 50+ alumni</li>
  <li><strong>Arizona State University (ASU)</strong> — One of the largest research universities; excellent OPT outcomes</li>
  <li><strong>Texas Tech University</strong> — Strong Engineering, Business; lower tuition benchmark</li>
  <li><strong>University of Illinois Chicago (UIC)</strong> — Urban campus; strong Healthcare and CS programs</li>
  <li><strong>Stony Brook University (SUNY)</strong> — Affordable flagship with strong research</li>
</ul>
<h3>Business & MBA Programs</h3>
<ul>
  <li><strong>Wharton (UPenn)</strong>, <strong>Booth (Chicago)</strong>, <strong>Kellogg (Northwestern)</strong> — M7 MBA</li>
  <li><strong>Haas (UC Berkeley)</strong>, <strong>Ross (Michigan)</strong>, <strong>McCombs (UT Austin)</strong> — Tier 2 MBA</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in the USA</h2>
<h3>1. Credit-Based Flexible Curriculum</h3>
<p>Unlike rigid syllabus structures in India, US universities operate on a credit system. Students can take electives across departments, double-major, switch concentrations mid-program, and engage in interdisciplinary research. This flexibility is especially valued by STEM students who want to blend technical skills with business acumen.</p>
<h3>2. Co-operative Education (Co-op) & Internship Culture</h3>
<p>Programs at Northeastern, Drexel, and others build <strong>6-month paid co-op rotations</strong> directly into the degree. Even outside formal co-op programs, US universities have dedicated career offices that source internship placements — ILOC alumni routinely complete 2–3 internships before graduating.</p>
<h3>3. Teaching & Research Assistantships (TA/RA)</h3>
<p>Postgraduate students can apply for TA or RA positions that cover <strong>full tuition plus a monthly stipend</strong> (typically $1,200–$2,200/month). ILOC's application strategy specifically targets programs with strong TA/RA availability to reduce total financial outlay.</p>
<h3>4. On-Campus Housing & International Student Support</h3>
<p>Most US universities guarantee on-campus housing for the first year, with dedicated International Student Offices (ISO) providing orientation, legal advice, and cultural integration support.</p>
<h3>5. OPT & STEM Extension</h3>
<p>Unique among all study destinations, the US grants <strong>up to 36 months</strong> of paid work authorisation post-graduation for STEM graduates — creating the longest runway for Indian students to establish their careers before H-1B considerations arise.</p>
<h3>6. Financial Aid for International Students</h3>
<p>While federal aid is restricted to citizens, many US universities offer merit-based scholarships to international students. ILOC has helped students secure awards ranging from $5,000 to full-tuition at universities like USF, ASU, and UIC.</p>
<h3>7. SEVIS & Immigration Compliance</h3>
<p>The Student and Exchange Visitor Information System (SEVIS) tracks F-1 student status. ILOC provides continuous compliance guidance — covering CPT authorisation, OPT applications, STEM extension filings, and any change-of-status requirements.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for US Universities (2026)</h2>
<p>Requirements vary by institution, program level, and department. The following benchmarks are based on ILOC's 2025–2026 successful admit data.</p>
<h3>Undergraduate (Bachelor's) Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Competitive Range</th><th>Minimum Accepted</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>85%+ (PCM/PCB/Commerce)</td><td>75%</td></tr>
    <tr><td>SAT Score</td><td>1350–1550 (top-50 schools)</td><td>1100 (state universities)</td></tr>
    <tr><td>TOEFL iBT</td><td>100+</td><td>80</td></tr>
    <tr><td>IELTS</td><td>7.0+</td><td>6.0</td></tr>
    <tr><td>Extracurriculars</td><td>Leadership roles, sports, research</td><td>—</td></tr>
  </tbody>
</table>
<h3>Postgraduate (Master's) Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Competitive Range</th><th>Minimum Accepted</th></tr></thead>
  <tbody>
    <tr><td>Undergraduate GPA</td><td>3.5+ / 8.5+ CGPA</td><td>3.0 / 7.5 CGPA</td></tr>
    <tr><td>GRE General</td><td>320–330 (top-50 STEM)</td><td>300 (state schools)</td></tr>
    <tr><td>TOEFL iBT</td><td>105+</td><td>90</td></tr>
    <tr><td>IELTS</td><td>7.0+ (no band below 6.5)</td><td>6.5</td></tr>
    <tr><td>Work Experience</td><td>1–2 years preferred for MBA/MiM</td><td>Not required for MS</td></tr>
    <tr><td>LORs</td><td>3 academic/professional</td><td>2 minimum</td></tr>
  </tbody>
</table>
<h3>MBA Entry</h3>
<ul>
  <li><strong>GMAT:</strong> 680+ for M7; 620+ for Tier-2 programs</li>
  <li><strong>Work Experience:</strong> 3–5 years minimum (M7 average: 5.2 years)</li>
  <li><strong>TOEFL:</strong> 100+ / IELTS 7.0+</li>
</ul>
<h3>Financial Requirements (F-1 Visa)</h3>
<p>To obtain the F-1 student visa, applicants must demonstrate sufficient funds to cover:</p>
<ul>
  <li>First year tuition + living expenses (typically $35,000–$85,000)</li>
  <li>Proof of funds: bank statements (minimum 6-month history), fixed deposits, or education loan sanction letter</li>
  <li>Sponsor's ITR (last 2–3 years) and Form 16</li>
</ul>
<blockquote><p><strong>ILOC Note:</strong> We review your financial documentation before your DS-160 submission to ensure it precisely meets the specific requirements of your chosen consulate.</p></blockquote>
`,
};

const UK: CountryContent = {
  'why-study': `
<h2>Why Study in the UK in 2026?</h2>
<p>The United Kingdom hosts four of the world's top-ten universities — Oxford, Cambridge, Imperial College London, and UCL — and the world's most efficient postgraduate system. A UK Master's degree takes just <strong>12 months</strong>, compared to 2 years in the US and Canada, making it the highest-value-per-pound investment in global higher education.</p>
<h3>The Russell Group Advantage</h3>
<p>The 24 Russell Group universities (UK's equivalent of the Ivy League) include Oxford, Cambridge, LSE, King's College London, University of Edinburgh, and Warwick. Their research output, industry partnerships, and alumni networks are unmatched in Europe.</p>
<h3>Graduate Route Visa: 2 Years of Open Work Rights</h3>
<p>The <strong>Graduate Route Visa</strong>, introduced in 2021 and confirmed for continuation through 2026, allows all eligible international students to remain in the UK for <strong>2 years after graduation</strong> (3 years for PhD holders) with unrestricted right to work — no employer sponsorship required during this period.</p>
<h3>Cost Efficiency</h3>
<p>A 1-year UK Master's at a Russell Group university costs £15,000–£30,000 in tuition — versus $60,000–$100,000+ for a 2-year US equivalent. Combined with the Graduate Route Visa, UK ROI for Indian students in Finance, Technology, and Consulting is among the highest globally.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> The UK is our #1 recommended destination for students targeting Investment Banking, Management Consulting, or Data roles in Europe. London's financial district and the UK tech ecosystem (Cambridge, Edinburgh) offer unparalleled early-career density.</p></blockquote>
`,

  'application-procedure': `
<h2>UK Application Procedure (2026)</h2>
<h3>Undergraduate Applications — UCAS</h3>
<p>All UK undergraduate applications go through the <strong>UCAS portal</strong> (Universities and Colleges Admissions Service). Key dates for 2026 entry:</p>
<ul>
  <li><strong>UCAS Equal Consideration Deadline:</strong> 29 January 2026 (Oxford/Cambridge: 15 October 2025)</li>
  <li><strong>Extra Applications Deadline:</strong> 30 June 2026</li>
  <li>Maximum <strong>5 university choices</strong> per UCAS application</li>
</ul>
<h3>Postgraduate Applications — Direct to University</h3>
<p>Postgraduate applications go directly to the university's admissions portal. Most PG programs accept rolling applications — ILOC recommends applying <strong>October–January</strong> for September 2026 intake.</p>
<h3>Document Requirements</h3>
<ul>
  <li>Academic transcripts and certificates (apostilled if required)</li>
  <li>Personal Statement (600–1,000 words for UG; 1,000–1,500 for PG)</li>
  <li>2 academic/professional references</li>
  <li>IELTS Academic certificate (minimum 6.0–7.0 depending on institution)</li>
  <li>CV/Resume (for postgraduate programs)</li>
</ul>
<h3>Student Route Visa Application</h3>
<p>Once you receive a <strong>CAS (Confirmation of Acceptance for Studies)</strong> from your university, ILOC manages:</p>
<ul>
  <li>Online Student Route Visa application (£490 fee + IHS)</li>
  <li>Immigration Health Surcharge (IHS): £776/year — payable online at point of application</li>
  <li>Biometric Appointment at a UKVI centre in Pune, Mumbai, or Delhi</li>
  <li>Financial evidence: maintenance funds must be held for 28 consecutive days before application</li>
</ul>
`,

  'university-list': `
<h2>Top UK Universities for Indian Students (2026)</h2>
<h3>Russell Group — Tier 1</h3>
<ul>
  <li><strong>University of Oxford</strong> — PPE, Law, Medicine, Engineering & Materials Science</li>
  <li><strong>University of Cambridge</strong> — Natural Sciences, Mathematics, Engineering, Law</li>
  <li><strong>Imperial College London</strong> — Engineering, Medicine, Business (ICBS), Computing</li>
  <li><strong>London School of Economics (LSE)</strong> — Finance, Economics, Statistics, Management</li>
  <li><strong>University College London (UCL)</strong> — Architecture, Urban Planning, Computer Science, Medicine</li>
  <li><strong>King's College London</strong> — Medicine, Law, Dental Sciences, International Relations</li>
</ul>
<h3>Russell Group — Tier 2</h3>
<ul>
  <li><strong>University of Edinburgh</strong> — Informatics, AI, Vet Medicine, Business</li>
  <li><strong>University of Manchester</strong> — Materials, Accounting, Computer Science, Life Sciences</li>
  <li><strong>University of Warwick</strong> — WBS MBA, Mathematics, Economics, Engineering</li>
  <li><strong>University of Bristol</strong> — Engineering, Aerospace, Law, Computer Science</li>
  <li><strong>University of Glasgow</strong> — Medicine, Veterinary, Accounting, Computing</li>
</ul>
<h3>ILOC High-Placement Universities</h3>
<ul>
  <li><strong>Coventry University</strong> — Automotive Engineering, Business, Design</li>
  <li><strong>De Montfort University</strong> — Fashion, Computing, Law</li>
  <li><strong>Northumbria University</strong> — Business, Engineering, Law</li>
  <li><strong>University of Hertfordshire</strong> — Aerospace, Pharmacy, Business</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in the UK</h2>
<h3>1. Shorter, Intensive Degree Structure</h3>
<p>UK postgraduate degrees are <strong>12 months full-time</strong> — a deliberate structural efficiency that reduces total cost and gets Indian students into the job market faster. Undergraduate degrees are typically 3 years (4 in Scotland).</p>
<h3>2. The Tutorial / Seminar System</h3>
<p>Oxford and Cambridge operate on a tutorial system where students meet their tutor 1-on-1 or in pairs weekly. This produces exceptionally strong critical thinking and written communication skills — highly valued by global employers.</p>
<h3>3. Graduate Route Visa</h3>
<p>Confirmed through 2026 and beyond, this visa allows graduates to remain in the UK for 2 years (PhD: 3 years) with full right to work, freelance, or set up a business — no employer sponsorship required.</p>
<h3>4. NHS Access</h3>
<p>The Immigration Health Surcharge (IHS), paid as part of the visa application, entitles students to use the <strong>National Health Service (NHS)</strong> — one of the world's best publicly funded healthcare systems — completely free of charge during their stay.</p>
<h3>5. Multicultural, English-Speaking Environment</h3>
<p>The UK has the highest concentration of Indian students in Europe — over 155,000 in 2024–25. Major cities (London, Manchester, Edinburgh) have vibrant South Asian communities, ensuring a smooth cultural transition.</p>
<h3>6. Strong Part-Time Work Rights</h3>
<p>International students on a Student Route Visa can work up to <strong>20 hours per week</strong> during term time and full-time during vacations — significantly offsetting living costs, particularly outside London.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for UK Universities (2026)</h2>
<h3>Undergraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Russell Group Range</th><th>Other Universities</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>90%+ (PCM)</td><td>75–80%</td></tr>
    <tr><td>IELTS Academic</td><td>7.0+ (min 6.5 per band)</td><td>6.0–6.5</td></tr>
    <tr><td>TOEFL iBT</td><td>100+</td><td>80–90</td></tr>
    <tr><td>Personal Statement</td><td>Strong narrative required</td><td>Required</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Russell Group</th><th>Mid-Tier Universities</th></tr></thead>
  <tbody>
    <tr><td>UG Degree Class</td><td>First Class / 2:1 (70%+ / 8.0+ CGPA)</td><td>2:2 (60%+ / 7.0+ CGPA)</td></tr>
    <tr><td>IELTS Academic</td><td>7.0+ (min 6.5)</td><td>6.5 (min 6.0)</td></tr>
    <tr><td>TOEFL iBT</td><td>100+</td><td>90+</td></tr>
    <tr><td>Work Experience</td><td>Preferred for MBA/MSc Management</td><td>Not always required</td></tr>
    <tr><td>References</td><td>2 academic/professional</td><td>1–2</td></tr>
  </tbody>
</table>
<h3>Financial Requirements (Student Route Visa)</h3>
<ul>
  <li><strong>Outside London:</strong> £1,023/month × 9 months = £9,207 minimum maintenance</li>
  <li><strong>In London:</strong> £1,334/month × 9 months = £12,006 minimum maintenance</li>
  <li>Funds must be held in a bank account for <strong>28 consecutive days</strong> before application date</li>
  <li>Tuition fee payment or evidence of funding must be demonstrated</li>
</ul>
`,
};

const CANADA: CountryContent = {
  'why-study': `
<h2>Why Study in Canada in 2026?</h2>
<p>Canada offers what no other major study destination can match: a world-class education, a clear and structured pathway to <strong>Permanent Residency</strong>, and one of the most welcoming immigration systems for Indian students in the world. UofT, UBC, and McGill rank in the global top 50 — and a Canadian degree commands immediate respect across North America and beyond.</p>
<h3>The PGWP Advantage</h3>
<p>The <strong>Post-Graduation Work Permit (PGWP)</strong> is Canada's defining competitive advantage. Graduates of programs lasting 8 months or more receive an open work permit valid for the same duration as their program — up to <strong>3 years</strong> for bachelor's and master's graduates. This means Indian students can live and work anywhere in Canada immediately after graduating, with no employer restrictions.</p>
<h3>PR Pathway via Express Entry</h3>
<p>Canadian work experience gained on the PGWP directly feeds into the <strong>Express Entry Canadian Experience Class (CEC)</strong>. With 1 year of skilled work experience in Canada, most Indian graduates qualify for a PR application — a route that 43% of ILOC Canada alumni have successfully navigated since 2019.</p>
<h3>Safe, Multicultural Society</h3>
<p>Canada consistently ranks as one of the world's most peaceful and inclusive countries. With large South Asian communities in Toronto, Vancouver, and Brampton, Indian students find a culturally familiar environment within a diverse, English-speaking country.</p>
<blockquote><p><strong>ILOC 2026 Advisory:</strong> Canada has implemented international student permit caps. We strongly recommend submitting applications by <strong>October 2025</strong> for Fall 2026 intake to avoid waitlisting at oversubscribed institutions.</p></blockquote>
`,

  'application-procedure': `
<h2>Canada Application Procedure (2026)</h2>
<h3>Step 1 — Institution & Program Selection</h3>
<p>ILOC identifies the optimal combination of program quality, PGWP eligibility, tuition cost, and city-specific job market. Key guidance: only programs at <strong>Designated Learning Institutions (DLIs)</strong> qualify for PGWP — all ILOC-recommended institutions are DLI-verified.</p>
<h3>Step 2 — Application Submission</h3>
<ul>
  <li>Applications open: August–October 2025 for January 2026 intake; October 2025–February 2026 for September 2026 intake</li>
  <li>Documents: transcripts, SOP, LOR, English proficiency, passport copy</li>
  <li>Most universities use <strong>Ontario Universities' Application Centre (OUAC)</strong> or direct portals</li>
</ul>
<h3>Step 3 — Study Permit Application (SDS)</h3>
<p>The <strong>Student Direct Stream (SDS)</strong> is Canada's fast-track study permit pathway for Indian students, with processing in <strong>20 business days</strong>. Requirements:</p>
<ul>
  <li>Letter of Acceptance from a DLI</li>
  <li>Guaranteed Investment Certificate (GIC): CAD 10,000 from a participating Canadian bank</li>
  <li>IELTS Academic: minimum 6.0 overall (no band below 6.0)</li>
  <li>Medical examination by a designated panel physician</li>
  <li>Proof of financial support for first-year tuition</li>
</ul>
<h3>Step 4 — PGWP & PR Strategy Session</h3>
<p>ILOC conducts a dedicated pre-departure briefing covering Express Entry CRS score projection, provincial nominee programs (Ontario PNP, BC PNP), and the optimal PGWP utilisation strategy for your career goals.</p>
`,

  'university-list': `
<h2>Top Canadian Universities for Indian Students (2026)</h2>
<h3>Global Research Universities (QS Top 50)</h3>
<ul>
  <li><strong>University of Toronto (UofT)</strong> — Engineering, Computer Science, Medicine, Finance; QS #25</li>
  <li><strong>University of British Columbia (UBC)</strong> — Forestry, Mining, Sustainability, CS; QS #38</li>
  <li><strong>McGill University</strong> — Medicine, Law, Life Sciences; QS #46</li>
</ul>
<h3>Strong Research Universities (QS Top 250)</h3>
<ul>
  <li><strong>McMaster University</strong> — Engineering, Health Sciences, Business (DeGroote)</li>
  <li><strong>Queen's University</strong> — Commerce (Smith School of Business), Engineering</li>
  <li><strong>University of Waterloo</strong> — #1 in Canada for Computer Science and Engineering; co-op model</li>
  <li><strong>University of Alberta</strong> — Petroleum Engineering, Pharmacy, Computing; strong PR outcomes</li>
  <li><strong>Western University</strong> — Ivey Business School (top MBA), Medicine, Law</li>
</ul>
<h3>ILOC High-Placement Colleges & Universities</h3>
<ul>
  <li><strong>Seneca Polytechnic (Toronto)</strong> — Business Analytics, IT, Accounting</li>
  <li><strong>Humber College (Toronto)</strong> — Business, Media, Engineering Technology</li>
  <li><strong>George Brown College (Toronto)</strong> — Culinary Arts, Business, Early Childhood</li>
  <li><strong>Conestoga College (Waterloo)</strong> — Business Management, Software Engineering</li>
  <li><strong>Lambton College</strong> — Oil & Gas Technology, Integrated Manufacturing</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in Canada</h2>
<h3>1. Co-op Programs — Built-In Career Capital</h3>
<p>The University of Waterloo's co-op program is one of the world's largest — over 7,000 employers hire Waterloo co-op students, including Google, Microsoft, and RBC. 8-month work terms are integrated directly into the 4-year degree, and students graduate with 2 full years of paid professional experience.</p>
<h3>2. Affordable Compared to USA & UK</h3>
<p>Canadian tuition averages CAD $18,000–$40,000 per year — significantly less than equivalent US programs. Combined with the PGWP, the total cost-to-income ratio for a Canadian education is among the most favourable in the world.</p>
<h3>3. PR Pathway — Transparent & Structured</h3>
<p>Unlike the US H-1B lottery, Canada's Express Entry system is points-based and predictable. Indian students who graduate and work in Canada for 1+ year typically achieve CRS scores qualifying for invitation rounds — a structured immigration journey rather than a lottery.</p>
<h3>4. Bilingual Advantage (Quebec)</h3>
<p>Studying in Quebec (McGill, Université de Montréal) provides exposure to French — the second official language — which scores additional CRS points in Express Entry and opens doors in multilateral organisations.</p>
<h3>5. Campus Safety & Student Support</h3>
<p>Canadian universities invest heavily in international student support services — dedicated counsellors, settlement assistance, food banks, and cultural clubs. Campus safety statistics in Canadian university cities are among the best globally.</p>
<h3>6. Research & Graduate Funding</h3>
<p>The Natural Sciences and Engineering Research Council (NSERC) and Social Sciences and Humanities Research Council (SSHRC) fund thousands of graduate positions annually. Top graduate students at UofT, UBC, and McGill frequently receive fully-funded offers covering tuition and stipend.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for Canadian Universities (2026)</h2>
<h3>Undergraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Research Universities</th><th>Colleges / Polytechnics</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>85%+ (competitive programs)</td><td>60–70%</td></tr>
    <tr><td>IELTS Academic</td><td>6.5+ (min 6.0 per band)</td><td>6.0</td></tr>
    <tr><td>TOEFL iBT</td><td>90–100+</td><td>80+</td></tr>
    <tr><td>Math Proficiency</td><td>Required for Engineering/CS</td><td>Program-dependent</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Top Universities</th><th>Colleges</th></tr></thead>
  <tbody>
    <tr><td>UG Degree</td><td>75%+ / 3.0 GPA minimum</td><td>60–65%</td></tr>
    <tr><td>IELTS Academic</td><td>6.5–7.0</td><td>6.0</td></tr>
    <tr><td>GRE/GMAT</td><td>Required for MBA (GMAT 600+); optional for most MS</td><td>Not required</td></tr>
    <tr><td>Work Experience</td><td>2+ years for MBA; not required for MS</td><td>Not required</td></tr>
  </tbody>
</table>
<h3>SDS (Study Permit) Financial Requirements</h3>
<ul>
  <li><strong>Guaranteed Investment Certificate (GIC):</strong> CAD 10,000 (mandatory for SDS)</li>
  <li><strong>Tuition fee payment</strong> for first year (or proof of scholarship)</li>
  <li><strong>IELTS Academic 6.0</strong> overall (mandatory for SDS — no band below 6.0)</li>
  <li>Medical exam by IRCC-designated physician (required for stays over 6 months)</li>
</ul>
`,
};

const AUSTRALIA: CountryContent = {
  'why-study': `
<h2>Why Study in Australia in 2026?</h2>
<p>Australia's <strong>Group of Eight (Go8)</strong> universities — ANU, University of Melbourne, Sydney, UNSW, Monash, UQ, UWA, and Adelaide — deliver globally benchmarked research and education. Australia offers the <strong>most generous post-study work rights in the world</strong> — up to 6 years for regional graduates under the Temporary Graduate visa.</p>
<h3>The Temporary Graduate Visa (Subclass 485)</h3>
<p>The 485 visa grants Indian graduates the right to live and work anywhere in Australia after completing their degree. From 2023, the Government extended post-study rights significantly:</p>
<ul>
  <li>Bachelor's graduates: 2 years standard; 3 years in regional areas</li>
  <li>Master's graduates: 3 years standard; 4 years in regional areas</li>
  <li>PhD graduates: 4 years standard; 6 years in regional areas</li>
</ul>
<h3>Strong Industry Demand</h3>
<p>Australia faces critical skills shortages in Nursing, Engineering, Teaching, IT, and Accounting — all on the <strong>Medium and Long-term Strategic Skills List (MLTSSL)</strong>. Indian graduates in these fields are in immediate demand, with pathway to PR via skilled migration.</p>
<blockquote><p><strong>ILOC 2026 Advisory:</strong> Australia's Genuine Student (GS) visa requirement replaced the Genuine Temporary Entrant (GTE) test in 2024. ILOC prepares a robust GS statement for every student — our 96% visa approval rate reflects this preparation.</p></blockquote>
`,

  'application-procedure': `
<h2>Australia Application Procedure (2026)</h2>
<h3>Key Intakes & Deadlines</h3>
<ul>
  <li><strong>Semester 1 (February):</strong> Apply October–December 2025</li>
  <li><strong>Semester 2 (July):</strong> Apply February–April 2026</li>
</ul>
<h3>Step 1 — Program & Institution Selection</h3>
<p>ILOC shortlists Go8 and key providers based on CRICOS registration (required for student visa), program strength, and post-study employment outcomes by field.</p>
<h3>Step 2 — Application & Offer Letter</h3>
<p>Applications go directly to university portals. ILOC prepares transcripts, SOP, English scores, and references. Most Go8 universities issue offers within 2–6 weeks.</p>
<h3>Step 3 — Acceptance & CoE</h3>
<p>After accepting the offer and paying a tuition deposit (typically AUD $2,000–$5,000), the university issues a <strong>Confirmation of Enrolment (CoE)</strong> — the trigger document for the student visa application.</p>
<h3>Step 4 — Subclass 500 Visa Application</h3>
<ul>
  <li>Online application via ImmiAccount</li>
  <li><strong>Genuine Student (GS) statement</strong> — ILOC prepares and reviews this critical document</li>
  <li>OSHC (Overseas Student Health Cover) purchase — mandatory before visa lodgement</li>
  <li>Biometrics at a VFS Global centre in India</li>
  <li>Medical examination by an AHPRA-registered physician (if health requirement applies)</li>
  <li>Financial evidence: AUD $29,710 minimum living funds</li>
</ul>
`,

  'university-list': `
<h2>Top Australian Universities for Indian Students (2026)</h2>
<h3>Group of Eight (Go8)</h3>
<ul>
  <li><strong>Australian National University (ANU)</strong> — QS #30; Politics, Law, International Relations, Science</li>
  <li><strong>University of Melbourne</strong> — QS #33; Medicine, Commerce, Engineering, Architecture</li>
  <li><strong>University of Sydney</strong> — QS #41; Business, Law, Engineering, Medicine</li>
  <li><strong>UNSW Sydney</strong> — QS #45; Engineering, Law, Business, Medicine</li>
  <li><strong>Monash University</strong> — QS #57; Pharmacy, Engineering, Business, Law</li>
  <li><strong>University of Queensland (UQ)</strong> — QS #40; Medicine, Mining Engineering, Business</li>
</ul>
<h3>Strong Technology & Applied Science Universities</h3>
<ul>
  <li><strong>University of Technology Sydney (UTS)</strong> — IT, Design, Business, Engineering</li>
  <li><strong>RMIT University</strong> — Applied Science, Engineering, Fashion, Design</li>
  <li><strong>Deakin University</strong> — Business Analytics, Nursing, Education</li>
  <li><strong>Griffith University</strong> — Criminology, Arts, Business; strong Gold Coast campus</li>
</ul>
<h3>ILOC High-Placement Institutions</h3>
<ul>
  <li><strong>Swinburne University</strong> — IT, Aviation, Business; strong Indian student community</li>
  <li><strong>La Trobe University</strong> — Health Sciences, Agriculture, Business</li>
  <li><strong>Charles Darwin University (CDU)</strong> — Regional campus; extended 485 visa (4–6 years)</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in Australia</h2>
<h3>1. World's Most Generous Post-Study Work Rights</h3>
<p>No other developed nation offers Indian graduates up to 6 years of open work rights. Regional Australian universities add an extra year of 485 visa validity, and ILOC frequently recommends regional campuses of major universities (Monash Caulfield, Deakin Geelong) to unlock this extension.</p>
<h3>2. High Graduate Salaries</h3>
<p>Australia's minimum wage ($23.23/hour in 2026) is among the world's highest. Graduate roles in Engineering, Nursing, IT, and Finance start at AUD $65,000–$90,000 — significantly above global benchmarks relative to cost of living.</p>
<h3>3. Outdoor Lifestyle & International Student Wellbeing</h3>
<p>Australian universities rank consistently high on student satisfaction surveys. The combination of year-round good weather, outdoor culture, and well-funded international student support services produces exceptionally high wellbeing outcomes for Indian students.</p>
<h3>4. OSHC — Comprehensive Health Coverage</h3>
<p>The Overseas Student Health Cover (OSHC) — mandatory for all student visa holders — covers doctor visits, hospital accommodation, pharmaceuticals, and emergency ambulance at subsidised rates.</p>
<h3>5. Pathway to PR via Skilled Migration</h3>
<p>The 485 visa feeds directly into Australia's skilled migration program. Points-tested visas (subclass 189, 190) reward Australian qualifications, English proficiency, and Australian work experience — giving Indian graduates a structurally favourable path to permanent residency.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for Australian Universities (2026)</h2>
<h3>Undergraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Go8 Universities</th><th>Other Universities</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>85%+ in relevant subjects</td><td>65–75%</td></tr>
    <tr><td>IELTS Academic</td><td>7.0+ (min 6.5 per band)</td><td>6.0–6.5</td></tr>
    <tr><td>TOEFL iBT</td><td>94+</td><td>79–90</td></tr>
    <tr><td>Portfolio / Interview</td><td>Required for Architecture, Fine Arts</td><td>Varies</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Go8</th><th>Other Institutions</th></tr></thead>
  <tbody>
    <tr><td>UG Degree</td><td>Credit average (65%+) / 7.5+ CGPA</td><td>Pass level (50%+)</td></tr>
    <tr><td>IELTS Academic</td><td>6.5–7.0 (min 6.0–6.5)</td><td>6.0 (min 5.5)</td></tr>
    <tr><td>Work Experience</td><td>Preferred for MBA; not required for MS</td><td>Program-dependent</td></tr>
    <tr><td>GMAT</td><td>600+ for top MBA programs</td><td>Not always required</td></tr>
  </tbody>
</table>
<h3>Financial Requirements (Subclass 500 Visa)</h3>
<ul>
  <li>Living costs: <strong>AUD $29,710/year</strong> (student alone)</li>
  <li>Additional AUD $10,116/year for a partner; AUD $4,449/year per child</li>
  <li>OSHC: approximately AUD $600–$700/year</li>
  <li>Proof of funds: bank statement, education loan, or scholarship letter</li>
</ul>
`,
};

const IRELAND: CountryContent = {
  'why-study': `
<h2>Why Study in Ireland in 2026?</h2>
<p>Ireland is Europe's only English-speaking nation in the Eurozone — a fact that makes it uniquely attractive for Indian students seeking European careers without a language barrier. The country hosts the EMEA headquarters of <strong>Google, Meta, Apple, Microsoft, LinkedIn, Twitter/X, Pfizer, and Johnson &amp; Johnson</strong> — creating an unrivalled technology and pharma employment ecosystem for graduates.</p>
<h3>The Stamp 1G Post-Study Visa</h3>
<p>The <strong>Stamp 1G</strong> permission allows graduates of Level 8+ programs to remain in Ireland for <strong>24 months</strong> to seek employment. Unlike the UK Graduate Route, Stamp 1G holders can work full-time in any sector without employer sponsorship — making it the most unrestricted post-study work permit in Europe.</p>
<h3>EU Job Market Access</h3>
<p>With Irish residency, Indian graduates can access job opportunities across the <strong>EU Single Market</strong> — particularly in technology clusters in Amsterdam, Berlin, Paris, and Barcelona — a geographic reach unmatched by the UK post-Brexit.</p>
<blockquote><p><strong>ILOC Insight:</strong> For students targeting software engineering, cloud infrastructure, financial services, or pharmaceutical regulatory careers in Europe, Ireland is our unequivocal top recommendation for 2026.</p></blockquote>
`,

  'application-procedure': `
<h2>Ireland Application Procedure (2026)</h2>
<h3>Step 1 — University Application</h3>
<ul>
  <li>Undergraduate: Apply via the <strong>CAO (Central Applications Office)</strong> by 1 February 2026</li>
  <li>Postgraduate: Apply directly to university portals — most accept rolling applications from October 2025</li>
</ul>
<h3>Step 2 — Letter of Offer</h3>
<p>Upon receiving a conditional or unconditional offer letter, ILOC confirms all financial and academic conditions and proceeds to visa preparation.</p>
<h3>Step 3 — Irish Study Visa Application</h3>
<ul>
  <li>Apply online via <strong>INIS (Irish Naturalisation and Immigration Service)</strong></li>
  <li>Visa fee: €60 single entry / €100 multiple entry</li>
  <li>Processing time: 4–8 weeks from biometric submission</li>
  <li>Documents: offer letter, bank statements (€7,000+ in personal or family account), IELTS, passport, academic certificates</li>
</ul>
<h3>Step 4 — IRP (Irish Residence Permit) Registration</h3>
<p>Within <strong>90 days</strong> of arrival, all non-EEA students must register at their local Garda National Immigration Bureau (GNIB) office and obtain an <strong>Irish Residence Permit (IRP)</strong> card. ILOC provides a step-by-step guide and appointment booking support.</p>
`,

  'university-list': `
<h2>Top Irish Universities for Indian Students (2026)</h2>
<h3>Tier 1 Research Universities</h3>
<ul>
  <li><strong>Trinity College Dublin (TCD)</strong> — QS #81; Computer Science, Business, Law, Medicine</li>
  <li><strong>University College Dublin (UCD)</strong> — QS #181; Veterinary, Business (Smurfit MBA), Engineering</li>
  <li><strong>University College Cork (UCC)</strong> — Pharmacy, Food Science, Law, Medicine</li>
  <li><strong>National University of Ireland Galway (NUIG/University of Galway)</strong> — Marine Science, Biomedical, Law</li>
</ul>
<h3>Technology-Focused Universities</h3>
<ul>
  <li><strong>Dublin City University (DCU)</strong> — Computing, Communications, Business</li>
  <li><strong>Technological University Dublin (TU Dublin)</strong> — Engineering, Business, Science, Arts</li>
  <li><strong>Munster Technological University (MTU)</strong> — Technology, Business, Creative Arts</li>
</ul>
<h3>ILOC High-Placement Institutions</h3>
<ul>
  <li><strong>National College of Ireland (NCI)</strong> — MSc Data Analytics, Cloud Computing, Cybersecurity</li>
  <li><strong>Dublin Business School (DBS)</strong> — MBA, Marketing, Finance, Law</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in Ireland</h2>
<h3>1. Big Tech Career Hub</h3>
<p>Ireland has more EMEA tech headquarters per capita than any other country. Google Dublin employs 8,000+; Meta Ireland, 3,000+. For Indian CS and engineering graduates, Ireland offers direct proximity to hiring decisions that affect the entire EMEA region.</p>
<h3>2. English-Speaking in the EU</h3>
<p>Post-Brexit, Ireland is the <strong>only English-native country in the EU</strong>. This is a significant advantage for Indian students who are comfortable in English but lack proficiency in French, German, or Dutch.</p>
<h3>3. Compact Country — Fast Networking</h3>
<p>Ireland's small size means that Dublin's tech ecosystem is tightly networked. University career fairs directly attract Google, Salesforce, Workday, Stripe, and HubSpot — all of which have significant Dublin offices and regularly hire from Irish universities.</p>
<h3>4. EU Blue Card Pathway</h3>
<p>After gaining 1 year of Irish work experience, graduates on Stamp 1G can apply for a <strong>Critical Skills Employment Permit</strong> — a fast-track to long-term Irish residency and EU Blue Card eligibility.</p>
<h3>5. Quality of Life</h3>
<p>Ireland consistently ranks in the top 15 globally for quality of life. While Dublin is expensive, cities like Cork, Galway, and Limerick offer lower living costs with strong graduate employment markets.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for Irish Universities (2026)</h2>
<h3>Undergraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>TCD / UCD</th><th>Other Universities</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>85%+</td><td>70–75%</td></tr>
    <tr><td>IELTS Academic</td><td>6.5–7.0</td><td>6.0–6.5</td></tr>
    <tr><td>TOEFL iBT</td><td>90+</td><td>80+</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Research Universities</th><th>ITs / DBS / NCI</th></tr></thead>
  <tbody>
    <tr><td>UG Degree</td><td>2:1 Honours (7.5+ CGPA)</td><td>Pass / 2:2 (6.5+ CGPA)</td></tr>
    <tr><td>IELTS Academic</td><td>6.5+ (min 6.0)</td><td>6.0 (min 5.5)</td></tr>
    <tr><td>Work Experience</td><td>Preferred for MBA/MSc Management</td><td>Not always required</td></tr>
  </tbody>
</table>
<h3>Financial Requirements (Study Visa)</h3>
<ul>
  <li>Personal savings: minimum <strong>€7,000</strong> (student alone) in accessible bank account</li>
  <li>Tuition fee evidence or letter of financial sponsorship</li>
  <li>Health insurance: recommended; some universities require it</li>
  <li>Proof of accommodation in Ireland</li>
</ul>
`,
};

// Shared template for New Zealand, Singapore, Europe — equally detailed
const NEW_ZEALAND: CountryContent = {
  'why-study': `
<h2>Why Study in New Zealand in 2026?</h2>
<p>New Zealand offers a unique combination of globally ranked universities, <strong>up to 3 years of post-study work rights</strong>, and an unmatched quality of life in one of the world's safest, most peaceful nations. The <strong>University of Auckland</strong> ranks in the QS World Top 100, and NZ's small size means Indian students have direct access to faculty, industry networks, and the national job market from day one.</p>
<h3>Post-Study Work Visa — Up to 3 Years</h3>
<p>New Zealand's Post-Study Work Visa (PSWV) grants open work authorisation for 1–3 years depending on qualification level and study location. Regional study further extends PSWV duration, and NZ actively encourages graduates to settle in regional cities where infrastructure investment is high and competition for skilled roles is lower.</p>
<h3>Skills Shortage & Pathway to Residency</h3>
<p>New Zealand's <strong>Green List</strong> — a structured pathway to residency for critical skills occupations — covers Nurses, Engineers, ICT Professionals, Accountants, and Teachers. Indian graduates in these fields may qualify for <strong>Residence from Work</strong> visas with as little as 24 months of NZ work experience.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> New Zealand is an underrated destination. Smaller than Australia yet offering equivalent post-study rights, our students consistently report faster career entry and a genuinely welcoming cultural environment.</p></blockquote>
`,

  'application-procedure': `
<h2>New Zealand Application Procedure (2026)</h2>
<h3>Key Intakes</h3>
<ul>
  <li><strong>Semester 1 (February):</strong> Apply July–October 2025</li>
  <li><strong>Semester 2 (July):</strong> Apply January–March 2026</li>
</ul>
<h3>Step 1 — Programme Selection</h3>
<p>All NZ programmes must be at a <strong>NZQA-registered provider</strong> on the NZQA framework. ILOC verifies NZQF level (Level 7 = Bachelor's; Level 9 = Master's) and ensures PSWV eligibility before recommending any programme.</p>
<h3>Step 2 — Application & Offer Letter</h3>
<p>Applications go directly to university portals. Documents required: academic transcripts, English proficiency certificate, CV (for postgraduate), personal statement.</p>
<h3>Step 3 — Student Visa Application (INZ)</h3>
<ul>
  <li>Apply online via <strong>Immigration New Zealand (INZ)</strong> portal</li>
  <li>Processing time: 4–8 weeks</li>
  <li>Documents: offer of place, proof of funds (NZD 15,000 minimum), IELTS, passport</li>
  <li>Health and character certificates required</li>
  <li>Biometric data collection in India at an INZ-authorised Visa Application Centre</li>
</ul>
<h3>Step 4 — Pre-Departure & IRD Number</h3>
<p>ILOC guides banking setup, IRD (tax) number application, and student accommodation near your campus.</p>
`,

  'university-list': `
<h2>Top New Zealand Universities for Indian Students (2026)</h2>
<h3>Tier 1 — Globally Ranked</h3>
<ul>
  <li><strong>University of Auckland</strong> — QS #68; Engineering, Law, Business, Computer Science</li>
  <li><strong>Victoria University of Wellington</strong> — Law, Public Policy, Architecture, Information Management</li>
  <li><strong>University of Otago</strong> — Medicine, Dentistry, Pharmacy, Health Sciences</li>
</ul>
<h3>Technology & Applied Universities</h3>
<ul>
  <li><strong>Auckland University of Technology (AUT)</strong> — Business, IT, Health Sciences, Design</li>
  <li><strong>Massey University</strong> — Agriculture, Veterinary Science, Aviation, Business</li>
  <li><strong>Lincoln University</strong> — Agriculture, Environmental Management, Sport Science</li>
</ul>
<h3>ILOC High-Placement Institutions</h3>
<ul>
  <li><strong>Wintec (Waikato Institute of Technology)</strong> — Engineering Technology, IT, Business</li>
  <li><strong>Whitireia Polytechnic / WelTec</strong> — Health, Creative Arts, Computing</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in New Zealand</h2>
<h3>1. Safe, Peaceful Environment</h3>
<p>New Zealand consistently ranks in the top 5 on the Global Peace Index. Indian students report feeling exceptionally safe — both on and off campus — with low crime rates across all major student cities (Auckland, Wellington, Christchurch, Dunedin).</p>
<h3>2. Small Class Sizes & Direct Faculty Access</h3>
<p>Unlike large research universities in the US or UK, NZ institutions maintain small class sizes. Indian students benefit from direct mentorship from professors, lab access, and research collaboration opportunities from Year 1.</p>
<h3>3. Green List — Structured Path to Residency</h3>
<p>New Zealand's Green List directly ties residency to skills shortage occupations. Engineering, ICT, Nursing, and Teaching graduates with NZ qualifications face an accelerated residency pathway — a benefit unique to NZ among English-speaking destinations.</p>
<h3>4. Work Rights During Study</h3>
<p>Full-time students are permitted to work up to <strong>20 hours per week</strong> during term time and full-time during scheduled holidays — significantly reducing living cost burden.</p>
<h3>5. Research Excellence</h3>
<p>NZ universities punch above their weight in agricultural science, marine biology, geothermal engineering, and seismic research — niche fields where NZ offers world-class expertise unavailable elsewhere.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for New Zealand Universities (2026)</h2>
<h3>Undergraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>University of Auckland / Otago</th><th>Other Providers</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>75%+</td><td>60–65%</td></tr>
    <tr><td>IELTS Academic</td><td>6.5 (min 6.0 per band)</td><td>6.0</td></tr>
    <tr><td>TOEFL iBT</td><td>90+</td><td>79+</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>Universities</th><th>Polytechnics / ITPs</th></tr></thead>
  <tbody>
    <tr><td>UG Degree</td><td>3.0 GPA / 60%+ in relevant discipline</td><td>Pass level acceptable</td></tr>
    <tr><td>IELTS Academic</td><td>6.5 (min 6.0)</td><td>6.0 (min 5.5)</td></tr>
    <tr><td>Work Experience</td><td>Relevant experience valued; not always mandatory</td><td>Varies</td></tr>
  </tbody>
</table>
<h3>Financial Requirements (Student Visa)</h3>
<ul>
  <li>Living costs: minimum <strong>NZD 15,000/year</strong></li>
  <li>Proof of tuition fee payment or scholarship letter</li>
  <li>Comprehensive health and travel insurance for full study duration (mandatory)</li>
  <li>Return airfare funds evidence recommended</li>
</ul>
`,
};

const SINGAPORE: CountryContent = {
  'why-study': `
<h2>Why Study in Singapore in 2026?</h2>
<p>Singapore is Asia's education powerhouse. The <strong>National University of Singapore (NUS)</strong> ranks <strong>#8 globally (QS 2026)</strong> — higher than the entire UK except Oxford and Cambridge. Singapore's strategic position as ASEAN's financial, technological, and logistics hub means graduates immediately enter a job market that connects to 650 million consumers across Southeast Asia.</p>
<h3>Asia's Highest Graduate Salaries</h3>
<p>Singapore offers Indian graduates the highest starting salaries in Asia. Software engineers at Singaporean tech firms or MNCs earn SGD $60,000–$100,000 in their first year — comparable to US salaries with a lower cost of living penalty.</p>
<h3>English-Medium, World-Class Research</h3>
<p>All top Singaporean universities operate entirely in English. Research funding from A*STAR (Agency for Science, Technology and Research) ensures postgraduate students have access to cutting-edge laboratory infrastructure.</p>
<h3>Gateway to ASEAN Careers</h3>
<p>An NUS or NTU degree is the most respected credential across all ASEAN markets. ILOC alumni who studied in Singapore have landed roles at Grab, Sea Group, DBS, OCBC, and regional offices of McKinsey and BCG.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> Singapore is our top recommendation for students targeting fintech, data science, supply chain management, or early-stage startup careers in Asia. The NUS/NTU network in Southeast Asia is unparalleled.</p></blockquote>
`,

  'application-procedure': `
<h2>Singapore Application Procedure (2026)</h2>
<h3>Key Intakes</h3>
<ul>
  <li><strong>August intake:</strong> Apply October 2025 – February 2026</li>
  <li><strong>January intake</strong> (NTU/SMU select programs): Apply June – August 2026</li>
</ul>
<h3>Step 1 — Application to NUS / NTU / SMU</h3>
<p>Applications are submitted directly to each university's admissions portal. NUS and NTU are highly selective — ILOC recommends applying to 3–5 Singaporean institutions simultaneously with an optimised portfolio.</p>
<h3>Step 2 — Student's Pass (STP) via SOLAR+</h3>
<p>Once you receive an <strong>Enrolment Acceptance Form (eForm 16)</strong> from your institution, the <strong>ICA (Immigration and Checkpoints Authority)</strong> Student's Pass application is submitted via the SOLAR+ system:</p>
<ul>
  <li>In-Principle Approval (IPA) letter issued within 4–8 weeks</li>
  <li>The IPA letter is used to obtain a Single Journey Pass to enter Singapore</li>
  <li>STP is collected in person at ICA upon arrival in Singapore</li>
</ul>
<h3>Step 3 — Pre-Departure</h3>
<ul>
  <li>Accommodation: on-campus hostel (ballot system) or off-campus HDB flat</li>
  <li>DBS/POSB bank account setup (ILOC provides guidance)</li>
  <li>MOE Tuition Grant acceptance (where applicable) — requires 3-year Singapore employment bond</li>
</ul>
`,

  'university-list': `
<h2>Top Singapore Universities for Indian Students (2026)</h2>
<h3>World-Class Research Universities</h3>
<ul>
  <li><strong>National University of Singapore (NUS)</strong> — QS #8 globally; Computing, Engineering, Medicine, Law, Business</li>
  <li><strong>Nanyang Technological University (NTU)</strong> — QS #26 globally; Engineering, Business, Arts &amp; Social Sciences, Science</li>
  <li><strong>Singapore Management University (SMU)</strong> — Finance, Law, Information Systems, Accounting</li>
</ul>
<h3>Government Polytechnics</h3>
<ul>
  <li><strong>Singapore Polytechnic</strong> — Engineering, Business, Media &amp; Communication</li>
  <li><strong>Temasek Polytechnic</strong> — Design, Engineering, IT, Business, Applied Science</li>
  <li><strong>Nanyang Polytechnic</strong> — IT, Engineering, Business, Health Sciences</li>
</ul>
<h3>Private Education Institutions (PEIs)</h3>
<ul>
  <li><strong>INSEAD (Asia Campus)</strong> — Asia's top MBA program; SGD $95,000; average GMAT 711</li>
  <li><strong>James Cook University Singapore</strong> — Psychology, Marine Science, Business</li>
  <li><strong>PSB Academy</strong> — Business, Engineering, IT; UK-affiliated degrees</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in Singapore</h2>
<h3>1. Proximity to Asia-Pacific Markets</h3>
<p>Singapore sits at the intersection of ASEAN, Greater China, India, and Australia's trade routes. A degree from NUS or NTU gives Indian students a professional identity that travels across the entire Asia-Pacific region.</p>
<h3>2. MOE Tuition Grant</h3>
<p>The Singapore Ministry of Education (MOE) offers tuition subsidies of up to <strong>SGD $10,000–$16,000/year</strong> to international students at NUS, NTU, and SMU — in exchange for a commitment to work in Singapore for 3 years post-graduation. This dramatically reduces the effective cost of a Singaporean degree.</p>
<h3>3. Part-Time Work Rights</h3>
<p>Student's Pass holders may work up to <strong>16 hours per week</strong> during academic term time. Singapore's high hourly wages (SGD $10–$18 for entry-level positions) make part-time work a meaningful supplement to living costs.</p>
<h3>4. Safe, Clean, Efficient City</h3>
<p>Singapore is consistently ranked the world's most efficient city. Public transport, housing quality, healthcare, and food hygiene standards are globally benchmarked. Indian students adjust quickly — Indian food, temples, and South Asian communities are abundant in Little India and Serangoon.</p>
<h3>5. Research Funding & A*STAR</h3>
<p>A*STAR funds hundreds of research scholarships for postgraduate students at NUS and NTU. ILOC has helped students secure A*STAR Graduate Scholarships covering full tuition plus a monthly stipend of SGD $2,200.</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for Singapore Universities (2026)</h2>
<h3>Undergraduate Entry (NUS / NTU)</h3>
<table>
  <thead><tr><th>Requirement</th><th>NUS / NTU</th><th>Government Polytechnics</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Percentage</td><td>90%+ (PCM for Engineering/Science)</td><td>65–75%</td></tr>
    <tr><td>SAT Score</td><td>1400+ (competitive benchmark)</td><td>Not required</td></tr>
    <tr><td>IELTS Academic</td><td>6.5–7.0</td><td>6.0</td></tr>
    <tr><td>Maths / Physics</td><td>Strong H2 or equivalent required</td><td>O-Level equivalent</td></tr>
  </tbody>
</table>
<h3>Postgraduate Entry</h3>
<table>
  <thead><tr><th>Requirement</th><th>NUS / NTU / SMU</th></tr></thead>
  <tbody>
    <tr><td>UG Degree</td><td>Honours degree (equivalent to 3.5 GPA / 8.0+ CGPA)</td></tr>
    <tr><td>IELTS Academic</td><td>6.5+ (some programs require 7.0+)</td></tr>
    <tr><td>TOEFL iBT</td><td>85–100+ depending on faculty</td></tr>
    <tr><td>GRE / GMAT</td><td>Required for select Engineering PhD and MBA programs</td></tr>
    <tr><td>Research Proposal</td><td>Required for PhD applications — ILOC assists with draft</td></tr>
  </tbody>
</table>
<h3>Financial Requirements (Student's Pass)</h3>
<ul>
  <li>Proof of sufficient funds for first year of study (tuition + living)</li>
  <li>Typical annual budget: SGD $25,000–$45,000 (tuition + accommodation + living)</li>
  <li>MOE Tuition Grant recipients must sign a service obligation agreement</li>
</ul>
`,
};

const EUROPE: CountryContent = {
  'why-study': `
<h2>Why Study in Europe in 2026?</h2>
<p>Europe offers the world's best tuition-to-quality ratio. <strong>Germany's public universities charge zero tuition fees</strong> for international students in most states — including TU Munich (#37 QS) and Heidelberg University. The <strong>Schengen Zone</strong> grants graduates access to work across 26 EU countries, creating a career opportunity space larger than the entire population of the USA.</p>
<h3>Germany: The Free-Tuition Powerhouse</h3>
<p>Germany's 300+ public universities charge only a semester contribution fee of €150–€350 — covering public transport, student union services, and sports facilities. For Indian students, a German Master's in Engineering, Computer Science, or Business from TU Munich, RWTH Aachen, or KIT costs less than one semester of tuition at a US state university.</p>
<h3>Netherlands, France & Spain — English Programs at Scale</h3>
<p>The Netherlands offers 2,100+ fully English-taught Master's programs. France's <em>Grandes Écoles</em> (HEC Paris, Sciences Po, CentraleSupélec) are globally competitive. Spain's ESADE and IE Business School rank in the global top 30 for MBA programs.</p>
<h3>EU Blue Card — The Executive Immigration Pathway</h3>
<p>After 2 years of working in an EU country at a minimum salary threshold (€48,060/year in Germany for 2026), graduates qualify for the <strong>EU Blue Card</strong> — the most powerful working-residency permit in the world, valid across 25 EU member states.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> Europe is our top recommendation for students with strong academic profiles but budget constraints. A free German master's + 18-month job search visa + EU Blue Card pathway delivers comparable lifetime earnings to an expensive US degree at a fraction of the upfront cost.</p></blockquote>
`,

  'application-procedure': `
<h2>Europe Application Procedure (2026)</h2>
<h3>Germany — Step-by-Step</h3>
<ol>
  <li><strong>University-Assist / Uni-Assist:</strong> Most German universities use the <em>uni-assist</em> portal for international document verification. Apply via uni-assist October–January for Winter Semester (October 2026 intake).</li>
  <li><strong>Language Requirement:</strong> English-taught programs require IELTS 6.5+ / TOEFL 90+. German-taught programs require <strong>TestDaF Level 4</strong> or DSH-2. ILOC offers TestDaF preparation.</li>
  <li><strong>Blocked Account:</strong> German student visa requires proof of a <strong>Sperrkonto (blocked account)</strong> with €11,208 (2026 rate). ILOC assists with Expatrio or Fintiba account setup.</li>
  <li><strong>Student Visa Application:</strong> At the German Consulate in Mumbai, Chennai, or New Delhi. Processing: 4–12 weeks. Documents: admission letter, blocked account, health insurance, CV, SOP.</li>
</ol>
<h3>Netherlands — Step-by-Step</h3>
<ul>
  <li>Apply directly to university portals (Studielink for Dutch-taught; direct for English)</li>
  <li>Deadline: 1 April 2026 for most programs; highly competitive programs close December 2025</li>
  <li>Holland Scholarship (€5,000) application: February 2026 deadline</li>
  <li>MVV (Machtiging tot Voorlopig Verblijf) — Entry Visa — processed by IND (Dutch Immigration)</li>
</ul>
<h3>France — Key Steps</h3>
<ul>
  <li>Applications via <strong>Campus France India</strong> (mandatory for French universities)</li>
  <li>Campus France interview required before visa application</li>
  <li>APS (post-study work permit): 1 year, extendable; apply at French Prefecture</li>
</ul>
`,

  'university-list': `
<h2>Top European Universities for Indian Students (2026)</h2>
<h3>Germany</h3>
<ul>
  <li><strong>TU Munich (TUM)</strong> — QS #37; Engineering, Computer Science, Business (TUM School of Management)</li>
  <li><strong>RWTH Aachen University</strong> — Europe's largest technical university; Mechanical & Electrical Engineering</li>
  <li><strong>Heidelberg University</strong> — Life Sciences, Medicine, Humanities; Germany's oldest university</li>
  <li><strong>Karlsruhe Institute of Technology (KIT)</strong> — Engineering, Physics, Computer Science</li>
  <li><strong>Ludwig Maximilian University (LMU Munich)</strong> — Medicine, Law, Social Sciences</li>
</ul>
<h3>Netherlands</h3>
<ul>
  <li><strong>Delft University of Technology (TU Delft)</strong> — QS #47; Architecture, Aerospace, Civil, Computing</li>
  <li><strong>University of Amsterdam (UvA)</strong> — Economics, Law, Social Sciences, Humanities</li>
  <li><strong>Eindhoven University of Technology (TU/e)</strong> — Industrial Design, Applied Physics, Data Science</li>
  <li><strong>Wageningen University</strong> — #1 globally in Agricultural Sciences</li>
</ul>
<h3>France</h3>
<ul>
  <li><strong>HEC Paris</strong> — #1 MBA in Europe (FT 2025); Finance, Management, Entrepreneurship</li>
  <li><strong>Sciences Po Paris</strong> — International Affairs, Public Policy, Law</li>
  <li><strong>CentraleSupélec</strong> — Engineering, Data Science, Energy</li>
</ul>
<h3>Spain</h3>
<ul>
  <li><strong>ESADE Business School</strong> — Top-20 global MBA; Strategy, Marketing, Finance</li>
  <li><strong>IE Business School</strong> — Top-5 global MBA; Entrepreneurship, Innovation</li>
</ul>
`,

  'salient-features': `
<h2>Salient Features of Studying in Europe</h2>
<h3>1. Free / Near-Free Tuition in Germany</h3>
<p>Public German universities charge <strong>zero tuition fees</strong> for international students (except Baden-Württemberg, which charges €1,500/semester). This is categorically the best tuition deal in the world for STEM programs — TU Munich and RWTH Aachen at zero cost versus $80,000+ for equivalent US programs.</p>
<h3>2. Schengen Zone Freedom</h3>
<p>A German or Dutch residence permit provides freedom of movement across 26 Schengen countries. Indian students can travel, attend interviews, and eventually work across the entire EU single market without additional visas.</p>
<h3>3. 18-Month Job Search Visa (Germany)</h3>
<p>Germany's <strong>Aufenthaltserlaubnis zur Arbeitssuche</strong> (job-search visa) allows graduates to remain in Germany for 18 months after graduation to find employment — the most generous job-search window in Europe.</p>
<h3>4. Erasmus+ Programme</h3>
<p>Studying in one EU country provides access to the <strong>Erasmus+ exchange programme</strong> — allowing Indian students to spend a semester at another European university, gaining multilingual exposure and EU-wide professional networks.</p>
<h3>5. EU Blue Card — Accelerated Residency</h3>
<p>Once employed at the minimum EU Blue Card salary threshold, Indian graduates can obtain the Blue Card within 1–3 months — granting long-term residency, family reunion rights, and a path to permanent residency in 2–5 years (2 years in Germany with B1 German language level).</p>
`,

  'entry-criteria': `
<h2>Entry Criteria for European Universities (2026)</h2>
<h3>Germany — Postgraduate (Most Common Entry for Indians)</h3>
<table>
  <thead><tr><th>Requirement</th><th>TU Munich / RWTH / KIT</th><th>Other Public Universities</th></tr></thead>
  <tbody>
    <tr><td>UG Degree / CGPA</td><td>75%+ / 3.5 GPA equivalent</td><td>60%+ / 3.0 GPA</td></tr>
    <tr><td>Language (English programs)</td><td>IELTS 7.0+ / TOEFL 100+</td><td>IELTS 6.5 / TOEFL 90+</td></tr>
    <tr><td>Language (German programs)</td><td>TestDaF TDN 4 / DSH-2</td><td>TestDaF TDN 3+ acceptable</td></tr>
    <tr><td>GRE</td><td>Recommended but not mandatory</td><td>Not required</td></tr>
    <tr><td>Motivation Letter</td><td>Required — ILOC drafts and reviews</td><td>Required</td></tr>
  </tbody>
</table>
<h3>Netherlands — Postgraduate</h3>
<ul>
  <li>Bachelor's degree with minimum 75% / 3.0 GPA</li>
  <li>IELTS 6.5–7.0 / TOEFL 90+ (program-dependent)</li>
  <li>Programme-specific entry: research proposal for MSc Research programs</li>
</ul>
<h3>Financial Requirements</h3>
<ul>
  <li><strong>Germany:</strong> Blocked account (Sperrkonto) — <strong>€11,208</strong> (2026 requirement); health insurance ~€110/month</li>
  <li><strong>Netherlands:</strong> MVV application — proof of accommodation and ~€900/month living funds</li>
  <li><strong>France:</strong> Campus France fee €50; visa fee €99; proof of €615/month minimum</li>
</ul>
`,
};

// ── Master export map ──────────────────────────────────────────────────────────
export const COUNTRY_SUBPAGES: Record<string, CountryContent> = {
  usa:           USA,
  uk:            UK,
  canada:        CANADA,
  australia:     AUSTRALIA,
  ireland:       IRELAND,
  'new-zealand': NEW_ZEALAND,
  singapore:     SINGAPORE,
  europe:        EUROPE,
};

export function getSubpageContent(country: string, section: SectionSlug): string | null {
  return COUNTRY_SUBPAGES[country]?.[section] ?? null;
}
