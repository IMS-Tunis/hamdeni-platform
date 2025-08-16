/* popup-script.js — supports keyword and exam Q/A popups for syllabus 1.3a–1.3d */

/* ---------- Static Q/A data for 1.3a–1.3d (from Step F0) ---------- */
const data = {
  "1.3a": {
    title: "Past Paper: 1.3a",
    question: `Data storage is measured using binary denominations.
Complete each conversion.
8 bytes = .............................. nibbles
512 kibibytes (KiB) = .............................. mebibytes (MiB)
4 gibibytes (GiB) = .............................. mebibytes (MiB)
1 exbibyte (EiB) = .............................. pebibytes (PiB)`,
    answer: `One mark each:
8 bytes = 16 nibbles
512 KiB = 0.5 MiB
4 GiB = 4096 MiB
1 EiB = 1024 PiB`
  },
  "1.3b": {
    title: "Past Paper: 1.3b",
    question: `A 16-bit colour image has a resolution of 512 pixels wide by 512 pixels high.
Calculate the file size of the image in kibibytes (KiB). Show all your working.`,
    answer: `512 × 512 × 16 ÷ 8 = 524 288 bytes
524 288 ÷ 1024 = 512 KiB
Answer = 512 KiB`
  },
  "1.3c": {
    title: "Past Paper: 1.3c",
    question: `State what is meant by file compression.`,
    answer: `Reducing the size of a file`
  },
  "1.3d": {
    title: "Past Paper: 1.3d",
    question: `Explain the reasons why the artist chose lossless compression instead of lossy compression to compress this image file.`,
    answer: `Any three from:
No/all data is not permanently removed when using lossless compression
It will be a smaller amount of compression compared to lossy but still reduces the original file size
It is able to make an identical copy of the original image file`
  }
};

/* ---------- Global cache for fetched keywords ---------- */
let keywordsData = null;

/* ---------- Utilities ---------- */
function nl2br(s) {
  return String(s).replace(/\n/g, "<br>");
}

function openPopupWindow(width, height, title, bodyHtml) {
  const specs = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const popup = window.open("", "_blank", specs);
  if (!popup) {
    alert("Popup blocked. Please allow popups for this site.");
    return null;
  }
  popup.document.open();
  popup.document.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        ${bodyHtml}
      </body>
    </html>
  `);
  popup.document.close();
  return popup;
}

/* ---------- Questions popup ---------- */
function openPopupQ(id) {
  const item = data[id];
  if (!item) {
    alert("No past-paper item is configured for: " + id);
    return;
  }
  const bodyHtml = `
    <div class="popup-card">
      <div class="popup-label">Past Paper Example</div>
      <div class="popup-question"><strong>Question:</strong><br>${nl2br(item.question)}</div>
      <div class="popup-answer"><strong>Answer:</strong><br>${nl2br(item.answer)}</div>
    </div>
  `;
  openPopupWindow(700, 600, item.title, bodyHtml);
}

/* ---------- Keywords popup ---------- */
function openPopupK(id) {
  if (keywordsData) {
    renderKeywords(id);
    return;
  }
  fetch("keywords.json", { cache: "no-cache" })
    .then(resp => {
      if (!resp.ok) throw new Error("Failed to load keywords.json");
      return resp.json();
    })
    .then(json => {
      keywordsData = json;
      renderKeywords(id);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file. Please ensure keywords.json is present.");
    });
}

function renderKeywords(id) {
  const list = (keywordsData && keywordsData[id]) || [];
  const content = list.length
    ? `<ul class="keyword-list">` +
      list.map(entry => `<li><strong>${entry.term}:</strong> ${entry.definition}</li>`).join("") +
      `</ul>`
    : `<div class="empty-note">No keywords found for ${id}.</div>`;

  const bodyHtml = `
    <div class="popup-card">
      <div class="popup-label">Keyword List: ${id}</div>
      <div class="popup-content">${content}</div>
    </div>
  `;
  openPopupWindow(520, 520, `Keywords: ${id}`, bodyHtml);
}

/* Expose functions globally (for inline onclick handlers) */
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
