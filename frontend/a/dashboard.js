
document.addEventListener("DOMContentLoaded", function () {
  const student = localStorage.getItem("studentId");
  if (student) {
    const nameBar = document.getElementById("student-name-bar");
    if (nameBar) {
      nameBar.textContent = "Computer Science Journey progress of " + student;
    }
  }

  renderTheoryPoints();
  renderProgrammingLevels();
});

function renderTheoryPoints() {
  const data = [
    { id: "P1", title: "User-defined data types", progress: 4 },
    { id: "P2", title: "File organisation and access", progress: 3 },
    { id: "P3", title: "Floating-point numbers", progress: 1 },
    { id: "P4", title: "Bitwise operations", progress: 0 }
  ];
  const container = document.getElementById("theory-points");
  container.innerHTML = "";
  data.forEach((item) => {
    const box = document.createElement("div");
    box.className = "point-box";
    const title = document.createElement("h3");
    title.textContent = `${item.id}: ${item.title}`;
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.innerHTML = item.progress === 4 ? "✅" : "";

    for (let i = 0; i < 4; i++) {
      const segment = document.createElement("div");
      segment.className = "segment";
      segment.style.backgroundColor = i < item.progress ? "#4caf50" : "#ccc";
      bar.appendChild(segment);
    }

    const labels = document.createElement("div");
    labels.className = "progress-labels";
    labels.innerHTML = `
      <span>Basic Understanding</span>
      <span>Exam-Style Questions</span>
      <span>Past Paper Questions</span>
      <span>Test Validation</span>
    `;

    box.appendChild(title);
    box.appendChild(bar);
    box.appendChild(labels);
    box.appendChild(tick);
    container.appendChild(box);
  });
}

function renderProgrammingLevels() {
  const levels = [
    "Introduction", "Basic I/O", "Conditionals", "Loops",
    "Functions", "Arrays", "Strings", "Data structures",
    "Recursion", "File handling", "Object-Oriented 1", "Object-Oriented 2",
    "Algorithms", "Searching & Sorting", "Advanced Projects", "Final Challenge"
  ];
  const container = document.getElementById("programming-levels");
  container.innerHTML = "";
  levels.forEach((title, index) => {
    const box = document.createElement("div");
    box.className = "level-box";
    box.innerHTML = `
      <a href="level${index + 1}.html">
        <div class="level-header">Level ${index + 1}</div>
        <div class="level-sub">${title}</div>
      </a>
      <div class="connector">${index < levels.length - 1 ? "⭣" : ""}</div>
    `;
    container.appendChild(box);
  });
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const response = await fetch("https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/students?select=*", {
    headers: {
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw"
    }
  });
  const users = await response.json();
  const match = users.find(u => u.username === username && u.password === password);
  if (match) {
    localStorage.setItem("studentId", username);
    localStorage.setItem("platform", match.platform);
    location.reload();
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}
