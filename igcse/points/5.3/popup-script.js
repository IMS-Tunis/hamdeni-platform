
// Static question/answer data (hardcoded) for 5.3
const data = {
  "5.3a": {
    title: "Past Paper: 5.3a",
    question: `Complete the statements about a distributed denial of service (DDoS) attack... The attacker encourages people to download ...... onto their computer...`,
    answer: `• malware/virus
• malware is installed on computers (unknown to the users)
• attacker uses these computers to generate large amounts of traffic
• traffic directed to a single web server
• web server unable to cope with traffic`
  },
  "5.3b": {
    title: "Past Paper: 5.3b",
    question: `Explain how the firewall operates to help protect the network.`,
    answer: `• filters data traffic (entering and/or leaving a computer network)
• by checking whether incoming or outgoing data meets a given set of criteria/rules
• and blocks data that does not meet the criteria/rules
• can keep a list of undesirable IP addresses
• and blocks data to/from these IP addresses
• maintains a log of traffic
• prevents viruses/hackers entering the network`
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
