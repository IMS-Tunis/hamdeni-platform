
import { login, logout, getCurrentStudent, fetchTheoryProgress, fetchProgrammingProgress } from './modules/supabase.js';
import { renderTheoryPoints } from './modules/theoryRenderer.js';
import { renderProgrammingLevels } from './modules/levelRenderer.js';

document.addEventListener("DOMContentLoaded", async () => {
  const studentId = getCurrentStudent();
  const nameBar = document.getElementById("student-name-bar");

  if (studentId) {
    nameBar.textContent = "Computer Science Journey progress of " + studentId;

    const [theoryData, levelData] = await Promise.all([
      fetchTheoryProgress(studentId),
      fetchProgrammingProgress(studentId)
    ]);

    renderTheoryPoints(theoryData);
    renderProgrammingLevels(levelData);
  } else {
    nameBar.textContent = "Guest Mode";
    renderTheoryPoints();  // Render default (gray)
    renderProgrammingLevels();  // Render locked
  }

  document.getElementById("login-btn").onclick = login;
  document.getElementById("logout-btn").onclick = logout;
});
