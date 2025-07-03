
import { fetchPassedLevels } from "./supabase.js";

export async function renderProgrammingLevels() {
  const container = document.getElementById("programming-levels");
  if (!container) return;

  const levels = [
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

  const passed = await fetchPassedLevels();
  const highestPassed = passed.length ? Math.max(...passed) : 0;

  levels.forEach((level, index) => {
    const num = index + 1;
    let status = "locked";
    if (passed.includes(num)) {
      status = "passed";
    } else if (num === highestPassed + 1) {
      status = "unlocked";
    }

    const box = document.createElement("div");
    box.className = `level-box ${status}`;
    box.innerHTML = `
      <strong>Level ${num}</strong><br/>
      <span>${level.title}</span>
    `;
    container.appendChild(box);

    if (index < levels.length - 1) {
      const arrow = document.createElement("img");
      arrow.src = "images/arrow.png";
      arrow.alt = "↓";
      arrow.className = "arrow-img";
      container.appendChild(arrow);
    }
  });
}
