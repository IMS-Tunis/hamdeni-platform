
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("theory-points");
  const studentId = localStorage.getItem("student_id");
  const studentName = localStorage.getItem("student_name");
  document.getElementById("student-name").textContent = "👤 " + (studentName || "Guest");

  fetch("points/index.json")
    .then(response => response.json())
    .then(points => {
      if (!studentId) {
        renderDefaultBoxes(points);
      } else {
        fetch(`https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/progress?student_id=eq.${studentId}`, {
          headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw'
          }
        })
        .then(res => res.json())
        .then(progressData => {
          renderBoxesWithProgress(points, progressData);
        });
      }
    });

  function renderDefaultBoxes(points) {
    points.forEach((point, i) => {
      const box = createBox(point, i + 1, null);
      container.appendChild(box);
    });
  }

  function renderBoxesWithProgress(points, progressData) {
    points.forEach((point, i) => {
      const progress = progressData.find(p => p.point_id === point.id.toUpperCase());
      const box = createBox(point, i + 1, progress);
      container.appendChild(box);
    });
  }

  function createBox(point, number, progress) {
    const div = document.createElement("div");
    div.className = "point-box";

    const title = document.createElement("h3");
    title.textContent = `P${number}: ${point.title}`;

    const link = document.createElement("a");
    link.href = `points/${point.id}/layer1.html`;
    link.textContent = "Start";

    const bar = document.createElement("div");
    bar.className = "progress-bar";

    const layers = ["layer1_passed", "layer2_passed", "layer3_passed", "layer4_passed"];
    let completed = 0;
    if (progress) {
      completed = layers.reduce((acc, key) => acc + (progress[key] ? 1 : 0), 0);
    }

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = `${(completed / 4) * 100}%`;
    bar.appendChild(fill);

    div.appendChild(title);
    div.appendChild(link);
    div.appendChild(bar);
    return div;
  }
});
