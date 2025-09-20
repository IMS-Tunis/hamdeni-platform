
import { fetchProgressCounts } from "./supabase.js";

export const levels = [
    { title: "Introduction", id: "level1", status: "locked" },
    { title: "Basic I/O", id: "level2", status: "locked" },
    { title: "Conditionals", id: "level3", status: "locked" },
    { title: "Loops", id: "level4", status: "locked" },
    { title: "Functions", id: "level5", status: "locked" },
    { title: "Lists", id: "level6", status: "locked" },
    { title: "Strings", id: "level7", status: "locked" },
    { title: "Dictionaries", id: "level8", status: "locked" },
    { title: "File Handling", id: "level9", status: "locked" },
    { title: "Debugging", id: "level10", status: "locked" },
    { title: "OOP Basics", id: "level11", status: "locked" },
    { title: "Advanced OOP", id: "level12", status: "locked" },
    { title: "Modules", id: "level13", status: "locked" },
    { title: "Recursion", id: "level14", status: "locked" },
    { title: "Algorithms", id: "level15", status: "locked" },
    { title: "Final Project", id: "level16", status: "locked" }
  ];

export async function renderProgrammingLevels() {
  console.log('[levelRenderer] Rendering programming levels');
  const container = document.getElementById("programming-levels");
  if (!container) {
    console.error('[levelRenderer] programming-levels container not found');
    return;
  }

  const progress = await fetchProgressCounts();
  let reached = Number(progress?.levels ?? 0);
  if (!Number.isFinite(reached)) {
    reached = 0;
  }
  if (reached < 1) {
    reached = 1;
  }

  levels.forEach((level, index) => {
    console.debug('[levelRenderer] Creating level box', level.id);
    const box = document.createElement("div");
    let status = 'locked';
    if (index + 1 < reached) {
      status = 'passed';
    } else if (index + 1 === reached) {
      status = 'unlocked';
    }
    box.className = `level-box ${status}`;
    box.dataset.level = index + 1;

    let icon = "";
    if (status === "locked") icon = "\uD83D\uDD12"; // 🔒
    else if (status === "unlocked") icon = "\uD83D\uDD13"; // 🔓
    else if (status === "passed") icon = "\u2705"; // ✅

    box.innerHTML = `
      <span class="level-icon">${icon}</span>
      <div class="level-text">
        <strong>Level ${index + 1}</strong><br/>
        <span>${level.title}</span>
      </div>
    `;
    box.addEventListener("click", () => {
      try {
        if (box.classList.contains("locked")) {
          alert("This level is locked.");
        } else {
          window.location.href = `./levels/level${index + 1}.html`;
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
