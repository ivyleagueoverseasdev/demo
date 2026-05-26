/**
 * app/api/whatsapp-webhook/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Next.js 15 App Router · Edge Runtime · Cloudflare Pages compatible
 *
 * Handles:
 *   GET  /api/whatsapp-webhook  →  Meta webhook verification challenge
 *   POST /api/whatsapp-webhook  →  Incoming messages + state machine
 *
 * State machine flow:
 *   [initial msg] → AWAITING_NAME → AWAITING_COUNTRY → AWAITING_DEGREE → DONE
 *
 * External services (all free-tier, all HTTP):
 *   • Upstash Redis  — conversation state (10k req/day free)
 *   • Google Sheets  — lead data via Apps Script webhook (unlimited free)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const runtime = "edge"; // ← Required for Cloudflare Pages

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES (set in Cloudflare Pages dashboard)
// ═══════════════════════════════════════════════════════════════════════════════
const {
  WHATSAPP_TOKEN,          // Meta System User permanent access token
  WHATSAPP_PHONE_ID,       // Phone Number ID from Meta Business > WhatsApp > API Setup
  WEBHOOK_VERIFY_TOKEN,    // Any secret string you chose when registering the webhook
  UPSTASH_REDIS_REST_URL,  // https://YOUR-DB.upstash.io
  UPSTASH_REDIS_REST_TOKEN,// Token from Upstash dashboard
  SHEETS_WEBHOOK_URL,      // Google Apps Script web app URL (doPost endpoint)
} = process.env;

const WA_API = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
const STATE_TTL = 86400; // 24 hours in seconds — conversations expire

// ═══════════════════════════════════════════════════════════════════════════════
// REDIS STATE LAYER  (Upstash REST API — works on any edge runtime)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Execute one or more Redis commands via the Upstash pipeline endpoint.
 * Commands format: [["GET", "key"], ["SET", "key", "value", "EX", 86400]]
 */
async function redis(commands) {
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  return res.json(); // [{ result: ... }, ...]
}

/** Retrieve conversation state for a phone number. Returns null if none. */
async function getState(phone) {
  const [{ result }] = await redis([["GET", `wa:${phone}`]]);
  return result ? JSON.parse(result) : null;
}

/** Persist conversation state with a 24-hour TTL. */
async function setState(phone, state) {
  await redis([["SET", `wa:${phone}`, JSON.stringify(state), "EX", STATE_TTL]]);
}

/** Delete state once the conversation is complete. */
async function clearState(phone) {
  await redis([["DEL", `wa:${phone}`]]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHATSAPP CLOUD API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Send a plain text message to a WhatsApp number. */
async function sendText(to, body) {
  const res = await fetch(WA_API, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type:    "individual",
      to,
      type: "text",
      text: { preview_url: false, body },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`WA send failed to ${to}:`, err);
  }
}

/** Mark a message as read (keeps the double-blue-tick UX). */
async function markRead(messageId) {
  await fetch(WA_API, {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status:            "read",
      message_id:        messageId,
    }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHATSAPP INTERACTIVE MESSAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Low-level sender for any interactive message payload. */
async function sendInteractive(to, interactive) {
  const res = await fetch(WA_API, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type:    "individual",
      to,
      type: "interactive",
      interactive,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`WA interactive send failed to ${to}:`, err);
  }
}

/**
 * Step 2 — Country selection via interactive LIST.
 * Meta list constraints: max 10 rows, title ≤ 24 chars, description ≤ 72 chars.
 * List reply returns: msg.interactive.list_reply.title  (e.g. "USA")
 */
async function sendCountryList(to, name) {
  await sendInteractive(to, {
    type:   "list",
    header: { type: "text", text: "Step 2 of 3 — Destination 🌍" },
    body:   {
      text: `Great to meet you, *${name}!* 🙌\n\nWhich country are you targeting for your studies?\n\nTap *Select Country* below to choose.`,
    },
    footer: { text: "Ivy League Overseas Consulting" },
    action: {
      button: "Select Country",          // CTA label on the list trigger (≤ 20 chars)
      sections: [
        {
          title: "Study Destinations",   // section header (≤ 24 chars)
          rows: [
            { id: "country_usa",  title: "USA",         description: "🇺🇸  200+ universities" },
            { id: "country_uk",   title: "UK",          description: "🇬🇧  150+ universities" },
            { id: "country_ca",   title: "Canada",      description: "🇨🇦  100+ universities" },
            { id: "country_au",   title: "Australia",   description: "🇦🇺  40+ universities"  },
            { id: "country_ie",   title: "Ireland",     description: "🇮🇪  20+ universities"  },
            { id: "country_nz",   title: "New Zealand", description: "🇳🇿  8 universities"    },
          ],
        },
      ],
    },
  });
}

/**
 * Step 3 — Degree selection via interactive BUTTONS.
 * Meta button constraints: max 3 buttons, title ≤ 20 chars.
 * Button reply returns: msg.interactive.button_reply.title  (e.g. "Undergraduate")
 */
async function sendDegreeButtons(to, country) {
  await sendInteractive(to, {
    type:   "button",
    header: { type: "text", text: "Step 3 of 3 — Study Level 🎓" },
    body:   {
      text: `*${country}* — excellent choice! 🌟\n\nWhat level of study are you planning to pursue?\n\nTap an option below:`,
    },
    footer: { text: "Ivy League Overseas Consulting" },
    action: {
      buttons: [
        { type: "reply", reply: { id: "degree_ug",  title: "Undergraduate"  } },
        { type: "reply", reply: { id: "degree_pg",  title: "Postgraduate"   } },
        { type: "reply", reply: { id: "degree_phd", title: "PhD / Diploma"  } },
      ],
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOGGING — Google Sheets via Apps Script Web App
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Push completed lead data to Google Sheets.
 * The SHEETS_WEBHOOK_URL must be a deployed Google Apps Script "doPost" endpoint.
 * See setup instructions in README.md.
 */
async function logLead(lead) {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn("SHEETS_WEBHOOK_URL not set — skipping lead logging.");
    return;
  }
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(lead),
    });
  } catch (e) {
    // Non-fatal — don't let a Sheets failure break the WhatsApp flow
    console.error("Sheets logging failed:", e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE TEXT PARSERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect if the incoming message is the pre-filled trigger from the website CTA.
 * We also accept any first message and start the flow anyway (handles organic traffic).
 */
function isTriggerMessage(text) {
  const t = text.toLowerCase();
  return (
    t.includes("check my study") ||
    t.includes("study abroad") ||
    t.includes("eligibility") ||
    t.includes("ivy league overseas") ||
    t.includes("hello") ||
    t.includes("hi")
  );
}

/**
 * Parse a free-text country response OR a numbered response (1-6).
 * Returns a canonical country string or null if unrecognised.
 */
function parseCountry(text) {
  const t = text.toLowerCase().trim();
  // Numbered shorthand
  const numMap = { "1":"USA","2":"UK","3":"Canada","4":"Australia","5":"Ireland","6":"New Zealand" };
  if (numMap[t]) return numMap[t];
  // Keyword match
  if (t.includes("usa") || t.includes("america") || t.includes("united states")) return "USA";
  if (t.includes("uk")  || t.includes("england") || t.includes("britain") || t.includes("united kingdom")) return "UK";
  if (t.includes("canada"))                                                                return "Canada";
  if (t.includes("australia") || t.includes("aus") || t.includes("sydney") || t.includes("melbourne")) return "Australia";
  if (t.includes("ireland") || t.includes("dublin"))                                      return "Ireland";
  if (t.includes("new zealand") || t.includes("nz"))                                      return "New Zealand";
  return null;
}

/**
 * Parse a degree preference from interactive button title OR free text fallback.
 * Returns "Undergraduate" | "Postgraduate" | "PhD / Diploma" | null.
 */
function parseDegree(text) {
  const t = text.toLowerCase().trim();
  // Exact interactive button_reply.title match (happy path — user tapped a button)
  if (t === "undergraduate") return "Undergraduate";
  if (t === "postgraduate")  return "Postgraduate";
  if (t === "phd / diploma") return "PhD / Diploma";
  // Fallback: user typed something instead of tapping
  if (t === "1" || t.includes("under") || t.includes("ug") || t.includes("bachelor"))              return "Undergraduate";
  if (t === "2" || t.includes("post")  || t.includes("pg") || t.includes("master") || t.includes("mba")) return "Postgraduate";
  if (t === "3" || t.includes("phd")   || t.includes("doctoral") || t.includes("diploma") || t.includes("cert")) return "PhD / Diploma";
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * States:
 *   null            → first contact
 *   AWAITING_NAME   → bot asked for name, waiting
 *   AWAITING_COUNTRY→ bot asked for country, waiting
 *   AWAITING_DEGREE → bot asked for degree, waiting
 */
async function handleMessage(phone, text, messageId) {
  // Mark as read immediately (shows double blue tick to user)
  if (messageId) await markRead(messageId).catch(() => {});

  const state = await getState(phone);
  const input = text.trim();

  // ── 1. No existing state → cold start ──────────────────────────────────────
  if (!state) {
    // Start the flow regardless of message content
    // (isTriggerMessage check optional — kept for semantic clarity)
    await setState(phone, { step: "AWAITING_NAME" });
    await sendText(
      phone,
      `👋 Welcome to *Ivy League Overseas Consulting!*\n\n` +
      `I'm your virtual assistant. I'll help you find the best university options abroad in just *3 quick steps*. 🌍\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `*Step 1 of 3 — What's your full name?*`
    );
    return;
  }

  // ── 2. AWAITING_NAME ───────────────────────────────────────────────────────
  if (state.step === "AWAITING_NAME") {
    if (input.length < 2) {
      await sendText(phone, "Please enter your full name (at least 2 characters):");
      return;
    }
    // Basic sanitisation — strip HTML-like characters
    const name = input.replace(/[<>{}]/g, "").slice(0, 60);
    await setState(phone, { step: "AWAITING_COUNTRY", name });
    await sendCountryList(phone, name);  // Interactive list — user taps a country
    return;
  }

  // ── 3. AWAITING_COUNTRY ────────────────────────────────────────────────────
  if (state.step === "AWAITING_COUNTRY") {
    const country = parseCountry(input);
    if (!country) {
      // Unrecognised text — re-send the interactive list so the user can tap
      await sendText(phone, "I didn't catch that. 😅 Please select your destination from the menu:");
      await sendCountryList(phone, state.name);
      return;
    }
    await setState(phone, { ...state, step: "AWAITING_DEGREE", country });
    await sendDegreeButtons(phone, country);  // Interactive buttons — user taps a degree
    return;
  }

  // ── 4. AWAITING_DEGREE → complete the flow ─────────────────────────────────
  if (state.step === "AWAITING_DEGREE") {
    const degree = parseDegree(input);
    if (!degree) {
      // Unrecognised text — re-send the interactive buttons so the user can tap
      await sendText(phone, "Please tap one of the options to select your study level:");
      await sendDegreeButtons(phone, state.country);
      return;
    }

    // ── Assemble lead record ──────────────────────────────────────────────────
    const lead = {
      phone,
      name:      state.name,
      country:   state.country,
      degree,
      timestamp: new Date().toISOString(),
      source:    "WhatsApp Bot — ILOC Website",
    };

    // ── Side-effects: clear state + log lead (run concurrently) ───────────────
    await Promise.all([clearState(phone), logLead(lead)]);

    // ── Send confirmation message ─────────────────────────────────────────────
    await sendText(
      phone,
      `✅ *All done, ${state.name}!*\n\n` +
      `Here's your profile summary:\n` +
      `👤 Name      : ${state.name}\n` +
      `🌍 Country   : ${state.country}\n` +
      `🎓 Degree    : ${degree}\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `Our expert counsellor will reach out to you *within 24 hours* to walk you through your best options. 🚀\n\n` +
      `In the meantime, feel free to contact us directly:\n` +
      `📞 *+91-9158577707*\n` +
      `📧 *ivyleagueoverseas@gmail.com*\n\n` +
      `_Ivy League Overseas Consulting — Your journey to global education starts here._`
    );
    return;
  }

  // ── Fallback: state exists but unrecognised step (shouldn't happen) ─────────
  await clearState(phone);
  await sendText(phone, "Sorry, something went wrong. Let's start fresh — please send \"Hi\" to begin again.");
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/whatsapp-webhook
 * Meta sends this once to verify the webhook endpoint.
 * We echo back the challenge string if the verify token matches.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified successfully.");
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn("❌ Webhook verification failed — token mismatch.");
  return new Response("Forbidden", { status: 403 });
}

/**
 * POST /api/whatsapp-webhook
 * Receives all events from WhatsApp:
 *   - Incoming messages (text, interactive replies)
 *   - Message status updates (sent, delivered, read) — we ignore these
 *
 * IMPORTANT: Always return 200 OK, even on errors.
 * If we return non-200, Meta will retry up to 20 times, flooding the endpoint.
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Only process WhatsApp Business Account events
    if (body.object !== "whatsapp_business_account") {
      return new Response("OK", { status: 200 });
    }

    // Drill down to the message payload
    const entry   = body?.entry?.[0];
    const change  = entry?.changes?.[0];
    const value   = change?.value;
    const messages = value?.messages;

    // Ignore status-update events (no messages array)
    if (!messages || messages.length === 0) {
      return new Response("OK", { status: 200 });
    }

    const msg   = messages[0];
    const phone = msg.from;       // Sender's WhatsApp number (E.164)
    const msgId = msg.id;         // Message ID (for read receipts)

    // ── Extract text from different message types ───────────────────────────
    let text = "";

    if (msg.type === "text") {
      text = msg.text?.body ?? "";

    } else if (msg.type === "interactive") {
      // Button replies or list replies
      text =
        msg.interactive?.button_reply?.title  ??
        msg.interactive?.list_reply?.title    ??
        msg.interactive?.button_reply?.id     ??
        "";

    } else {
      // Audio, image, video, document received mid-conversation
      const state = await getState(phone);
      if (state) {
        await sendText(
          phone,
          "Please send a *text message* to continue the conversation. 😊"
        );
      }
      return new Response("OK", { status: 200 });
    }

    if (!text) return new Response("OK", { status: 200 });

    // ── Run the state machine (non-blocking from Meta's perspective) ────────
    // We await here — Edge runtime keeps the function alive until this resolves.
    // Cloudflare enforces a 30 s CPU limit; WhatsApp retries after 20 s,
    // so we must respond within that window. Redis + WA API calls are fast (<300 ms each).
    await handleMessage(phone, text, msgId);

    return new Response("OK", { status: 200 });

  } catch (err) {
    // Log but never return 5xx — prevents Meta retry storms
    console.error("WhatsApp webhook unhandled error:", err);
    return new Response("OK", { status: 200 });
  }
}
