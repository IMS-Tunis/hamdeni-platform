// popup-script.js
// Supports keyword and exam popups for the current syllabus point (3.4a–3.4d).
// Buttons should call openPopupK('3.4a') / openPopupQ('3.4a') etc.

// Static question/answer data (from Step F0)
const data = {
  "3.4a": {
    title: "Past Paper: 3.4a",
    question: `6 A user wants to connect their computer to a network.
(a) (i) Identify the component in the computer that is needed to access a network.`,
    answer: `Network interface card/controller // NIC // WNIC`
  },
  "3.4b": {
    title: "Past Paper: 3.4b",
    question: `(a) (ii) Identify three characteristics of a MAC address.`,
    answer: `Any three from:<br>• (Represented) in hexadecimal<br>• Numbers are separated by colons/hyphens<br>• Six groups of digits<br>• Sets of 2-digit/8-bit (hex) numbers // 48 bits // 12-digits<br>• Contains manufacturer ID and unique device number<br>• Static address // cannot be changed`
  },
  "3.4c": {
    title: "Past Paper: 3.4c",
    question: `(b) A dynamic internet protocol (IP) address is allocated to the computer when it is connected to the network.
(ii) Describe what is meant by a dynamic IP address.`,
    answer: `Three from:<br>• It can be used to uniquely identify a device (on a network)<br>• It can change …<br>• … each time the device is connected to the network`
  },
  "3.4d": {
    title: "Past Paper: 3.4d",
    question: `7 Data is transmitted using the Internet.
(b) (ii) Give the purpose of a router in the packet-switching process.`,
    answer: `Any one from:<br>• Control the route the packet takes<br>• Send each packet towards its destination<br>• Choose more efficient route`
  }
};

// Global cache for fetched keywords
let keywordsData = null;

// Popup for exam question/answer
function openPopupQ(id) {
  const item = data[id];
  if (!item) return;
  const q = item.question.replace(/\n/g, "<br>");
  const a = item.answer.replace(/\n/g, "<br>");
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
          <div class="popup-question"><strong>Question:<br></strong> ${q}</div>
          <div class="popup-answer"><strong>Answer:<br></strong> ${a}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=600,height=500,resizable=yes,scrollbars=yes");
  if (!popup) { alert("Popup blocked. Allow popups for this site."); return; }
  popup.document.write(html);
  popup.document.close();
}

// Popup for keywords (loads JSON on demand)
function openPopupK(id) {
  if (keywordsData) {
    showKeywordsPopup(id);
    return;
  }
  fetch("keywords.json")
    .then(response => response.json())
    .then(data => {
      keywordsData = data;
      showKeywordsPopup(id);
    })
    .catch(error => {
      alert("Failed to load keyword file.");
      console.error(error);
    });
}

// Renders the keywords popup
function showKeywordsPopup(id) {
  const list = keywordsData[id];
  if (!list || list.length === 0) {
    const htmlEmpty = `
      <html>
        <head>
          <title>Keywords: ${id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="../popup-styles.css">
        </head>
        <body>
          <div class="popup-card">
            <div class="popup-label">Keyword List</div>
            <div class="popup-content"><p>No keywords found for this topic.</p></div>
          </div>
        </body>
      </html>
    `;
    const popupEmpty = window.open("", "_blank", "width=400,height=300,resizable=yes,scrollbars=yes");
    if (!popupEmpty) { alert("Popup blocked. Allow popups for this site."); return; }
    popupEmpty.document.write(htmlEmpty);
    popupEmpty.document.close();
    return;
  }
  const content = `
    <ul>
      ${list.map(entry => `<li><strong>${entry.term}:</strong> ${entry.definition}</li>`).join("")}
    </ul>
  `;
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
  const popup = window.open("", "_blank", "width=400,height=300,resizable=yes,scrollbars=yes");
  if (!popup) { alert("Popup blocked. Allow popups for this site."); return; }
  popup.document.write(html);
  popup.document.close();
}

// Expose functions globally
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
