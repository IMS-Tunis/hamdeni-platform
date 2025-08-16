
// popup-script.js for syllabus 2.1 (Types and methods of data transmission)
// Supports: openPopupK(id) and openPopupQ(id)
// Keywords are loaded from ./keywords.json
// Shared CSS: ../popup-styles.css

// Representative past-paper question/answer data (exact text preserved)
const questionData = {
  "2.1a": {
    title: "Past Paper: 2.1a",
    question: `2 The artist compresses the image file before uploading it to their website. Users can download the image file from the website to print as a poster.
(d) (i) Explain how a file is broken down into packets and transmitted over a network.`,
    answer: `Any three from:
• Data is split into fixed size packets<br>• The data is the payload<br>• Each packet is given a header<br>• … example of header data e.g. Destination IP, packet number, hop number<br>• Each packet has a trailer<br>• … example of trailer data e.g. error checking method<br><br>Any three from:<br>• Router directs each packet towards its destination<br>• Routes selects the most efficient path<br>• Each packet can take a different path<br>• Packets can arrive out of order<br>• … after the last packet has arrived, they are reordered`
  },
  "2.1b": {
    title: "Past Paper: 2.1b",
    question: `4 Data packets are transmitted across a network from one computer to another computer.
(a) Describe the structure of a data packet.`,
    answer: `Any three from:<br>• A packet is split into three different sections<br>• … the header<br>• … the payload<br>• … the trailer`
  },
  "2.1c": {
    title: "Past Paper: 2.1c",
    question: `2 A student has a sound file that is too large to be stored on their external secondary storage device. The student compresses the sound file to make the file size smaller.
(c) The student sends the sound file to a friend. The file is transmitted across a network that uses packet switching.
(ii) Explain how the file is transmitted using packet switching.`,
    answer: `Any five from:<br>• Data is broken/split/divided into packets<br>• Each packet (could) take a different route<br>• A router controls the route/path a packet takes<br>• … selecting the shortest/fastest available route/path<br>• Packets may arrive out of order<br>• Once the last packet has arrived, packets are reordered<br>• If a packet is missing/corrupted, it is requested again`
  },
  "2.1d": {
    title: "Past Paper: 2.1d",
    question: `6 The table contains descriptions about data transmission methods.
Complete the table by identifying which data transmission methods are described.

Data transmission method  Description

............................................................  Data is transmitted down a single wire, one bit at a time, in one direction only.

............................................................  Data is transmitted down multiple wires, multiple bits at a time, in both directions, but only one direction at a time.

............................................................  Data is transmitted down a single wire, one bit at a time, in both directions at the same time.

............................................................  Data is transmitted down multiple wires, multiple bits at a time, in one direction only.`,
    answer: `serial simplex — Data is transmitted down a single wire, one bit at a time, in one direction only.<br>parallel half-duplex — Data is transmitted down multiple wires, multiple bits at a time, in both directions, but only one direction at a time.<br>serial full-duplex — Data is transmitted down a single wire, one bit at a time, in both directions at the same time.<br>parallel simplex — Data is transmitted down multiple wires, multiple bits at a time, in one direction only.`
  },
  "2.1e": {
    title: "Past Paper: 2.1e",
    question: `5 (b) After a barcode is scanned, data is sent to a stock control system to update the stock value stored for that product. The data is sent to the stock control system using serial simplex data transmission.
(ii) Explain why serial simplex is the most appropriate method of data transmission for this purpose.`,
    answer: `Any three from:<br>• The stock control system may be a long distance away<br>• … parallel should not be used in long distance transmission // Serial is more reliable for long distance transmission<br>• The data does not need to be sent quickly<br>• … the increased speed of parallel is not needed<br>• … as only small amounts of data need to be sent<br>• The bits are sent/arrived in order<br>• … the data will not be skewed // the data could be skewed if parallel was used<br>• … there will be no data collisions<br>• There will be less interference/crosstalk (due to single wire)<br>• … there will be fewer errors in the data<br>• No need for a reply/response from stock control system<br>• … half-duplex/full-duplex is not necessary as only one way transmission needed`
  }
};

// Global cache for fetched keywords.json
let keywordsCache = null;

// Opens a popup showing the representative past-paper question and answer for a given id such as "2.1a"
function openPopupQ(id) {
  const item = questionData[id];
  if (!item) {
    alert("No question is available for this topic.");
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
          <div class="popup-label">Past Paper Question</div>
          <div class="popup-question"><strong>Question:</strong><br>${item.question.replaceAll('\n', '<br>')}</div>
          <div class="popup-answer"><strong>Answer:</strong><br>${item.answer}</div>
        </div>
      </body>
    </html>
  `;
  const w = window.open("", "_blank", "width=720,height=640,resizable=yes,scrollbars=yes");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// Opens a popup listing the keywords for a given id such as "2.1a"
function openPopupK(id) {
  const show = () => {
    const list = (keywordsCache && keywordsCache[id]) ? keywordsCache[id] : null;
    if (!list || !Array.isArray(list) || list.length === 0) {
      alert("No keywords found for this topic.");
      return;
    }
    const items = list.map(entry => {
      const term = entry.term || "";
      const def = entry.definition || "";
      return `<li><strong>${escapeHtml(term)}:</strong> ${escapeHtml(def)}</li>`;
    }).join("");
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
            <div class="popup-content">
              <ul>${items}</ul>
            </div>
          </div>
        </body>
      </html>
    `;
    const w = window.open("", "_blank", "width=560,height=520,resizable=yes,scrollbars=yes");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  if (keywordsCache) {
    show();
    return;
  }
  fetch("keywords.json", { cache: "no-store" })
    .then(resp => {
      if (!resp.ok) throw new Error("Failed to load keywords.json");
      return resp.json();
    })
    .then(json => {
      keywordsCache = json;
      show();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load keyword file.");
    });
}

// Simple HTML escaper to prevent injection inside keyword popups
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Expose functions globally (in case of module scopes)
window.openPopupQ = openPopupQ;
window.openPopupK = openPopupK;
