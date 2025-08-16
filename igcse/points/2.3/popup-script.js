/* popup-script.js
 * Supports buttons:
 *   <button class="keyword-button" onclick="openPopupK('2.3a')">...</button>
 *   <button class="exam-button"    onclick="openPopupQ('2.3a')">...</button>
 * and similarly for '2.3b'.
 * Depends on ../popup-styles.css and a local keywords.json file.
 */

/* =========================
   Representative exam Q/A
   ========================= */
const data = {
  "2.3a": {
    title: "Past Paper: 2.3a",
    questionSource: "0478_m24_qp_12, Q7(a)(i)",
    question: `State the purpose of encrypting data.`,
    answerSource: "0478_m24_ms_12, Q7(a)(i)",
    answer: `If the data is intercepted, it cannot be understood`
  },
  "2.3b": {
    title: "Past Paper: 2.3b",
    questionSource: "0478_m24_qp_12, Q7(a)(ii)",
    question: `Describe the differences between symmetric and asymmetric encryption.`,
    answerSource: "0478_m24_ms_12, Q7(a)(ii)",
    answer: `Four from:<br>
• Symmetric has a shared key…<br>
• … to encrypt and decrypt<br>
• Both the sender and receiver know the key<br>
• Asymmetric has different keys // a public key and a private key<br>
• …public to encrypt the data and private to decrypt<br>
• …anyone can know the public key but only those intended know the private key`
  }
};

/* =========================
   Keyword loading (external)
   ========================= */
let keywordsData = null;

function fetchKeywordsIfNeeded() {
  if (keywordsData) return Promise.resolve(keywordsData);
  return fetch("keywords.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("Failed to load keywords.json");
      return r.json();
    })
    .then(json => {
      keywordsData = json;
      return keywordsData;
    });
}

/* =========================
   Popup helpers
   ========================= */
function buildBaseHtml(title, bodyInnerHtml) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          ${bodyInnerHtml}
        </div>
      </body>
    </html>
  `;
}

function openWindowWith(html, width = 600, height = 500) {
  const features = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const w = window.open("", "_blank", features);
  if (!w) {
    alert("Your browser blocked the popup. Please allow popups for this site.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/* =========================
   Public API used by buttons
   ========================= */
function openPopupQ(id) {
  const item = data[id];
  if (!item) {
    alert(`No question is configured for ${id}.`);
    return;
  }
  const body = `
    <div class="popup-label">Past Paper Example</div>
    <div class="popup-question">
      <strong>Question</strong><br>
      <span class="popup-meta">${item.questionSource}</span><br>
      ${item.question}
    </div>
    <div class="popup-answer">
      <strong>Answer</strong><br>
      <span class="popup-meta">${item.answerSource}</span><br>
      ${item.answer}
    </div>
  `;
  const html = buildBaseHtml(item.title, body);
  openWindowWith(html, 650, 600);
}

function openPopupK(id) {
  fetchKeywordsIfNeeded()
    .then(() => {
      const list = keywordsData[id];
      if (!Array.isArray(list) || list.length === 0) {
        alert(`No keywords found for ${id}.`);
        return;
      }
      const items = list
        .map(entry => {
          const term = String(entry.term ?? "").trim();
          const defn = String(entry.definition ?? "").trim();
          return `<li><strong>${term}:</strong> ${defn}</li>`;
        })
        .join("");
      const body = `
        <div class="popup-label">Keyword List</div>
        <div class="popup-content">
          <ul>${items}</ul>
        </div>
      `;
      const html = buildBaseHtml(`Keywords: ${id}`, body);
      openWindowWith(html, 500, 420);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file.");
    });
}

/* Expose functions globally for inline onclick handlers */
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
