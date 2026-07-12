const supabase = window.supabase;
const username = localStorage.getItem("username");
const platform = localStorage.getItem("platform");
const pointId = (document.body.dataset.pointId || location.pathname
  .split("/")
  .filter(Boolean)
  .find(part => /^\d+(?:\.\d+)?$/.test(part)) || "").toLowerCase();

const PROGRESS_TABLES = {
  A_Level: "a_theory_progress",
  AS_Level: "as_theory_progress",
  IGCSE: "igcse_theory_progress"
};

const COMPLETION_BANNER_ID = "layer2-complete-banner";
let attempt = 1;
let completedBefore = false;

init();

async function init() {
  await checkInitialProgress();

  try {
    const response = await fetch("quiz.json");
    if (!response.ok) throw new Error(`Failed to load quiz: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.questions) || !data.questions.length) {
      throw new Error("The quiz does not contain any questions.");
    }
    startQuiz(data.questions);
  } catch (error) {
    console.error("Failed to load quiz questions", error);
    const container = document.getElementById("quiz-container");
    if (container) {
      container.textContent = "Unable to load the quiz right now. Please try again later.";
    }
  }
}

async function checkInitialProgress() {
  const table = PROGRESS_TABLES[platform];
  if (!supabase || !username || !table || !pointId) return;

  try {
    const { data, error } = await supabase
      .from(table)
      .select("reached_layer")
      .eq("username", username)
      .eq("point_id", pointId)
      .maybeSingle();

    if (error) throw error;
    if (parseReachedLayer(data?.reached_layer) >= 2) {
      completedBefore = true;
      showAlreadyCompletedBanner();
    }
  } catch (error) {
    console.error("Failed to check existing progress", error);
  }
}

function showAlreadyCompletedBanner() {
  const container = document.getElementById("quiz-container");
  if (!container || document.getElementById(COMPLETION_BANNER_ID)) return;

  const banner = document.createElement("div");
  banner.id = COMPLETION_BANNER_ID;
  banner.className = "success-message";
  banner.append("✅ You've already completed this practice quiz. You can continue to the next layer or retake the questions below for revision.");

  const actionRow = document.createElement("div");
  actionRow.style.marginTop = "12px";
  const continueButton = createContinueButton();
  actionRow.appendChild(continueButton);
  banner.appendChild(actionRow);
  container.parentNode?.insertBefore(banner, container);
}

function createContinueButton() {
  const button = document.createElement("a");
  button.className = "nav-btn next";
  button.href = "layer3.html";
  button.textContent = "Continue to Layer 3";
  button.addEventListener("click", async event => {
    event.preventDefault();
    try {
      await sendProgress();
    } catch (error) {
      console.error("Failed to save Layer 2 progress", error);
    } finally {
      window.location.href = "layer3.html";
    }
  });
  return button;
}

function parseReachedLayer(value) {
  if (value === "R") return 4;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function startQuiz(questions) {
  const container = document.getElementById("quiz-container");
  const visibleQuestions = attempt === 1 ? questions : questions.filter(question => question.retry);
  container.replaceChildren();

  visibleQuestions.forEach((question, index) => {
    container.appendChild(renderQuestion(question, index));
  });

  const submitButton = document.createElement("button");
  const isInitialRetake = completedBefore && attempt === 1;
  submitButton.className = `submit-btn${attempt === 1 && !isInitialRetake ? "" : " retry"}`;
  submitButton.type = "button";
  submitButton.textContent = attempt === 1 ? (isInitialRetake ? "Retake Quiz" : "Submit") : "Retry";
  submitButton.addEventListener("click", () => checkAnswers(visibleQuestions));
  container.appendChild(submitButton);
}

function renderQuestion(question, index) {
  const card = document.createElement("section");
  card.className = "quiz-question";

  const heading = document.createElement("h3");
  heading.textContent = `Q${index + 1}: ${question.question}`;
  card.appendChild(heading);

  if (question.type === "mcq" || question.type === "true_false") {
    const options = question.type === "mcq" ? question.options : ["True", "False"];
    options.forEach(option => {
      const label = document.createElement("label");
      label.className = "option-label";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = option;
      label.append(input, document.createTextNode(option));
      card.appendChild(label);
      card.appendChild(document.createElement("br"));
    });
  } else if (question.type === "fill_blank") {
    const input = document.createElement("input");
    input.className = "fill-answer";
    input.type = "text";
    input.name = `q${index}`;
    input.placeholder = "Your answer";
    input.autocomplete = "off";
    card.appendChild(input);
  } else if (question.type === "match") {
    const values = shuffle(Object.values(question.pairs));
    Object.keys(question.pairs).forEach((term, pairIndex) => {
      const row = document.createElement("div");
      row.className = "match-item";
      const label = document.createElement("label");
      const selectId = `q${index}-${pairIndex}`;
      label.htmlFor = selectId;
      label.textContent = term;

      const select = document.createElement("select");
      select.id = selectId;
      select.name = `q${index}_${pairIndex}`;
      const prompt = document.createElement("option");
      prompt.value = "";
      prompt.textContent = "Select";
      select.appendChild(prompt);

      values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      row.append(label, select);
      card.appendChild(row);
    });
  }

  return card;
}

function checkAnswers(questions) {
  let correct = 0;
  const incorrect = [];
  const result = document.getElementById("quiz-result");
  result.replaceChildren();

  questions.forEach((question, index) => {
    let isCorrect = false;

    if (question.type === "mcq" || question.type === "true_false") {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      isCorrect = selected?.value === question.answer;
    } else if (question.type === "fill_blank") {
      const input = document.querySelector(`input[name="q${index}"]`);
      isCorrect = withinOneEdit(input?.value.trim() || "", question.answer);
    } else if (question.type === "match") {
      isCorrect = Object.values(question.pairs).every((answer, pairIndex) => {
        const select = document.querySelector(`select[name="q${index}_${pairIndex}"]`);
        return select?.value === answer;
      });
    }

    question.retry = !isCorrect;
    if (isCorrect) correct += 1;
    else incorrect.push(question);
  });

  if (correct === questions.length) {
    const message = document.createElement("div");
    message.className = "success-message";
    message.textContent = "✅ All correct! Proceed to the next layer.";
    result.append(message, createContinueButton());
    completedBefore = true;
    return;
  }

  attempt += 1;
  const message = document.createElement("div");
  message.className = "retry-message";
  message.textContent = `You answered ${correct} out of ${questions.length} questions correctly. Only the questions answered incorrectly are shown below. Please try them again.`;
  result.appendChild(message);
  startQuiz(incorrect);
  document.getElementById("quiz-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function withinOneEdit(value, answer) {
  const a = value.toLowerCase();
  const b = String(answer).toLowerCase();
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (a.length > b.length) i += 1;
      else if (b.length > a.length) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
  }
  if (i < a.length || j < b.length) edits += 1;
  return edits <= 1;
}

async function sendProgress() {
  const table = PROGRESS_TABLES[platform];
  if (!supabase || !username || !table || !pointId) return;

  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("reached_layer")
    .eq("username", username)
    .eq("point_id", pointId)
    .maybeSingle();
  if (readError) throw readError;

  if (parseReachedLayer(existing?.reached_layer) < 2) {
    const { error } = await supabase.from(table).upsert({
      username,
      point_id: pointId,
      reached_layer: "2"
    }, { onConflict: ["username", "point_id"] });
    if (error) throw error;
  }
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
