
const theoryData = [
  { id: '13_1', label: 'P1', title: 'User-defined data types', layers: [true, true, true] },
  { id: '13_2', label: 'P2', title: 'File organisation', layers: [true, true, false] },
  { id: '13_3', label: 'P3', title: 'Floating-point numbers', layers: [true, false, false] },
  { id: '14_1', label: 'P4', title: 'Protocols', layers: [false, false, false] },
  { id: '14_2', label: 'P5', title: 'Switching', layers: [true, false, true] },
  { id: '15_1', label: 'P6', title: 'Processors', layers: [false, false, true] },
  { id: '15_2', label: 'P7', title: 'Boolean Algebra', layers: [true, true, false] },
  { id: '15_3', label: 'P8', title: 'OS', layers: [true, true, true] },
  { id: '15_4', label: 'P9', title: 'Translation Software', layers: [false, true, false] },
  { id: '15_5', label: 'P10', title: 'Encryption', layers: [false, false, false] }
];

const levelData = Array.from({ length: 16 }, (_, i) => {
  const level = i + 1;
  return {
    number: level,
    title: `Level ${level}`,
    link: `pages/levels/level${level}.html`,
    done: level === 1,
    unlocked: level === 2 || level === 3
  };
});

const theoryContainer = document.getElementById("theory-points");
theoryData.forEach(point => {
  const a = document.createElement("a");
  a.href = `pages/theory/${point.id}.html`;
  a.className = "theory-point";
  a.setAttribute("data-title", point.title);

  const layersDone = point.layers;
  const doneCount = layersDone.filter(l => l).length;

  if (doneCount === 3) {
    a.classList.add("completed");
  } else if (doneCount > 0) {
    a.classList.add("partial");
  }

  for (let i = 0; i < 3; i++) {
    const layer = document.createElement("div");
    layer.className = `layer layer${i + 1}`;
    a.appendChild(layer);
  }

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = point.label;
  a.appendChild(label);

  theoryContainer.appendChild(a);
});

const levelContainer = document.getElementById("programming-levels");
levelData.forEach((level, index) => {
  const box = document.createElement("div");
  box.className = "level-box";
  box.textContent = `${level.done ? "✅" : level.unlocked ? "🔓" : "🔒"} ${level.title}`;

  if (level.done || level.unlocked) {
    box.classList.add("unlocked");
    box.addEventListener("click", () => {
      window.location.href = level.link;
    });
  } else {
    box.classList.add("locked");
  }

  const progress = document.createElement("div");
  progress.className = `level-progress ${level.done ? "done" : level.unlocked ? "unlocked" : "locked"}`;

  const bar = document.createElement("div");
  bar.className = "bar";
  progress.appendChild(bar);
  box.appendChild(progress);

  levelContainer.appendChild(box);

  if (index < levelData.length - 1) {
    const arrow = document.createElement("div");
    arrow.innerHTML = `
      <svg class="arrow-down" viewBox="0 0 100 50">
        <path d="M0,0 Q50,50 100,0" stroke="#888" stroke-width="4" fill="none"/>
      </svg>`;
    levelContainer.appendChild(arrow);
  }
});
