/*
  popup-script.js

  Provides two popup functions for your HTML buttons:
    openPopupK('<point_id>')  -> shows keywords loaded from keywords.json
    openPopupQ('<point_id>')  -> shows one representative past-paper question with its mark scheme

  Assumptions
    - Your HTML uses buttons like: onclick="openPopupK('2.2a')" and onclick="openPopupQ('2.2a')"
    - The stylesheet is at ../popup-styles.css relative to the page that opens the popup
    - keywords.json is in the same folder as the HTML that includes this script
    - This file is configured for syllabus 2.2 (sub-points a-d). Update qaData if you change topic.
*/

/* ================================
   Q&A content for 2.2a to 2.2d
   ================================

   Each entry contains:
     - title: shown in the popup tab title
     - question: HTML string for the question text
     - answer: HTML string for the official mark scheme

   The four entries below are the single best representatives selected in the previous step.
*/
const qaData = {
  "2.2a": {
    title: "Past Paper: 2.2a",
    question: "(a) Explain how the data might have errors after transmission.",
    answer: [
      "Any three from:",
      "Data could be lost",
      "Data could be gained or added",
      "Data could be changed",
      "Bits reassembled in the wrong order",
      "Interference",
      "Crosstalk",
      "Data collisions",
      "Data packets timeout",
      "Network infected with malware"
    ].join("<br>")
  },
  "2.2b": {
    title: "Past Paper: 2.2b",
    question: [
      "Complete the table by giving the correct error detection method for each statement:",
      "............. An odd or even process can be used.",
      "............. A value is calculated from the data, using an algorithm. This happens before and after the data is transmitted.",
      "............. A copy of the data is sent back to the sender by the receiver."
    ].join("<br>"),
    answer: [
      "parity (check/bit/byte/block)",
      "checksum",
      "echo check"
    ].join("<br>")
  },
  "2.2c": {
    title: "Past Paper: 2.2c",
    question: "Explain how the barcode scanning system operates to check for errors.",
    answer: [
      "Any four from:",
      "Digits are read or scanned",
      "Check digit is calculated using the digits",
      "Calculated value is compared to the check digit",
      "If they are the same there are no errors",
      "If they are not the same then there are errors",
      "Barcode or data is re-scanned",
      "Data is rejected"
    ].join("<br>")
  },
  "2.2d": {
    title: "Past Paper: 2.2d",
    question: "Explain how an ARQ operates using a positive acknowledgement method.",
    answer: [
      "Any five from:",
      "A timer starts when data is sent to the receiver",
      "Receiver sends a positive acknowledgement when data is received without errors",
      "Acknowledgement is sent back to the sender",
      "If the acknowledgement arrives before the timer ends, the next packet is sent",
      "If the timer ends before acknowledgement is received, the data is re-sent"
    ].join("<br>")
  }
};

/* ================================
   Internal helpers
   ================================ */

/**
 * Escape angle brackets and ampersands in a string.
 * Use this when injecting untrusted plain text into HTML.
 */
function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Build a complete HTML document string for popup content.
 */
function buildPopupHTML(title, label, bodyHTML) {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHTML(title)}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          <div class="popup-label">${escapeHTML(label)}</div>
          <div class="popup-content">
            ${bodyHTML}
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Open a new window and write the provided HTML into it.
 * If the popup fails to open, inform the user to allow popups.
 */
function openWindowWithHTML(html, width, height) {
  const features = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const win = window.open("", "_blank", features);
  if (!win) {
    alert("Popup blocked. Please allow popups for this site and try again.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/* ================================
   Keywords popup logic
   ================================ */

let keywordsCache = null;  // populated after first fetch

/**
 * Open the keywords popup for a syllabus id, loading keywords.json on first use.
 * @param {string} id - syllabus point like "2.2a"
 */
function openPopupK(id) {
  if (keywordsCache) {
    renderKeywordsPopup(id);
    return;
  }
  // keywords.json is expected in the same folder as the HTML
  fetch("keywords.json", { cache: "no-store" })
    .then((resp) => {
      if (!resp.ok) throw new Error("Failed to load keywords.json");
      return resp.json();
    })
    .then((json) => {
      keywordsCache = json;
      renderKeywordsPopup(id);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load keyword file. Ensure keywords.json is present next to your HTML.");
    });
}

/**
 * Render the keywords list for a syllabus id in a popup.
 */
function renderKeywordsPopup(id) {
  const entries = (keywordsCache && keywordsCache[id]) || [];
  if (!Array.isArray(entries) || entries.length === 0) {
    alert("No keywords found for this topic.");
    return;
  }
  const listHTML = `
    <ul class="keyword-list">
      ${entries.map((e) => {
        const term = e && e.term != null ? escapeHTML(e.term) : "";
        const def = e && e.definition != null ? escapeHTML(e.definition) : "";
        return `<li><strong>${term}:</strong> ${def}</li>`;
      }).join("")}
    </ul>
  `;
  const html = buildPopupHTML(`Keywords: ${id}`, "Keyword List", listHTML);
  openWindowWithHTML(html, 520, 480);
}

/* ================================
   Q&A popup logic
   ================================ */

/**
 * Open the Q&A popup for a syllabus id.
 * @param {string} id - syllabus point like "2.2a"
 */
function openPopupQ(id) {
  const item = qaData[id];
  if (!item) {
    alert(`No question is configured for ${id}.`);
    return;
  }
  const qHTML = `
    <div class="popup-question">
      <div class="popup-section-title">Question</div>
      <div>${item.question}</div>
    </div>
  `;
  const aHTML = `
    <div class="popup-answer">
      <div class="popup-section-title">Mark Scheme</div>
      <div>${item.answer}</div>
    </div>
  `;
  const html = buildPopupHTML(item.title, "Past Paper Example", qHTML + aHTML);
  openWindowWithHTML(html, 720, 560);
}

// Expose functions for inline onclick handlers in your HTML
window.openPopupK = openPopupK;
window.openPopupQ = openPopupQ;
