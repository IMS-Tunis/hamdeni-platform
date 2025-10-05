'use strict';
/*
  popup-script.js
  Supports two kinds of popups for syllabus 19.2 (Recursion):
    - openPopupQ('<subpoint>')  // shows representative past-paper question + mark scheme
    - openPopupK('<subpoint>')  // shows keywords loaded from keywords.json
  Sub-points used here: "19.2a" and "19.2b".
  Styling is provided by an external stylesheet located at ../popup-styles.css
*/

/* -----------------------------
   1) Representative Q/A content
   ----------------------------- */
const qaData = {
  "19.2a": {
    title: "Past Paper: 19.2a",
    question: `State three essential features of recursion.`,
    // Mark scheme text preserved; line breaks rendered using <br>
    answer: `One mark for each correct marking point (Max 3)<br><br>` +
            `• Must have a base case/stopping condition<br>` +
            `• Must have a general case<br>` +
            `… which calls itself (recursively) // Defined in terms of itself<br>` +
            `… which changes its state and moves towards the base case<br>` +
            `Unwinding can occur once the base case is reached.`
  },
  "19.2b": {
    title: "Past Paper: 19.2b",
    question: `Explain how a compiler makes use of a stack when translating recursive programming code.`,
    answer: `9(c) One mark per mark point (Max 1)<br>` +
            `MP1 The compiler must produce object code to<br><br>` +
            `One mark per mark point (Max 3)<br>` +
            `MP2 …push return addresses / values of local variables onto a stack<br>` +
            `MP3 …with each recursive call // … to set up winding<br>` +
            `MP4 …pop return addresses / values of local variables off the stack …<br>` +
            `MP5 …after the base case is reached // … to implement unwinding.`
  }
};

/* -----------------------------
   2) Keyword data cache
   ----------------------------- */
let keywordsCache = null;

/* -----------------------------
   3) Generic popup renderer
   ----------------------------- */
function renderPopup({ title, label, innerHTML, width = 640, height = 560 }) {
  const win = window.open("", "_blank", `width=${width},height=${height},resizable=yes,scrollbars=yes`);
  if (!win) {
    alert("Popup blocked by the browser. Please allow popups for this site.");
    return;
  }
  const doc = win.document;
  doc.open();
  doc.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="../popup-styles.css">
</head>
<body>
  <div class="popup-card">
    <div class="popup-label">${escapeHtml(label)}</div>
    <div class="popup-content">${innerHTML}</div>
  </div>
</body>
</html>`);
  doc.close();
}

/* Escape for <title> and text labels; innerHTML content is intentionally controlled */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* -----------------------------
   4) Public API: openPopupQ
   ----------------------------- */
function openPopupQ(id) {
  const item = qaData[id];
  if (!item) {
    alert("No question is configured for: " + id);
    return;
  }
  const html = `
    <div class="qa-block">
      <div class="qa-heading"><strong>Question</strong></div>
      <div class="qa-body">${item.question}</div>
    </div>
    <div class="qa-block">
      <div class="qa-heading"><strong>Answer</strong></div>
      <div class="qa-body">${item.answer}</div>
    </div>
  `;
  renderPopup({
    title: item.title,
    label: "Past Paper Question and Mark Scheme",
    innerHTML: html
  });
}

/* -----------------------------
   5) Public API: openPopupK
   ----------------------------- */
function openPopupK(id) {
  if (keywordsCache) {
    showKeywords(id);
    return;
  }
  fetch("keywords.json", { cache: "no-cache" })
    .then(resp => {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.json();
    })
    .then(json => {
      keywordsCache = json;
      showKeywords(id);
    })
    .catch(err => {
      console.error("Failed to load keywords.json:", err);
      alert("Failed to load keyword file (keywords.json).");
    });
}

function showKeywords(id) {
  const list = keywordsCache && keywordsCache[id];
  if (!Array.isArray(list) || list.length === 0) {
    alert("No keywords found for this topic: " + id);
    return;
  }
  const items = list.map(entry => {
    const term = typeof entry.term === "string" ? escapeHtml(entry.term) : "";
    const def = typeof entry.definition === "string" ? escapeHtml(entry.definition) : "";
    return `<li><strong>${term}:</strong> ${def}</li>`;
  }).join("");

  const html = `<ul class="keyword-list">${items}</ul>`;
  renderPopup({
    title: `Keywords: ${id}`,
    label: "Keyword List",
    innerHTML: html,
    width: 520,
    height: 480
  });
}

/* Expose functions globally for inline onclick handlers */
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
