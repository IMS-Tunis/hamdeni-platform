/* popup-script.js
 * Supports keyword and exam-question popups for syllabus sub-points.
 * Expects buttons like:
 *   <button class="keyword-button" onclick="openPopupK('1.2a')">...</button>
 *   <button class="exam-button" onclick="openPopupQ('1.2a')">...</button>
 * Styling is provided by ../popup-styles.css (relative to the HTML file opening the popup).
 */

/* ---------------------------
 * Representative Q/A content
 * --------------------------- */
const examData = {
  "1.2a": {
    title: "Past Paper: 1.2a",
    question: `Describe how the text is converted to binary to be processed by the computer.`,
    answer: `• A character set is used<br>• Each character has a unique binary number assigned<br>• Text characters are converted to binary for the computer to process // store`
  },
  "1.2b": {
    title: "Past Paper: 1.2b",
    question: `State what is meant by the sample rate and sample resolution.`,
    answer: `The sample rate is the number of samples taken in a second<br>The sample resolution is the number of bits used to store each sample`
  },
  "1.2c": {
    title: "Past Paper: 1.2c",
    question: `2 An image has a 16-bit colour depth and a resolution of 1000 × 1750 pixels.<br><br>(a) State what is meant by a 16-bit colour depth.<br><br>(b) The resolution of the image is changed to 750 × 1500 pixels.<br><br>Give the effect this will have on the file size of the image.`,
    answer: `2(a) 16 bits used to represent each colour in the image<br><br>2(b) The file size will decrease`
  }
};

/* ---------------------------
 * Keyword data (loaded on demand from keywords.json in the same directory)
 * --------------------------- */
let keywordsCache = null;

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPopup(html, width = 640, height = 540, title = "Popup") {
  const specs = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const win = window.open("", "_blank", specs);
  if (!win) {
    alert("Please allow pop-ups for this site to view the content.");
    return;
  }
  win.document.open();
  win.document.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHTML(title)}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
  win.document.close();
}

/* ---------------------------
 * Exam Question popup
 * --------------------------- */
function openPopupQ(id) {
  const item = examData[id];
  if (!item) {
    alert("No question available for " + id);
    return;
  }
  const html = `
    <div class="popup-card">
      <div class="popup-label">Past Paper Example</div>
      <div class="popup-question"><strong>Question:</strong><br>${item.question}</div>
      <div class="popup-answer"><strong>Answer:</strong><br>${item.answer}</div>
    </div>
  `;
  renderPopup(html, 720, 640, item.title);
}

/* ---------------------------
 * Keywords popup
 * --------------------------- */
function openPopupK(id) {
  if (keywordsCache) {
    return showKeywords(id);
  }
  fetch("keywords.json", { cache: "no-store" })
    .then(resp => {
      if (!resp.ok) throw new Error("Failed to load keywords.json");
      return resp.json();
    })
    .then(json => {
      keywordsCache = json || {};
      showKeywords(id);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file. Check that keywords.json is present.");
    });
}

function showKeywords(id) {
  const list = keywordsCache[id];
  if (!Array.isArray(list) || list.length === 0) {
    const msg = `No keywords found for ${id}.`;
    const html = `
      <div class="popup-card">
        <div class="popup-label">Keyword List</div>
        <div class="popup-content">${escapeHTML(msg)}</div>
      </div>
    `;
    renderPopup(html, 520, 360, `Keywords: ${id}`);
    return;
  }
  const items = list.map(entry => {
    const term = entry && entry.term != null ? escapeHTML(entry.term) : "(missing term)";
    const def = entry && entry.definition != null ? escapeHTML(entry.definition) : "(missing definition)";
    return `<li><strong>${term}:</strong> ${def}</li>`;
  }).join("");
  const html = `
    <div class="popup-card">
      <div class="popup-label">Keyword List</div>
      <div class="popup-content">
        <ul>${items}</ul>
      </div>
    </div>
  `;
  renderPopup(html, 560, 420, `Keywords: ${id}`);
}

/* Expose functions to global scope for inline onclick handlers */
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
