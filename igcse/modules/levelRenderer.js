
import { fetchProgressCounts } from "./supabase.js";

export const levels = [
	{ title: "Introduction to Algorithms", id: "level1", status: "locked" },
    { title: "Programming Basics", id: "level2", status: "locked" },
    { title: "Selection", id: "level3", status: "locked" },
    { title: "Count controlled Iteration", id: "level4", status: "locked" },
    { title: "Conditional Iteration", id: "level5", status: "locked" },
    { title: "Standard Methods of Solution", id: "level6", status: "locked" },
    { title: "String Handling & Nested Statements", id: "level7", status: "locked" },
    { title: "Arrays and Iterative Data Handling", id: "level8", status: "locked" },
    { title: "Search and Sort", id: "level9", status: "locked" },
    { title: "File Handling", id: "level10", status: "locked" },
    { title: "Validation, Verification, and Error Handling", id: "level11", status: "locked" },
    { title: "Dry Runs, Trace Tables, and Test Data", id: "level12", status: "locked" },
    { title: "Systems decomposition, Procedures, Functions", id: "level13", status: "locked" },
    { title: "Comprehensive Problem-solving", id: "level14", status: "locked" }

  ];

export async function renderProgrammingLevels() {
  console.log('[levelRenderer] Rendering programming levels');
  const container = document.getElementById("programming-levels");
  if (!container) {
    console.error('[levelRenderer] programming-levels container not found');
    return;
  }

  const progress = await fetchProgressCounts();
  const guestAccess = progress?.guest || !localStorage.getItem('username');
  const totalLevels = levels.length;

  let completed = guestAccess ? totalLevels : Number(progress?.levels ?? 0);
  if (!Number.isFinite(completed) || completed < 0) {
    completed = guestAccess ? totalLevels : 0;
  }

  const hasRemainingLevels = completed < totalLevels;
  const nextUnlock = hasRemainingLevels ? completed + 1 : null;

  levels.forEach((level, index) => {
    console.debug('[levelRenderer] Creating level box', level.id);
    const box = document.createElement("div");
    const idNumber =
      typeof level.id === 'string'
        ? Number.parseInt(level.id.replace('level', ''), 10)
        : Number.NaN;
    const displayNumber = Number.isFinite(idNumber) ? idNumber : index;
    const levelNumber = index + 1;
    let status = 'locked';
    if (levelNumber <= completed) {
      status = 'passed';
    } else if (nextUnlock !== null && levelNumber === nextUnlock) {
      status = 'unlocked';
    }
    box.className = `level-box ${status}`;
    box.dataset.level = String(displayNumber);

    let icon = "";
    if (status === "locked") icon = "\uD83D\uDD12"; // 🔒
    else if (status === "unlocked") icon = "\uD83D\uDD13"; // 🔓
    else if (status === "passed") icon = "\u2705"; // ✅

    box.innerHTML = `
      <span class="level-icon">${icon}</span>
      <div class="level-text">
        <strong class="level-number">Level ${displayNumber}</strong>
        <span class="level-title">${level.title}</span>
      </div>
    `;
    box.addEventListener("click", () => {
      try {
        if (box.classList.contains("locked")) {
          alert("This level is locked.");
        } else {
          window.location.href = `./levels/${level.id}.html`;
        }
      } catch (err) {
        console.error('[levelRenderer] Level box click error:', err);
      }
    });

    container.appendChild(box);

    // Insert red arrow image between levels except after last one
    if (index < levels.length - 1) {
      const arrow = document.createElement("img");
      arrow.src = "images/arrow.png";
      arrow.alt = "↓";
      arrow.className = "arrow-img";
      container.appendChild(arrow);
      console.debug('[levelRenderer] Inserted arrow after', level.id);
    }
  });
  console.log('[levelRenderer] Finished rendering levels');
}
