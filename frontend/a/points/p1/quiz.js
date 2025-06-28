
let quizData = [];
let currentAttempt = 1;
let previousWrongIndexes = [];
let currentDisplayIndexes = [];

// Read student info from localStorage
const studentId = localStorage.getItem('student_id') || "anonymous";
const studentName = localStorage.getItem('student_name') || "Unknown Student";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("student-info").innerText = "👤 Student: " + studentName;
});

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

  const resultTop = document.getElementById('result');
  const resultBottom = document.getElementById('result-bottom');

  if (unanswered) {
    const warning = "<p style='color:red;'>⚠️ Please answer all displayed questions before submitting.</p>";
    resultTop.innerHTML = warning;
    resultBottom.innerHTML = warning;
    document.getElementById('retry-btn').style.display = "none";
    document.getElementById('proceed-btn').style.display = "none";
    return;
  }

  const total = currentDisplayIndexes.length;
  const percent = Math.round((score / total) * 100);
  const success = newWrongIndexes.length === 0;

  const message = `
    <h3>✅ Score: ${percent}%</h3>
    <p>${success ? "🎉 Excellent! You may now proceed to Layer 3." : "Some answers are still incorrect. Try again."}</p>
  `;

  resultTop.innerHTML = message;
  resultBottom.innerHTML = message;

  if (success) {
    document.getElementById('retry-btn').style.display = "none";
    document.getElementById('proceed-btn').style.display = "inline-block";

    // ✅ Supabase update on success
    fetch('https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/progress', {
      method: 'PATCH',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: studentId,
        point_id: 'P1',
        layer2_passed: true
      })
    }).then(res => {
      if (res.ok) {
        console.log("✅ Supabase updated for Layer 2 (P1).");
      } else {
        console.error("❌ Failed to update Supabase.");
      }
    });
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
  document.getElementById('result-bottom').innerHTML = '';
  document.getElementById('retry-btn').style.display = "none";
  document.getElementById('proceed-btn').style.display = "none";
}

function goToLayer3() {
  window.location.href = "layer3.html";
}
