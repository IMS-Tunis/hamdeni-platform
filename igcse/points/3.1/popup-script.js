
// Static question/answer data for 3.1 topics
const data = {
  "3.1a": {
    "title": "Past Paper: 3.1a",
    "question": "Describe the role of the CPU in the computer.",
    "answer": "\u2022 processes data/instructions\n\u2022 controls the computer\u2019s operations\n\u2022 fetches and executes instructions\n\u2022 sends control signals to other components"
  },
  "3.1b": {
    "title": "Past Paper: 3.1b",
    "question": "Describe the role of the MDR in the fetch\u2013decode\u2013execute cycle.",
    "answer": "\u2022 holds data that has been read from memory\n\u2022 or that is to be written to memory"
  },
  "3.1c": {
    "title": "Past Paper: 3.1c",
    "question": "Explain the purpose of cache in the CPU.",
    "answer": "\u2022 temporarily stores frequently used instructions/data\n\u2022 enables faster access than RAM"
  },
  "3.1d": {
    "title": "Past Paper: 3.1d",
    "question": "State the name of the list of machine code commands processed by the CPU.",
    "answer": "\u2022 Instruction set"
  },
  "3.1e": {
    "title": "Past Paper: 3.1e",
    "question": "State what is meant by an embedded system.",
    "answer": "\u2022 a computer system built into a larger device\n\u2022 designed to carry out a dedicated function"
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
