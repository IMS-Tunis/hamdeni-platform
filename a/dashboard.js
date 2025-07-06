
import { renderTheoryPoints } from "./modules/theoryRenderer.js";
import { renderProgrammingLevels } from "./modules/levelRenderer.js";
import { initializeLogin, fetchProgressCounts } from "./modules/supabase.js";

async function updateGeneralProgress() {
  const fill = document.querySelector(".general-progress-fill");
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

  const totalLevels = 16; // defined in levelRenderer

  const { points, levels } = await fetchProgressCounts();

  const total = totalPoints + totalLevels;
  const done = points + levels;
  const percent = total ? Math.round((done / total) * 100) : 0;

  fill.style.width = percent + "%";
  fill.textContent = percent + "%";
  console.debug('[dashboard] Progress percent', percent);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, running dashboard.js");

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
