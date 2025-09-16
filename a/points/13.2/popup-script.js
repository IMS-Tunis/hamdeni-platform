/*
  popup-script.js
  Purpose: Support keyword and exam Q/A popups for syllabus 13.2 (File organisation and access).
  Requirements:
    - keywords.json located in the same directory as this script.
    - Shared CSS at ../popup-styles.css
    - HTML buttons should call openPopupK('13.2a'), openPopupQ('13.2a'), etc.
  Notes:
    - Question and answer content is embedded verbatim from validated past-paper sources.
    - Line breaks are preserved using <br> for display fidelity.
*/

// -----------------------------
// Utility: newline to <br> for HTML-safe rendering
// -----------------------------
function nl2br(text) {
  if (typeof text !== "string") return "";
  return text.replace(/\n/g, "<br>");
}

// -----------------------------
// Static exam Q/A data for 13.2 sub-points (exact wording preserved)
// -----------------------------
const examData = {
  "13.2a": {
    title: "Past Paper: 13.2a",
    question: `Compare sequential and serial methods of file organisation.`,
    answer: `5(a) One mark for each correct marking point (Max 4)
• In both serial and sequential files records are stored one after the other …
• … and need to be accessed one after the other
• Serial files are stored in chronological order
• Sequential files are stored with ordered records
• … and stored in the order of the key field
• In serial files, new records are added in the next available space / records are appended to the file
• In sequential files, new records are inserted in the correct position.`
  },
  "13.2b": {
    title: "Past Paper: 13.2b",
    question: `Explain how the sequential method of file access is applied to files with serial organisation and to files with sequential organisation.`,
    answer: `4(b) One mark per mark point (Max 3)
MP1 For serial files, records are stored in chronological order
MP2 … every record needs to be checked until the record is found, or all records have been checked.
MP3 For sequential files, records are stored in order of a key field/index, and it is the key field/index that is compared.
MP4 … every record is checked until the record is found, or the key field of the current record is greater than the key field of the target record.`
  },
  "13.2c": {
    title: "Past Paper: 13.2c",
    question: `Explain what is meant by a hashing algorithm in the context of file access.`,
    answer: `5(a) One mark per mark point (Max 3)
MP1 A hashing algorithm is used in direct access methods on random and sequential files
MP2 It is a mathematical formula
MP3 … used to perform a calculation applied to the key field of the record being searched / stored
MP4 The result of the calculation gives the address where the record should be found / stored.`
  }
};

// -----------------------------
// Global cache for fetched keywords
// -----------------------------
let keywordsData = null;

// -----------------------------
/* Popup window (generic) */
// -----------------------------
function openWindow(html, width, height) {
  const specs = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const popup = window.open("", "_blank", specs);
  if (!popup) {
    alert("Please allow popups for this site to view the content.");
    return null;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  return popup;
}

// -----------------------------
/* Exam Question Popup */
// -----------------------------
function openPopupQ(id) {
  const item = examData[id];
  if (!item) {
    alert("No exam data found for: " + id);
    return;
  }

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${item.title}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          <div class="popup-label">Past Paper</div>
          <div class="popup-question"><strong>Question:</strong><br>${nl2br(item.question)}</div>
          <div class="popup-answer"><strong>Answer:</strong><br>${nl2br(item.answer)}</div>
        </div>
      </body>
    </html>
  `;
  openWindow(html, 720, 560);
}

// -----------------------------
/* Keyword Popup (loads keywords.json lazily) */
// -----------------------------
function openPopupK(id) {
  const render = () => showKeywordsPopup(id);

  if (keywordsData) {
    render();
    return;
  }

  fetch("keywords.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load keywords.json");
      return response.json();
    })
    .then((data) => {
      keywordsData = data;
      render();
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load keyword file. Ensure keywords.json is present next to popup-script.js.");
    });
}

// -----------------------------
/* Render Keywords Popup */
// -----------------------------
function showKeywordsPopup(id) {
  if (!keywordsData || !Object.prototype.hasOwnProperty.call(keywordsData, id)) {
    alert("No keywords found for: " + id);
    return;
  }

  const list = keywordsData[id];
  const listHTML = (Array.isArray(list) && list.length > 0)
    ? ("<ul>" + list.map(entry => {
        const term = (entry && entry.term) ? String(entry.term) : "";
        const defn = (entry && entry.definition) ? String(entry.definition) : "";
        return `<li><strong>${term}:</strong> ${defn}</li>`;
      }).join("") + "</ul>")
    : "<p>No keywords available for this sub-point.</p>";

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Keywords: ${id}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          <div class="popup-label">Keyword List</div>
          <div class="popup-content">${listHTML}</div>
        </div>
      </body>
    </html>
  `;
  openWindow(html, 560, 480);
}

// Expose functions globally for button onclick handlers
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
