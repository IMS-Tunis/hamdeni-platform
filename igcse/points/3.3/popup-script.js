/* popup-script.js
 * Supports keyword and past-paper popups for syllabus point 3.3 (sub-points a–f).
 * Dependencies:
 *   - keywords.json (same directory as this script)
 *   - ../popup-styles.css (shared stylesheet for popups)
 *
 * Exposes two global functions used by existing HTML buttons:
 *   - openPopupK(id)  // e.g., openPopupK('3.3a')
 *   - openPopupQ(id)  // e.g., openPopupQ('3.3a')
 *
 * Implementation notes:
 * - Questions/answers are hardcoded below based on the validated Step F0 selection.
 * - Keywords are loaded lazily from keywords.json on first request and cached.
 * - All popups are opened in a new window using window.open with scrollbars enabled.
 */

/* ---------- Utility: basic HTML escape to avoid accidental HTML injection ---------- */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- Static representative Q/A data for 3.3 ---------- */
const data = {
  "3.3a": {
    title: "Past Paper: 3.3a",
    question: `Explain why a computer needs RAM.`,
    answer: `• To store data currently in use<br>• To store currently running programs / instructions<br>• Volatile memory — data is lost when power is off`
  },
  "3.3b": {
    title: "Past Paper: 3.3b",
    question: `State the purpose of secondary storage.`,
    answer: `• To store data and programs long term / when the computer is switched off`
  },
  "3.3c": {
    title: "Past Paper: 3.3c",
    question: `One type of secondary storage is optical. Circle three examples of optical storage.<br>read only memory (ROM)<br>secure digital (SD) card<br>compact disk (CD)<br>hard disk drive (HDD)<br>digital versatile disk (DVD)<br>Blu-ray disk<br>universal serial bus (USB) drive<br>solid-state drive (SSD)`,
    answer: `• CD<br>• DVD<br>• Blu-ray disk`
  },
  "3.3d": {
    title: "Past Paper: 3.3d",
    question: `Explain what is meant by virtual memory.`,
    answer: `• Memory that uses part of the secondary storage as if it were RAM (1)<br>• Used when RAM is full (1)`
  },
  "3.3e": {
    title: "Past Paper: 3.3e",
    question: `State what is meant by cloud storage.`,
    answer: `• Storage of data on remote servers accessed via the internet`
  },
  "3.3f": {
    title: "Past Paper: 3.3f",
    question: `Give one advantage and one disadvantage of using cloud storage instead of local storage.`,
    answer: `• Advantage: Can access files from anywhere with internet access<br>• Disadvantage: Requires internet connection / security concerns`
  }
};

/* ---------- Global cache for fetched keywords ---------- */
let keywordsData = null;

/* ---------- Popup function for questions ---------- */
function openPopupQ(id) {
  try {
    const item = data[id];
    if (!item) {
      alert("No question found for: " + id);
      return;
    }
    // Compose HTML for the popup. Question and answer may contain <br> intentionally.
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${escapeHTML(item.title)}</title>
          <link rel="stylesheet" href="../popup-styles.css">
        </head>
        <body>
          <div class="popup-card">
            <div class="popup-label">Past Paper Example</div>
            <div class="popup-question"><strong>Question:<br></strong> ${item.question}</div>
            <div class="popup-answer"><strong>Answer:<br></strong> ${item.answer}</div>
          </div>
        </body>
      </html>
    `;
    const popup = window.open("", "_blank", "width=700,height=600,resizable=yes,scrollbars=yes");
    if (!popup) {
      alert("Popup blocked by the browser. Please allow popups for this site.");
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  } catch (err) {
    console.error(err);
    alert("Failed to open question popup.");
  }
}

/* ---------- Popup function for keywords (loads JSON if needed) ---------- */
function openPopupK(id) {
  try {
    if (keywordsData) {
      showKeywordsPopup(id);
      return;
    }
    fetch("keywords.json", { cache: "no-cache" })
      .then(response => {
        if (!response.ok) throw new Error("Failed to load keywords.json");
        return response.json();
      })
      .then(json => {
        keywordsData = json;
        showKeywordsPopup(id);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load keyword file.");
      });
  } catch (err) {
    console.error(err);
    alert("Failed to open keywords popup.");
  }
}

/* ---------- Renders the popup window for keywords ---------- */
function showKeywordsPopup(id) {
  const list = keywordsData && keywordsData[id];
  if (!Array.isArray(list) || list.length === 0) {
    alert("No keywords found for: " + id);
    return;
  }
  const content = `
    <ul class="keyword-list">
      ${list.map(entry => {
        const term = escapeHTML(String(entry.term ?? ""));
        const defn = escapeHTML(String(entry.definition ?? ""));
        return `<li><strong>${term}:</strong> ${defn}</li>`;
      }).join("")}
    </ul>
  `;
  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Keywords: ${escapeHTML(id)}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          <div class="popup-label">Keyword List</div>
          <div class="popup-content">${content}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=600,height=500,resizable=yes,scrollbars=yes");
  if (!popup) {
    alert("Popup blocked by the browser. Please allow popups for this site.");
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}

/* ---------- Expose functions to global scope ---------- */
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
