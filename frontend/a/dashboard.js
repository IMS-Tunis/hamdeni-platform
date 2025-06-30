
import { renderTheoryPoints } from "./modules/theoryRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, running dashboard.js");
  const student = localStorage.getItem("student_name");
  document.getElementById("student-name").textContent = "👤 Logged in as: " + student;
  renderTheoryPoints();
});
