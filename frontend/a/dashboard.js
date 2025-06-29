
import { renderTheoryPoints } from "./modules/theoryRenderer.js";
import { renderProgrammingLevels } from "./modules/levelRenderer.js";
import { initializeLogin } from "./modules/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, running dashboard.js");

  renderTheoryPoints();
  renderProgrammingLevels();
  initializeLogin();

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
