/**
 * Default content for the /about and /services pages.
 * Shared by the public pages (fallback when KV has no override) AND the
 * admin editors (so they always show the content that is actually live).
 */

import type { AboutPageSettings, ServicesPageSettings, StudentServiceCard } from '@/lib/types';
import { COMPANY } from '@/lib/data';

export const ABOUT_DEFAULTS: AboutPageSettings = {
  heroImageUrl:      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
  heroEyebrow:       `Est. ${COMPANY.since}`,
  heroHeadingLine1:  'Honest guidance.',
  heroHeadingLine2:  'Proven results.',
  heroParagraph:     `${COMPANY.name} (ILOC) is a premium overseas education consultancy founded by ${COMPANY.founder} in ${COMPANY.since}. Based in Pune, we've placed 10,000+ students at 400+ universities worldwide — with a 97% visa approval rate and zero hidden fees.`,
  founderInitials:   'ILOC',
  founderName:       COMPANY.founder,
  founderRole:       'Founder & Head Counsellor',
  founderMeta:       '10+ Years Experience · Pune, India',
  founderQuote:      '"Every student deserves honest, personalised guidance — not a one-size-fits-all template driven by commissions."',
  founderParagraph1: 'I founded ILOC with one simple belief: students deserve unbiased, transparent guidance from someone who genuinely cares. Too many students are mis-guided by agents chasing commissions — we operate on a completely different model. Our fee is fixed, transparent and never tied to any specific university.',
  founderParagraph2: "With 10,000+ students placed across 400+ universities in 12+ countries, our track record speaks for itself. Every student gets expert, personalised attention — that's the ILOC promise.",
  missionTitle:      'Our Mission',
  missionDesc:       'To provide quality, transparent and unbiased overseas education counselling that empowers every student to achieve their global aspirations — regardless of background or budget.',
  visionTitle:       'Our Vision',
  visionDesc:        'To be the most trusted overseas education consulting brand in India — known for ethical practices, zero hidden fees, personalised service and outstanding student outcomes.',
  whyHeading:        'Why choose ILOC?',
  whyLabels: [
    'Google Verified Business',
    '97% Visa Approval',
    'Zero Hidden Fees',
    'Direct Founder Access',
  ],
  ctaHeading:        'Ready to begin your journey?',
  ctaParagraph:      'Book a free 30-minute counselling session with our team. No pressure, no commitment — just clarity.',
};

// 12 student service cards — the 4×3 image-led grid on /services
// Each card also has its own detail page at /services/[id].
// `description` = short card blurb; `body` = full page content (plain text, double-newline = new paragraph)
export const DEFAULT_STUDENT_SERVICES: StudentServiceCard[] = [
  {
    id:          'ug-admissions',
    title:       'Undergraduate Admissions',
    description: 'End-to-end UG application support — university shortlisting across USA, UK, Canada & Australia, SOP strategy, and offer-letter negotiation.',
    imageUrl:    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop',
    body:        `ILOC's undergraduate admissions service takes you through every step of the application process — from initial profile evaluation and university shortlisting to final offer acceptance.\n\nWe evaluate your academic scores, extracurriculars, and aspirations to build a shortlist of universities that match your profile and budget across the USA, UK, Canada, and Australia.\n\nOur team handles the entire paperwork — SOP strategy, reference letters, application forms, and deadline tracking — so you never miss a single submission window.`,
  },
  {
    id:          'pg-admissions',
    title:       'Graduate & MBA Admissions',
    description: 'MS, MBA and PhD applications with precision SOP narratives, LOR strategy, and active scholarship negotiation for top-ranked programs worldwide.',
    imageUrl:    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop',
    body:        `Graduate applications demand a different level of precision. Our team specialises in MS, MBA, and PhD applications at top-ranked institutions worldwide.\n\nWe craft narratives that translate your work experience and academic background into compelling Statements of Purpose — tailored individually to each university and program.\n\nBeyond the application, we actively negotiate scholarship offers and provide post-admission guidance on securing funding that can reduce your tuition by up to 70%.`,
  },
  {
    id:          'profile-building',
    title:       'Profile Building & Career Strategy',
    description: 'Build a compelling academic identity — research exposure, leadership roadmap, and a 12-month personalised plan to unlock Ivy League and Russell Group admits.',
    imageUrl:    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
    body:        `A strong academic profile is built over months, not days. Our 12-month profile-building programme helps you develop the extracurricular record and academic identity that top universities want to see.\n\nWe identify research opportunities, leadership initiatives, and relevant certifications that align with your target universities' expectations — then help you present them compellingly.\n\nStudents who join our profile-building programme one year before applying consistently achieve admits at institutions 2–3 tiers above their initial expectations.`,
  },
  {
    id:          'test-coaching',
    title:       'IELTS · TOEFL · GRE · GMAT Coaching',
    description: 'Expert-led coaching with small batches, personalised feedback, and 400+ practice questions — averaging a 1.5-band IELTS improvement in 6 weeks.',
    imageUrl:    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop',
    body:        `Our test preparation programme is designed for efficiency. Small batches of 4–6 students ensure personalised feedback and rapid improvement over a structured 6-week programme.\n\nWe have helped students achieve a 1.5-band IELTS improvement and 8+ point GRE score gains on average. Our 400+ practice questions are drawn from real past papers and updated annually.\n\nFlexible batch timings — morning, evening, and weekend — mean test prep fits around your existing commitments.`,
  },
  {
    id:          'visa-assistance',
    title:       'Visa Assistance & Mock Interviews',
    description: '97%+ visa approval rate built on meticulous documentation — every DS-160, CAS and GIC filed without error. Intensive mock interview preparation included.',
    imageUrl:    'https://images.unsplash.com/photo-1569974507005-6dc61f6d5f98?w=800&q=80&auto=format&fit=crop',
    body:        `ILOC holds a 97%+ visa approval rate built on meticulous documentation and intensive interview preparation. We handle every financial affidavit, DS-160, CAS letter, GIC, and GTE statement without error.\n\nOur mock interview programme runs three rounds of realistic embassy simulations — complete with tough questions and immediate feedback — so you walk in fully prepared and confident.\n\nWe stay updated on every country's latest visa processing requirements so your application is never caught off guard by regulatory changes.`,
  },
  {
    id:          'counselling',
    title:       'Free 30-Min Expert Counselling',
    description: 'A direct session with our expert counsellors. Honest profile assessment, university-country fit, and a scholarship strategy — no sales pitch, zero hidden fees.',
    imageUrl:    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&auto=format&fit=crop',
    body:        `Our free counselling session is not a sales pitch — it is a genuine assessment of your academic profile, target universities, and scholarship potential delivered by an experienced counsellor.\n\nIn 30 minutes, you receive a clear picture of which countries and programmes suit your background, what scholarship options are available to you, and the exact next steps you need to take.\n\nNo hidden fees, no pressure, and no obligation. Just an honest roadmap from someone who has guided 10,000+ students through the same journey.`,
  },
  {
    id:          'sop-lor',
    title:       'SOP & LOR Writing',
    description: 'Professionally crafted Statements of Purpose and Letters of Recommendation tailored to each university, program, and the applicant\'s unique story.',
    imageUrl:    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    body:        `Your Statement of Purpose is often the single most important document in your application. Our counsellors work with you through multiple drafts to craft a narrative that is authentic, strategic, and compelling.\n\nWe do not use templates. Each SOP is built from scratch around your unique background, career goals, and the specific requirements of each university you are applying to.\n\nFor Letters of Recommendation, we coach your referees on the key points to highlight and provide structure that ensures their letter strengthens — rather than merely repeats — your application story.`,
  },
  {
    id:          'accommodation',
    title:       'Accommodation Guidance',
    description: 'Pre-arrival support to find safe, affordable student housing near your campus — vetted options across all major international student cities.',
    imageUrl:    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80&auto=format&fit=crop',
    body:        `Finding safe, affordable student housing in an unfamiliar city can be stressful. Our pre-arrival accommodation support removes that uncertainty before you board your flight.\n\nWe provide vetted options for on-campus residences, purpose-built student accommodation, and private rentals across all major university cities in the UK, USA, Canada, and Australia.\n\nOur team reviews lease terms, flags hidden costs, and helps you shortlist options that match your budget and proximity preferences — so you arrive with somewhere to go.`,
  },
  {
    id:          'forex-banking',
    title:       'Forex & Banking Setup',
    description: 'Currency exchange guidance, student banking accounts and international money transfer support for seamless pre-departure financial transitions.',
    imageUrl:    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop',
    body:        `International money transfers and student banking can be complicated and expensive without the right guidance. Our forex and banking support helps you navigate this smoothly.\n\nWe advise on the most cost-effective ways to transfer tuition fees and living allowances abroad, and guide you through opening a student bank account — including NRI accounts and international student accounts at partner banks.\n\nOur education loan guidance covers Indian nationalised banks, private lenders, and NBFC products with the lowest effective interest rates available for studying abroad.`,
  },
  {
    id:          'career-coaching',
    title:       'Career Coaching',
    description: 'Resume review, interview preparation and internship search support specifically designed for international students navigating competitive global job markets.',
    imageUrl:    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80&auto=format&fit=crop',
    body:        `Securing a job or internship as an international student requires a different strategy than domestic applicants. Our career coaching is built specifically for this challenge.\n\nWe review your resume for international formats, coach you on interview questions for your target industry, and help you identify job search platforms most active in your country of study.\n\nPost-study work rights vary significantly by country. We ensure you understand your options from day one so you can plan your career trajectory before you even arrive.`,
  },
  {
    id:          'smart-budgeting',
    title:       'Smart Budgeting',
    description: 'Personalised financial planning for studying abroad — tuition structuring, living cost estimates, education loan guidance, and monthly budget templates.',
    imageUrl:    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop',
    body:        `Studying abroad involves complex financial planning — tuition, living costs, forex rates, health insurance, and education loans all need to be accounted for together.\n\nOur smart budgeting service creates a personalised financial plan for your specific country, city, and university — with accurate monthly cost estimates and a complete breakdown of one-time setup costs.\n\nWe also provide education loan strategy guidance, helping you identify the right loan amount and structure to cover your full cost of attendance without over-borrowing.`,
  },
  {
    id:          'scholarship-support',
    title:       'Scholarship Support',
    description: 'Identify and apply for merit-based, need-based, and country-specific scholarships. Our team actively negotiates scholarship upgrades at time of admission.',
    imageUrl:    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80&auto=format&fit=crop',
    body:        `ILOC's scholarship support goes beyond simply listing available awards. We actively identify scholarships that match your specific profile — academic, need-based, country-specific, and university-funded.\n\nOur team helps you prepare scholarship applications alongside your university application, ensuring every essay and supporting document is tailored to the awarding body's criteria.\n\nAt the time of admission offer, our counsellors negotiate scholarship upgrades directly with universities — a step that has resulted in students receiving awards of ₹2 lakhs to ₹25 lakhs beyond their initial offer.`,
  },
];

export const SERVICES_DEFAULTS: ServicesPageSettings = {
  heroImageUrl:    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop',
  heroEyebrow:     'What We Offer',
  heroHeadingLine1: 'Complete services for',
  heroHeadingLine2: 'every step of your journey.',
  heroParagraph:   'From university shortlisting to visa clearance — our end-to-end process is designed so you never have to figure anything out alone.',
  studentHeading:  'Student Services',
  studentServices: DEFAULT_STUDENT_SERVICES,
  extraServices: [
    { id: 'sop',    icon: '✍️', title: 'SOP & LOR Writing',      desc: 'Professionally crafted Statements of Purpose and Letters of Recommendation tailored to each university and program.' },
    { id: 'accom',  icon: '🏠', title: 'Accommodation Guidance', desc: 'Pre-arrival support to find safe, affordable student housing near your campus in any target country.' },
    { id: 'forex',  icon: '💱', title: 'Forex & Banking Setup',  desc: 'Currency exchange guidance, student banking accounts and international money transfer support for seamless transitions.' },
    { id: 'career', icon: '💼', title: 'Career Coaching',        desc: 'Resume review, interview preparation and internship search support specifically for international students in 2026.' },
  ],
  instituteHeading: 'For Institutes',
  instituteIntro:   'Partner with ILOC to access a verified student pipeline across India.',
  instituteServices: [
    { icon: '🏫', title: 'Student Pipeline',  desc: 'Access a verified pool of qualified Indian students seeking admission at your institution.' },
    { icon: '📊', title: 'Marketing Support', desc: 'ILOC promotes your institution through counselling sessions, education fairs and digital channels.' },
    { icon: '🤝', title: 'MOU Partnerships',  desc: 'Formalise the relationship with a signed MOU defining clear commission and referral terms.' },
  ],
  partnerBoxHeading: 'Interested in a B2B partnership?',
  partnerBoxText:    'Contact us to discuss MOU terms, commission structures and student pipeline access.',
  ctaHeading:        'Start with a free 30-min session.',
  ctaParagraph:      'Zero pressure. Direct founder access. Personalised roadmap.',
};

/** Merge a KV override onto the defaults the same way the public pages do. */
export function mergeAboutSettings(kv: Partial<AboutPageSettings> | null): AboutPageSettings {
  if (!kv) return ABOUT_DEFAULTS;
  return {
    ...ABOUT_DEFAULTS,
    ...kv,
    whyLabels: kv.whyLabels?.length ? kv.whyLabels : ABOUT_DEFAULTS.whyLabels,
  };
}

export function mergeServicesSettings(kv: Partial<ServicesPageSettings> | null): ServicesPageSettings {
  if (!kv) return SERVICES_DEFAULTS;
  return {
    ...SERVICES_DEFAULTS,
    ...kv,
    studentServices:   kv.studentServices?.length   ? kv.studentServices   : SERVICES_DEFAULTS.studentServices,
    extraServices:     kv.extraServices?.length     ? kv.extraServices     : SERVICES_DEFAULTS.extraServices,
    instituteServices: kv.instituteServices?.length ? kv.instituteServices : SERVICES_DEFAULTS.instituteServices,
  };
}
