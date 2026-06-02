import type { Country2026, HeroSlide, Testimonial, Stat, SiteEvent, SiteMedia, ServiceItem, ProcessStepItem } from './types';

// ── Company constants ─────────────────────────────────────────────────────
export const COMPANY = {
  name:      'Ivy League Overseas Consulting',
  short:     'ILOC',
  phone:     '+91-9158577707',
  email:     'ivyleagueoverseas@gmail.com',
  founder:   'Rajib Paul Choudhury',
  since:     '2000',
  address:   '1st Floor, Govind Chambers, Karve Rd, opp. Lagu Bandhu, near Nal Stop, Erandwane, Pune, Maharashtra 411004, India',
  tagline:   'From Pune to the World\'s Best Universities.',
  website:   'https://www.ivyleagueoverseas.com/',
  wa:        'https://wa.me/919158577707?text=Hi%21%20%F0%9F%91%8B%20I%20am%20browsing%20the%20ILOC%20website%20and%20would%20like%20to%20learn%20more%20about%20your%20overseas%20education%20services.',
  mapsLink:  'https://share.google/g3DURuQ8R1TbBPXzR',
} as const;

export const STATS: Stat[] = [
  { num: '10,000+', label: 'Students Placed'               },
  { num: '97%',    label: 'Visa Approval Rate'             },
  { num: '5.0★',   label: 'JustDial Rating (48+ Reviews)' },
  { num: '25+',    label: 'Years in Business'               },
  { num: '400+',   label: 'Partner Universities'           },
  { num: '₹0',     label: 'Hidden Fees'                    },
];

// ── Default Services (admin-editable via KV) ──────────────────────────────
export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id:    'undergrad',
    icon:  '🎓',
    title: 'Undergraduate Admissions',
    desc:  'Your child deserves a world-class start. We handle every detail — profile evaluation, university shortlisting across USA, UK, Canada and Australia, SOP strategy, and offer-letter negotiation — so parents never lose sleep over the process.',
  },
  {
    id:    'postgrad',
    icon:  '🎖️',
    title: 'Graduate & MBA Admissions',
    desc:  'MS, MBA and PhD applications demand precision. Our counsellors craft SOP narratives that stand out, secure strong LORs, and actively negotiate scholarship offers — turning strong admits into fully-funded opportunities.',
  },
  {
    id:    'profiling',
    icon:  '⭐',
    title: 'Profile Building & Career Strategy',
    desc:  'Top-tier universities admit students, not just scores. We build a compelling academic identity — research exposure, leadership activities, and a 12-month personalised roadmap — designed to unlock Ivy League and Russell Group admits.',
  },
  {
    id:    'training',
    icon:  '📝',
    title: 'IELTS · TOEFL · GRE · GMAT · SAT',
    desc:  'Expert-led coaching with small batches, personalised feedback, and 400+ practice questions. Our students average a 1.5-band improvement in IELTS and 8+ point GRE score gains within 6 weeks of structured preparation.',
  },
  {
    id:    'visa',
    icon:  '🛂',
    title: 'Visa Assistance & Mock Interviews',
    desc:  'A 97%+ visa approval rate built on meticulous documentation. We prepare every financial affidavit, DS-160, CAS and GIC — and run intensive mock interviews until you walk into the embassy with complete confidence.',
  },
  {
    id:    'counsel',
    icon:  '🤝',
    title: 'Free 30-Min Expert Counselling',
    desc:  'One direct session with our expert counsellors. Get an honest assessment of your profile, the right country-university fit, and a scholarship strategy. No sales pitch. No hidden fees. Just a clear roadmap.',
  },
];

// Legacy alias kept for any other imports
export const SERVICES = DEFAULT_SERVICES;

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1', name: 'Niraj Paspule', role: 'BS Computer Sciences',
    uni: 'University of South Florida', country: 'USA 🇺🇸',
    quote: "ILOC didn't just prepare me for the F-1 interview — they ran three mock sessions until every answer was razor-sharp. I walked in confident and walked out with my visa the same day. That preparation is priceless.",
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't2', name: 'Gaurav Nawale', role: 'MS Mechatronics & Robotics',
    uni: 'New York University', country: 'USA 🇺🇸',
    quote: "The SOP ILOC crafted for me wasn't a template — it was a strategic narrative built around my specific research background. NYU's admissions team said it was one of the strongest applications they reviewed. That's the ILOC difference.",
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't3', name: 'Yash Bhavsar', role: 'MS Engineering Management',
    uni: 'University of Technology Sydney', country: 'Australia 🇦🇺',
    quote: "My Subclass 500 visa was approved in under three weeks. ILOC's documentation was so precise — every financial affidavit, GTE statement and health declaration filed without a single error. I couldn't have navigated the Genuine Student Test alone.",
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't4', name: 'Abhijit Zarekar', role: 'MS Business Analytics',
    uni: 'University of Illinois Chicago', country: 'USA 🇺🇸',
    quote: "I came to ILOC with a decent GRE score but a weak profile narrative. They restructured my entire application story — internships reframed, LORs strategically aligned, SOP completely rebuilt. UIC admitted me with a $15,000 merit award I wasn't expecting.",
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't5', name: 'Omkar Awate', role: 'MS Industrial Engineering',
    uni: 'Northeastern University', country: 'USA 🇺🇸',
    quote: "ILOC built my profile 14 months before my application deadline. The research exposure and leadership activities they recommended made me a genuinely stronger candidate — not just on paper. I'm now a process engineer at a Fortune 500 firm in Boston.",
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't6', name: 'Rohan Gosavi', role: 'BS Foundational Engineering',
    uni: 'Texas Tech University', country: 'USA 🇺🇸',
    quote: "I received five admits. ILOC then negotiated directly with TTU's financial aid office and secured an additional $12,000 in scholarship funding beyond the initial offer. I didn't even know that was possible. That single conversation paid for my first year.",
    imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't7', name: 'Priya Sharma', role: 'MSc Finance',
    uni: 'University of Manchester', country: 'UK 🇬🇧',
    quote: "Making the Chevening shortlist requires a flawless application strategy. ILOC guided every essay, coached every competency interview, and handled my CAS and Student Route Visa with military precision. This isn't a consultancy — it's a career accelerator.",
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't8', name: 'Sneha Kulkarni', role: 'MIM Global Business',
    uni: 'Trinity College Dublin', country: 'Ireland 🇮🇪',
    quote: "Ireland's visa system is underrated in complexity. ILOC handled my INIS application, IRP registration timeline, and even connected me with a verified accommodation near Trinity's campus. I arrived in Dublin with zero loose ends — that peace of mind is invaluable.",
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't9', name: 'Arjun Mehta', role: 'MS Computer Science',
    uni: 'University of Toronto', country: 'Canada 🇨🇦',
    quote: "Most consultants get you a study permit and disappear. ILOC briefed me on PGWP eligibility, Express Entry CRS strategy, and provincial nominee programs before my first semester even began. I'm now on track for Canadian PR. The roadmap they gave me extends far beyond graduation.",
    imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
  {
    id: 't10', name: 'Ananya Desai', role: 'BEng Electrical Engineering',
    uni: 'NUS Singapore', country: 'Singapore 🇸🇬',
    quote: "NUS is a top-10 global university — the application demands a near-perfect profile. ILOC's strategic profile-building plan, combined with their scholarship research, helped me land the ASEAN Undergraduate Scholarship alongside my admit. They turned my dream into a fully-funded reality.",
    imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&h=120&q=80&fit=crop&crop=face',
    stars: 5, published: true,
  },
];

// Legacy alias
export const TESTIMONIALS = DEFAULT_TESTIMONIALS;

// ── Default Process Steps (admin-editable via KV) ─────────────────────────
export const DEFAULT_PROCESS_STEPS: ProcessStepItem[] = [
  {
    step:  1,
    icon:  '🤝',
    title: 'Free Expert Counselling',
    desc:  'Book a 30-minute, zero-pressure session with our expert team. We conduct an honest profile evaluation, identify your strongest country-university fit, and hand you a clear scholarship strategy — before you spend a single rupee.',
  },
  {
    step:  2,
    icon:  '📋',
    title: 'Application Architecture',
    desc:  'No guesswork, only strategy. We craft your SOP, polish every LOR, and build a shortlist of 8–12 universities across reach, match and safety tiers. Every deadline is tracked. Every document is reviewed twice.',
  },
  {
    step:  3,
    icon:  '🏆',
    title: 'Admit & Scholarship Maximisation',
    desc:  'When offers arrive, our work intensifies. We negotiate scholarship upgrades directly with university financial aid offices — our students average 22% more funding than their initial offer. You choose the best deal.',
  },
  {
    step:  4,
    icon:  '✈️',
    title: 'Visa & Stress-Free Departure',
    desc:  'We handle every document — DS-160, CAS, SEVIS, I-20, GIC, CoE. Intensive mock interviews until the embassy feels routine. Pre-departure briefing covers banking, accommodation and arrival logistics. You just pack your bags.',
  },
];

// Legacy alias kept for any other imports
export const HOW_IT_WORKS = DEFAULT_PROCESS_STEPS;

export const UNIS_MARQUEE = [
  'University of South Florida','New York University','Northeastern University',
  'Univ. of Illinois Chicago','Texas Tech University','Univ. of Technology Sydney',
  'University of Melbourne','University of Toronto','King\'s College London',
  'University of Manchester','University of Auckland','Monash University',
  'Arizona State University','Dublin City University','RMIT University','Purdue University',
  'NUS Singapore','TU Munich','TU Delft',
];

// Structured data for the logo marquee — logos served from /public/logos/
export interface UniEntry { name: string; src: string; country: string; darkBg?: boolean }
export const UNIS_MARQUEE_DATA: UniEntry[] = [
  { name: 'University of Edinburgh',              src: '/logos/university-of-edinburgh.png',              country: 'UK'          },
  { name: 'Carnegie Mellon University',           src: '/logos/carnegie-mellon-university.png',           country: 'USA'         },
  { name: 'University of Sydney',                 src: '/logos/university-of-sydney.png',                 country: 'Australia'   },
  { name: 'University of Birmingham',             src: '/logos/university-of-birmingham.png',             country: 'UK'          },
  { name: 'McGill University',                    src: '/logos/mcgill-university.png',                    country: 'Canada'      },
  { name: 'University of New South Wales',        src: '/logos/university-of-new-south-wales.png',        country: 'Australia'   },
  { name: 'University of Warwick',                src: '/logos/university-of-warwick.png',                country: 'UK'          },
  { name: 'Columbia University',                  src: '/logos/columbia-university.gif',                  country: 'USA'         },
  { name: 'University of Nottingham',             src: '/logos/university-of-nottingham.jpg',             country: 'UK'          },
  { name: 'University of Auckland',               src: '/logos/university-of-auckland.png',               country: 'New Zealand' },
  { name: 'Georgia Institute of Technology',      src: '/logos/georgia-institute-of-technology.png',      country: 'USA'         },
  { name: 'University of Glasgow',                src: '/logos/university-of-glasgow.png',                country: 'UK', darkBg: true },
  { name: 'New York University',                  src: '/logos/new-york-university.png',                  country: 'USA'         },
  { name: 'University of British Columbia',       src: '/logos/university-of-british-columbia.jpg',       country: 'Canada'      },
  { name: 'University College London',            src: '/logos/university-college-london.png',            country: 'UK'          },
  { name: 'University of Michigan',               src: '/logos/university-of-michigan.png',               country: 'USA'         },
  { name: 'University of Adelaide',               src: '/logos/adelaide-university.png',                  country: 'Australia'   },
  { name: 'Pennsylvania State University',        src: '/logos/pennsylvania-state-university.png',        country: 'USA'         },
  { name: 'University of Southampton',            src: '/logos/university-of-southampton.png',            country: 'UK', darkBg: true },
  { name: 'Monash University',                    src: '/logos/monash-university.png',                    country: 'Australia'   },
  { name: 'University of Illinois',               src: '/logos/university-of-illinois.png',               country: 'USA'         },
  { name: 'Trinity College Dublin',               src: '/logos/trinity-college-dublin.png',               country: 'Ireland'     },
  { name: 'University of California, Davis',      src: '/logos/university-of-california-davis.png',       country: 'USA'         },
  { name: 'University of Texas at Austin',        src: '/logos/university-of-texas-at-austin.png',        country: 'USA'         },
];

// ── Country data (2026) ────────────────────────────────────────────────────
export const COUNTRIES: Country2026[] = [
  {
    code: 'usa', name: 'USA', flag: '🇺🇸',
    heroImage:   'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    color: '#1d4ed8', tagline: 'The Global Leader in Higher Education',
    intake: 'Aug / Jan', avgCost: '$20,000–$55,000/yr', visaRate: '94%', unis: '4,000+',
    description: 'The USA offers the world\'s most diverse and prestigious university system. With OPT work authorization for 3 years post-graduation and globally recognised STEM programs, it remains the #1 destination for Indian students in 2026.',
    highlights: ['MIT, Harvard, Stanford, NYU & 4,000+ institutions','OPT work visa for 3 years post-graduation (STEM)','World-class research & co-op programs','Huge scholarship & financial aid ecosystem'],
    visa2026: [
      'F-1 Student Visa processing time: 4–8 weeks (2026 average)',
      'STEM OPT extension remains at 24 months (total 36 months)',
      'SEVIS fee: $350 (unchanged for 2026)',
      'DS-160 form + I-20 document mandatory for all applicants',
      'Embassy interview required — ILOC provides full mock prep',
      '2026 change: Biometric appointment now mandatory for first-time applicants',
    ],
    scholarships: [
      { name: 'Fulbright-Nehru Scholarship',  amount: 'Full funding',     type: 'Government',  deadline: 'Jul 2026' },
      { name: 'Inlaks Shivdasani Foundation', amount: '$90,000 max',      type: 'Merit-based', deadline: 'Mar 2026' },
      { name: 'AAUW International Fellowship',amount: '$18,000–$30,000',  type: 'Women only',  deadline: 'Nov 2025' },
      { name: 'University Merit Scholarships', amount: 'Up to 50% tuition',type: 'University', deadline: 'Rolling' },
    ],
    careers: [
      'Software Engineering: $110,000–$180,000/yr',
      'Data Science & AI: $120,000–$200,000/yr',
      'Healthcare & Pharma: $80,000–$150,000/yr',
      'Financial Analyst: $75,000–$130,000/yr',
      'Mechanical Engineer: $70,000–$110,000/yr',
    ],
    process: [
      { step:1, title:'Profile Evaluation', desc:'We assess GPA, test scores, work experience and career goals.' },
      { step:2, title:'University Shortlist', desc:'8–12 universities across reach, match and safety tiers.' },
      { step:3, title:'Application Submission', desc:'SOP, LOR, transcripts — all crafted and submitted before deadlines.' },
      { step:4, title:'Visa & Pre-Departure', desc:'F-1 visa prep, mock interview, SEVIS registration and I-20 handling.' },
    ],
  },
  {
    code: 'uk', name: 'UK', flag: '🇬🇧',
    heroImage:   'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&q=80',
    color: '#b91c1c', tagline: 'Russell Group Excellence, Global Recognition',
    intake: 'Sep / Jan', avgCost: '£12,000–£35,000/yr', visaRate: '95%', unis: '150+',
    description: 'The UK offers 1–2 year master\'s degrees with Russell Group prestige, making it the most cost-efficient high-value destination. The Graduate Route visa grants 2 years of work rights post-study.',
    highlights: ['Oxford, Cambridge, Imperial & 24 Russell Group universities','1–2 year PG degrees — cost & time efficient','Graduate Route Visa: 2 years post-study work rights','Strong research culture & global alumni network'],
    visa2026: [
      'Student Visa (Tier 4) replaced by Student Route Visa in 2021 — still applicable',
      '2026: CAS (Confirmation of Acceptance for Studies) required from sponsor university',
      'Financial requirement: £1,334/month maintenance for London; £1,023 outside London',
      'Graduate Route Visa: 2 years work after graduation (3 for PhD)',
      'IELTS score: minimum 6.0 overall (varies by university)',
      '2026 update: English language test flexibility expanded — PTE & TOEFL now widely accepted',
    ],
    scholarships: [
      { name: 'Chevening Scholarship',         amount: 'Full funding',     type: 'Government',  deadline: 'Nov 2025' },
      { name: 'Commonwealth Scholarship',       amount: 'Full funding',     type: 'Government',  deadline: 'Dec 2025' },
      { name: 'GREAT Scholarship',              amount: '£10,000',          type: 'Merit',       deadline: 'Feb 2026' },
      { name: 'University Specific Scholarships',amount: 'Up to £15,000',   type: 'University',  deadline: 'Rolling' },
    ],
    careers: [
      'Finance & Banking: £45,000–£85,000/yr',
      'Technology: £42,000–£80,000/yr',
      'Healthcare: £35,000–£65,000/yr',
      'Consulting: £40,000–£75,000/yr',
    ],
    process: [
      { step:1, title:'UCAS / Direct Application', desc:'We manage UCAS or direct applications based on your program.' },
      { step:2, title:'CAS & Visa Application', desc:'University issues CAS — we handle the Student Visa application.' },
      { step:3, title:'Accommodation Booking', desc:'We guide safe, affordable student housing near your campus.' },
      { step:4, title:'Pre-Departure Briefing', desc:'NHS registration, banking, travel insurance — fully covered.' },
    ],
  },
  {
    code: 'canada', name: 'Canada', flag: '🇨🇦',
    heroImage:   'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
    color: '#c2410c', tagline: 'World-Class Education with a PR Pathway',
    intake: 'Sep / Jan', avgCost: 'CAD 18,000–40,000/yr', visaRate: '93%', unis: '100+',
    description: 'Canada is unique in offering an unmatched Post-Graduate Work Permit (PGWP) for up to 3 years plus a clear pathway to Permanent Residency. With UofT, UBC and McGill, it combines academic excellence with long-term immigration opportunities.',
    highlights: ['UofT, UBC, McGill — top 50 globally','PGWP: up to 3 years post-study work authorization','Pathway to Canadian PR via Express Entry & PNP','Safe, multicultural environment with high quality of life'],
    visa2026: [
      '2025–2026: Canada has capped international student permits — apply early',
      'Student Direct Stream (SDS) available for Indian students (faster processing)',
      'PGWP validity: 8 months to 3 years based on program length',
      'Study permit processing: 4–12 weeks (SDS: 20 business days)',
      'GIC (Guaranteed Investment Certificate): CAD 10,000 required',
      '2026 update: IRCC focusing on Express Entry CRS scores — work experience matters',
    ],
    scholarships: [
      { name: 'Vanier Canada Graduate Scholarship', amount: 'CAD 50,000/yr',      type: 'Government',  deadline: 'Oct 2025' },
      { name: 'Ontario Graduate Scholarship',       amount: 'CAD 10,000–15,000',  type: 'Provincial',  deadline: 'Jan 2026' },
      { name: 'University of Toronto Scholarships', amount: 'Up to CAD 25,000',   type: 'University',  deadline: 'Rolling'  },
      { name: 'Emerging Leaders in the Americas',   amount: 'Full funding',        type: 'Government',  deadline: 'Nov 2025' },
    ],
    careers: [
      'Software Developer: CAD $80,000–$130,000/yr',
      'Registered Nurse: CAD $70,000–$100,000/yr',
      'Civil/Structural Engineer: CAD $65,000–$100,000/yr',
      'Business Analyst: CAD $60,000–$95,000/yr',
    ],
    process: [
      { step:1, title:'University Application', desc:'We apply before Jan/Feb deadline for Sep intake (Canada fills fast).' },
      { step:2, title:'SDS Study Permit', desc:'We prepare the SDS package for rapid processing by IRCC.' },
      { step:3, title:'PGWP & PR Planning', desc:'We brief you on Express Entry strategy before you even graduate.' },
      { step:4, title:'Settlement Support', desc:'Banking, SIN card, health insurance — we guide your first month.' },
    ],
  },
  {
    code: 'australia', name: 'Australia', flag: '🇦🇺',
    heroImage:   'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
    color: '#047857', tagline: 'Group of Eight Excellence in a Global City',
    intake: 'Feb / Jul', avgCost: 'AUD 22,000–45,000/yr', visaRate: '96%', unis: '43',
    description: 'Australia\'s Group of Eight universities are globally ranked with strong research output. The Temporary Graduate Visa (subclass 485) grants 2–6 years of post-study work rights — the most generous in the world.',
    highlights: ['ANU, Melbourne, Sydney, Monash — Group of Eight','Temporary Graduate Visa: 2–6 years work rights (2026)','Safe, multicultural — one of the world\'s most liveable countries','Strong demand for IT, Engineering and Healthcare'],
    visa2026: [
      'Student Visa (Subclass 500) — standard processing: 1–4 months',
      '2026 update: Post-Study Work Rights extended for regional graduates (up to 6 years)',
      'Genuine Student (GS) requirement replaces Genuine Temporary Entrant (GTE) from 2024',
      'Confirmation of Enrolment (CoE) required from university',
      'Health insurance (OSHC) mandatory for full duration of stay',
      'AUD 29,710 minimum funds required for Subclass 500 application',
    ],
    scholarships: [
      { name: 'Australia Awards Scholarships', amount: 'Full funding',     type: 'Government', deadline: 'Apr 2026' },
      { name: 'Endeavour Scholarships',        amount: 'AUD $272,500',     type: 'Government', deadline: 'Jun 2026' },
      { name: 'University of Melbourne Grant', amount: 'Up to AUD $7,500', type: 'University', deadline: 'Rolling'  },
      { name: 'Destination Australia Program', amount: 'AUD $15,000/yr',   type: 'Regional',   deadline: 'Oct 2025' },
    ],
    careers: [
      'Software Engineer: AUD $90,000–$140,000/yr',
      'Registered Nurse: AUD $70,000–$100,000/yr',
      'Accountant/CPA: AUD $65,000–$100,000/yr',
      'Civil Engineer: AUD $72,000–$110,000/yr',
    ],
    process: [
      { step:1, title:'Choose Institution & Course', desc:'We shortlist Group of Eight and key providers based on your goals.' },
      { step:2, title:'Genuine Student Assessment', desc:'We prepare a strong GS statement — critical for visa approval.' },
      { step:3, title:'Subclass 500 Visa', desc:'Full documentation, OSHC, biometrics and health check handled.' },
      { step:4, title:'Orientation & Settlement', desc:'Pre-departure session, TFN, bank account and transport briefing.' },
    ],
  },
  {
    code: 'ireland', name: 'Ireland', flag: '🇮🇪',
    heroImage:   'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&q=80',
    color: '#15803d', tagline: "Europe's Tech Capital",
    intake: 'Sep', avgCost: '€10,000–€25,000/yr', visaRate: '94%', unis: '20+',
    description: "Ireland is Europe's technology hub — home to EMEA headquarters of Google, Meta, Apple and LinkedIn. The Stamp 1G post-study visa grants 2 years of work rights across the entire EU job market.",
    highlights: ["UCD, Trinity College & tech hub of Europe",'Stamp 1G: 2-year post-study work permission','Home to Google, Meta, Apple EMEA HQs','English-speaking with full EU job market access'],
    visa2026: [
      'Irish Study Visa — online application through INIS',
      'Processing time: 4–8 weeks from visa application',
      'Stamp 1G post-study visa: 2 years for degree graduates',
      '€3,000 minimum funds per year required',
      '2026: GNIB card replaced by IRP — all students must register within 90 days',
      'Part-time work: 20 hours/week during term, 40 hours during holidays',
    ],
    scholarships: [
      { name: 'Government of Ireland Scholarship', amount: '€10,000/yr',     type: 'Government', deadline: 'Mar 2026' },
      { name: 'UCD Scholarship',                   amount: '€5,000–€10,000', type: 'University',  deadline: 'Rolling'  },
      { name: 'TCD Postgraduate Scholarship',      amount: '€5,000',         type: 'University',  deadline: 'Feb 2026' },
    ],
    careers: [
      'Software Engineer: €55,000–€90,000/yr',
      'Data Analyst: €45,000–€75,000/yr',
      'Financial Analyst: €45,000–€70,000/yr',
      'Digital Marketing: €40,000–€65,000/yr',
    ],
    process: [
      { step:1, title:'Program Selection', desc:'We shortlist top Irish universities and programs matching your profile.' },
      { step:2, title:'Visa Application', desc:'We prepare INIS application, financial docs and acceptance letters.' },
      { step:3, title:'IRP Registration', desc:'We guide Irish Residence Permit registration within 90 days.' },
      { step:4, title:'Job Placement Support', desc:'We connect you with tech company campus drives in Dublin.' },
    ],
  },
  {
    code: 'new-zealand', name: 'New Zealand', flag: '🇳🇿',
    heroImage:   'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80&fit=crop',
    color: '#00448F', tagline: 'Quality Education in a Stunning Natural Setting',
    intake: 'Feb / Jul', avgCost: 'NZD 22,000–38,000/yr', visaRate: '92%', unis: '8+',
    description: 'New Zealand combines world-class QS-ranked universities with an unmatched quality of life. The Post-Study Work Visa allows up to 3 years of open work rights, and the country\'s small size means direct access to faculty, research opportunities and tight-knit industry networks.',
    highlights: [
      'University of Auckland (top 100 globally), Victoria University & AUT',
      'Post-Study Work Visa: up to 3 years open work rights post-graduation',
      'Safe, English-speaking country — one of the world\'s most peaceful nations',
      'Strong demand for IT, Engineering, Agriculture & Nursing professionals',
    ],
    visa2026: [
      'Student Visa (INZ) — standard processing: 4–8 weeks',
      'IELTS minimum 6.0 overall required (varies by institution and program)',
      'Post-Study Work Visa: 1–3 years based on qualification level and location',
      'Minimum NZD 15,000 in living funds required for visa application',
      'Comprehensive health and travel insurance mandatory for full study period',
      '2026 update: Biometric data collection now mandatory for all new student visa applicants',
    ],
    scholarships: [
      { name: 'New Zealand Excellence Awards',       amount: 'NZD 10,000–50,000', type: 'Government', deadline: 'Mar 2026' },
      { name: 'University of Auckland International', amount: 'Up to NZD 10,000',  type: 'University',  deadline: 'Rolling'  },
      { name: 'AUT Vice-Chancellor Scholarship',     amount: 'Up to NZD 5,000',    type: 'University',  deadline: 'Nov 2025' },
    ],
    careers: [
      'Software Engineer: NZD $75,000–$120,000/yr',
      'Registered Nurse: NZD $65,000–$90,000/yr',
      'Civil/Structural Engineer: NZD $68,000–$100,000/yr',
      'Agricultural Scientist: NZD $55,000–$80,000/yr',
    ],
    process: [
      { step:1, title:'University Selection', desc:'We shortlist top NZ institutions matching your profile, budget and career goals.' },
      { step:2, title:'INZ Visa Application', desc:'We prepare a complete visa package: offer letter, financials, health insurance.' },
      { step:3, title:'Pre-Departure Briefing', desc:'IRD number, student banking, accommodation near campus — fully guided.' },
      { step:4, title:'Post-Study Work Visa', desc:'We brief you on PSWV strategy well before your graduation date.' },
    ],
  },
  {
    code: 'singapore', name: 'Singapore', flag: '🇸🇬',
    heroImage:   'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80&fit=crop',
    color: '#C8102E', tagline: "Asia's Education Hub with Global Career Access",
    intake: 'Aug / Jan', avgCost: 'SGD 15,000–40,000/yr', visaRate: '96%', unis: '6+',
    description: "Singapore's National University of Singapore (NUS) and Nanyang Technological University (NTU) consistently rank in Asia's top 3 globally. Strategically positioned as Asia's business hub, graduates gain immediate access to the ASEAN job market with highly competitive SGD salaries.",
    highlights: [
      'NUS ranked #8 globally, NTU #26 globally (QS World 2026)',
      'Strategic ASEAN location — gateway to entire Asia-Pacific career ecosystem',
      'Student\'s Pass (STP) with part-time work allowance during studies',
      'English-medium instruction; world-class research funding and industry ties',
    ],
    visa2026: [
      'Student\'s Pass (STP) issued via SOLAR+ system by ICA Singapore',
      'Processing time: 4–8 weeks after successful ICA application',
      '2026: In-Principle Approval (IPA) letter required before travelling to Singapore',
      'Enrolment Acceptance Form from NUS / NTU / SMU mandatory',
      'Part-time work: 16 hours/week during academic term time',
      '2026 update: MOE Tuition Grant for international students — no bond for most programs',
    ],
    scholarships: [
      { name: 'ASEAN Undergraduate Scholarship',      amount: 'Full tuition + living allowance', type: 'Government', deadline: 'Mar 2026' },
      { name: 'NUS School of Computing Scholarship',  amount: 'Full tuition',                    type: 'University',  deadline: 'Rolling'  },
      { name: 'NTU Research Scholarship',             amount: 'SGD 22,000/yr',                   type: 'University',  deadline: 'Dec 2025' },
      { name: 'Singapore Government Scholarship',     amount: 'Full funding + SGD 500/month',    type: 'Government',  deadline: 'Feb 2026' },
    ],
    careers: [
      'Software Engineer: SGD $60,000–$120,000/yr',
      'Financial Analyst: SGD $54,000–$108,000/yr',
      'Data Scientist: SGD $72,000–$144,000/yr',
      'Mechanical Engineer: SGD $48,000–$90,000/yr',
    ],
    process: [
      { step:1, title:'Institution Selection', desc:'We shortlist NUS, NTU, SMU and SIT based on your goals and eligibility.' },
      { step:2, title:'Application & STP', desc:'We handle SOLAR+ ICA registration and Student\'s Pass application.' },
      { step:3, title:'Pre-Arrival Setup', desc:'Accommodation, DBS/POSB bank account and transport card — ILOC guides all.' },
      { step:4, title:'ASEAN Career Strategy', desc:'We brief you on Singapore PR pathway and ASEAN job market entry.' },
    ],
  },
  {
    code: 'europe', name: 'Europe', flag: '🇪🇺',
    heroImage:   'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80&fit=crop',
    color: '#003399', tagline: 'World-Class Education Across 20+ Countries',
    intake: 'Sep / Feb', avgCost: '€0–€25,000/yr', visaRate: '93%', unis: '200+',
    description: "Europe offers the world's best value-for-money higher education — Germany's public universities charge near-zero tuition, while the Netherlands, France and Spain offer world-ranked English programs. The Schengen Zone grants graduates work access across 26 EU countries.",
    highlights: [
      'Germany: free tuition at public universities for international students',
      'Schengen Zone: live and work across 26 EU countries post-graduation',
      'English-taught programs in Netherlands, Germany, France, Spain & Sweden',
      '18-month post-study work/job-search permit in most EU countries',
    ],
    visa2026: [
      'Schengen Student Visa — apply at respective country embassy in India',
      '2026: Germany\'s Student Opportunity Visa allows 18-month job search post-study',
      'Netherlands: Highly Skilled Migrant (HSM) permit pathway for graduates',
      'France: APS (Autorisation Provisoire de Séjour) — 1-year post-study work permit',
      'Germany blocked account (Sperrkonto): €11,208/year living funds required',
      '2026 update: EU Blue Card eligibility threshold lowered — easier path to European PR',
    ],
    scholarships: [
      { name: 'DAAD Scholarships (Germany)',          amount: '€850–€1,200/month',   type: 'Government', deadline: 'Oct 2025' },
      { name: 'Eiffel Excellence Scholarship (France)',amount: '€1,181/month',        type: 'Government', deadline: 'Jan 2026' },
      { name: 'Holland Scholarship (Netherlands)',    amount: '€5,000 one-time',      type: 'Government', deadline: 'Feb 2026' },
      { name: 'Erasmus+ Scholarships',               amount: '€800–€1,700/month',    type: 'EU Program',  deadline: 'Rolling'  },
    ],
    careers: [
      'Software Engineer (Germany/Netherlands): €55,000–€90,000/yr',
      'Business Analyst (France/Germany): €45,000–€75,000/yr',
      'Mechanical / Auto Engineer (Germany): €50,000–€85,000/yr',
      'Data Scientist (Netherlands): €55,000–€90,000/yr',
    ],
    process: [
      { step:1, title:'Country & University Selection', desc:'We shortlist the best European countries and programs for your profile and budget.' },
      { step:2, title:'Application & Admission', desc:'We handle applications to TU Munich, TU Delft, Sciences Po and other top EU institutions.' },
      { step:3, title:'Schengen Visa Application', desc:'We prepare blocked accounts, health insurance, financials and visa documentation.' },
      { step:4, title:'EU Career Strategy', desc:'We brief you on EU Blue Card pathway, Schengen Zone mobility and long-term settlement.' },
    ],
  },
  {
    code: 'uae', name: 'UAE', flag: '🇦🇪',
    heroImage:   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80&fit=crop',
    color: '#006233', tagline: 'Global Degrees, Tax-Free Careers in the Heart of the Middle East',
    intake: 'Sep / Jan', avgCost: 'AED 45,000–120,000/yr', visaRate: '97%', unis: '70+',
    description: 'The UAE hosts branch campuses of world-ranked institutions including NYU Abu Dhabi, Heriot-Watt Dubai, and University of Birmingham Dubai. Zero income tax, proximity to India, and the 10-year Golden Visa for graduates make it one of the fastest-growing destinations for Indian students in 2026.',
    highlights: [
      'NYU Abu Dhabi, Heriot-Watt Dubai & University of Birmingham Dubai',
      'Zero personal income tax — highest real-value salaries globally',
      '10-year UAE Golden Visa for top-performing graduates',
      '4-hour flight from Mumbai — world\'s largest Indian diaspora (3.5M+)',
    ],
    visa2026: [
      'UAE Student Entry Permit — sponsored and processed by your university',
      'Medical fitness test (blood + chest X-ray) mandatory for all entrants',
      'Emirates ID registration at GDRFA within 30 days of arrival',
      '2026: Golden Visa extended to outstanding graduates from accredited UAE universities',
      'Part-time work: permitted up to 15 hours/week for registered students',
      'Processing time: 2–4 weeks from offer letter to permit issuance',
    ],
    scholarships: [
      { name: 'NYU Abu Dhabi Financial Aid',          amount: 'Up to full scholarship', type: 'University',  deadline: 'Jan 2026' },
      { name: 'Heriot-Watt Excellence Scholarship',   amount: 'Up to 50% tuition',      type: 'University',  deadline: 'Rolling'  },
      { name: 'UAE University Merit Award',           amount: 'AED 20,000–60,000',      type: 'University',  deadline: 'Mar 2026' },
      { name: 'KHDA Scholarship Programme',           amount: 'Varies',                 type: 'Government',  deadline: 'Feb 2026' },
    ],
    careers: [
      'Software Engineer (Dubai/Abu Dhabi): AED 120,000–220,000/yr',
      'Financial Analyst: AED 100,000–180,000/yr',
      'Civil / Construction Engineer: AED 90,000–160,000/yr',
      'Marketing Manager: AED 85,000–150,000/yr',
    ],
    process: [
      { step:1, title:'University Selection', desc:'We match your profile to NYU Abu Dhabi, Heriot-Watt, Birmingham Dubai or UAEU.' },
      { step:2, title:'Application & Offer', desc:'ILOC prepares transcripts, SOP, English scores and submits before rolling deadlines.' },
      { step:3, title:'Entry Permit & Visa', desc:'University sponsors your Student Entry Permit — ILOC handles all GDRFA documentation.' },
      { step:4, title:'Golden Visa Strategy', desc:'We brief you on graduation performance benchmarks required for 10-year Golden Visa eligibility.' },
    ],
  },
  {
    code: 'japan', name: 'Japan', flag: '🇯🇵',
    heroImage:   'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&fit=crop',
    color: '#BC002D', tagline: "Asia's Premier Research Universities with MEXT Full Funding",
    intake: 'Apr / Oct', avgCost: '¥535,800–¥1,200,000/yr', visaRate: '96%', unis: '800+',
    description: "Japan combines Asia's top research universities (University of Tokyo #28, Kyoto #46) with the MEXT Government Scholarship — one of the world's most comprehensive full-funding programs covering tuition, stipend and airfare. Over 300 English-taught programs now require no Japanese language ability.",
    highlights: [
      'University of Tokyo (#28), Kyoto University (#46) — Asia\'s research elite',
      'MEXT Scholarship: full tuition + ¥143,000/month stipend + return airfare',
      '300+ English-taught programs — no Japanese language required',
      'Specified Skilled Worker visa: direct STEM employment pathway post-graduation',
    ],
    visa2026: [
      'Student Visa (College Student / 留学) — Certificate of Eligibility (CoE) required first',
      'CoE issued by Japanese immigration; processing: 1–3 months',
      'MEXT scholars: visa arranged directly through Japanese Embassy in India',
      '2026: Japan Skills Fast-Track — PR eligibility reduced to 1 year for highly skilled graduates',
      'Part-time work: up to 28 hours/week permitted with work permission stamp',
      'Health insurance: National Health Insurance mandatory — approx ¥20,000–30,000/year',
    ],
    scholarships: [
      { name: 'MEXT Government Scholarship',          amount: 'Full tuition + ¥143,000/month + airfare', type: 'Government', deadline: 'May 2026' },
      { name: 'JASSO Scholarship',                    amount: '¥48,000/month',                           type: 'Government', deadline: 'Rolling'  },
      { name: 'University of Tokyo PEAK Scholarship', amount: 'Full tuition waiver',                     type: 'University',  deadline: 'Nov 2025' },
      { name: 'Rotary Yoneyama Scholarship',          amount: '¥140,000/month',                          type: 'Foundation',  deadline: 'Apr 2026' },
    ],
    careers: [
      'Software Engineer (Tokyo): ¥4,500,000–¥9,000,000/yr',
      'Automotive / Mechanical Engineer: ¥4,000,000–¥7,500,000/yr',
      'AI / Robotics Researcher: ¥5,000,000–¥10,000,000/yr',
      'Business Analyst (MNC Japan): ¥4,200,000–¥7,800,000/yr',
    ],
    process: [
      { step:1, title:'Track Selection', desc:'ILOC assesses your profile for MEXT scholarship track vs. direct university application.' },
      { step:2, title:'Research & Application', desc:'We help contact supervising professors, draft research proposals and SOP for target universities.' },
      { step:3, title:'CoE & Student Visa', desc:'We prepare the Certificate of Eligibility package and handle visa application at Japanese Embassy.' },
      { step:4, title:'Pre-Departure Briefing', desc:'National Health Insurance registration, My Number card, banking setup — fully guided.' },
    ],
  },
  {
    code: 'south-korea', name: 'South Korea', flag: '🇰🇷',
    heroImage:   'https://images.unsplash.com/photo-1546412414-e1885e51cfa5?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80&fit=crop',
    color: '#003478', tagline: 'KAIST, SKY Universities & Global Korea Scholarship',
    intake: 'Mar / Sep', avgCost: '₩6,000,000–15,000,000/yr', visaRate: '92%', unis: '200+',
    description: 'South Korea offers KAIST (#42 globally), POSTECH and the SKY universities (Seoul National, Yonsei, Korea University) with the Global Korea Scholarship covering full tuition, ₩900,000/month stipend and airfare. Direct access to Samsung, SK Hynix, LG and Hyundai campus recruitment.',
    highlights: [
      'KAIST #42 globally, POSTECH — world-class STEM research institutions',
      'Global Korea Scholarship (GKS): full tuition + ₩900,000/month + airfare',
      'Samsung, SK Hynix, LG & Hyundai campus recruitment at top universities',
      '5,000 GKS scholarships awarded annually — one of the world\'s most generous programs',
    ],
    visa2026: [
      'D-2 Student Visa — issued by Korean Consulate in Delhi, Mumbai or Chennai',
      'Certificate of Admission from Korean university required for visa application',
      'GKS scholars: visa process managed through Korean Embassy with NIIED support',
      '2026: Alien Registration Card (ARC) must be obtained within 90 days of arrival',
      'Part-time work: permitted up to 20 hours/week (campus jobs and off-campus with permit)',
      'Processing time: 3–5 weeks from complete application submission',
    ],
    scholarships: [
      { name: 'Global Korea Scholarship (GKS)',        amount: 'Full tuition + ₩900,000/month + airfare', type: 'Government', deadline: 'Mar 2026' },
      { name: 'KAIST International Student Scholarship',amount: 'Full tuition waiver',                    type: 'University',  deadline: 'Dec 2025' },
      { name: 'SNU International Scholarship',         amount: 'Up to full tuition',                     type: 'University',  deadline: 'Rolling'  },
      { name: 'Yonsei University Merit Award',         amount: '50–100% tuition',                        type: 'University',  deadline: 'Feb 2026' },
    ],
    careers: [
      'Semiconductor / Chip Engineer (Samsung/SK Hynix): ₩45,000,000–80,000,000/yr',
      'Software Engineer (Kakao/Naver/Samsung): ₩40,000,000–75,000,000/yr',
      'EV Battery Engineer (LG/Samsung SDI): ₩42,000,000–78,000,000/yr',
      'Business Analyst (MNC Korea): ₩35,000,000–65,000,000/yr',
    ],
    process: [
      { step:1, title:'Scholarship Track Decision', desc:'ILOC evaluates your GPA and profile for GKS Embassy Track vs. University Track.' },
      { step:2, title:'Application Preparation', desc:'We craft your GKS application, SOP, research proposal and recommendation strategy.' },
      { step:3, title:'D-2 Visa Processing', desc:'ILOC handles Certificate of Admission, visa documentation and Korean Consulate submission.' },
      { step:4, title:'Korean Language Prep', desc:'We start pre-departure Korean language basics — GKS scholars attend 1 year of formal language training.' },
    ],
  },
  {
    code: 'russia', name: 'Russia', flag: '🇷🇺',
    heroImage:   'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80',
    campusImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80&fit=crop',
    color: '#CC0000', tagline: 'Affordable MBBS & Engineering with Government Scholarships',
    intake: 'Sep / Feb', avgCost: '₹3,00,000–6,00,000/yr', visaRate: '91%', unis: '400+',
    description: 'Russia offers NMC-approved MBBS programs at ₹15–28 lakhs total cost — the most affordable route to a medical degree recognised for Indian practice. Moscow State University (#87 globally) leads world-class STEM programs, while 15,000 Russian Government scholarships are awarded annually to international students.',
    highlights: [
      'NMC-approved MBBS — graduates eligible for NExT exam and Indian medical practice',
      'Moscow State University #87 globally — top STEM research institution',
      '15,000 Russian Government scholarships (Rossotrudnichestvo) annually',
      'Total MBBS cost ₹15–28 lakhs — vs ₹60–100 lakhs at Indian private colleges',
    ],
    visa2026: [
      'Russian Student Visa — requires official Invitation Letter (Vyzov) from university',
      'Vyzov processed via Ministry of Internal Affairs — ILOC handles this with partner universities',
      'Migration card: must register with local police within 7 working days of arrival',
      '2026: Online visa application portal for Indian students — faster processing',
      'Medical insurance mandatory for full study period',
      'Processing time: 3–6 weeks from complete application to visa issuance',
    ],
    scholarships: [
      { name: 'Russian Government Scholarship (Rossotrudnichestvo)', amount: 'Full tuition waiver', type: 'Government', deadline: 'Mar 2026' },
      { name: 'Open Doors Russian Scholarship Olympiad',              amount: 'Full tuition',        type: 'Merit',       deadline: 'Dec 2025' },
      { name: 'MSU Presidential Scholarship',                         amount: 'Full tuition + stipend', type: 'University', deadline: 'Feb 2026' },
      { name: 'University Merit Scholarships',                        amount: '25–50% tuition',      type: 'University',  deadline: 'Rolling'  },
    ],
    careers: [
      'Medical Doctor (return to India via NExT): ₹8–25 lakhs/yr starting',
      'Software Engineer (Russian tech sector): ₽1,200,000–2,400,000/yr',
      'Mechanical / Industrial Engineer: ₽900,000–1,800,000/yr',
      'Research Scientist (MSU/BMSTU): ₽800,000–1,500,000/yr',
    ],
    process: [
      { step:1, title:'Program Selection', desc:'ILOC maps your goal (MBBS, Engineering, Science) to the strongest NMC-approved Russian institution.' },
      { step:2, title:'Application & Invitation', desc:'We apply to university and coordinate the official Invitation Letter (Vyzov) from Russia.' },
      { step:3, title:'Student Visa Processing', desc:'ILOC submits your visa application to the Russian Consulate in Mumbai or Delhi.' },
      { step:4, title:'NExT Coaching Strategy', desc:'For MBBS students, we integrate NExT preparation planning from Year 1 of study.' },
    ],
  },
];

export const COUNTRIES_MAP = Object.fromEntries(COUNTRIES.map(c => [c.code, c]));

// ── Default events (admin can override via KV) ────────────────────────────
export const DEFAULT_EVENTS: SiteEvent[] = [
  {
    id: 'ev1',
    title: 'USA University Fair 2026',
    type: 'fair',
    date: '2026-06-14',
    time: '11:00 AM – 2:00 PM IST',
    location: 'Online (Zoom)',
    description: 'Meet admission representatives from 15+ top US universities. Free registration. Seats filling fast.',
    country: 'usa',
    speakers: ['Rajib Paul Choudhury', 'USA Partner University Reps'],
    body: `## About This Event

The USA University Fair 2026 is ILOC's flagship annual event — bringing together admission representatives from **15+ top US universities** including University of South Florida, Texas Tech University, Northeastern University, and the University of Illinois Chicago.

This is a **zero-cost, zero-obligation** event. Whether you're a student just beginning to explore options or a parent with a specific shortlist in mind, this fair gives you direct access to the people who decide on admissions.

## What You Will Learn

- **University-specific admission requirements** for 2026–27 intake
- **Scholarship opportunities** — merit-based, need-based, and STEM-specific awards
- **F-1 Visa process** explained step-by-step for 2026 applicants
- **OPT & STEM OPT** — understanding your 3-year work authorization
- **Cost comparison** across universities and how to evaluate financial aid packages

## Who Should Attend

- Students targeting **August 2026 or January 2027** US intake
- Parents who want a complete picture of costs, scholarships and safety
- Anyone who has already received admits and needs help comparing offers

## Speakers

**Rajib Paul Choudhury** — Founder & Head Counsellor, ILOC (7+ years, 2,500+ students placed)

**University Representatives** from partner institutions across Florida, Texas, New York, Illinois and Massachusetts.

## Format

Live Zoom session with Q&A. A recording will be shared with all registered attendees within 24 hours.

> **Seats are limited to 150.** Register early — this event sells out every year.`,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80&auto=format&fit=crop',
    ctaLabel: 'Register Free',
    ctaUrl: '/contact',
    seats: 150,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ev2',
    title: 'UK Admissions Masterclass',
    type: 'webinar',
    date: '2026-06-21',
    time: '4:00 PM – 5:30 PM IST',
    location: 'Online (Google Meet)',
    description: 'Deep dive into UCAS, personal statements, scholarships and 2026 visa changes with Rajib Paul.',
    country: 'uk',
    speakers: ['Rajib Paul Choudhury'],
    body: `## About This Webinar

The UK Admissions Masterclass is a 90-minute deep-dive session designed specifically for students targeting **September 2026 UK intake**. Led personally by Rajib Paul Choudhury, this is not a sales pitch — it's a practical, no-nonsense walkthrough of everything you need to know before you apply.

## What We Cover

### UCAS & Direct Applications
- How UCAS works and when to apply (critical deadlines for Oxford, Cambridge, Medicine)
- Direct application routes for non-UCAS universities
- How to choose the right 5 universities for your UCAS form

### Personal Statement Excellence
- What Russell Group admissions tutors actually look for
- The "3-part narrative" structure ILOC uses for every PS
- Common mistakes that get Indian applicants rejected

### 2026 Visa Changes
- UK Student Route Visa — updated financial requirements for 2026
- **CAS (Confirmation of Acceptance for Studies)** — timeline and what to prepare
- Graduate Route Visa: your 2-year post-study work right explained

### Scholarships & Funding
- Chevening Scholarship — eligibility, timeline and what makes a winning application
- GREAT Scholarship — £10,000 for Indian students
- University-specific merit awards you can negotiate

## Who Should Attend

Students targeting MSc, MBA, or undergraduate programs at UK universities for September 2026. Parents are welcome and encouraged to join.

> **Only 80 seats available.** This fills up fast — register now to secure your spot.`,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&auto=format&fit=crop',
    ctaLabel: 'Join Webinar',
    ctaUrl: '/contact',
    seats: 80,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ev3',
    title: 'IELTS Strategy Workshop',
    type: 'workshop',
    date: '2026-07-05',
    time: '10:00 AM – 12:00 PM IST',
    location: 'Pune Office',
    description: 'Hands-on session covering all 4 IELTS modules with proven high-score techniques and mock tests.',
    country: '',
    speakers: ['ILOC Expert Trainers'],
    body: `## About This Workshop

This 2-hour hands-on workshop is conducted at **ILOC's Pune Office** (Erandwane, near Nal Stop). Unlike typical coaching classes, this is a **strategy session** — we focus on what actually moves the needle in the IELTS exam in 2026.

Our trainers have helped students achieve **Band 7.5+ across all modules**, with many reaching 8.0+ in Listening and Reading.

## What We Cover

### Listening (Module 1)
- The 3 trap types that cost students half a band — and how to spot them instantly
- Speed-reading questions before the audio plays
- Dictation practice with authentic 2025–2026 test audio formats

### Reading (Module 2)
- Skimming vs. scanning — when to use each (most students get this wrong)
- True/False/Not Given — the logic-based approach that eliminates guesswork
- Time management: finishing all 40 questions with 3 minutes to spare

### Writing (Module 3)
- Task 1: Data description structure that guarantees Band 7 if executed correctly
- Task 2: The 5-paragraph essay template ILOC students use for high-band responses
- Live review of 3 real student essays — what scored Band 6 vs. Band 8 and why

### Speaking (Module 4)
- Part 2 cue card — the 2-minute talk formula
- Common vocabulary substitutions that sound natural (not rehearsed)
- Live mock speaking with immediate feedback

## What's Included

- Printed strategy guide
- 1 full-length mock IELTS test (to complete at home)
- Access to ILOC's online question bank (400+ questions)

> **Only 40 seats.** This workshop runs in small groups to maximise individual feedback.`,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80&auto=format&fit=crop',
    ctaLabel: 'Book Seat',
    ctaUrl: '/contact',
    seats: 40,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ev4',
    title: 'Canada PR Pathway Seminar',
    type: 'seminar',
    date: '2026-07-12',
    time: '3:00 PM – 4:30 PM IST',
    location: 'Online (Zoom)',
    description: 'Understanding PGWP, Express Entry CRS scores and Provincial Nominee Programs for 2026 intake.',
    country: 'canada',
    speakers: ['Rajib Paul Choudhury'],
    body: `## About This Seminar

Canada is unique among study destinations: it doesn't just offer a world-class education — it offers a **clear, well-defined pathway to Permanent Residency**. But this pathway is changing rapidly in 2026, and most students arrive without a plan.

This seminar is for students who want to **study in Canada** and **stay in Canada** — and want to understand exactly how to maximise their chances at Canadian PR before they even graduate.

## What We Cover

### Canada's 2026 Immigration Landscape
- Why Canada capped international student permits — and what this means for applicants
- The Student Direct Stream (SDS) — faster processing, what documents you need
- How IRCC is prioritising applications in 2026

### PGWP — The Post-Graduate Work Permit
- PGWP validity based on program length (8 months to 3 years)
- Which programs qualify — and which ones to avoid if PR is your goal
- Starting your Express Entry profile while still in your first year

### Express Entry & CRS Score Strategy
- How the Comprehensive Ranking System (CRS) works
- What CRS score you need in 2026 (based on recent draws)
- Provincial Nominee Programs (PNP) — the shortcut to PR that most students overlook

### Choosing the Right University & Program
- How to select programs at UofT, UBC, McGill and other institutions with PGWP eligibility
- Programs with co-op — how Canadian work experience boosts your CRS score
- GIC (Guaranteed Investment Certificate) — what it is and how to set it up

## Who Should Attend

Students targeting **September 2026 or January 2027** Canada intake. Especially valuable if PR is part of your long-term plan.

> **120 seats available.** Free registration — register now to receive the event workbook.`,
    imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80&auto=format&fit=crop',
    ctaLabel: 'Register Now',
    ctaUrl: '/contact',
    seats: 120,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  // ── Live Online Classes ──────────────────────────────────────────────────
  {
    id: 'class-german-a1',
    title: 'Online German (A1 Level)',
    type: 'class',
    date: '2026-06-02',
    time: '8:00 PM – 9:30 PM IST',
    location: 'Online (Zoom)',
    description: 'Beginner German A1 batch — alphabet, greetings, basic grammar and everyday vocabulary. First session is a FREE demo. No prior knowledge needed.',
    country: 'europe',
    speakers: ['ILOC Language Faculty'],
    body: `## About This Course

This is ILOC's beginner **German A1 Online Batch** — designed for students targeting Germany, Austria or Switzerland for higher education or career purposes.

Classes run live on Zoom with a maximum batch size of 20 students for personalised attention.

## What You'll Learn

- German alphabet, pronunciation and phonetics
- Greetings, introductions and everyday conversation
- Noun genders, articles (der/die/das) and basic plurals
- Numbers, dates, time and colours
- Present tense verb conjugation
- Sentence structure and basic grammar patterns

## Who Should Attend

- Students planning to study in Germany or Austria
- Anyone starting German from scratch (zero prior knowledge needed)
- Professionals seeking language skills for work in Europe

## Format

Live Zoom classes · 1.5 hours per session · 3 sessions per week · Recordings provided

> **The first session is a FREE demo.** Attend and decide — no payment required upfront.`,
    imageUrl: '/images/german.jpg',
    ctaLabel: 'Book Free Demo',
    ctaUrl: '/contact',
    seats: 20,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'class-gre-online',
    title: 'GRE Online Coaching',
    type: 'class',
    date: '2026-06-05',
    time: '10:00 PM – 11:30 PM IST',
    location: 'Online (Zoom)',
    description: 'Comprehensive GRE prep covering Verbal, Quant and AWA. Expert-led live batches with personalised feedback. First session FREE.',
    country: 'usa',
    speakers: ['ILOC GRE Expert Faculty'],
    body: `## About This Course

ILOC's **GRE Online Coaching** is a structured, live program built around the revised GRE General Test format (2024 onwards). Our faculty have coached students to scores of 325+ across Verbal and Quantitative sections.

## What We Cover

### Verbal Reasoning
- Text Completion and Sentence Equivalence strategies
- Reading Comprehension — academic passages, argument analysis
- Vocabulary building with high-frequency GRE word lists

### Quantitative Reasoning
- Arithmetic, Algebra, Geometry and Data Analysis
- Problem-solving and Data Interpretation strategies
- Quantitative Comparison — how to tackle the tricky ones

### Analytical Writing Assessment (AWA)
- Issue Essay — the 6-point framework
- Argument Essay — how to critique, not just describe
- Live essay reviews with band-level feedback

## Format

Live Zoom · 1.5 hours per session · 4 sessions per week · Full mock tests every 2 weeks

> **First session is a FREE demo.** See the teaching quality before committing.`,
    imageUrl: '/images/gre.jpg',
    ctaLabel: 'Book Free Demo',
    ctaUrl: '/contact',
    seats: 25,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'class-toefl-online',
    title: 'TOEFL Online Coaching',
    type: 'class',
    date: '2026-06-09',
    time: '5:00 PM – 6:00 PM IST',
    location: 'Online (Zoom)',
    description: 'Expert TOEFL iBT coaching covering Reading, Listening, Speaking and Writing with live practice and instant feedback. First session FREE.',
    country: '',
    speakers: ['ILOC TOEFL Faculty'],
    body: `## About This Course

ILOC's **TOEFL Online Coaching** is a structured program for students targeting universities in the USA, Canada, UK and Australia that require the TOEFL iBT. Our students consistently achieve scores of 100+ iBT.

## What We Cover

### Reading
- Academic passage strategies — skimming, scanning, inference questions
- Vocabulary-in-context and rhetorical purpose questions

### Listening
- Note-taking from lectures and campus conversations
- Gist, detail, attitude and inference question types

### Speaking
- Independent Tasks (Questions 1–2): opinion and personal experience
- Integrated Tasks (Questions 3–6): campus situations + academic lectures
- Live speaking practice with instant feedback on fluency and pronunciation

### Writing
- Integrated Writing Task — reading + lecture synthesis
- Independent Writing Task — structured 5-paragraph essays
- Live essay reviews

## Format

Live Zoom · 1 hour per session · 5 sessions per week · Full iBT mock tests monthly

> **First session is a FREE demo.** No payment or commitment required to attend.`,
    imageUrl: '/images/toefl.jpg',
    ctaLabel: 'Book Free Demo',
    ctaUrl: '/contact',
    seats: 25,
    published: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// ── Default hero rotating images ──────────────────────────────────────────
export const DEFAULT_HERO_IMAGES: string[] = [
  // Slot 1 — Students in a bright modern library (ultra-stable Unsplash ID)
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop',
  // Slot 2 — Diverse students on campus steps
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
  // Slot 3 — Professional woman reviewing documents (consultant vibe)
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2070&auto=format&fit=crop',
];

// Single guaranteed fallback used by onError — never references DEFAULT_HERO_IMAGES to avoid circular dependency
export const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop';

// ── Default site media ────────────────────────────────────────────────────
export const DEFAULT_MEDIA: SiteMedia = {
  heroImages:   DEFAULT_HERO_IMAGES,
  aboutImage:   'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
  officeImage:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
  customImages: [],
};

// ── Default hero carousel slides (admin-editable via KV) ──────────────────
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id:               'study-abroad',
    badge:            '🎓 25+ Years of Trusted Expertise — Pune\'s #1 Choice',
    headingLines:     ['Begin Your Study Abroad', 'Journey with India\'s', 'Most Trusted Consultants'],
    headingHighlight: [false, false, true],
    highlightColor:   'text-amber-400',
    subtext:          'Join 10,000+ students who fulfilled their Study Abroad dreams with ILOC — zero hidden fees, 97% visa approval, and a free 30-minute counselling session waiting for you.',
    trustBadges:      ['97% Visa Approval', '₹0 Hidden Fees', '25+ Years Expertise', 'Free Counselling'],
    ctaPrimary:       { label: 'Book a Free Consultation →', style: 'amber', action: 'link', href: '/contact' },
    ctaSecondary:     { label: '💬 Chat on WhatsApp', style: 'ghost', action: 'whatsapp' },
    imageUrl:         'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1600&auto=format&fit=crop',
    imageAlt:         'Students celebrating their university admission with ILOC',
    stats:            [
      { num: '10,000+', label: 'Students Placed',  color: '#D97706' },
      { num: '97%',     label: 'Visa Approval',    color: '#059669' },
      { num: '25+',     label: 'Years of Expertise', color: '#246DFF' },
    ],
    accentGradient:   'from-blue-900/60 via-blue-800/30',
    enabled:          true,
  },
  {
    id:               'universities',
    badge:            '🏛️ 400+ Partner Universities Across 12 Countries',
    headingLines:     ['Your Passport to', 'World\'s Most Prestigious', 'Universities'],
    headingHighlight: [false, true, false],
    highlightColor:   'text-amber-400',
    subtext:          'Follow the footsteps of 1,200+ ILOC students placed in Top 100 QS-ranked universities across USA, UK, Canada, Australia, Ireland & Europe — with maximum scholarships.',
    trustBadges:      ['400+ Universities', '12 Countries', '1,200+ Top-100 Placed', 'Max Scholarships'],
    ctaPrimary:       { label: 'Explore Destinations →', style: 'amber', action: 'link', href: '/destinations' },
    ctaSecondary:     { label: '📋 View Success Stories', style: 'ghost', action: 'link', href: '/about' },
    imageUrl:         'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop',
    imageAlt:         'Diverse students thriving on a prestigious world-class campus',
    stats:            [
      { num: '400+',   label: 'Partner Universities', color: '#246DFF' },
      { num: '12',     label: 'Countries',            color: '#7C3AED' },
      { num: '1,200+', label: 'Top-100 Placed',       color: '#D97706' },
    ],
    accentGradient:   'from-indigo-900/60 via-indigo-800/30',
    enabled:          true,
  },
  {
    id:               'ielts',
    badge:            '📝 IELTS Coaching — Live Classes & Online Batches',
    headingLines:     ['Achieve an', '8+ Band Score', 'on Your First Attempt'],
    headingHighlight: [false, true, false],
    highlightColor:   'text-emerald-400',
    subtext:          'Join 14,000+ students who cleared IELTS with a 96% success rate. Expert faculty, personalised score feedback, real exam simulations, and guaranteed band improvement.',
    trustBadges:      ['14,000+ IELTS Cleared', '96% Success Rate', 'Live + Online Batches', 'Free Demo Class'],
    ctaPrimary:       { label: 'Book a Free DEMO Class →', style: 'green', action: 'demo-modal' },
    ctaSecondary:     { label: '📞 Call Us Now', style: 'ghost', action: 'phone', href: 'tel:+919158577707' },
    imageUrl:         'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop',
    imageAlt:         'Student studying for IELTS exam with expert coaching support',
    stats:            [
      { num: '14,000+', label: 'IELTS Cleared',  color: '#059669' },
      { num: '96%',     label: 'Success Rate',   color: '#D97706' },
      { num: '8+',      label: 'Avg Band Score', color: '#246DFF' },
    ],
    accentGradient:   'from-emerald-900/60 via-emerald-800/30',
    enabled:          true,
  },
  {
    id:               'live-classes',
    badge:            '🎁 First Session Always FREE — No Commitment Required',
    headingLines:     ['Ace Your Exams with', 'Expert Live', 'Online Classes'],
    headingHighlight: [false, true, false],
    highlightColor:   'text-amber-400',
    subtext:          'Join online batches for GRE, TOEFL, IELTS, and German. Every new batch starts with a 🎁 FREE Demo Session. No commitment required.',
    trustBadges:      ['GRE · GMAT · SAT', 'TOEFL · IELTS', 'German A1–B2', 'Free Demo Session'],
    ctaPrimary:       { label: 'Explore Live Classes →', style: 'amber', action: 'link', href: '/events?type=classes' },
    ctaSecondary:     { label: '💬 Book via WhatsApp', style: 'ghost', action: 'whatsapp' },
    imageUrl:         'https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=1600&auto=format&fit=crop',
    imageAlt:         'Students attending live online coaching classes from ILOC',
    stats:            [
      { num: '6',       label: 'Subjects Available', color: '#FBBF24' },
      { num: '100%',    label: 'Live & Online',      color: '#34D399' },
      { num: '₹0',      label: 'Demo Session Cost',  color: '#60A5FA' },
    ],
    accentGradient:   'from-violet-900/60 via-violet-800/30',
    enabled:          true,
  },
];
