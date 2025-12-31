
import { renderTheoryPoints } from "./modules/theoryRenderer.js";
import { renderProgrammingLevels, levels } from "./modules/levelRenderer.js";
import { initializeLogin, fetchProgressCounts, verifyPlatform } from "./modules/supabase.js";

async function updateGeneralProgress() {
  const fill = document.querySelector(".general-progress-fill");
  const termGradeEl = document.getElementById("term-grade-value");
  if (!fill) return;
  console.log('[dashboard] Updating general progress');

  let totalPoints = 0;
  try {
    const res = await fetch("./points/index.json");
    if (res.ok) {
      const pts = await res.json();
      totalPoints = pts.length;
    }
  } catch (err) {
    console.error("Failed to load points index:", err);
  }

  const totalLevels = levels.length;

  const { points, levels: levelsDone, midTermGrade } = await fetchProgressCounts();

  if (termGradeEl) {
    const numericGrade = Number(midTermGrade);
    const sanitizedGrade = Number.isFinite(numericGrade)
      ? Math.min(100, Math.max(0, numericGrade))
      : 0;
    const formattedGrade = Number.isInteger(sanitizedGrade)
      ? sanitizedGrade.toString()
      : sanitizedGrade.toFixed(1);

    termGradeEl.textContent = `${formattedGrade}%`;
  }

  const total = totalPoints + totalLevels;
  const doneLevels = levelsDone;
  const donePoints = points;
  const done = doneLevels + donePoints;
  const percent = total ? (done / total) * 100 : 0;
  const roundedPercent = Math.round(percent);
  const clampedPercent = Math.max(0, Math.min(100, percent));

  fill.textContent = roundedPercent + "%";
  fill.style.setProperty("width", clampedPercent + "%", "important");

  fill.classList.remove("progress-low", "progress-medium", "progress-high");

  let progressClass = "progress-low";
  if (roundedPercent >= 67) {
    progressClass = "progress-high";
  } else if (roundedPercent >= 34) {
    progressClass = "progress-medium";
  }

  fill.classList.add(progressClass);
  console.debug('[dashboard] Progress percent', roundedPercent);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, running dashboard.js");

  verifyPlatform();

  renderTheoryPoints();
  renderProgrammingLevels();
  initializeLogin();
  updateGeneralProgress();

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.onclick = () => {
      console.log("🏠 Home button clicked");
      window.location.href = "../index.html";
    };
  }

  const studentName = localStorage.getItem("student_name");
  console.log("👤 Logged in as:", studentName);
});
