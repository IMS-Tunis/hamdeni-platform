const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
// `window.supabase` already holds the Supabase client instance created in
// `layer2.html`. Just reuse it instead of trying to call `createClient` again
// on an undefined object.
const supabase = window.supabase;
const username = localStorage.getItem("username");
const platform = localStorage.getItem("platform");
const pointId = (() => {
  if (typeof point_id !== 'undefined' && point_id) {
    return String(point_id).trim();
  }

  const segment = location.pathname
    .split('/')
    .filter(Boolean)
    .find(part => /^\d+(?:\.\d+)?$/.test(part));

  return segment || '';
})().toLowerCase();

const PROGRESS_TABLES = {
  A_Level: 'a_theory_progress',
  AS_Level: 'as_theory_progress',
  IGCSE: 'igcse_theory_progress'
};

const COMPLETION_BANNER_ID = 'layer2-complete-banner';

let attempt = 1;
let incorrect = [];
let completedBefore = false;

init();

async function init() {
  await checkInitialProgress();
  try {
    const response = await fetch("quiz.json");
    if (!response.ok) throw new Error(`Failed to load quiz: ${response.status}`);
    const data = await response.json();
    startQuiz(data.questions);
  } catch (error) {
    console.error('Failed to load quiz questions', error);
    const container = document.getElementById("quiz-container");
    if (container) {
      container.innerHTML = "<p>Unable to load the quiz right now. Please try again later.</p>";
    }
  }
}

async function checkInitialProgress() {
  const table = PROGRESS_TABLES[platform];
  if (!supabase || !username || !table || !pointId) return;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('reached_layer')
      .eq('username', username)
      .eq('point_id', pointId)
      .maybeSingle();
    if (error) throw error;
    if (parseReachedLayer(data?.reached_layer) >= 2) {
      completedBefore = true;
      showAlreadyCompletedBanner();
    }
  } catch (err) {
    console.error('Failed to check existing progress', err);
  }
}

function showAlreadyCompletedBanner() {
  const container = document.getElementById("quiz-container");
  if (!container || document.getElementById(COMPLETION_BANNER_ID)) return;

  const wrapper = document.createElement('div');
  wrapper.id = COMPLETION_BANNER_ID;
  wrapper.className = 'success-message';
  wrapper.innerHTML = `✅ You've already completed this practice quiz. ` +
    `You can head straight to the next layer whenever you're ready, or retake the questions below for revision.`;

  const actionRow = document.createElement('div');
  actionRow.style.marginTop = '12px';

  const continueBtn = document.createElement('a');
  continueBtn.className = 'nav-btn next';
  continueBtn.href = '#';
  continueBtn.textContent = 'Continue to Layer 3';
  actionRow.appendChild(continueBtn);
  wrapper.appendChild(actionRow);

  const parent = container.parentNode;
  if (parent) {
    parent.insertBefore(wrapper, container);
  }

  attachContinueHandler(continueBtn);
}

function attachContinueHandler(btn) {
  if (!btn) return;
  btn.addEventListener('click', async (event) => {
    event.preventDefault();
    await sendProgress();
    window.location.href = 'layer3.html';
  });
}

function parseReachedLayer(value) {
  if (value === 'R') return 4;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function startQuiz(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  incorrect = [];
  questions.forEach((q, i) => {
    if (attempt > 1 && !q.retry) return;
    const div = document.createElement("div");
    div.className = "quiz-question";
    let html = `<h3>Q${i + 1}: ${q.question}</h3>`;
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
      });
    }
    div.innerHTML = html;
    container.appendChild(div);
  });
  const submit = document.createElement("button");
  const isInitialRetake = completedBefore && attempt === 1;
  submit.className = !isInitialRetake && attempt === 1 ? "submit-btn" : "submit-btn retry";
  if (attempt === 1) {
    submit.textContent = isInitialRetake ? "Retake Quiz" : "Submit";
  } else {
    submit.textContent = "Retry";
  }
  submit.type = "button";
  submit.onclick = () => checkAnswers(questions);
  container.appendChild(submit);
}

function withinOneEdit(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return true;
  const lenA = a.length, lenB = b.length;
  if (Math.abs(lenA - lenB) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < lenA && j < lenB) {
    if (a[i] === b[j]) { i++; j++; }
    else {
      if (++edits > 1) return false;
      if (lenA > lenB) i++;
      else if (lenB > lenA) j++;
      else { i++; j++; }
    }
  }
  if (i < lenA || j < lenB) edits++;
  return edits <= 1;
}

function checkAnswers(questions) {
  let correct = 0;
  const result = document.getElementById("quiz-result");
  result.innerHTML = "";
  questions.forEach((q, i) => {
    if (attempt > 1 && !q.retry) return;
    let isCorrect = false;
    if (q.type === "mcq" || q.type === "true_false") {
      const sel = document.querySelector(`input[name="q${i}"]:checked`);
      const val = sel ? sel.value : "";
      isCorrect = val === q.answer;
    } else if (q.type === "fill_blank") {
      const val = document.querySelector(`input[name="q${i}"]`).value.trim();
      isCorrect = withinOneEdit(val, q.answer);
    } else if (q.type === "match") {
      const pairs = Object.entries(q.pairs);
      isCorrect = pairs.every(([key, correct], j) =>
        document.querySelector(`select[name="q${i}_${j}"]`).value === correct
      );
    }
    if (isCorrect) {
      correct++;
    } else {
      q.retry = true;
      incorrect.push(q);
    }
  });

  const total = questions.filter(q => attempt === 1 || q.retry).length;
  if (correct === total) {
    result.innerHTML = `<div class="success-message">✅ All correct! Proceed to next layer.</div>` +
      `<a class="nav-btn next" id="continue-btn" href="#">Continue to Layer 3</a>`;
    completedBefore = true;
    attachContinueHandler(document.getElementById('continue-btn'));
  } else {
    attempt++;
    result.innerHTML = `<div class="retry-message">You answered ${correct} out of ${total} questions correctly. To help you practice, only the questions you answered incorrectly are displayed. Please try them again.</div>`;
    startQuiz(incorrect);
  }
}

async function sendProgress() {
  const platform = localStorage.getItem("platform");
  const table = PROGRESS_TABLES[platform];
  if (!table) return;
  const { data: existing } = await supabase
    .from(table)
    .select('reached_layer')
    .eq('username', username)
    .eq('point_id', pointId)
    .maybeSingle();
  if (parseReachedLayer(existing?.reached_layer) < 2) {
    await supabase.from(table).upsert({
      username: username,
      point_id: pointId,
      reached_layer: '2'
    }, { onConflict: ['username', 'point_id'] });
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
