'use strict';

/**
 * popup-script.js
 * Supports keyword and exam question popups for syllabus point 1.1 (sub-points a–f).
 * Expects buttons like:
 *   <button class="keyword-button" onclick="openPopupK('1.1a')">...</button>
 *   <button class="exam-button" onclick="openPopupQ('1.1a')">...</button>
 * Keywords are loaded from ./keywords.json at click time.
 * All popups use ../popup-styles.css for styling.
 */

/* Representative past-paper question and mark-scheme data for 1.1 sub-points */
const data = {
  "1.1a": {
    title: "Past Paper: 1.1a",
    question: `Tick (✓) one box to show the reason why computers use binary to represent data.
A: Computers only allow 1s and 0s to be entered.
B: Computers are made of switches and gates that can only be on or off.
C: Binary does not need to be converted into other forms of data to be displayed.
D: Both computers and humans can quickly process binary data.`,
    answer: `B`
  },
  "1.1b": {
    title: "Past Paper: 1.1b",
    question: `Give the hexadecimal number for each of the three denary numbers. [14, 100, 250]`,
    answer: `E ; 64 ; FA`
  },
  "1.1c": {
    title: "Past Paper: 1.1c",
    question: `Give one reason why the addresses are displayed in hexadecimal instead of binary.`,
    answer: `easier to read than binary/ shorter representation of binary/ less chance of making errors`
  },
  "1.1d": {
    title: "Past Paper: 1.1d",
    question: `Add the two binary integers using binary addition. Show all your working. Give your answer in binary. [11100011 + 11001100]`,
    answer: `1 1 0 0 1 1 1 1`
  },
  "1.1e": {
    title: "Past Paper: 1.1e",
    question: `State the mathematical effect of a right shift of four places on a positive binary integer.`,
    answer: `divides by 2^4 // 1/16`
  },
  "1.1f": {
    title: "Past Paper: 1.1f",
    question: `Complete the register to show the binary number that would be stored, using two's complement. Show all your working. [The negative denary number −99 needs to be stored in the register]`,
    answer: `10011101`
  }
};

/* Global cache for fetched keywords */
let keywordsData = null;

/* Utility: convert plain text to HTML with preserved line breaks */
function toHtml(text) {
  if (typeof text !== "string") return "";
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/\n/g, "<br>");
}

/* Opens a popup window showing the representative question and answer for the given syllabus id */
function openPopupQ(id) {
  const item = data[id];
  if (!item) {
    alert("No exam content is available for topic " + id + ".");
    return;
  }
  const html = `
    <html>
      <head>
        <title>${item.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../popup-styles.css">
      </head>
      <body>
        <div class="popup-card">
          <div class="popup-label">Past Paper Example</div>
          <div class="popup-question"><strong>Question:<br></strong> ${toHtml(item.question)}</div>
          <div class="popup-answer"><strong>Answer:<br></strong> ${toHtml(item.answer)}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=720,height=560,resizable=yes,scrollbars=yes");
  if (!popup) {
    alert("Popup blocked. Please allow popups for this site.");
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}

/* Opens a popup window showing the keyword list for the given syllabus id */
function openPopupK(id) {
  if (keywordsData) {
    renderKeywordsPopup(id);
    return;
  }
  fetch("keywords.json", { cache: "no-store" })
    .then(resp => {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.json();
    })
    .then(json => {
      keywordsData = json;
      renderKeywordsPopup(id);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file.");
    });
}

/* Render the keywords popup for a particular id */
function renderKeywordsPopup(id) {
  const list = keywordsData && keywordsData[id];
  const content = Array.isArray(list) && list.length > 0
    ? `<ul>${list.map(entry => `<li><strong>${toHtml(String(entry.term || ""))}:</strong> ${toHtml(String(entry.definition || ""))}</li>`).join("")}</ul>`
    : `<p>No keywords found for this topic.</p>`;

  const html = `
    <html>
      <head>
        <title>Keywords: ${id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
  const popup = window.open("", "_blank", "width=560,height=480,resizable=yes,scrollbars=yes");
  if (!popup) {
    alert("Popup blocked. Please allow popups for this site.");
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}

// Expose functions to global scope
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
