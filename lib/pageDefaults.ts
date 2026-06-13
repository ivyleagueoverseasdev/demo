/**
 * Default content for the /about and /services pages.
 * Shared by the public pages (fallback when KV has no override) AND the
 * admin editors (so they always show the content that is actually live).
 */

import type { AboutPageSettings, ServicesPageSettings } from '@/lib/types';
import { COMPANY } from '@/lib/data';

export const ABOUT_DEFAULTS: AboutPageSettings = {
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

export const SERVICES_DEFAULTS: ServicesPageSettings = {
  heroEyebrow:      'What We Offer',
  heroHeadingLine1: 'Complete services for',
  heroHeadingLine2: 'every step of your journey.',
  heroParagraph:    'From university shortlisting to visa clearance — our end-to-end process is designed so you never have to figure anything out alone.',
  studentHeading:   'Student Services',
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
    extraServices:     kv.extraServices?.length     ? kv.extraServices     : SERVICES_DEFAULTS.extraServices,
    instituteServices: kv.instituteServices?.length ? kv.instituteServices : SERVICES_DEFAULTS.instituteServices,
  };
}
