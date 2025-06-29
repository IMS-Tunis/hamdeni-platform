
document.addEventListener("DOMContentLoaded", () => {
  const theoryContainer = document.getElementById("theory-points");
  const studentNameEl = document.getElementById("student-name");
  const studentName = localStorage.getItem("student_name") || "Guest Mode";
  studentNameEl.textContent = "Computer Science Journey Progress of: " + studentName;

  fetch("points/index.json")
    .then(response => response.json())
    .then(points => {
      points.forEach(point => {
        const box = document.createElement("div");
        box.className = "theory-box";
        box.innerHTML = `
          <h3>${point.title}</h3>
          <div class="progress-bar">
            <div class="segment grey"></div>
            <div class="segment grey"></div>
            <div class="segment grey"></div>
            <div class="segment grey"></div>
          </div>
        `;
        box.onclick = () => {
          localStorage.setItem("current_point", point.id);
          window.location.href = `points/${point.id}/layer1.html`;
        };
        theoryContainer.appendChild(box);
      });
    });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });
  }
});
