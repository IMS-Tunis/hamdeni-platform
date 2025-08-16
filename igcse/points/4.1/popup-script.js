// popups-4.1.js
// Supports buttons like:
//   <button class="keyword-button" onclick="openPopupK('4.1a')">...</button>
//   <button class="exam-button" onclick="openPopupQ('4.1a')">...</button>
//
// This script expects a keywords.json file in the SAME directory
// and a CSS file at ../popup-styles.css

// ------------------------------
// Static question/answer content
// ------------------------------
const data = {
  "4.1a": {
    title: "Past Paper: 4.1a (System vs Application Software)",
    question: `Complete the statements about different types of software.<br><br>
Use the terms from the list.<br>
Some of the terms in the list will not be used. You should only use a term once.<br>
application&nbsp;&nbsp;&nbsp;assembly language&nbsp;&nbsp;&nbsp;bootloader&nbsp;&nbsp;&nbsp;central processing unit (CPU)<br>
firmware&nbsp;&nbsp;&nbsp;hardware&nbsp;&nbsp;&nbsp;operating&nbsp;&nbsp;&nbsp;output&nbsp;&nbsp;&nbsp;system&nbsp;&nbsp;&nbsp;user<br><br>
________ software provides the services that the computer requires; an example is utility software.<br>
________ software is run on the operating system.<br>
The ________ system is run on the firmware, which is run on the ________.`,
    answer: `• System<br>• Application<br>• Operating<br>• Hardware`
  },
  "4.1b": {
    title: "Past Paper: 4.1b (Operating System Functions)",
    question: `Complete the table by writing each missing OS function name and description.`,
    answer: `• <strong>managing memory</strong> — allocates memory to processes; prevents two processes accessing the same memory<br>
• <strong>platform for running applications</strong> — allows application software to run on the computer<br>
• <strong>managing peripherals</strong> — allocates data to buffers; transmits data to hardware; receives data from hardware`
  },
  "4.1c": {
    title: "Past Paper: 4.1c (Firmware)",
    question: `(a) State the purpose of firmware.<br>(b) Give one example of firmware.`,
    answer: `Acceptable points for (a):<br>
• Permanently store instructions (in ROM)<br>
• Stores instructions to boot up/start up the computer<br>
• Provides the operating system with a platform to run on<br>
• Controls/manages/allows communication with hardware<br>
• Store instructions securely (to stop them being easily corrupted)<br><br>
Examples for (b):<br>
• Bootstrap / Bootloader / BIOS<br>
• Operating system (in embedded system)<br>
• Programs (in embedded systems)`
  },
  "4.1d": {
    title: "Past Paper: 4.1d (Interrupts)",
    question: `(i) State the purpose of an interrupt.<br>(ii) Explain how the processor manages the current program and the interrupt.`,
    answer: `Purpose:<br>
• To indicate that something requires the attention of the processor/OS/CPU<br><br>
Operation (typical sequence):<br>
• Interrupt is given priority and placed in the interrupt queue<br>
• Processor finishes current fetch–execute cycle for the program<br>
• Processor checks interrupt priority queue for a higher-priority interrupt<br>
• If higher priority exists, processor stores current process/registers on the stack (context save)<br>
• Source of interrupt is checked and the appropriate ISR (interrupt service routine) is called<br>
• ISR handles/resolves the interrupt; if another higher priority interrupt occurs, repeat the check<br>
• When complete, processor retrieves stack/registers and resumes the previous process`
  }
};

// ------------------------------
// Keywords (loaded from keywords.json)
// ------------------------------
let keywordsData = null;

// ------------------------------
// Helpers to open popups
// ------------------------------
function openPopupQ(id) {
  const item = data[id];
  if (!item) {
    alert("No question data found for " + id);
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
          <div class="popup-question"><strong>Question:<br></strong> ${item.question}</div>
          <div class="popup-answer"><strong>Answer:<br></strong> ${item.answer}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=720,height=600,resizable=yes,scrollbars=yes");
  popup.document.write(html);
  popup.document.close();
}

function openPopupK(id) {
  if (keywordsData) {
    showKeywordsPopup(id);
    return;
  }
  fetch("keywords.json")
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      keywordsData = data;
      showKeywordsPopup(id);
    })
    .catch(error => {
      alert("Failed to load keyword file.");
      console.error(error);
    });
}

function showKeywordsPopup(id) {
  const list = keywordsData && keywordsData[id];
  if (!list || list.length === 0) {
    alert("No keywords found for " + id);
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
  const popup = window.open("", "_blank", "width=520,height=480,resizable=yes,scrollbars=yes");
  popup.document.write(html);
  popup.document.close();
}
