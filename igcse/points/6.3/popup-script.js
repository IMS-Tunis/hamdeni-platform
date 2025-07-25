

const data = {
  "6.3a": {
    title: "Past Paper: 6.3a",
    question: `The expert system is an example of artificial intelligence (AI). Describe what is meant by AI.`,
    answer: `• AI is the simulation of human intelligence<br>• by computer systems<br>• to perform tasks normally requiring human intelligence<br>• e.g. speech recognition, decision-making, language translation`
  },
  "6.3b": {
    title: "Past Paper: 6.3b",
    question: `The robot is adapted to have machine learning capabilities. Explain how this will improve the robot.`,
    answer: `• The robot can now adapt itself by changing its own rules/data/processes<br>• The robot will become more efficient<br>• as it has a greater knowledge of its surroundings/environment<br>• as it can remember where a fence is<br>• as it can remember the route it needs to take<br>• as it can remember where any obstacles are to avoid<br>• as it can remember where to start and stop sowing seeds<br>• as it may make fewer errors`
  },
  "6.3c": {
    title: "Past Paper: 6.3c",
    question: `Explain how the expert system operates and how it is used to help diagnose the problem.`,
    answer: `• User inputs symptoms via the interface<br>• The inference engine searches the knowledge base<br>• applies the rule base to the symptoms<br>• A diagnosis is made<br>• which is output to the user<br>• System may ask follow-up questions to refine the diagnosis`
  }
};

const keywords = {
  "6.3a": {
    title: "Keywords: 6.3a",
    content: `
      <ul>
        <li><strong>Artificial intelligence (AI):</strong> A part of computer science that focuses on creating machines that can think and perform tasks a person would usually perform</li>
        <li><strong>Cognitive functions:</strong> The mental processes of the human brain such as reasoning, learning, perception, and speech</li>
        <li><strong>Narrow AI:</strong> AI that outperforms humans at one specific task, such as playing chess</li>
        <li><strong>General AI:</strong> AI that performs at a similar level to humans on a specific task</li>
        <li><strong>Strong AI:</strong> AI that performs better than humans across many tasks</li>
        <li><strong>Simulated intelligence:</strong> The ability of a machine to mimic intelligent human behavior</li>
        <li><strong>Natural language systems:</strong> AI systems that interpret human language</li>
        <li><strong>Speech recognition:</strong> The ability of a machine to understand spoken language</li>
        <li><strong>Facial expression recognition:</strong> An AI process for identifying human emotions based on facial features</li>
        <li><strong>Turing Test:</strong> A test proposed by Alan Turing to determine if a machine can imitate human responses</li>
        <li><strong>Rules:</strong> Instructions a machine follows to make decisions</li>
        <li><strong>Data:</strong> Information used by the system</li>
        <!-- add further entries here in the same format -->
      </ul>`
  },
  "6.3b": {
    title: "Keywords: 6.3b",
    content: `
      <ul>
        <li><strong>Data collection:</strong> The process of gathering input for the system, either from users or from sensors such as cameras or microphones</li>
        <li><strong>Rules base:</strong> A collection of predefined instructions or logic used to guide decisions within the system</li>
        <li><strong>Reasoning:</strong> The ability to use logic and rules to draw new conclusions from known information</li>
        <li><strong>Learning and adaptation:</strong> The ability of the system to improve or change its decision-making rules based on experience or new data</li>
        <li><strong>Infra-red sensors:</strong> Sensors that detect proximity or obstacles</li>
        <li><strong>Machine learning:</strong> A sub-field of AI that enables machines to learn from data and improve performance without explicit reprogramming</li>
        <li><strong>Supervised learning:</strong> A type of machine learning where the system is trained with labeled data and examples</li>
        <li><strong>Unsupervised learning:</strong> A type of machine learning where the system finds patterns in data without human-provided labels</li>
        <li><strong>Clustering:</strong> A method used in unsupervised learning to group similar data points based on shared features</li>
        <li><strong>Spam filtering:</strong> An application of machine learning to detect unwanted emails</li>
        <li><strong>Product recommendation:</strong> The use of machine learning to suggest items to users</li>
        <li><strong>Fraud detection:</strong> Using machine learning to identify suspicious transactions</li>
        <li><strong>Collaborative filtering:</strong> A technique used in recommendation systems to suggest items based on similar users’ preferences</li>
        <li><strong>Knowledge base:</strong> A storage area for expert-level facts</li>
        <li><strong>Rule base:</strong> A set of IF-THEN rules for applying logic</li>
        <li><strong>Inference engine:</strong> The system’s reasoning module that applies the rules to reach decisions</li>
        <li><strong>User interface:</strong> The method by which the user communicates with the expert system</li>
        <li><strong>Cognitive functions:</strong> Human mental processes such as perception, learning, memory, and decision-making</li>
        <!-- add further entries here in the same format -->
      </ul>`
  },
  "6.3c": {
    title: "Keywords: 6.3c",
    content: `
      <ul>
        <li><strong>Expert system:</strong> A type of AI that mimics human expert knowledge to solve problems or give advice</li>
        <li><strong>Knowledge base:</strong> A storage of expert-level facts and information, often organized as objects and attributes</li>
        <li><strong>Rules base:</strong> A set of logical IF-THEN statements that determine actions based on the facts</li>
        <li><strong>Inference engine:</strong> The reasoning unit that applies rules to the facts and decides what to do next</li>
        <li><strong>User interface:</strong> The part of the system that allows users to input answers and receive results</li>
        <li><strong>Explanation system:</strong> A module that explains the reasoning behind the system’s diagnosis or advice to the user</li>
        <li><strong>Medical expert system:</strong> An AI used to support medical diagnosis</li>
        <li><strong>Machine learning system:</strong> An AI system that improves its own performance using data and feedback from past experience</li>
        <li><strong>Black boxes:</strong> Systems whose internal reasoning is difficult to interpret, even for developers</li>
        <!-- add further entries here in the same format -->
      </ul>`
  }
};



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

function openPopupK(id) {
  const item = keywords[id];
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
          <div class="popup-label">Keyword List</div>
          <div class="popup-content">${item.content}</div>
        </div>
      </body>
    </html>
  `;
  const popup = window.open("", "_blank", "width=600,height=800,resizable=yes,scrollbars=yes");
  popup.document.write(html);
  popup.document.close();
}

