
// Static question/answer data (hardcoded) for 3.2a–c
const data = {
  "3.2a": {
    title: "Past Paper: 3.2a",
    question: `A 2D scanner is used to scan barcodes. Describe how a 2D scanner works.`,
    answer: `light source (illuminates the image)\nsensor captures reflected light\nlenses focus the image\nscanned image is converted into digital form\nsoftware processes the image\nsoftware identifies data/patterns/QR code/barcode\ndata is output to computer/device`
  },
  "3.2b": {
    title: "Past Paper: 3.2b",
    question: `Explain how a DLP projector works.`,
    answer: `uses millions of tiny mirrors\nmirrors reflect light towards or away from lens\nspinning colour wheel adds colour\nlight source shines onto DLP chip\nimage is projected onto screen`
  },
  "3.2c": {
    title: "Past Paper: 3.2c",
    question: `A patient monitoring system uses temperature and pressure sensors. Explain why both are used and the type of data each captures.`,
    answer: `temperature sensor detects body temperature\npressure sensor detects blood pressure\neach sensor provides specific type of data\nallows monitoring of patient’s vital signs\nensures timely alerts for abnormal readings`
  }
};

// Global cache for fetched keywords
let keywordsData = null;

// Popup function for questions
function openPopupQ(id) {
  const item = data[id];
  if (!item) return;
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
          <div class="popup-question"><strong>Question:<br></strong> ${item.question}</div>
          <div class="popup-answer"><strong>Answer:<br></strong> ${item.answer}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=600,height=500,resizable=yes,scrollbars=yes");
  popup.document.write(html);
  popup.document.close();
}

// Popup function for keywords (loads JSON if needed)
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

// Renders the popup window for keywords
function showKeywordsPopup(id) {
  const list = keywordsData[id];
  if (!list || list.length === 0) {
    alert("No keywords found for this topic.");
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
  popup.document.write(html);
  popup.document.close();
}
