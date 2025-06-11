
export function renderProgrammingLevels(progressData = []) {
  const container = document.getElementById("programming-levels");
  container.innerHTML = "";

  const levels = [
    "Introduction", "Basic I/O", "Conditionals", "Loops",
    "List", "String", "Functions", "OOP",
    "Files and Exception", "Recursion", "Search Algorithms", "Sort Algorithms",
    "Linked Lists", "Stacks and Queues", "Binary Trees", "Implement ADT from ADT"
  ];

  const levelMap = {};
  progressData.forEach(p => {
    levelMap[p.level_number] = p.level_done;
  });

  for (let i = 0; i < levels.length; i++) {
    const levelNum = i + 1;
    const isDone = levelMap[levelNum] === true;

    const levelBox = document.createElement("div");
    levelBox.className = isDone ? "level-box unlocked" : "level-box locked";
    levelBox.setAttribute("data-status", isDone ? "✅" : "🔒");
    levelBox.onclick = () => window.location.href = `pages/levels/level${levelNum}.html`;

    levelBox.innerHTML = `<h4>Level ${levelNum}</h4><p>${levels[i]}</p>`;
    container.appendChild(levelBox);

    if (levelNum < levels.length) {
      const arrow = document.createElement("div");
      arrow.className = "arrow-down";
      arrow.innerHTML = '<svg viewBox="0 0 100 50"><path d="M0,0 Q50,50 100,0" stroke="#888" stroke-width="4" fill="none"/></svg>';
      container.appendChild(arrow);
    }
  }
}
