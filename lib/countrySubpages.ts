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

// ── Europe ─────────────────────────────────────────────────────────────────────
const EUROPE: CountryContent = {
  'why-study': `
<h2>Why Study in Europe in 2026?</h2>
<p>Europe offers the world's most diverse and affordable higher education landscape. From Germany's tuition-free public universities to the Netherlands' internationally acclaimed English-taught programs, Europe delivers Ivy League-calibre academics at a fraction of the cost. The Schengen Zone's open borders mean one degree unlocks career opportunities across 26 countries simultaneously.</p>
<h3>Germany: The Engineering Powerhouse</h3>
<p>TU Munich, RWTH Aachen, and KIT consistently rank among the world's top 10 engineering universities. German public universities charge <strong>no tuition fees</strong> for international students — only a semester contribution of €150–€350. With a booming automotive, pharmaceutical, and AI industry, Germany produces some of the world's highest-paid engineering graduates.</p>
<h3>Netherlands: Global Business & Technology Hub</h3>
<p>Delft University of Technology, Wageningen University, and the University of Amsterdam offer hundreds of fully English-taught programs. The Netherlands hosts the EMEA headquarters of Shell, ASML, Philips, and Booking.com — translating directly into internship and post-study employment opportunities.</p>
<h3>France: Elite Grandes Écoles & Research</h3>
<p>Sciences Po, HEC Paris, and École Polytechnique (Polytechnique) are global brand names in business, policy, and engineering. France's Campus France program provides a structured, counsellor-guided application process with highly subsidised tuition at public universities.</p>
<h3>EU Blue Card: Your Path to European PR</h3>
<p>The <strong>EU Blue Card</strong> — available to non-EU graduates employed above the salary threshold — provides a fast-track route to permanent residency across most EU member states. In 2026, Germany lowered the Blue Card salary threshold, making it accessible to more STEM graduates.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> Europe is the fastest-growing destination in our portfolio. For students deterred by the US H-1B lottery or UK living costs, Germany and the Netherlands offer a compelling combination of free/low tuition, strong employment prospects, and a viable PR pathway.</p></blockquote>
`,
  'application-procedure': `
<h2>Europe Application Procedure (2026 Intake)</h2>
<p>Europe's application system varies by country and institution. ILOC manages the full process across all major European destinations.</p>
<h3>Germany — Step-by-Step</h3>
<ol>
  <li><strong>University Shortlisting (Month 1–2):</strong> We select programs via uni-assist portal or direct university application. TU Munich, RWTH, TU Berlin, Heidelberg University — matched to your profile.</li>
  <li><strong>Document Preparation (Month 2–5):</strong> Certified transcripts, German/English language proof, motivation letter (Motivationsschreiben), CV in Europass format, recommendation letters.</li>
  <li><strong>Blocked Account (Sperrkonto) Setup:</strong> Required for visa — €11,208 for 2026. ILOC guides account opening with Fintiba or Deutsche Bank.</li>
  <li><strong>German Student Visa Application:</strong> Applied at German consulate in Mumbai, Delhi, or Chennai. Processing: 4–12 weeks.</li>
</ol>
<h3>Netherlands — Step-by-Step</h3>
<ol>
  <li><strong>Studielink Application:</strong> All Dutch university applications go through the national Studielink portal. ILOC handles registration and submission.</li>
  <li><strong>MVV (Entry Visa) + Residence Permit:</strong> Applied via Dutch IND (Immigration and Naturalisation Service). Most students receive a combined student visa + residence permit (NUFFIC pathway).</li>
</ol>
<h3>Key Deadlines 2026</h3>
<table>
  <thead><tr><th>Country</th><th>Application Deadline</th><th>Intake</th></tr></thead>
  <tbody>
    <tr><td>Germany (most universities)</td><td>15 Jan / 15 Jul 2026</td><td>Apr / Oct 2026</td></tr>
    <tr><td>Netherlands</td><td>1 Apr 2026</td><td>Sep 2026</td></tr>
    <tr><td>France (Campus France)</td><td>15 Jan 2026</td><td>Sep 2026</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top European Universities for Indian Students (2026)</h2>
<h3>Germany</h3>
<ul>
  <li><strong>TU Munich (TUM)</strong> — QS #30 globally; Engineering, Computer Science, Life Sciences</li>
  <li><strong>RWTH Aachen University</strong> — QS #106; Mechanical Engineering, Automotive, Materials Science</li>
  <li><strong>Heidelberg University</strong> — Germany's oldest university; Medicine, Natural Sciences</li>
  <li><strong>Karlsruhe Institute of Technology (KIT)</strong> — Top-5 Germany for STEM</li>
  <li><strong>LMU Munich</strong> — Research excellence in Physics, Economics, Law</li>
</ul>
<h3>Netherlands</h3>
<ul>
  <li><strong>Delft University of Technology (TU Delft)</strong> — QS #47; Architecture, Civil, Aerospace Engineering</li>
  <li><strong>Wageningen University</strong> — QS #61; World #1 for Agriculture & Food Science</li>
  <li><strong>University of Amsterdam (UvA)</strong> — Business, AI, Social Sciences</li>
  <li><strong>Eindhoven University of Technology</strong> — Industry tie-ups with ASML, Philips, NXP</li>
</ul>
<h3>France</h3>
<ul>
  <li><strong>HEC Paris</strong> — QS #24 for Business; Europe's top MBA</li>
  <li><strong>Sciences Po</strong> — World #1 for Politics & International Relations</li>
  <li><strong>École Polytechnique</strong> — France's premier engineering grande école</li>
  <li><strong>INSEAD (Fontainebleau)</strong> — World's most international MBA program</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in Europe</h2>
<ul>
  <li><strong>Zero tuition (Germany):</strong> Public universities in Germany charge no tuition — only a semester fee of €150–€350 covering transport passes and student services.</li>
  <li><strong>Schengen Freedom:</strong> One student visa lets you travel freely across 26 Schengen countries during your studies — weekend trips to Paris, Amsterdam or Prague are part of the experience.</li>
  <li><strong>18-Month Job Search Visa:</strong> Germany's Student Opportunity Visa allows 18 months after graduation to find employment — no employer sponsorship needed during the search period.</li>
  <li><strong>EU Blue Card:</strong> After employment above the threshold salary, India graduates can apply for the EU Blue Card — a fast-track PR permit valid across most EU member states.</li>
  <li><strong>Research Ecosystem:</strong> The EU's Horizon Europe program funds €95 billion in research (2021–2027) — graduate students can access funded research assistant positions.</li>
  <li><strong>Affordable Living:</strong> Outside major cities, monthly expenses average €700–€1,000 — significantly lower than the UK or USA.</li>
  <li><strong>English-Taught Programs:</strong> Over 3,000 English-taught Master's programs across Europe — German language not required for most international programs.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for European Universities (2026)</h2>
<h3>Germany — Postgraduate</h3>
<table>
  <thead><tr><th>Requirement</th><th>Top Universities (TUM/RWTH)</th><th>Other Public Universities</th></tr></thead>
  <tbody>
    <tr><td>UG CGPA</td><td>75%+ / 3.5 GPA equivalent</td><td>60%+ / 3.0 GPA</td></tr>
    <tr><td>German Language</td><td>Not required for English programs</td><td>DSH-2 / TestDaF 4 for German programs</td></tr>
    <tr><td>English</td><td>IELTS 6.5+ / TOEFL 88+</td><td>IELTS 6.0+</td></tr>
    <tr><td>GRE/GMAT</td><td>Recommended, not mandatory</td><td>Not required</td></tr>
    <tr><td>Work Experience</td><td>Preferred for MBA programs</td><td>Not required</td></tr>
  </tbody>
</table>
<h3>Netherlands</h3>
<ul>
  <li>Bachelor's degree with 60–75% CGPA (program dependent)</li>
  <li>IELTS 6.5–7.0 / TOEFL 90+ for most Master's programs</li>
  <li>Numerus Fixus (capacity restriction) applies to Medicine and some Psychology programs</li>
</ul>
<h3>Financial Requirements</h3>
<ul>
  <li><strong>Germany:</strong> Blocked account (Sperrkonto) — €11,208 for 2026; health insurance ~€110/month</li>
  <li><strong>Netherlands:</strong> MVV application — proof of accommodation and ~€900/month living funds</li>
  <li><strong>France:</strong> Campus France fee €50; visa fee €99; proof of €615/month minimum</li>
</ul>
`,
};

// ── UAE ────────────────────────────────────────────────────────────────────────
const UAE: CountryContent = {
  'why-study': `
<h2>Why Study in the UAE in 2026?</h2>
<p>The United Arab Emirates has transformed itself into one of the world's most dynamic international education hubs in less than a decade. Dubai and Abu Dhabi now host branch campuses of globally ranked institutions — NYU Abu Dhabi, Heriot-Watt University Dubai, Middlesex University Dubai, and the University of Birmingham Dubai — offering authentic, accredited international degrees within a 4-hour flight from India.</p>
<h3>Zero Income Tax: The Financial Advantage</h3>
<p>The UAE levies <strong>no personal income tax</strong>. A graduate earning AED 150,000/year retains every dirham — making UAE salaries among the highest real-value compensation packages globally. For Indian students weighing 3 years of US OPT against immediate UAE employment, the tax-free salary is a compelling equaliser.</p>
<h3>Proximity to India & Cultural Familiarity</h3>
<p>The UAE hosts the world's largest Indian diaspora — over 3.5 million Indians. Hindi, Malayalam, Tamil, and Punjabi are widely spoken. Vegetarian food is universally available. The 4-hour direct flight from Mumbai means families can visit cheaply and frequently — a psychological comfort that matters enormously for first-time international students.</p>
<h3>2026: UAE Golden Visa for Graduates</h3>
<p>Top-performing graduates from accredited UAE universities are now eligible for the <strong>10-year UAE Golden Visa</strong> — a landmark long-term residency permit that allows living, working, and studying without a national sponsor. This is a game-changer for Indian students seeking long-term Middle East career pathways.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> The UAE is the fastest-growing destination in our portfolio for 2026. Students from Maharashtra and Gujarat with strong commerce or engineering backgrounds are finding the UAE combination of global degree + tax-free salary + proximity to India genuinely compelling.</p></blockquote>
`,
  'application-procedure': `
<h2>UAE Application Procedure (2026 Intake)</h2>
<h3>Step 1 — University Selection (Month 1)</h3>
<p>ILOC maps your degree objective to the strongest available UAE institution:</p>
<ul>
  <li><strong>NYU Abu Dhabi:</strong> Liberal arts, Science, Engineering — highly selective, generous scholarships</li>
  <li><strong>Heriot-Watt University Dubai:</strong> Engineering, Business, Actuarial Science — UK-accredited degree</li>
  <li><strong>Middlesex University Dubai:</strong> Business, IT, Arts — UK degree, more accessible entry</li>
  <li><strong>University of Birmingham Dubai:</strong> Engineering, Business — Russell Group degree in Dubai</li>
  <li><strong>UAEU (UAE University):</strong> Engineering, Medicine — flagship national university</li>
</ul>
<h3>Step 2 — Application Submission (Month 1–2)</h3>
<p>Most UAE universities have rolling admissions. ILOC prepares your complete package: transcripts (attested), English proficiency scores, personal statement, and references. Applications are typically reviewed within 2–4 weeks.</p>
<h3>Step 3 — Student Entry Permit & Visa (Month 2–3)</h3>
<p>Upon receiving your offer letter, your university sponsors your UAE Student Entry Permit. ILOC guides:</p>
<ul>
  <li>Medical fitness test (blood test + chest X-ray) — required for all entrants</li>
  <li>Emirates ID registration at GDRFA within 30 days of arrival</li>
  <li>University health insurance enrollment (mandatory)</li>
</ul>
<h3>Key 2026 Intakes</h3>
<table>
  <thead><tr><th>University</th><th>Intake 1</th><th>Intake 2</th></tr></thead>
  <tbody>
    <tr><td>NYU Abu Dhabi</td><td>Sep 2026</td><td>Jan 2027</td></tr>
    <tr><td>Heriot-Watt Dubai</td><td>Sep 2026</td><td>Jan 2027</td></tr>
    <tr><td>Middlesex Dubai</td><td>Sep 2026</td><td>Jan 2027</td></tr>
    <tr><td>UAEU</td><td>Sep 2026</td><td>Feb 2027</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top UAE Universities for Indian Students (2026)</h2>
<h3>International Branch Campuses</h3>
<ul>
  <li><strong>NYU Abu Dhabi</strong> — Ranked among the most selective universities globally; full scholarships available; offers degrees in Science, Engineering, Liberal Arts, and Social Science identical to NYU New York</li>
  <li><strong>Heriot-Watt University Dubai</strong> — UK-accredited degrees in Engineering, Business, Energy; strong industry placements in Gulf energy sector</li>
  <li><strong>University of Birmingham Dubai</strong> — Russell Group credentials; Engineering, Business, Computer Science</li>
  <li><strong>Middlesex University Dubai</strong> — Business, IT, Media, Psychology; UK degree, accessible entry requirements</li>
  <li><strong>Murdoch University Dubai</strong> — Australian degree; Business, IT, Media</li>
</ul>
<h3>National UAE Universities</h3>
<ul>
  <li><strong>UAE University (UAEU)</strong> — Flagship national university; Medicine, Engineering, Business; QS ranked</li>
  <li><strong>Khalifa University</strong> — Abu Dhabi; focused on Engineering, AI, Energy; strong industry ties with ADNOC, Mubadala</li>
  <li><strong>American University of Sharjah (AUS)</strong> — Architecture, Engineering, Business; ABET-accredited programs</li>
  <li><strong>University of Sharjah</strong> — Medicine, Pharmacy, Dentistry — growing popularity among Indian students</li>
</ul>
<h3>Free Zone Education Clusters</h3>
<ul>
  <li><strong>Dubai International Academic City (DIAC)</strong> — Hosts 30+ universities including Manipal, Amity, and BITS Pilani Dubai</li>
  <li><strong>Abu Dhabi Education Knowledge (ADEK)</strong> — Governs higher education quality in Abu Dhabi emirate</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in the UAE</h2>
<ul>
  <li><strong>Zero income tax:</strong> Graduates retain 100% of their salary — no PAYE, no income deductions beyond social contributions.</li>
  <li><strong>World-class infrastructure:</strong> State-of-the-art campuses, cutting-edge labs, and smart-city environments that mirror the innovation culture of Singapore and Switzerland.</li>
  <li><strong>Indian community support:</strong> Over 3.5 million Indians in the UAE — the largest diaspora globally. Malayalam, Hindi, Gujarati, and Tamil widely spoken.</li>
  <li><strong>Part-time work (2026):</strong> Student visa holders may now work 20 hours/week — enabling students to gain professional experience and offset living costs simultaneously.</li>
  <li><strong>Safety & stability:</strong> UAE consistently ranks among the world's safest countries — a major factor for Indian parents.</li>
  <li><strong>English-medium instruction:</strong> All international branch campuses and most national universities operate in English.</li>
  <li><strong>Cost of living:</strong> AED 3,000–6,000/month including accommodation, transport and food — comparable to UK, lower than USA.</li>
  <li><strong>Golden Visa pathway:</strong> High-performing graduates eligible for the 10-year UAE Golden Visa, enabling long-term career building without annual visa renewals.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for UAE Universities (2026)</h2>
<h3>Undergraduate Programs</h3>
<table>
  <thead><tr><th>Requirement</th><th>NYU Abu Dhabi / Khalifa</th><th>Heriot-Watt / Middlesex</th><th>UAEU / AUS</th></tr></thead>
  <tbody>
    <tr><td>Grade 12 Score</td><td>90%+ (top-ranking)</td><td>75–85%</td><td>70%+</td></tr>
    <tr><td>English (IELTS)</td><td>7.0+</td><td>6.0–6.5</td><td>5.5–6.0</td></tr>
    <tr><td>SAT/ACT</td><td>Required (1400+ SAT)</td><td>Not required</td><td>Not required</td></tr>
    <tr><td>Personal Statement</td><td>Required</td><td>Required</td><td>Not required</td></tr>
  </tbody>
</table>
<h3>Postgraduate Programs</h3>
<ul>
  <li>Bachelor's degree with minimum 60% CGPA (most programs accept 55% with work experience)</li>
  <li>IELTS 6.0–6.5 / TOEFL 79–90 (program specific)</li>
  <li>2+ years work experience preferred for MBA programs</li>
  <li>GMAT 550+ for top MBA programs (HEC Paris Dubai, Heriot-Watt MBA)</li>
</ul>
<h3>Financial Requirements</h3>
<ul>
  <li>Proof of funds: AED 15,000–25,000 minimum in bank account (visa requirement)</li>
  <li>University tuition fee payment or scholarship letter required for entry permit</li>
  <li>Health insurance: provided by most universities (AED 500–1,500/year)</li>
</ul>
`,
};

// ── Japan ──────────────────────────────────────────────────────────────────────
const JAPAN: CountryContent = {
  'why-study': `
<h2>Why Study in Japan in 2026?</h2>
<p>Japan is the world's third-largest economy and a global leader in robotics, semiconductor manufacturing, automotive engineering, and artificial intelligence. For Indian STEM students, a Japanese university degree combines cutting-edge technical education with direct industry access to corporations like Toyota, Sony, SoftBank, and Panasonic — companies that actively recruit at Japan's national universities.</p>
<h3>Academic Excellence: Asia's Premier Research Universities</h3>
<p>The University of Tokyo (#28 globally, QS 2026) and Kyoto University (#46) are among Asia's finest research institutions. Osaka University, Tohoku University, and Tokyo Institute of Technology (Tokyo Tech) are consistently ranked in the world's top 200 for engineering, science, and medicine. Research funding in Japan exceeds ¥19 trillion annually — second only to the USA.</p>
<h3>MEXT Scholarship: Fully Funded Study</h3>
<p>The Japanese Government (Monbukagakusho/MEXT) Scholarship is one of the world's most comprehensive — covering <strong>full tuition, a monthly stipend of ¥143,000, and return airfare</strong>. Approximately 2,000 Research Student slots are available annually for Master's and PhD applicants. ILOC has a proven MEXT application strategy that significantly improves shortlisting probability.</p>
<h3>English-Taught Programs: A Rapidly Expanding Catalogue</h3>
<p>Over 300 English-taught undergraduate and postgraduate programs are now available across Japanese universities — a figure that has tripled since 2019. Programs such as the University of Tokyo's PEAK (Programs in English at Komaba) and GSGC, and Tokyo Tech's English-medium Master's, require <strong>no Japanese language ability</strong>.</p>
<h3>Post-Study Work Pathways</h3>
<p>Japan's rapidly ageing population has created a significant skilled worker shortage. The government has responded with the <strong>Specified Skilled Worker (SSW) visa</strong>, allowing STEM graduates to transition directly to employment. The 2026 Japan Skills Program fast-tracks PR eligibility to just 1 year for highly skilled graduates — down from the previous 5-year standard.</p>
`,
  'application-procedure': `
<h2>Japan Application Procedure (2026 Intake)</h2>
<h3>Track A — MEXT Government Scholarship (Recommended)</h3>
<ol>
  <li><strong>Embassy Recommendation (Month 1–4):</strong> Apply through the Japanese Embassy in India (Delhi/Mumbai/Chennai/Kolkata). Submit application, academic records, and research plan. Written exam in English, Mathematics, and subject-specific papers.</li>
  <li><strong>Primary Screening (Month 4–6):</strong> Embassy selects candidates for interview. ILOC provides full preparation.</li>
  <li><strong>University Matching (Month 6–9):</strong> MEXT forwards your application to 3 Japanese universities of your choice. Professors review and accept candidates as Research Students.</li>
  <li><strong>Certificate of Eligibility & Visa (Month 9–12):</strong> ILOC handles CoE application, student visa documentation, and pre-departure briefing.</li>
</ol>
<h3>Track B — Direct University Application</h3>
<ol>
  <li>Identify English-taught programs via JASSO (Japan Student Services Organisation) portal</li>
  <li>Contact supervising professor (for research degrees) — ILOC assists with email drafting and research proposal</li>
  <li>Submit application: transcripts, SOP, recommendation letters, English proficiency scores</li>
  <li>Obtain Certificate of Eligibility (CoE) from Japanese immigration — then apply for student visa</li>
</ol>
<h3>Key Dates 2026</h3>
<table>
  <thead><tr><th>Track</th><th>Application Period</th><th>Intake</th></tr></thead>
  <tbody>
    <tr><td>MEXT Embassy Recommendation</td><td>May–Jun 2026</td><td>Apr 2027</td></tr>
    <tr><td>University Recommendation (MEXT)</td><td>Nov–Dec 2025</td><td>Apr 2026</td></tr>
    <tr><td>Direct University Application</td><td>Oct–Jan (varies)</td><td>Apr / Oct 2026</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top Japanese Universities for Indian Students (2026)</h2>
<h3>National Top-Tier (QS Ranked)</h3>
<ul>
  <li><strong>University of Tokyo (UTokyo)</strong> — QS #28; Engineering, Science, Medicine, Economics; PEAK English program</li>
  <li><strong>Kyoto University</strong> — QS #46; Research excellence; Nobel laureate faculty</li>
  <li><strong>Osaka University</strong> — QS #80; Medical Engineering, Biotechnology</li>
  <li><strong>Tokyo Institute of Technology (Tokyo Tech)</strong> — QS #91; STEM specialist; English-medium Master's</li>
  <li><strong>Tohoku University</strong> — QS #101; Materials Science, Physics; strong research funding</li>
</ul>
<h3>Strong Industry Tie-Ups</h3>
<ul>
  <li><strong>Waseda University</strong> — Business, International Studies; large English-taught catalogue; Tokyo location</li>
  <li><strong>Keio University</strong> — Business, Engineering; IBM and Microsoft research partnerships</li>
  <li><strong>Nagoya University</strong> — Automotive Engineering; Toyota research collaboration</li>
  <li><strong>Kyushu University</strong> — Energy, Environment, Regional Studies; growing English programs</li>
</ul>
<h3>Programs Popular with Indian Students</h3>
<ul>
  <li>Robotics & Mechatronics Engineering (Tokyo Tech, Tohoku)</li>
  <li>AI & Data Science (UTokyo, Waseda)</li>
  <li>MBA / International Business (Waseda, Keio, Hitotsubashi)</li>
  <li>Materials Science & Semiconductor Engineering (Tokyo Tech, Nagoya)</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in Japan</h2>
<ul>
  <li><strong>Safety:</strong> Japan consistently ranks in the top 5 safest countries globally — crime rates are among the world's lowest; solo travel is universally safe.</li>
  <li><strong>Part-time work:</strong> Student visa holders may work 28 hours/week during term and full-time during university breaks — enabling students to offset living costs substantially.</li>
  <li><strong>Low cost of living (outside Tokyo):</strong> Monthly expenses in Kyoto, Osaka, Nagoya average ¥80,000–120,000 (₹44,000–66,000) — significantly lower than Australia, UK, or USA.</li>
  <li><strong>National Health Insurance (NHI):</strong> International students pay ¥20,000–40,000/year for comprehensive public health coverage — far lower than private health insurance in other destinations.</li>
  <li><strong>Cultural immersion:</strong> Japan offers a uniquely rich cultural experience — from traditional arts to the world's most advanced urban technology — contributing to a well-rounded global perspective.</li>
  <li><strong>Industry access:</strong> Japanese corporations conduct campus recruitment (shūkatsu) at national universities — Toyota, Sony, SoftBank and Panasonic actively recruit international graduates.</li>
  <li><strong>Language support:</strong> Most universities provide extensive Japanese language courses — even non-language students develop conversational Japanese proficiency, enhancing career prospects.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for Japanese Universities (2026)</h2>
<h3>Undergraduate (English-Taught Programs)</h3>
<table>
  <thead><tr><th>Requirement</th><th>UTokyo PEAK</th><th>Waseda / Keio</th><th>Other National Universities</th></tr></thead>
  <tbody>
    <tr><td>Grade 12 Score</td><td>90%+ (very selective)</td><td>80%+</td><td>75%+</td></tr>
    <tr><td>English (IELTS)</td><td>7.0+</td><td>6.5+</td><td>6.0+</td></tr>
    <tr><td>SAT/ACT</td><td>Required</td><td>Recommended</td><td>Not required</td></tr>
    <tr><td>Essays / SOP</td><td>Required (rigorous)</td><td>Required</td><td>Required</td></tr>
  </tbody>
</table>
<h3>Postgraduate (Master's / PhD)</h3>
<ul>
  <li>Bachelor's degree with strong academic record (70%+ CGPA)</li>
  <li>Research proposal (for research Master's and PhD) — ILOC assists with drafting</li>
  <li>IELTS 6.0–7.0 / TOEFL 72–100 (program specific)</li>
  <li>Letter of acceptance from supervising professor (for research track)</li>
  <li>GRE: required by some programs (Tokyo Tech, UTokyo Graduate School)</li>
</ul>
<h3>MEXT Scholarship Eligibility</h3>
<ul>
  <li>Age: Under 35 years at time of application</li>
  <li>Academic performance: Minimum 65% across undergraduate degree</li>
  <li>Health: Must pass medical examination</li>
  <li>No prior Japanese government scholarship holder in the last 3 years</li>
</ul>
`,
};

// ── South Korea ────────────────────────────────────────────────────────────────
const SOUTH_KOREA: CountryContent = {
  'why-study': `
<h2>Why Study in South Korea in 2026?</h2>
<p>South Korea is the world's most technologically dense economy per capita — home to Samsung, LG, SK Hynix, Hyundai, and POSCO, which together dominate global semiconductor, display, EV battery, and steel manufacturing. For Indian engineering and business students, South Korea offers a unique proposition: world-ranked universities, fully funded government scholarships, and direct access to the companies shaping 21st-century technology.</p>
<h3>Academic Rankings: KAIST & POSTECH in the Global Elite</h3>
<p>KAIST (Korea Advanced Institute of Science and Technology) ranks <strong>#42 globally</strong> and <strong>#7 in Asia</strong> for Engineering (QS 2026). POSTECH (Pohang University of Science and Technology) is often described as South Korea's Caltech — consistently ranked in the world's top 100 for STEM. Seoul National University (SNU), Yonsei, and Korea University (SKY universities) are considered Korea's Ivy League equivalents.</p>
<h3>Global Korea Scholarship: The World's Best Value Full Funding</h3>
<p>The <strong>Global Korea Scholarship (GKS)</strong> — funded by the Korean government — covers full tuition, a monthly living stipend of ₩900,000 (~₹55,000), return airfare, and Korean language training. Approximately 5,000 scholarships are awarded annually to international students. ILOC has successfully guided GKS applications from Maharashtra and Karnataka for engineering and business programs.</p>
<h3>K-Tech Industry Access</h3>
<p>Samsung Electronics, SK Hynix, LG Energy Solution, and Hyundai Motor actively recruit from KAIST, POSTECH, SNU, and Yonsei campuses. Graduate engineers from these institutions command starting salaries of ₩45,000,000–80,000,000 (₹28–50 lakhs/year) — with rapid progression in a performance-driven corporate culture.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> South Korea is our most underrated destination. Students who apply for GKS scholarship with strong CGPA and research profiles have a very real chance of receiving one of the world's most generous fully-funded study packages. The Korea opportunity is genuinely available — most Indian students simply don't know it exists.</p></blockquote>
`,
  'application-procedure': `
<h2>South Korea Application Procedure (2026 Intake)</h2>
<h3>Track A — GKS Embassy Track (Most Common)</h3>
<ol>
  <li><strong>Application through Indian Embassy (Month 1–2):</strong> Apply through the Korean Embassy in Delhi or the Korean Consulate in Mumbai/Chennai. Submit GKS application form, academic records, personal statement, and recommendations.</li>
  <li><strong>Written Test & Interview (Month 2–3):</strong> Korean Embassy screens candidates. Some applicants are invited for interview. ILOC provides full mock preparation.</li>
  <li><strong>University Matching (Month 3–5):</strong> Successful GKS candidates list 3 preferred universities. NIIED (National Institute for International Education) matches candidates to institutions.</li>
  <li><strong>Korean Language Training (Month 6):</strong> All GKS scholars attend 1 year of Korean language training before academic studies begin. ILOC provides pre-departure language preparation.</li>
  <li><strong>D-2 Visa & Arrival (Month 6–7):</strong> ILOC handles Certificate of Admission, ARC pre-registration, and arrival setup in Korea.</li>
</ol>
<h3>Track B — University Direct Application</h3>
<ol>
  <li>Apply directly to KAIST, SNU, Yonsei, or Korea University via their international admission portals</li>
  <li>ILOC prepares application package: transcripts, SOP, research proposal, recommendation letters</li>
  <li>Obtain D-2 Student Visa through Korean Consulate in India</li>
</ol>
<h3>Key Deadlines 2026</h3>
<table>
  <thead><tr><th>Track</th><th>Application Period</th><th>Intake</th></tr></thead>
  <tbody>
    <tr><td>GKS Embassy Track</td><td>Feb–Mar 2026</td><td>Sep 2026</td></tr>
    <tr><td>GKS University Track</td><td>Oct–Nov 2025</td><td>Mar 2026</td></tr>
    <tr><td>Direct University Application</td><td>Sep–Nov 2025</td><td>Mar 2026</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top South Korean Universities for Indian Students (2026)</h2>
<h3>SKY Universities (Korea's Ivy League)</h3>
<ul>
  <li><strong>Seoul National University (SNU)</strong> — QS #41; Korea's premier national university; Engineering, Medicine, Business, Law</li>
  <li><strong>Yonsei University</strong> — QS #56; Business, International Studies, Medicine; strong English-taught programs</li>
  <li><strong>Korea University</strong> — QS #74; Law, Business, Engineering; large international student community</li>
</ul>
<h3>STEM Specialist Institutions</h3>
<ul>
  <li><strong>KAIST (Korea Advanced Institute of Science and Technology)</strong> — QS #42; AI, Semiconductor Engineering, Robotics; 100% English-medium instruction for international students</li>
  <li><strong>POSTECH (Pohang University of Science and Technology)</strong> — QS #107; Materials Science, Chemical Engineering; POSCO industry partnership</li>
  <li><strong>GIST (Gwangju Institute of Science and Technology)</strong> — Photonics, Energy Science; full English instruction</li>
  <li><strong>DGIST (Daegu Gyeongbuk Institute of Science and Technology)</strong> — Interdisciplinary convergence science; GKS scholarships available</li>
</ul>
<h3>Programs Popular with Indian Students</h3>
<ul>
  <li>Semiconductor & Display Engineering (KAIST, POSTECH)</li>
  <li>AI & Machine Learning (KAIST, SNU)</li>
  <li>EV Battery & Materials Science (POSTECH, Yonsei)</li>
  <li>International Business & MBA (SKY Universities, Sungkyunkwan)</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in South Korea</h2>
<ul>
  <li><strong>GKS Full Scholarship:</strong> One of the world's most generous government scholarships — full tuition, ₩900,000/month stipend, Korean language year, and return airfare.</li>
  <li><strong>Fastest internet globally:</strong> South Korea has the world's fastest average internet speed — a genuine advantage for CS, data science, and tech research students.</li>
  <li><strong>Part-time work:</strong> D-2 student visa holders may work 20 hours/week on campus, and full-time during vacation periods.</li>
  <li><strong>Affordable living:</strong> Monthly expenses average ₩600,000–1,000,000 (₹37,000–62,000) — significantly lower than the USA, UK, or Australia.</li>
  <li><strong>Samsung & LG campus recruitment:</strong> Both companies conduct on-campus recruitment at KAIST, POSTECH, SNU, and Yonsei — directly accessible to international students.</li>
  <li><strong>D-10 Job-Seeking Visa:</strong> 1-year post-study job search visa allowing graduates to find employment without leaving Korea.</li>
  <li><strong>Safety:</strong> South Korea is one of Asia's safest countries with extremely low violent crime rates.</li>
  <li><strong>Cultural richness:</strong> The K-culture wave (K-pop, K-food, K-drama) has created a vibrant, internationally connected social environment for international students.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for South Korean Universities (2026)</h2>
<h3>Undergraduate</h3>
<table>
  <thead><tr><th>Requirement</th><th>SNU / Yonsei / Korea Univ.</th><th>KAIST / POSTECH</th></tr></thead>
  <tbody>
    <tr><td>Grade 12 Score</td><td>85%+</td><td>90%+ (highly competitive)</td></tr>
    <tr><td>English (IELTS)</td><td>6.0–6.5</td><td>6.5+ (KAIST may waive for English-medium school graduates)</td></tr>
    <tr><td>SAT/ACT</td><td>Recommended</td><td>Required for some programs</td></tr>
    <tr><td>Math/Science</td><td>Strong performance required</td><td>Outstanding performance required</td></tr>
  </tbody>
</table>
<h3>Postgraduate (Master's / PhD)</h3>
<ul>
  <li>Bachelor's degree with 70%+ CGPA (KAIST/POSTECH require 3.0/4.0 GPA minimum)</li>
  <li>IELTS 6.0+ / TOEFL 80+ (KAIST English-medium programs accept IELTS 6.5+)</li>
  <li>Research proposal required for research Master's and PhD programs</li>
  <li>GRE: recommended for KAIST and POSTECH graduate programs</li>
</ul>
<h3>GKS Scholarship Eligibility</h3>
<ul>
  <li>Age: Under 25 (undergraduate track), under 40 (graduate track)</li>
  <li>GPA: Minimum 80% (2.64/4.0) across all subjects in the most recent 3 years</li>
  <li>Not a Korean national or dual citizen</li>
  <li>Good health — medical certificate required</li>
</ul>
`,
};

// ── Singapore ──────────────────────────────────────────────────────────────────
const SINGAPORE: CountryContent = {
  'why-study': `
<h2>Why Study in Singapore in 2026?</h2>
<p>Singapore is the undisputed education capital of Asia. The National University of Singapore (NUS) ranks <strong>#8 globally</strong> in the QS World University Rankings 2026 — making it one of the highest-ranked universities in the world outside the US and UK. Nanyang Technological University (NTU) follows at #26. For Indian students seeking a top-10 global degree within a 4-hour flight of home, Singapore is unmatched.</p>
<h3>Asia's Financial & Technology Hub</h3>
<p>Singapore hosts the APAC headquarters of Google, Meta, Apple, Goldman Sachs, JPMorgan, and virtually every major global corporation. Graduates from NUS and NTU access a talent market that is among the world's most competitive and highest-paying — with starting salaries in tech and finance ranging from SGD 4,500–8,000/month (~₹2.8–5 lakhs/month).</p>
<h3>English-Medium: No Language Barrier</h3>
<p>Singapore's official working language is English. All NUS, NTU, SMU, and SIT programs are conducted entirely in English — eliminating the language preparation burden that Japan, Korea, Germany, or France impose. This makes Singapore the natural first choice for Indian students seeking an Asian university without a language transition.</p>
<h3>Student's Pass: Structured Work Rights</h3>
<p>All Singapore university students receive a Student's Pass (STP) that permits <strong>16 hours of part-time work per week</strong> during term and full-time work during vacations. The 2026 MOE Tuition Grant reduces effective tuition by 50–70% for international students who commit to working 3 years in Singapore after graduation — making NUS genuinely cost-competitive with European destinations.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> NUS and NTU admit approximately 3,000 international undergraduates per year — and Indian students consistently comprise the largest non-ASEAN cohort. The academic standards are high, but so is the reward. Our track record shows that Indian applicants with 90%+ Class 12 scores and strong extracurriculars have a credible shot at admission.</p></blockquote>
`,
  'application-procedure': `
<h2>Singapore Application Procedure (2026 Intake)</h2>
<h3>Step 1 — University Selection (Month 1)</h3>
<ul>
  <li><strong>NUS:</strong> Engineering, Computing, Business, Medicine, Law, Arts & Social Sciences</li>
  <li><strong>NTU:</strong> Engineering, Business, Science, Art, Design & Media</li>
  <li><strong>SMU:</strong> Business, Law, Accountancy, Information Systems</li>
  <li><strong>SIT (Singapore Institute of Technology):</strong> Applied engineering; work-integrated learning</li>
  <li><strong>SUTD:</strong> Architecture & Sustainable Design, Engineering Systems</li>
</ul>
<h3>Step 2 — Application Submission (Month 1–3)</h3>
<p>NUS and NTU applications open in October for the August intake. ILOC prepares:</p>
<ul>
  <li>Online application via university portal</li>
  <li>Academic transcripts (Class 10, 11, 12) with certified translations if required</li>
  <li>Personal Statement / Essay (ILOC provides extensive coaching)</li>
  <li>Co-curricular activity portfolio and leadership record</li>
  <li>SAT/ACT scores (required for NUS and NTU undergraduate programs)</li>
  <li>IELTS/TOEFL: IELTS 6.5+ / TOEFL 90+</li>
</ul>
<h3>Step 3 — SOLAR+ Student's Pass Application (Month 4–5)</h3>
<p>Upon receiving an offer letter, the university submits an In-Principle Approval (IPA) through the SOLAR+ system. ILOC then guides:</p>
<ul>
  <li>IPA letter collection and travel to Singapore</li>
  <li>Student's Pass (STP) issuance at ICA within first week of arrival</li>
  <li>MOE Tuition Grant agreement signing (reduces tuition by 50–70%)</li>
</ul>
<h3>Key 2026 Deadlines</h3>
<table>
  <thead><tr><th>University</th><th>Application Opens</th><th>Deadline</th><th>Intake</th></tr></thead>
  <tbody>
    <tr><td>NUS Undergraduate</td><td>Oct 2025</td><td>Mar 2026</td><td>Aug 2026</td></tr>
    <tr><td>NTU Undergraduate</td><td>Oct 2025</td><td>Feb 2026</td><td>Aug 2026</td></tr>
    <tr><td>SMU Undergraduate</td><td>Oct 2025</td><td>Feb 2026</td><td>Aug 2026</td></tr>
    <tr><td>NUS Graduate (Master's)</td><td>Sep 2025</td><td>Dec 2025</td><td>Aug 2026</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top Singapore Universities for Indian Students (2026)</h2>
<h3>National Universities</h3>
<ul>
  <li><strong>National University of Singapore (NUS)</strong> — QS #8 globally; consistently Asia's top-ranked university; Computing, Engineering, Business, Medicine, Law; 40,000+ students; largest and most research-intensive</li>
  <li><strong>Nanyang Technological University (NTU)</strong> — QS #26 globally; Engineering, Science, Business, Art, Design; strong AI and materials science research; vibrant campus</li>
  <li><strong>Singapore Management University (SMU)</strong> — QS #511 globally; Business, Law, Accountancy, IT; city campus in the heart of Singapore's CBD</li>
  <li><strong>Singapore Institute of Technology (SIT)</strong> — Applied degrees with work-integrated learning; partnerships with overseas universities including DigiPen, Newcastle, Glasgow</li>
  <li><strong>Singapore University of Technology and Design (SUTD)</strong> — Collaboration with MIT; Architecture, Engineering Systems, Information Systems Technology & Design</li>
</ul>
<h3>Programs Popular with Indian Students</h3>
<ul>
  <li>Computer Science & Computing (NUS School of Computing — ranked #11 globally)</li>
  <li>Electrical & Computer Engineering (NTU)</li>
  <li>Business Administration / Accountancy (NUS Business School, SMU)</li>
  <li>Data Science & AI (NUS, NTU)</li>
  <li>Biomedical Engineering (NUS, NTU)</li>
  <li>MBA (NUS MBA — ranked #24 globally by FT)</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in Singapore</h2>
<ul>
  <li><strong>World's top 10 university:</strong> NUS at #8 globally — the only non-US/UK institution in the world's top 10. An NUS degree commands the same global respect as Imperial College or UCL.</li>
  <li><strong>English is the working language:</strong> No language barrier — all academic instruction, corporate culture, and daily life operate in English.</li>
  <li><strong>MOE Tuition Grant:</strong> Reduces NUS/NTU/SMU tuition by 50–70% in exchange for a 3-year Singapore work commitment after graduation — making the net cost competitive with European destinations.</li>
  <li><strong>Safety:</strong> Singapore is consistently ranked the world's safest city — violent crime is virtually non-existent.</li>
  <li><strong>Indian community:</strong> 400,000+ Indian-origin residents in Singapore; Tamil is an official language; Indian food, festivals, and cultural spaces are deeply embedded in daily life.</li>
  <li><strong>Global corporate hub:</strong> Google, Apple, Meta, Goldman Sachs APAC HQs — all within commuting distance of NUS and NTU campuses.</li>
  <li><strong>Singapore PR pathway:</strong> After 3 years of employment (MOE Tuition Grant period), graduates are well-positioned to apply for Singapore Permanent Residency.</li>
  <li><strong>Climate & lifestyle:</strong> Year-round warm weather, world-class food scene, and exceptional public transport make Singapore highly liveable for South Asian students.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for Singapore Universities (2026)</h2>
<h3>NUS & NTU Undergraduate</h3>
<table>
  <thead><tr><th>Requirement</th><th>NUS Computing / Engineering</th><th>NUS Business / Arts</th><th>NTU Engineering</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Score</td><td>92%+ (PCM for Engineering)</td><td>88%+</td><td>90%+</td></tr>
    <tr><td>English (IELTS)</td><td>6.5+</td><td>6.5+</td><td>6.0+</td></tr>
    <tr><td>SAT</td><td>1400+ strongly preferred</td><td>1300+ preferred</td><td>1350+ preferred</td></tr>
    <tr><td>Extracurriculars</td><td>Leadership record required</td><td>Required</td><td>Required</td></tr>
  </tbody>
</table>
<h3>Postgraduate (Master's / PhD)</h3>
<ul>
  <li>Bachelor's degree with first-class or upper second-class honours equivalent (3.2/4.0 GPA or 70%+ CGPA)</li>
  <li>IELTS 6.5+ / TOEFL 85+ for most programs</li>
  <li>GRE: required for some NUS School of Computing and Engineering graduate programs</li>
  <li>Research proposal: required for PhD and research Master's programs</li>
  <li>2+ years work experience preferred (but not mandatory) for NUS MBA</li>
</ul>
<h3>Financial Requirements</h3>
<ul>
  <li>Proof of funds: SGD 20,000–30,000 minimum for Student's Pass issuance</li>
  <li>MOE Tuition Grant recipients: 3-year post-graduation Singapore employment commitment</li>
  <li>ASEAN Scholarship holders: full funding including accommodation and stipend</li>
</ul>
`,
};

// ── Russia ─────────────────────────────────────────────────────────────────────
const RUSSIA: CountryContent = {
  'why-study': `
<h2>Why Study in Russia in 2026?</h2>
<p>Russia is one of the world's most underrated academic destinations for Indian students — offering globally recognised degrees, particularly in <strong>Medicine (MBBS), Engineering, and Science</strong>, at a fraction of the cost of Western universities. With 48 Russian universities ranked in the QS World Rankings 2026 and a government scholarship program awarding 15,000 places annually to international students, Russia provides accessible excellence for cost-conscious Indian families.</p>
<h3>MBBS in Russia: The #1 Choice for Affordable Medical Education</h3>
<p>Russia's medical universities are approved by the <strong>National Medical Commission (NMC) of India</strong>, meaning MBBS graduates can appear for the National Exit Test (NExT) and practice medicine in India. The total cost of a 6-year MBBS in Russia — including tuition and living expenses — ranges from <strong>₹15–28 lakhs</strong>, compared to ₹60–100 lakhs at private Indian medical colleges. Key institutions include Kazan State Medical University, RUDN University, and First Moscow State Medical University (Sechenov).</p>
<h3>Lomonosov Moscow State University: Academic Prestige</h3>
<p>Moscow State University (MSU) ranks <strong>#87 globally</strong> (QS 2026) and is one of the world's oldest and most respected research institutions. Its Mathematics, Physics, Chemistry, and Computer Science departments have produced more Fields Medal and Nobel Prize winners than most Western universities. For Indian students seeking research-based postgraduate programs, MSU offers genuine world-class academic resources.</p>
<h3>Engineering & STEM Programs</h3>
<p>Bauman Moscow State Technical University (BMSTU) is Russia's MIT equivalent — ranked among Asia-Pacific's top engineering universities. SPbPU (St. Petersburg Polytechnic University) and NUST MISIS are strong in materials science, metallurgy, and industrial engineering. All offer English-medium programs for international students.</p>
<blockquote><p><strong>ILOC Insight (2026):</strong> Russia is best suited for Indian students pursuing MBBS or engineering who are unable to secure seats in Indian government colleges and are unwilling to pay ₹60–100 lakhs at Indian private institutions. Our MBBS Russia program includes FMGE/NExT coaching starting from Year 1 to ensure India return success.</p></blockquote>
`,
  'application-procedure': `
<h2>Russia Application Procedure (2026 Intake)</h2>
<h3>Track A — Russian Government Scholarship (Rossotrudnichestvo)</h3>
<ol>
  <li><strong>Apply through Rossotrudnichestvo (Month 1–3):</strong> The Russian House in India manages applications. Open Jan–Mar 2026 for Sep 2026 intake. Submit Class 12 certificate, passport, medical certificate, and application form.</li>
  <li><strong>Shortlisting & Interview (Month 3–5):</strong> Candidates are invited for interview at the Russian House (Delhi/Mumbai). ILOC provides full preparation.</li>
  <li><strong>University Placement (Month 5–6):</strong> Successful candidates are assigned to Russian universities by the Ministry of Education.</li>
  <li><strong>Invitation Letter (Vyzov) & Visa (Month 6–7):</strong> University issues formal invitation; ILOC handles student visa application at Russian consulate in Mumbai or Delhi.</li>
</ol>
<h3>Track B — Direct University Application</h3>
<ol>
  <li>Apply directly to your chosen university via their international admissions portal or authorised ILOC channel</li>
  <li>Receive university invitation letter (vyzov)</li>
  <li>Apply for Russian Student Visa at consulate — ILOC handles all documentation</li>
  <li>Upon arrival: register migration card within 7 working days; enrol in university system</li>
</ol>
<h3>Key Dates 2026</h3>
<table>
  <thead><tr><th>Track</th><th>Application Period</th><th>Intake</th></tr></thead>
  <tbody>
    <tr><td>Government Scholarship</td><td>Jan–Mar 2026</td><td>Sep 2026</td></tr>
    <tr><td>Direct University</td><td>Mar–Jul 2026</td><td>Sep 2026</td></tr>
    <tr><td>Spring Intake (some universities)</td><td>Oct–Nov 2025</td><td>Feb 2026</td></tr>
  </tbody>
</table>
`,
  'university-list': `
<h2>Top Russian Universities for Indian Students (2026)</h2>
<h3>Medical Universities (NMC-Approved)</h3>
<ul>
  <li><strong>Kazan State Medical University</strong> — One of Russia's oldest medical schools (1814); NMC-approved; MBBS in 6 years; strong FMGE pass rate</li>
  <li><strong>First Moscow State Medical University (I.M. Sechenov)</strong> — Russia's largest and most prestigious medical university; QS ranked; NMC-approved</li>
  <li><strong>RUDN University (Peoples' Friendship University)</strong> — QS #326; large Indian student community; NMC-approved MBBS; Medicine and Engineering programs</li>
  <li><strong>Kazan Federal University</strong> — QS #392; Medicine, Chemistry, IT; one of Russia's oldest universities</li>
  <li><strong>Saint Petersburg State Pediatric Medical University</strong> — Specialist in Pediatrics and General Medicine; NMC-approved</li>
</ul>
<h3>Engineering & STEM Universities</h3>
<ul>
  <li><strong>Lomonosov Moscow State University (MSU)</strong> — QS #87; Mathematics, Physics, Chemistry, Computer Science; Russia's flagship research institution</li>
  <li><strong>Bauman Moscow State Technical University (BMSTU)</strong> — Russia's premier engineering university; Aerospace, Mechanical, Robotics</li>
  <li><strong>St. Petersburg Polytechnic University (SPbPU)</strong> — QS #360; Engineering, IT, Physics; strong industry ties</li>
  <li><strong>NUST MISIS</strong> — Materials Science, Metallurgy, IT; government partner for international students</li>
  <li><strong>ITMO University (St. Petersburg)</strong> — QS #313; Computer Science, AI, Photonics; 6× World Programming Champion</li>
</ul>
`,
  'salient-features': `
<h2>Salient Features of Studying in Russia</h2>
<ul>
  <li><strong>Extremely affordable MBBS:</strong> Total MBBS cost (6 years, tuition + living) of ₹15–28 lakhs — compared to ₹60–100 lakhs at Indian private medical colleges.</li>
  <li><strong>NMC-approved medical degrees:</strong> Russian medical universities approved by India's National Medical Commission — graduates can appear for NExT/FMGE and practise in India.</li>
  <li><strong>Government scholarship:</strong> Rossotrudnichestvo awards 1,000+ scholarships to Indian students annually — covering full tuition for eligible applicants.</li>
  <li><strong>Low cost of living:</strong> Monthly expenses average ₹15,000–25,000 including university accommodation, food, and local transport — among the lowest of any major study destination.</li>
  <li><strong>Large Indian community:</strong> Over 18,000 Indian students currently study in Russia — peer support networks are well-established at all major medical universities.</li>
  <li><strong>No IELTS/TOEFL required:</strong> Most Russian universities offering English-medium programs do not require English proficiency tests for Indian students (Class 12 English qualification suffices).</li>
  <li><strong>Historic academic excellence:</strong> Russia has produced 31 Nobel Prize winners in Physics, Chemistry, and Medicine — the research tradition is genuinely world-class.</li>
  <li><strong>ILOC FMGE/NExT support:</strong> For MBBS students, ILOC provides access to NExT coaching materials and India-return career planning from Year 1.</li>
</ul>
`,
  'entry-criteria': `
<h2>Entry Criteria for Russian Universities (2026)</h2>
<h3>MBBS (Most Common Program for Indian Students)</h3>
<table>
  <thead><tr><th>Requirement</th><th>Standard</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Class 12 Score</td><td>50%+ in PCB (Physics, Chemistry, Biology)</td><td>Government scholarship requires 60%+</td></tr>
    <tr><td>English Proficiency</td><td>No IELTS/TOEFL required</td><td>Class 12 English subject satisfies requirement</td></tr>
    <tr><td>NEET</td><td>Must have appeared and passed NEET</td><td>NEET qualification mandatory for Indian students per NMC rules 2024</td></tr>
    <tr><td>Age</td><td>17–25 years at time of admission</td><td>DOB between 2001–2009 for 2026 intake</td></tr>
    <tr><td>Medical Fitness</td><td>Required</td><td>HIV test, blood group certificate</td></tr>
  </tbody>
</table>
<h3>Engineering & Science (Bachelor's)</h3>
<ul>
  <li>Class 12 with 55%+ in relevant subjects (PCM for Engineering; PCB for Life Sciences)</li>
  <li>No IELTS required for English-medium programs</li>
  <li>University entrance test (online) conducted by some institutions — ILOC provides preparation materials</li>
</ul>
<h3>Postgraduate (Master's / PhD)</h3>
<ul>
  <li>Bachelor's degree in relevant field with 55%+ aggregate</li>
  <li>Research proposal for PhD programs</li>
  <li>IELTS 5.5+ / TOEFL 60+ for English-medium programs at QS-ranked universities (MSU, SPbPU)</li>
</ul>
<h3>Financial Requirements</h3>
<ul>
  <li>Proof of funds: ₹2–4 lakhs in bank account for visa issuance</li>
  <li>VHI (Voluntary Health Insurance): ₹8,000–12,000/year — mandatory for student visa</li>
  <li>First-year tuition: Must be paid before university invitation letter (vyzov) is issued</li>
</ul>
`,
};

// ── Master export map ──────────────────────────────────────────────────────────
export const COUNTRY_SUBPAGES: Record<string, CountryContent> = {
  usa:            USA,
  uk:             UK,
  canada:         CANADA,
  australia:      AUSTRALIA,
  ireland:        IRELAND,
  'new-zealand':  NEW_ZEALAND,
  europe:         EUROPE,
  uae:            UAE,
  japan:          JAPAN,
  'south-korea':  SOUTH_KOREA,
  singapore:      SINGAPORE,
  russia:         RUSSIA,
};

export function getSubpageContent(country: string, section: SectionSlug): string | null {
  return COUNTRY_SUBPAGES[country]?.[section] ?? null;
}
