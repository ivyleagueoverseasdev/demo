# WhatsApp Lead Bot — Complete Setup Guide
## Ivy League Overseas Consulting

---

## Architecture Overview

```
User clicks CTA on website
        ↓
WhatsApp opens with pre-filled message
        ↓
User sends message → Meta Cloud API
        ↓
POST /api/whatsapp-webhook  (Next.js Edge Route on Cloudflare Pages)
        ↓
Upstash Redis ←→ Conversation State Machine (3 steps)
        ↓
Lead complete → Google Sheets (via Apps Script)
        ↓
Confirmation message sent back to user
```

---

## Step 1 — Meta WhatsApp Cloud API

### 1.1  Create Meta Business Account
1. Go to https://business.facebook.com → Create account
2. Go to https://developers.facebook.com → Create App
3. App type: **Business**
4. Add product: **WhatsApp**

### 1.2  Get Your Credentials
From **WhatsApp > API Setup** in the developer dashboard:

| Variable | Where to find it |
|---|---|
| `WHATSAPP_TOKEN` | **Temporary token** (or create a permanent System User token) |
| `WHATSAPP_PHONE_ID` | **Phone Number ID** (not the display number) |

> **Permanent token**: Go to Business Settings → System Users → Add System User →  
> Assign WhatsApp app → Generate Token → scope: `whatsapp_business_messaging`

### 1.3  Register the Webhook
1. In Meta Developer dashboard → WhatsApp → Configuration → Webhooks
2. **Callback URL**: `https://your-domain.pages.dev/api/whatsapp-webhook`
3. **Verify Token**: Any secret string you choose (e.g., `ILOC_WA_2024_SECRET`)
4. **Subscribe to fields**: `messages` ✅ (at minimum)
5. Click **Verify and Save**

> The GET handler in `route.js` echoes the challenge back automatically.

### 1.4  Add Your Test Phone Number
- In API Setup → To field → Add your personal mobile number
- WhatsApp must be installed on that number

---

## Step 2 — Upstash Redis (Free Tier)

1. Go to https://upstash.com → Sign up free
2. Create database → Region: closest to your users (e.g., `ap-south-1` for India)
3. Copy from dashboard:
   - **REST URL** → `UPSTASH_REDIS_REST_URL`
   - **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

**Free tier limits**: 10,000 commands/day, 256 MB storage — plenty for a lead gen bot.

---

## Step 3 — Google Sheets Data Logger

### 3.1  Create the Sheet
1. Create a new Google Sheet at https://sheets.google.com
2. Rename the first sheet to **`Leads`**

### 3.2  Deploy Apps Script
1. Open the sheet → **Extensions → Apps Script**
2. Delete the default `myFunction`, paste the content of `google-apps-script.gs`
3. Save with `Ctrl+S`
4. Click **Deploy → New deployment**
5. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** → **Authorize** → Copy the **Web app URL**

> This URL is your `SHEETS_WEBHOOK_URL`. It looks like:  
> `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Environment Variables in Cloudflare Pages

Go to **Cloudflare Pages → Your Project → Settings → Environment Variables**.  
Add all variables under **Production** (and optionally Preview):

```
WHATSAPP_TOKEN            =  EAAxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_ID         =  1234567890123456
WEBHOOK_VERIFY_TOKEN      =  ILOC_WA_2024_SECRET      ← your chosen secret
UPSTASH_REDIS_REST_URL    =  https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN  =  AXxxxxxxxxxxxxxxxxxxxxxxxx
SHEETS_WEBHOOK_URL        =  https://script.google.com/macros/s/xxxx/exec
```

---

## Step 5 — Next.js Project Setup

### 5.1  Copy Files
```bash
# Into your Next.js project root:
cp whatsapp-bot/components/WhatsAppWidget.jsx  components/WhatsAppWidget.jsx
cp whatsapp-bot/app/api/whatsapp-webhook/route.js  app/api/whatsapp-webhook/route.js
```

### 5.2  Install Dependencies
```bash
npm install framer-motion
```

### 5.3  Add Widget to Layout
```jsx
// app/layout.jsx
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppWidget />   {/* ← floating bubble on every page */}
      </body>
    </html>
  );
}
```

### 5.4  Add Inline Banner to Any Page
```jsx
import { WhatsAppCTABanner, WhatsAppButton } from "@/components/WhatsAppWidget";

// Full-width section banner:
<WhatsAppCTABanner />

// Compact button (nav / hero / cards):
<WhatsAppButton label="Apply via WhatsApp" />
```

### 5.5  Next.js Config for Edge Runtime
Ensure your `next.config.mjs` allows edge runtime:
```js
// next.config.mjs
const nextConfig = {
  experimental: { runtime: "edge" },   // optional — route.js declares it inline
};
export default nextConfig;
```

### 5.6  Cloudflare Pages Deployment
```bash
# Install Cloudflare adapter
npm install @cloudflare/next-on-pages

# Build command in Cloudflare Pages dashboard:
npx @cloudflare/next-on-pages

# Output directory:
.vercel/output/static
```

---

## Conversation Flow (What Users Experience)

```
USER  → "Hi Ivy League Overseas, I want to check my study abroad options."

BOT   → 👋 Welcome to Ivy League Overseas Consulting!
         I'll help you find the best university options in 3 quick steps. 🌍
         Step 1 of 3 — What's your full name?

USER  → Arjun Reddy

BOT   → Great to meet you, Arjun! 🙌
         Step 2 of 3 — Which country are you targeting?
         1️⃣ USA  2️⃣ UK  3️⃣ Canada  4️⃣ Australia  5️⃣ Ireland  6️⃣ New Zealand

USER  → 1

BOT   → USA — excellent choice! 🌟
         Step 3 of 3 — What level of study are you planning?
         1️⃣ Undergraduate  2️⃣ Postgraduate

USER  → 2

BOT   → ✅ All done, Arjun!
         👤 Name: Arjun Reddy
         🌍 Country: USA
         🎓 Degree: Postgraduate
         Our counsellor will reach out within 24 hours...
```

Google Sheet gets a new row:  
`2025-05-18T10:30:00Z | 919876543210 | Arjun Reddy | USA | Postgraduate | WhatsApp Bot`

---

## WhatsApp Free Tier Limits

| Metric | Free Allowance |
|---|---|
| Service conversations | 1,000 / month |
| Business-initiated templates | Separate pricing |
| Messages per conversation | Unlimited within 24h window |
| API calls | Unlimited |

> A "service conversation" starts when a **user** messages you first.  
> All our bot replies within that window are FREE.

---

## Troubleshooting

**Webhook verification fails**
- Ensure `WEBHOOK_VERIFY_TOKEN` matches exactly what you typed in Meta dashboard
- Redeploy Cloudflare Pages after adding env vars (they don't hot-reload)

**Bot doesn't respond**
- Check Meta webhook logs in dashboard → Webhook → View Logs
- Check Cloudflare Pages Functions logs → your project → Functions tab
- Ensure `messages` field is subscribed in webhook

**State not persisting between messages**
- Verify Upstash credentials — test with `curl` from terminal:
  ```bash
  curl https://YOUR.upstash.io/get/test \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```

**Leads not appearing in Sheets**
- Run `testDoPost()` from Apps Script editor to verify the script works
- Ensure web app is deployed as "Anyone can access"
- Check Apps Script execution logs → View → Logs
