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
export const DEFAULT_STUDENT_SERVICES: StudentServiceCard[] = [
  {
    id:          'ug-admissions',
    title:       'Undergraduate Admissions',
    description: 'End-to-end UG application support — university shortlisting across USA, UK, Canada & Australia, SOP strategy, and offer-letter negotiation.',
    imageUrl:    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'pg-admissions',
    title:       'Graduate & MBA Admissions',
    description: 'MS, MBA and PhD applications with precision SOP narratives, LOR strategy, and active scholarship negotiation for top-ranked programs worldwide.',
    imageUrl:    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'profile-building',
    title:       'Profile Building & Career Strategy',
    description: 'Build a compelling academic identity — research exposure, leadership roadmap, and a 12-month personalised plan to unlock Ivy League and Russell Group admits.',
    imageUrl:    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'test-coaching',
    title:       'IELTS · TOEFL · GRE · GMAT Coaching',
    description: 'Expert-led coaching with small batches, personalised feedback, and 400+ practice questions — averaging a 1.5-band IELTS improvement in 6 weeks.',
    imageUrl:    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'visa-assistance',
    title:       'Visa Assistance & Mock Interviews',
    description: '97%+ visa approval rate built on meticulous documentation — every DS-160, CAS and GIC filed without error. Intensive mock interview preparation included.',
    imageUrl:    'https://images.unsplash.com/photo-1569974507005-6dc61f6d5f98?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'counselling',
    title:       'Free 30-Min Expert Counselling',
    description: 'A direct session with our expert counsellors. Honest profile assessment, university-country fit, and a scholarship strategy — no sales pitch, zero hidden fees.',
    imageUrl:    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'sop-lor',
    title:       'SOP & LOR Writing',
    description: 'Professionally crafted Statements of Purpose and Letters of Recommendation tailored to each university, program, and the applicant\'s unique story.',
    imageUrl:    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'accommodation',
    title:       'Accommodation Guidance',
    description: 'Pre-arrival support to find safe, affordable student housing near your campus — vetted options across all major international student cities.',
    imageUrl:    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'forex-banking',
    title:       'Forex & Banking Setup',
    description: 'Currency exchange guidance, student banking accounts and international money transfer support for seamless pre-departure financial transitions.',
    imageUrl:    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'career-coaching',
    title:       'Career Coaching',
    description: 'Resume review, interview preparation and internship search support specifically designed for international students navigating competitive global job markets.',
    imageUrl:    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'smart-budgeting',
    title:       'Smart Budgeting',
    description: 'Personalised financial planning for studying abroad — tuition structuring, living cost estimates, education loan guidance, and monthly budget templates.',
    imageUrl:    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop',
  },
  {
    id:          'scholarship-support',
    title:       'Scholarship Support',
    description: 'Identify and apply for merit-based, need-based, and country-specific scholarships. Our team actively negotiates scholarship upgrades at time of admission.',
    imageUrl:    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80&auto=format&fit=crop',
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
