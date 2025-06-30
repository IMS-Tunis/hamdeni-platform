
let quizData = [];
let currentAttempt = 1;
let previousWrongIndexes = [];
let currentDisplayIndexes = [];

fetch('quiz.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    renderQuiz();
  });

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  currentDisplayIndexes = [];

  quizData.forEach((q, i) => {
    if (currentAttempt > 1 && !previousWrongIndexes.includes(i)) return;
    currentDisplayIndexes.push(i);

    const div = document.createElement('div');
    div.className = 'question';
    div.dataset.index = i;
    let html = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;
    if (q.type === "mcq") {
      q.options.forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;
      });
    } else if (q.type === "truefalse") {
      ["True", "False"].forEach(val => {
        html += `<label><input type="radio" name="q${i}" value="${val}"> ${val}</label><br>`;
      });
    } else if (q.type === "fill") {
      html += `<input type="text" name="q${i}">`;
    } else if (q.type === "match") {
      html += '<ul>';
      for (const key in q.pairs) {
        html += `<li>${key} — <input type="text" name="q${i}_${key}"></li>`;
      }
      html += '</ul>';
    }
    div.innerHTML = html;
    container.appendChild(div);
  });
}

function submitQuiz() {
  const resultDiv = document.getElementById('result');
  let score = 0;
  let unanswered = false;
  let newWrongIndexes = [];

  currentDisplayIndexes.forEach(i => {
    const q = quizData[i];
    const div = document.querySelector(`[data-index='${i}']`);
    if (!div) return;

    let correct = false;

    if (q.type === "mcq" || q.type === "truefalse") {
      const selected = div.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        unanswered = true;
        return;
      }
      if (selected.value.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct = true;
      }
    } else if (q.type === "fill") {
      const input = div.querySelector(`input[name="q${i}"]`);
      if (!input || input.value.trim() === "") {
        unanswered = true;
        return;
      }
      if (input.value.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct = true;
      }
    } else if (q.type === "match") {
      correct = true;
      for (const key in q.pairs) {
        const input = div.querySelector(`input[name="q${i}_${key}"]`);
        if (!input || input.value.trim() === "") {
          unanswered = true;
          return;
        }
        if (input.value.trim().toLowerCase() !== q.pairs[key].toLowerCase()) {
          correct = false;
        }
      }
    }

    if (correct) {
      div.classList.add("correct");
      div.classList.remove("incorrect");
      score++;
    } else {
      div.classList.add("incorrect");
      div.classList.remove("correct");
      newWrongIndexes.push(i);
    }
  });

  if (unanswered) {
    resultDiv.innerHTML = "<p style='color:red;'>⚠️ Please answer all displayed questions before submitting.</p>";
    document.getElementById('retry-btn').style.display = "none";
    document.getElementById('proceed-btn').style.display = "none";
    return;
  }

  const percent = Math.round((score / quizData.length) * 100);
  resultDiv.innerHTML = `<h3>✅ Score: ${percent}%</h3>`;

  if (newWrongIndexes.length === 0) {
    resultDiv.innerHTML += "<p>🎉 Excellent! You may now proceed to Layer 3.</p>";
    document.getElementById('retry-btn').style.display = "none";
    document.getElementById('proceed-btn').style.display = "inline-block";
  } else {
    previousWrongIndexes = newWrongIndexes;
    document.getElementById('retry-btn').style.display = "inline-block";
    document.getElementById('proceed-btn').style.display = "none";
  }
}

function retryWrong() {
  currentAttempt++;
  renderQuiz();
  document.getElementById('result').innerHTML = `<p>Attempt ${currentAttempt}: Retrying incorrect questions only.</p>`;
  document.getElementById('retry-btn').style.display = "none";
  document.getElementById('proceed-btn').style.display = "none";
}

function goToLayer3() {
  window.location.href = "layer3.html";
}
