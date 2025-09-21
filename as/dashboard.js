
import { renderTheoryPoints } from "./modules/theoryRenderer.js";
import { renderProgrammingLevels } from "./modules/levelRenderer.js";
import { initializeLogin, fetchProgressCounts, verifyPlatform } from "./modules/supabase.js";

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
  const percent = total ? (done / total) * 100 : 0;
  const roundedPercent = Math.round(percent);
  const clampedPercent = Math.max(0, Math.min(100, percent));

  fill.textContent = roundedPercent + "%";
  fill.style.setProperty("width", clampedPercent + "%", "important");
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
