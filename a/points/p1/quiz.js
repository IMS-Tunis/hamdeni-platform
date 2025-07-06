const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG;
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const studentId = localStorage.getItem("student_id");
const pointId = location.pathname.split("/").find(p => p.startsWith("p")).toUpperCase();

fetch("quiz.json")
  .then(r => r.json())
  .then(data => startQuiz(data.questions));
let attempt = 1;
let incorrect = [];
function startQuiz(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  incorrect = [];
  questions.forEach((q, i) => {
    if (attempt > 1 && !q.retry) return;
    const div = document.createElement("div");
    div.className = "quiz-question";
    let html = `<h3>Q${i+1}: ${q.question}</h3>`;
    if (q.type === "mcq" || q.type === "true_false") {
      const opts = q.type === "mcq" ? q.options : ["True", "False"];
      opts.forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}">${opt}</label><br>`;
      });
    } else if (q.type === "fill_blank") {
      html += `<input type="text" name="q${i}" placeholder="Your answer">`;
    } else if (q.type === "match") {
      const pairs = Object.entries(q.pairs);
      const values = shuffle(Object.values(q.pairs));
      pairs.forEach(([key, correct], j) => {
        html += `<div class="match-item"><span>${key}</span><select name="q${i}_${j}"><option>Select</option>` +
          values.map(v => `<option value="${v}">${v}</option>`).join('') + `</select></div>`;
    }
    div.innerHTML = html;
    container.appendChild(div);
  });
  const submit = document.createElement("button");
  submit.textContent = attempt === 1 ? "Submit" : "Retry";
  submit.onclick = () => checkAnswers(questions);
  container.appendChild(submit);
}
function checkAnswers(questions) {
  let correct = 0, total = 0;
  const result = document.getElementById("quiz-result");
  result.innerHTML = "";
    total++;
    let isCorrect = false, val = "";
      const sel = document.querySelector(`input[name="q${i}"]:checked`);
      val = sel?.value || "";
      isCorrect = val === q.answer;
      val = document.querySelector(`input[name="q${i}"]`).value.trim();
      isCorrect = val.toLowerCase() === q.answer.toLowerCase();
      isCorrect = pairs.every(([key, correct], j) =>
        document.querySelector(`select[name="q${i}_${j}"]`).value === correct
      );
    if (isCorrect) correct++;
    else {
      q.retry = true;
      incorrect.push(q);
  if (correct === total) {
    result.innerHTML = `<div class="success-message">✅ All correct! Proceed to next layer.</div>
      <a class="nav-btn next" href="layer3.html">Continue to Layer 3</a>`;
    sendProgress();
  } else {
    attempt++;
    result.innerHTML = `<div class="retry-message">❌ ${correct}/${total} correct. Try again.</div>`;
    startQuiz(incorrect);
  }
async function sendProgress() {
  const platform = localStorage.getItem("platform");
  const table = `${platform}_theory_progress`;
  await supabase.from(table).upsert({
    studentid: studentId,
    point_id: pointId,
    layer2_done: true
  }, { onConflict: ['studentid', 'point_id'] });
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  return a;
