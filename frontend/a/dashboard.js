
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
  const theoryPoints = [
    "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8",
    "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16"
  ];
  const container = document.getElementById("theory-points");
  container.innerHTML = "";
  theoryPoints.forEach((pt, index) => {
    const box = document.createElement("div");
    box.className = "point-box";
    box.textContent = pt;
    container.appendChild(box);
  });
}

function renderProgrammingLevels() {
  const container = document.getElementById("programming-levels");
  container.innerHTML = "";
  for (let i = 1; i <= 16; i++) {
    const level = document.createElement("a");
    level.className = "level-box";
    level.href = `level${i}.html`;
    level.textContent = `Level ${i}`;
    level.style.display = "block";
    level.style.marginBottom = "10px";
    container.appendChild(level);
  }
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
