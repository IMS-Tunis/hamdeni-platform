
// popup-script.js
// Supports keyword and exam popups for syllabus 13.3a–13.3e.
// Requires: keywords.json (same folder) and ../popup-styles.css (parent folder).

// ---------- Utility helpers ----------
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function nl2br(str) {
  return escapeHTML(str).replace(/\n/g, "<br>");
}
function openPopupWindow(title, bodyHTML, width, height) {
  var w = width || 640;
  var h = height || 520;
  var popup = window.open("", "_blank", "width=" + w + ",height=" + h + ",resizable=yes,scrollbars=yes");
  if (!popup) {
    alert("Popup blocked by browser. Please allow popups for this site.");
    return null;
  }
  var doc = popup.document;
  doc.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHTML(title)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          ${bodyHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();
  return popup;
}

// ---------- Exam Q/A data for 13.3 ----------
const examData = {
  "13.3a": {
    title: "Past Paper: 13.3a",
    question:
`(System: mantissa 10 bits, exponent 6 bits, two's complement for both.)
The denary number 513 cannot be stored accurately as a normalised floating-point number in this computer system.
(ii) Describe an alteration to the way floating-point numbers are stored to enable this number to be stored accurately using the same total number of bits.`,
    answer:
`1(d)(ii) One mark for each correct marking point (Max 2)

• The number of bits for the mantissa must be increased
• 11/12 bits mantissa and 5/4 bits exponent`
  },
  "13.3b": {
    title: "Past Paper: 13.3b",
    question:
`(System: mantissa 10 bits, exponent 6 bits, two's complement for both.)
Calculate the normalised binary floating-point representation of +201.125 in this system.
Show your working.
Respond using Mantissa (10 bits) and Exponent (6 bits).`,
    answer:
`1(a) One mark per mark point (Max 1)
• correct answer
• statement regarding number losing precision/rounding error

One mark per mark point for working (Max 2)
• number converted to binary 201.125 = 11001001.001
// 128 + 64 + 8 + 1 + 0.125 / 1/8 seen
• use of the exponent e.g. moving the binary point 8 places / × 2^8.

Mantissa  Exponent
0 1 1 0 0 1 0 0 1 0    0 0 1 0 0 0`
  },
  "13.3c": {
    title: "Past Paper: 13.3c",
    question:
`Explain the reason why binary numbers are stored in normalised form.`,
    answer:
`1(b) One mark for each correct marking point ( Max 3)

• To store the maximum range of numbers in the minimum number of bytes
/ bits
• Normalisation minimises the number of leading zeros/ones represented
• Maximising the number of significant bits // maximising the (potential)
precision / accuracy of the number for the given number of bits
• … enables very large / small numbers to be stored with accuracy.
• Avoids the possibility of many numbers having multiple representations.`
  },
  "13.3d": {
    title: "Past Paper: 13.3d",
    question:
`State when underflow occurs in a binary floating-point system.`,
    answer:
`1(c) One mark per point

• Following an arithmetic/logical operation
• … the result is too small to be precisely represented in the available system // When the number of bits is not enough / too small for the computer’s allocated word size / to represent the binary number`
  },
  "13.3e": {
    title: "Past Paper: 13.3e",
    question:
`(System: mantissa 12 bits, exponent 4 bits, two's complement for both.)
(ii) State the consequence of storing the binary number in part (a)(i) as a floating-point number in this system.
Justify your answer.
(Use the same number 1011100.011001.)`,
    answer:
`1(a)(ii) One mark for each correct consequence
One mark for each correct justification

Consequence
• The precision/accuracy of the number would be reduced

Justification
• … because the least significant bits of the original number have been truncated/lost // the original number had 13 bits / 14 bits with sign but the mantissa can only store 12 bits`
  }
};

// ---------- Keyword loading ----------
let _keywordsCache = null;
function fetchKeywords() {
  if (_keywordsCache) return Promise.resolve(_keywordsCache);
  return fetch("keywords.json", { cache: "no-store" })
    .then(resp => {
      if (!resp.ok) throw new Error("Failed to fetch keywords.json");
      return resp.json();
    })
    .then(json => {
      _keywordsCache = json;
      return _keywordsCache;
    });
}

// ---------- Public popup functions ----------
function openPopupQ(id) {
  const item = examData[id];
  if (!item) {
    alert("No exam content registered for: " + id);
    return;
  }
  const body = `
    <div class="popup-label">Past Paper Example</div>
    <div class="popup-title">${escapeHTML(item.title)}</div>
    <div class="popup-question"><strong>Question</strong><br>${nl2br(item.question)}</div>
    <div class="popup-answer"><strong>Answer</strong><br>${nl2br(item.answer)}</div>
  `;
  openPopupWindow(item.title, body, 720, 640);
}

function openPopupK(id) {
  fetchKeywords()
    .then(data => {
      const list = data[id];
      const content = Array.isArray(list) && list.length
        ? "<ul>" + list.map(entry => {
            const term = entry && entry.term != null ? escapeHTML(String(entry.term)) : "";
            const def = entry && entry.definition != null ? escapeHTML(String(entry.definition)) : "";
            return `<li><strong>${term}:</strong> ${def}</li>`;
          }).join("") + "</ul>"
        : "<p>No keywords found for this topic.</p>";
      const body = `
        <div class="popup-label">Keyword List</div>
        <div class="popup-title">${escapeHTML(id)}</div>
        <div class="popup-content">${content}</div>
      `;
      openPopupWindow("Keywords: " + id, body, 560, 520);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file.");
    });
}

// Expose to global for inline onclick handlers in HTML
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
