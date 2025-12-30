
import { fetchProgressCounts } from "./supabase.js";
import { showWarning } from "../../shared/guestWarning.js";

export const levels = [
    { title: "Basic Constructs", id: "level1", status: "locked" },
    { title: "Selection", id: "level2", status: "locked" },
    { title: "Loops", id: "level3", status: "locked" },
    { title: "Arrays", id: "level4", status: "locked" },
    { title: "Strings", id: "level5", status: "locked" },
    { title: "Files", id: "level6", status: "locked" },
    { title: "Functions", id: "level7", status: "locked" },
    { title: "Procedures", id: "level8", status: "locked" },
    { title: "Advanced Problem Solving", id: "level9", status: "locked" },
    { title: "Comprehensive problems", id: "level10", status: "locked" }
  ];

export async function renderProgrammingLevels() {
  console.log('[levelRenderer] Rendering programming levels');
  const container = document.getElementById("programming-levels");
  if (!container) {
    console.error('[levelRenderer] programming-levels container not found');
    return;
  }

  const progress = await fetchProgressCounts();
  const guestAccess = !localStorage.getItem('username');
  let reached = Number(progress?.levels ?? 0);
  if (!Number.isFinite(reached)) {
    reached = 0;
  }
  if (reached < 1) {
    reached = 1;
  }
  if (guestAccess) {
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
        if (guestAccess && index + 1 > 1) {
          showWarning("You must log in to see content.");
          return;
        }
        if (box.classList.contains("locked")) {
          showWarning("This level is locked.");
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
