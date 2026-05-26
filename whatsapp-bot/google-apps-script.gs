/**
 * Google Apps Script — WhatsApp Lead Logger
 * ─────────────────────────────────────────────────────────────────
 * SETUP:
 *   1. Open your Google Sheet
 *   2. Extensions → Apps Script
 *   3. Paste this entire file, save (Ctrl+S)
 *   4. Click "Deploy" → "New deployment"
 *   5. Type: Web app
 *   6. Execute as: Me
 *   7. Who has access: Anyone
 *   8. Deploy → Copy the Web App URL
 *   9. Paste the URL into Cloudflare Pages as SHEETS_WEBHOOK_URL
 */

// ── Column headers — written once on first run ──────────────────
const HEADERS = [
  "Timestamp",
  "Phone",
  "Name",
  "Target Country",
  "Degree Level",
  "Source",
];

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    // Style the header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1a1a2e");
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

// ── Receive POST from Next.js webhook ──────────────────────────
function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Leads") ||
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    ensureHeaders(sheet);

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.phone     || "",
      data.name      || "",
      data.country   || "",
      data.degree    || "",
      data.source    || "WhatsApp Bot",
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Apps Script error:", err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Optional: test manually from Apps Script editor ─────────────
function testDoPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        phone:     "919158577707",
        name:      "Test Student",
        country:   "USA",
        degree:    "Postgraduate",
        timestamp: new Date().toISOString(),
        source:    "WhatsApp Bot — Test",
      }),
    },
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
