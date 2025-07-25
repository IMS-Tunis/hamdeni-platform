
// Static question/answer data (remains hardcoded)
const data = {
  "5.1a": {
    title: "Past Paper: 5.1a",
    question: `Describe the difference between the internet and the world wide web.`,
    answer: `• Internet is the hardware/infrastructure/network of connected devices<br>• World wide web is a collection of websites/web pages (on the internet)`
  },
  "5.1b": {
    title: "Past Paper: 5.1b",
    question: `(a) State what is meant by a URL.`,
    answer: `• Text-based address for a website<br>• (Can contain) protocol/domain name/web page name`
  },
  "5.1c": {
    title: "Past Paper: 5.1c",
    question: `The uniform resource locator (URL) for a website includes the protocol hypertext transfer protocol secure (HTTPS).<br>Explain how HTTPS makes the transmission of data secure.`,
    answer: `• Uses encryption<br>• Data is unreadable if intercepted<br>• Uses Secure Socket Layer (SSL) protocol<br>• SSL uses public/private key encryption<br>• SSL provides authentication to check the website is genuine`
  },
  "5.1d": {
    title: "Past Paper: 5.1d",
    question: `The employee wants to be able to quickly access websites that he regularly uses.<br>Identify the function of a web browser that could be used for this purpose.`,
    answer: `• Storing bookmarks<br>• Storing favourites`
  },
  "5.1e": {
    title: "Past Paper: 5.1e",
    question: `Draw and annotate a diagram to show how the web page is located and retrieved to be displayed on the student’s tablet computer.`,
    answer: `• The browser sending a request using the URL<br>• The DNS converting the domain name to an IP address<br>• The browser contacting the web server using the IP address<br>• The web server sending the HTML/web page back to the browser<br>• The browser rendering the HTML to display the page`
  },
  "5.1f": {
    title: "Past Paper: 5.1f",
    question: `Complete the statements about cookies.`,
    answer: `• web browser<br>• session<br>• temporary<br>• web browser<br>• persistent<br>• permanent<br>• expire`
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
