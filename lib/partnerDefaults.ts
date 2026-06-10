/**
 * Default content for the three Partners B2B pages.
 * Shared by the public pages (fallback when KV has no override) AND the
 * admin editor (so it always shows the content that is actually live).
 * Heading supports **bold** markers rendered as the amber gradient span.
 */

import type { PartnerPageSettings } from '@/lib/kv';

export type PartnerPageKey = 'institutions' | 'agent' | 'referral';

export const PARTNER_DEFAULTS: Record<PartnerPageKey, PartnerPageSettings> = {
  institutions: {
    badge:       'Global University Network',
    heading:     'Recruit **High-Intent** Indian Students.',
    subheading:  'Join over 400 prestigious global institutions that trust ILOC for rigorous student screening, authentic documentation, and a sustained 97% visa approval rate.',
    bodyHeading: 'Why Partner with ILOC?',
    bodyIntro:   "As India's student mobility accelerates, universities face the challenge of volume versus quality. At Ivy League Overseas Consulting, we solve this by operating as an extension of your admissions office. We do not just process applications; we curate academic profiles.",
    stats: [
      { value: '97%',  label: 'Visa Success Rate',  desc: 'Our meticulous financial and academic verification guarantees highly genuine students with exceptional visa conversion.' },
      { value: '2.5k', label: 'Alumni Network',      desc: 'A thriving ecosystem of successful placements across the US, UK, Canada, and Australia generating constant organic referrals.' },
    ],
    listHeading: 'Our Commitment to Quality',
    listItems: [
      'Rigorous Academic Vetting: Direct verification of transcripts, test scores, and language proficiency.',
      'Financial Authenticity: Strict pre-screening of funding sources before application submission.',
      'Volume & Scale: Strategic marketing campaigns ensuring a steady pipeline of diverse applicants.',
    ],
    formHeading: 'Initiate Partnership',
    formSubtext: 'Our institutional relations team will contact you within 24 hours.',
  },

  agent: {
    badge:       'B2B Franchise & Agent Network',
    heading:     'Scale Your **Consultancy** with ILOC.',
    subheading:  'Leverage our established brand, direct university tie-ups, and industry-leading CRM processing to multiply your revenue with absolute transparency.',
    bodyHeading: 'Empower Your Business',
    bodyIntro:   'The overseas education market is highly fragmented and competitive. Building direct relationships with top-tier universities takes years. By joining the ILOC Agent Network, you bypass the friction. You focus on recruiting students in your local market; we provide the portfolio, the processing power, and the payouts.',
    stats: [
      { value: '400+', label: 'Direct Tie-Ups',  desc: 'Offer your students immediate access to top universities across the globe without negotiating individual contracts.' },
      { value: '100%', label: 'Transparency',    desc: 'Clear commission structures, real-time application tracking via our CRM, and guaranteed on-time payouts.' },
    ],
    listHeading: 'Partner Benefits',
    listItems: [
      'Industry-Leading Revenue Share: Maximise your earnings with our highly competitive commission models.',
      'Dedicated Processing Team: Our expert back-office handles SOP reviews, application submissions, and visa prep.',
      'Marketing & Brand Support: Utilize the trusted ILOC brand equity to convert high-value leads locally.',
    ],
    formHeading: 'Apply for Agency Partner',
    formSubtext: 'Register your agency to get access to our commercial terms.',
  },

  referral: {
    badge:       'ILOC Alumni & Student Network',
    heading:     'Share Success. **Earn Rewards.**',
    subheading:  'Over 60% of our students come through referrals. Help your friends navigate their study abroad journey with Pune\'s most trusted consultants, and get rewarded for every successful enrollment.',
    bodyHeading: 'How It Works',
    bodyIntro:   'We believe that the best endorsement of our premium consulting services is the success of our students. If you or someone you know has benefited from our expertise, share the advantage. The process is completely transparent and seamless.',
    stats: [
      { value: '1', label: 'Submit Referral',   desc: 'Fill out the quick form with your friend\'s details.' },
      { value: '2', label: 'Free Consultation', desc: 'Our expert team contacts them for a complimentary profile evaluation.' },
      { value: '3', label: 'Earn Rewards',      desc: 'Once they successfully enroll, your referral reward is instantly processed.' },
    ],
    listHeading: 'Exclusive Alumni Rewards',
    listItems: [
      'Alumni Monetary Rewards: Exclusive cash rewards for our alumni network on every successful referral.',
      'Premium Gifts: Special gifts and recognition for top referrers in our student community.',
      'Priority Support: Alumni referrers get priority access to counselling sessions and visa updates.',
    ],
    formHeading: 'Register a Referral',
    formSubtext: 'Enter the details below. We will handle the rest.',
  },
};

/** Merge a KV override onto the defaults the same way the public pages do. */
export function mergePartnerSettings(page: PartnerPageKey, kv: Partial<PartnerPageSettings> | null): PartnerPageSettings {
  const d = PARTNER_DEFAULTS[page];
  if (!kv) return d;
  return {
    ...d,
    ...kv,
    stats:     kv.stats?.length     ? kv.stats     : d.stats,
    listItems: kv.listItems?.length ? kv.listItems : d.listItems,
  };
}
