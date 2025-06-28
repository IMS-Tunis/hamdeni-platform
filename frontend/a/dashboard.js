
import { login, logout, getCurrentStudent, fetchTheoryProgress, fetchProgrammingProgress } from './modules/supabase.js';
import { renderTheoryPoints } from './modules/theoryRenderer.js';
import { renderProgrammingLevels } from './modules/levelRenderer.js';

document.addEventListener("DOMContentLoaded", async () => {
  const studentId = getCurrentStudent();
  const nameBar = document.getElementById("student-name-bar");

  if (studentId) {
    nameBar.textContent = "Dashboard progress of " + studentId;

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

document.getElementById("home-btn").onclick = () => {
  window.location.href = "/index.html";
};


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("theory-points");
  const levelContainer = document.getElementById("programming-levels");
  if (!container || !levelContainer) return;

  fetch("points/index.json")
    .then(res => res.json())
    .then(points => {
      container.innerHTML = "";
      points.forEach((point, i) => {
        const div = document.createElement("div");
        div.className = "point-box";
        div.innerHTML = `
          <h3>P${i + 1}: ${point.title}</h3>
          <a href="points/${point.id}/layer1.html">Start</a>
          <div class="progress-bar"><div class="progress-fill" style="width: 0%;"></div></div>
        `;
        container.appendChild(div);
      });

      levelContainer.innerHTML = "";
      for (let i = 1; i <= 16; i++) {
        const level = document.createElement("div");
        level.className = "level-box";
        level.textContent = "Level " + i;
        levelContainer.appendChild(level);
      }
    });
});
