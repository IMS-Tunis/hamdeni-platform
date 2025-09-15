
// popup-script.js — supports keyword and exam question popups for syllabus 13.1.*
// Requires: a sibling file "keywords.json" keyed by "13.1.1", "13.1.2", "13.1.3", "13.1.4"
// Styling: uses ../popup-styles.css (parent folder)

// ---------------------------
// Static representative Q/A (from verified Step F0 selection)
// ---------------------------
const examData = {
  "13.1a": {
    title: "Past Paper: 13.1.1",
    question: `Describe the purpose of a user-defined data type.`,
    answer: `One mark per correct point:<br>• To create a new data type<br>• To give identifier to the data type`
  },
  "13.1b": {
    title: "Past Paper: 13.1.2",
    question: `Define, using pseudocode, a pointer type SelectParts that points to the enumerated type Parts.`,
    answer: `TYPE SelectParts = ^Parts`
  },
  "13.1c": {
    title: "Past Paper: 13.1.3",
    question: `Write pseudocode to create a record type called Flight. The Flight data type has the following attributes:<br>• FlightNumber stores the flight number which is an integer<br>• FlightTime stores the number of minutes which is an integer<br>• StartLocation stores the starting location which is a string<br>• EndLocation stores the ending location which is a string<br>• Plane stores the type of plane which is an Aircraft type.`,
    answer: `TYPE Flight<br>DECLARE FlightNumber : INTEGER // stores the flight number<br>DECLARE FlightTime : INTEGER // stores the number of minutes<br>DECLARE StartLocation : STRING // stores the starting location<br>DECLARE EndLocation : STRING // stores the ending location<br>DECLARE Plane : Aircraft // stores the type of plane<br>ENDTYPE`
  },
  "13.1d": {
    title: "Past Paper: 13.1.4",
    question: `The type definition for LibraryRecord is changed.<br>(ii) Every copy of every book is now uniquely identified by an accession number, AccessionNumber, as it is added to the library. Each library record will include one or more accession numbers. Each accession number is an integer.<br>Write the extra line of pseudocode needed in the type definition of LibraryRecord.`,
    answer: `DECLARE AccessionNumber : ARRAY[1:NumberOfCopies] OF INTEGER`
  }
};

// ---------------------------
// Lazy-loaded keywords.json cache
// ---------------------------
let _keywordsCache = null;

// ---------------------------
// Helpers
// ---------------------------
function _openWindow(width, height, title = "Details") {
  const features = `width=${width},height=${height},resizable=yes,scrollbars=yes`;
  const win = window.open("", "_blank", features);
  if (!win) {
    alert("Popup blocked. Please allow popups for this site.");
    return null;
  }
  win.document.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body></body>
    </html>
  `);
  win.document.close();
  return win;
}

function _renderCard(win, label, contentHTML) {
  win.document.body.innerHTML = `
    <div class="popup-card">
      <div class="popup-label">${label}</div>
      <div class="popup-content">${contentHTML}</div>
    </div>
  `;
}

// ---------------------------
// Public API
// ---------------------------
function openPopupQ(id) {
  const item = examData[id];
  if (!item) {
    alert("No exam entry found for " + id);
    return;
  }
  const win = _openWindow(720, 640, item.title);
  if (!win) return;
  const content = `
    <div class="popup-question"><strong>Question:</strong><br>${item.question}</div>
    <div class="popup-answer"><strong>Answer:</strong><br>${item.answer}</div>
  `;
  _renderCard(win, "Past Paper Example", content);
}

function openPopupK(id) {
  if (_keywordsCache) {
    return _showKeywords(id);
  }
  fetch("keywords.json", { cache: "no-store" })
    .then(r => r.json())
    .then(json => {
      _keywordsCache = json;
      _showKeywords(id);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file (keywords.json).");
    });
}

function _showKeywords(id) {
  const list = (_keywordsCache && _keywordsCache[id]) || [];
  const win = _openWindow(560, 520, `Keywords: ${id}`);
  if (!win) return;
  if (!Array.isArray(list) || list.length === 0) {
    _renderCard(win, "Keyword List", `<p>No keywords found for <code>${id}</code>.</p>`);
    return;
  }
  const items = list.map(entry => {
    const term = (entry && entry.term) ? String(entry.term) : "";
    const def  = (entry && entry.definition) ? String(entry.definition) : "";
    return `<li><strong>${term}:</strong> ${def}</li>`;
  }).join("");
  const ul = `<ul class="keyword-list">${items}</ul>`;
  _renderCard(win, "Keyword List", ul);
}

// Expose to global scope for inline onclick handlers
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
