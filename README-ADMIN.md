# ILOC Admin Dashboard — Client Handoff Guide

## Accessing the Admin Panel

Open a browser and go to:

```
https://[your-staging-or-production-domain]/admin
```

For example, once deployed to Cloudflare Pages your URL will look like:
```
https://iloc-staging.pages.dev/admin
```

---

## Login

| Field    | Value        |
|----------|--------------|
| Password | `iloc-admin` |

> **Before going live:** Log in to Cloudflare Pages → your project → **Settings → Environment Variables** and set `ADMIN_PASSWORD` to a strong private password. The `iloc-admin` password is for development/staging only.

---

## Managing Homepage Content

1. Log in at `/admin`
2. Click the **Homepage** tab in the top navigation
3. You will see two editable sections:

### Services
- Click **+ Add Service** to add a new service card
- Edit the **Title** and **Description** for each card
- Click the **🗑 Delete** button to remove a card
- Click **Save Services** when done

### How It Works (Process Steps)
- Edit the **Title** and **Description** for each of the 4 steps
- Click **Save Steps** when done

---

## Managing Events

1. Click the **Events** tab
2. To create a new event, click **+ Create Event** (top right)
3. Fill in the form:

| Field | What to enter |
|-------|--------------|
| **Title** | Event name (e.g. "USA University Fair 2026") |
| **Type** | Webinar / Fair / Workshop / Seminar / Deadline |
| **Date** | Pick the event date |
| **Time** | e.g. `6:00 PM IST` |
| **Location** | e.g. `Online (Zoom)` or `Pune Office` |
| **Target Country** | Filter tag for the country (optional) |
| **Description** | One-sentence summary shown on the card |
| **Rich Body Content** | Full event details in Markdown (shown on the event detail page) |
| **Image URL** | Paste a direct image URL for the event banner |
| **CTA Label** | Button text, e.g. `Register Free` |
| **Seats Available** | Number of seats (leave blank if unlimited) |
| **Published** | Toggle ON to make it visible on the site |

4. Click **Save Event**
5. Use the **↗** link next to any event to preview its live page
6. Use **Edit** to update an event, or the **🗑** button to delete

---

## Managing Pages (Advanced)

The **Pages** tab lets you create custom landing pages (e.g. destination guides, scholarship pages).

- Set a **Slug** (URL path, e.g. `destinations/germany/2026`)
- Add a **Title** and **Body** in Markdown
- Toggle **Published** to make it live

---

## Hero & Country Images

The **Media** tab lets you update:
- **Hero carousel images** — paste Unsplash or direct image URLs
- **Country card images** — one image per destination

Click **Save Images** after making changes.

---

## Redirects

The **Redirects** tab lets you add 301 redirects (e.g. old URLs pointing to new ones). Enter the **From** path and **To** path, toggle active, and click **Add Redirect**.

---

## Need Help?

Contact your developer or refer to the project repository for technical details.
