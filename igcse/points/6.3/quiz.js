
let quizData = [];
let wrongIndexes = [];
let displayIndexes = [];

fetch("quiz.json").then(res => res.json()).then(data => {
  quizData = data;
  renderQuiz();
});

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  displayIndexes = [];

  quizData.forEach((q, i) => {
    if (wrongIndexes.length && !wrongIndexes.includes(i)) return;
    displayIndexes.push(i);

    const div = document.createElement("div");
    div.className = "question";
    let html = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;

    if (q.type === "mcq") {
      q.options.forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;
      });
    } else if (q.type === "truefalse") {
      ["True", "False"].forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;
      });
    } else if (q.type === "fill") {
      html += `<input type="text" name="q${i}" />`;
    }

    div.innerHTML = html;
    container.appendChild(div);
  });
}

function submitQuiz() {
  let score = 0;
  let newWrong = [];
  let total = displayIndexes.length;

  displayIndexes.forEach(i => {
    const q = quizData[i];
    let answer = "";
    if (q.type === "fill") {
      answer = document.querySelector(`[name='q${i}']`)?.value || "";
    } else {
      answer = document.querySelector(`[name='q${i}']:checked`)?.value || "";
    }

    if (answer.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
      score++;
    } else {
      newWrong.push(i);
    }
  });

  const result = document.getElementById("result");
  if (newWrong.length === 0) {
    result.innerHTML = `✅ All correct!`;
    document.getElementById("retry-btn").style.display = "none";
    document.getElementById("proceed-btn").style.display = "inline-block";
    updateTheoryProgress("6.3", 2);
  } else {
    result.innerHTML = `❌ ${newWrong.length} incorrect. Try again.`;
    wrongIndexes = newWrong;
    document.getElementById("retry-btn").style.display = "inline-block";
    document.getElementById("proceed-btn").style.display = "none";
  }
}

function retryWrong() {
  renderQuiz();
  document.getElementById("result").innerText = "Retrying incorrect questions.";
  document.getElementById("retry-btn").style.display = "none";
}

function goToLayer3() {
  window.location.href = "layer3.html";
}
