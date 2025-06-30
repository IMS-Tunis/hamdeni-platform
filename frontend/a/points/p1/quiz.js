
let quizData = [];
let currentIndexes = [];

fetch("quiz.json")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    renderQuiz();
  });

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  currentIndexes = [];

  quizData.forEach((q, i) => {
    currentIndexes.push(i);
    const div = document.createElement("div");
    div.className = "question";
    let html = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;

    if (q.type === "mcq" || q.type === "truefalse") {
      const options = q.type === "mcq" ? q.options : ["True", "False"];
      options.forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;
      });
    } else if (q.type === "fill") {
      html += `<input type="text" name="q${i}">`;
    }

    div.innerHTML = html;
    container.appendChild(div);
  });
}

function submitQuiz() {
  const result = document.getElementById("result");
  let score = 0;
  let total = quizData.length;
  let allAnswered = true;

  quizData.forEach((q, i) => {
    let answer;
    if (q.type === "fill") {
      answer = document.querySelector(`[name='q${i}']`).value;
    } else {
      const selected = document.querySelector(`[name='q${i}']:checked`);
      answer = selected ? selected.value : "";
    }

    if (!answer) {
      allAnswered = false;
      return;
    }

    if (answer.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
      score++;
    }
  });

  if (!allAnswered) {
    result.innerHTML = "⚠️ Please answer all questions.";
    return;
  }

  result.innerHTML = `✅ Score: ${score}/${total}`;
  if (score === total) {
    document.getElementById("proceed-btn").style.display = "inline-block";
    updateTheoryProgress("P1", 2);
  }
}

function goToLayer3() {
  window.location.href = "layer3.html";
}
