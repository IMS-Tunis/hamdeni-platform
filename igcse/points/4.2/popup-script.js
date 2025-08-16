
// Static question/answer data for 4.2
const data = {
  "4.2a": {
    title: "Past Paper: 4.2a",
    question: `Describe what is meant by a low-level language.`,
    answer: `• A language that is machine-oriented\n• such as machine code or assembly language\n• Uses mnemonics or binary\n• Has direct access to the hardware`
  },
  "4.2b": {
    title: "Past Paper: 4.2b",
    question: `Machine code is one type of low-level language. Identify one other type of low-level language. Identify the translator that is needed for the type of low-level language you have identified.`,
    answer: `• Assembly language\n• Assembler`
  },
  "4.2c": {
    title: "Past Paper: 4.2c",
    question: `Describe the operation of a compiler and of an interpreter.`,
    answer: `Compiler:\n• Translates the whole program in one go\n• Creates an executable file\n• Produces a list of errors\n\nInterpreter:\n• Translates a program one line at a time\n• Executes each line once it is translated\n• Stops when it encounters an error`
  },
  "4.2d": {
    title: "Past Paper: 4.2d",
    question: `Describe the advantages of using an interpreter instead of a compiler during software development.`,
    answer: `• Errors are shown one at a time which is useful for debugging\n• It is easier to locate errors\n• The program can be tested as it is being written`
  },
  "4.2e": {
    title: "Past Paper: 4.2e",
    question: `Integrated development environments (IDEs) provide translators. Identify three other common functions of an IDE.`,
    answer: `• Syntax checking\n• Debugging tools\n• Auto-complete\n• Error diagnostics\n• Stepping through code\n• Breakpoints`
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
          <div class="popup-answer"><strong>Answer:<br></strong> ${item.answer.replace(/\n/g, "<br>")}</div>
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
