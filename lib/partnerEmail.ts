// Partner enquiry email templates.
// Generates customUserSubject/customUserHtml/customAdminSubject/customAdminHtml
// which the Google Apps Script reads to override its default student-enquiry email.

export type PartnerType = 'institutions' | 'agent' | 'referral';

export interface PartnerEmailPayload {
  userSubject:  string;
  userHtml:     string;
  adminSubject: string;
  adminHtml:    string;
}

export interface PartnerEmailExtras {
  email?:           string;
  phone?:           string;
  designation?:     string;
  country?:         string;
  yearsInBusiness?: string;
  expectedVolume?:  string;
  friendName?:      string;
  friendPhone?:     string;
  message?:         string;
}

// HTML-safe escape — used in htmlBody only, never in plain-text subjects
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function adminRow(label: string, value: string): string {
  return [
    '<tr>',
    `  <td style="padding:8px 12px 8px 0;font-weight:bold;color:#6b7280;white-space:nowrap;vertical-align:top;width:120px">${label}</td>`,
    `  <td style="padding:8px 0;color:#111827;border-bottom:1px solid #f3f4f6">${value || '—'}</td>`,
    '</tr>',
  ].join('');
}

/**
 * Builds the four email override keys expected by the GAS webhook.
 *
 * @param name        Contact person's name (used in greeting + admin table)
 * @param companyName University / agency / referrer name (used in subject + admin table)
 * @param partnerType Which partnership track triggered the form
 * @param extra       All other form fields — only non-empty ones appear in the admin email
 * @param adminUrl    Link to the admin panel shown in the admin notification
 */
export function generatePartnerEmail(
  name:        string,
  companyName: string,
  partnerType: PartnerType,
  extra:       PartnerEmailExtras = {},
  adminUrl:    string = '',
): PartnerEmailPayload {

  // ── User-facing subject (plain text — no HTML escaping) ───────────────────
  const displayCompany = companyName || name || 'Unknown';
  const userSubject    = `Received: Partnership Proposal from ${displayCompany}`;

  // ── User-facing body — paragraphs differ per track ────────────────────────
  let para1: string;
  let para2: string;

  if (partnerType === 'institutions') {
    para1 = 'Thank you for reaching out to Ivy League Overseas Consulting. We have successfully received your enquiry regarding a potential collaboration. Our team is currently reviewing your proposal and will evaluate how it aligns with our current international initiatives.';
    para2 = 'We will get back to you with a response or to schedule a brief introductory meeting.';
  } else if (partnerType === 'agent') {
    para1 = 'Thank you for reaching out to Ivy League Overseas Consulting. We have successfully received your enquiry regarding a potential collaboration.';
    para2 = 'Our team is currently reviewing your proposal and will get back to you with a response or to schedule a brief introductory meeting.';
  } else {
    // referral
    para1 = 'Thank you for reaching out to Ivy League Overseas Consulting. We have received your enquiry regarding a collaboration.';
    para2 = 'Our team is currently reviewing your proposal and will get back to you with a response or to schedule a brief introductory meeting.';
  }

  const userHtml = [
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#333;max-width:600px;line-height:1.7;">',
    `  <h2 style="color:#07257C;margin:0 0 16px">Hello ${esc(name || 'there')},</h2>`,
    `  <p style="margin:0 0 14px">${para1}</p>`,
    `  <p style="margin:0 0 24px">${para2}</p>`,
    '  <p style="margin:0">Best regards,<br>',
    '  <strong>Ivy League Overseas Team</strong><br>',
    '  <a href="https://www.ivyleagueoverseas.com" style="color:#07257C;text-decoration:none;">www.ivyleagueoverseas.com</a></p>',
    '</div>',
  ].join('\n');

  // ── Admin notification ────────────────────────────────────────────────────
  const typeLabel = partnerType === 'institutions'
    ? 'Institution'
    : partnerType === 'agent'
    ? 'Agent / Franchisee'
    : 'Referral';

  const adminSubject = `🤝 New Partner Enquiry: ${displayCompany} — ${typeLabel}`;

  // Build table rows — always include core fields, then optional extras
  const rows: string[] = [
    adminRow('Partner Type', typeLabel),
    adminRow('Name',         esc(name)),
    adminRow('Company',      esc(displayCompany)),
    adminRow('Email',
      extra.email
        ? `<a href="mailto:${esc(extra.email)}" style="color:#07257C">${esc(extra.email)}</a>`
        : '—'
    ),
    adminRow('Phone',
      extra.phone
        ? `<a href="tel:${esc(extra.phone)}" style="color:#07257C">${esc(extra.phone)}</a>`
        : '—'
    ),
  ];

  if (extra.designation)     rows.push(adminRow('Designation',       esc(extra.designation)));
  if (extra.country)         rows.push(adminRow('Country',           esc(extra.country)));
  if (extra.yearsInBusiness) rows.push(adminRow('Years in Business', esc(extra.yearsInBusiness)));
  if (extra.expectedVolume)  rows.push(adminRow('Expected Volume',   esc(extra.expectedVolume)));
  if (extra.friendName)      rows.push(adminRow("Friend's Name",     esc(extra.friendName)));
  if (extra.friendPhone)     rows.push(adminRow("Friend's Phone",    esc(extra.friendPhone)));
  if (extra.message)         rows.push(adminRow('Message',           esc(extra.message)));

  const adminHtml = [
    '<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;max-width:600px">',
    '  <div style="background:#07257C;padding:20px 28px;border-radius:10px 10px 0 0">',
    '    <h2 style="margin:0;color:#fff;font-size:18px">🤝 New Partner Enquiry</h2>',
    `    <p style="margin:4px 0 0;color:#a5b4fc;font-size:12px">IVY LEAGUE OVERSEAS CONSULTING — ${typeLabel}</p>`,
    '  </div>',
    '  <div style="background:#f9fafb;padding:24px 28px;border:1px solid #e5e7eb;border-top:none">',
    '    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">',
    ...rows,
    '    </table>',
    '  </div>',
    '  <div style="background:#fff;padding:16px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px">',
    adminUrl
      ? `    <a href="${esc(adminUrl)}" style="display:inline-block;background:#F59E0B;color:#fff;font-weight:bold;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:13px">View in Admin Panel →</a>`
      : '',
    '  </div>',
    '</div>',
  ].join('\n');

  return { userSubject, userHtml, adminSubject, adminHtml };
}
