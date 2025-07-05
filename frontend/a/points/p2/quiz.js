const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG;
// Load quiz data
fetch("quiz.json")
  .then(response => response.json())
  .then(data => startQuiz(data.questions));

let currentAttempt = 1;
let incorrectQuestions = [];
function startQuiz(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  incorrectQuestions = [];
  questions.forEach((q, index) => {
    if (currentAttempt > 1 && !q.retry) return;
    const div = document.createElement("div");
    div.className = "quiz-question";
    let html = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
    if (q.type === "mcq") {
      q.options.forEach(opt => {
        html += `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`;
      });
    } else if (q.type === "true_false") {
      html += '<label><input type="radio" name="q' + index + '" value="True"> True</label><br>';
      html += '<label><input type="radio" name="q' + index + '" value="False"> False</label><br>';
    } else if (q.type === "fill_blank") {
      html += `<input type="text" name="q${index}" placeholder="Your answer"><br>`;
    } else if (q.type === "match") {
      const keys = Object.keys(q.pairs);
      const values = shuffle(Object.values(q.pairs));
      keys.forEach(k => {
        html += `<div>${k} → <select name="q${index}_${k}">` +
          values.map(v => `<option value="${v}">${v}</option>`).join("") +
          `</select></div>`;
    }
    div.innerHTML = html;
    container.appendChild(div);
  });
  const btn = document.createElement("button");
  btn.textContent = "Submit Answers";
  btn.onclick = () => evaluate(questions);
  container.appendChild(btn);
}
function evaluate(questions) {
  let correct = 0;
    let userAnswer = null;
    if (q.type === "mcq" || q.type === "true_false") {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (!selected) return;
      userAnswer = selected.value;
      if (userAnswer === q.answer) correct++;
      else {
        incorrectQuestions.push(index);
        q.retry = true;
      }
      const input = document.querySelector(`input[name="q${index}"]`);
      if (!input) return;
      userAnswer = input.value.trim();
      if (userAnswer.toLowerCase() === q.answer.toLowerCase()) correct++;
      let allCorrect = true;
      Object.keys(q.pairs).forEach(k => {
        const selected = document.querySelector(`select[name="q${index}_${k}"]`);
        if (!selected || selected.value !== q.pairs[k]) {
          allCorrect = false;
        }
      if (allCorrect) correct++;
  showResult(correct, questions.length, questions);
function showResult(correct, total, questions) {
  const result = document.getElementById("result-container");
  result.innerHTML = `<p>You got ${correct} out of ${total} correct.</p>`;
  if (correct === total) {
    result.innerHTML += `<p><strong>✅ Congratulations! You passed.</strong></p>`;
    result.innerHTML += `<a href="layer3.html"><button>Next → Layer 3</button></a>`;
    sendProgress();
  } else {
    currentAttempt++;
    result.innerHTML += `<button onclick='startQuiz(${JSON.stringify(questions)})'>Retry Incorrect Only</button>`;
  }
function sendProgress() {
  const student_id = localStorage.getItem("student_id");
  const path = window.location.pathname;
  const point_id = path.split("/").find(p => p.startsWith("p"));
  fetch(`${SUPABASE_URL}/rest/v1/theory_progress`, {
    method: "PATCH",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      student_id: student_id,
      point_id: point_id.toUpperCase(),
      layer2_passed: true
    })
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  return array;
