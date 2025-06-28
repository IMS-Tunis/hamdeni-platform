
document.addEventListener("DOMContentLoaded", () => {
  const theoryContainer = document.getElementById("theory-points");
  const levelContainer = document.getElementById("programming-levels");
  const studentName = localStorage.getItem("student_name") || "Guest";
  document.getElementById("student-name").textContent = "👤 " + studentName;

  fetch("points/index.json")
    .then(res => res.json())
    .then(points => {
      points.forEach((point, i) => {
        const div = document.createElement("div");
        div.className = "point-box";

        const title = document.createElement("h3");
        title.textContent = `P${i + 1}: ${point.title}`;

        const link = document.createElement("a");
        link.href = `points/${point.id}/layer1.html`;
        link.textContent = "Start";

        const bar = document.createElement("div");
        bar.className = "progress-bar";
        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = "0%";
        bar.appendChild(fill);

        div.appendChild(title);
        div.appendChild(link);
        div.appendChild(bar);
        theoryContainer.appendChild(div);
      });

      for (let i = 1; i <= 16; i++) {
        const level = document.createElement("div");
        level.className = "level-box";
        level.textContent = "Level " + i;
        levelContainer.appendChild(level);
      }
    });
});
