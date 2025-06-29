
import { renderTheoryPoints } from "./modules/theoryRenderer.js";
import { renderProgrammingLevels } from "./modules/levelRenderer.js";
import { initializeLogin } from "./modules/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  renderTheoryPoints();
  renderProgrammingLevels();
  initializeLogin();

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.onclick = () => {
      window.location.href = "../../index.html";
    };
  }
});
