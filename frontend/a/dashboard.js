
const theoryPoints = [
  { id: '13_1', title: 'User-defined data types', layers: [true, true, true, true] },
  { id: '13_2', title: 'File organisation and access', layers: [true, true, false, false] },
  { id: '13_3', title: 'Floating-point numbers', layers: [true, false, false, false] },
  { id: '14_1', title: 'Protocols', layers: [false, false, false, false] },
  { id: '14_2', title: 'Circuit and packet switching', layers: [true, false, true, false] },
  { id: '15_1', title: 'Processors and Virtual Machines', layers: [true, true, false, true] },
  { id: '15_2', title: 'Boolean Algebra and Logic Circuits', layers: [true, true, true, true] },
  { id: '16_1', title: 'Purposes of an Operating System', layers: [true, false, false, false] },
  { id: '16_2', title: 'Translation Software', layers: [false, true, false, false] },
  { id: '17_1', title: 'Encryption and Digital Certificates', layers: [false, false, false, false] },
  { id: '18_1', title: 'Artificial Intelligence', layers: [false, false, false, false] },
  { id: '19_1', title: 'Algorithms', layers: [false, false, false, false] },
  { id: '19_2', title: 'Recursion', layers: [false, false, false, false] },
  { id: '20_1', title: 'Programming Paradigms', layers: [false, false, false, false] },
  { id: '20_2', title: 'File Processing and Exception Handling', layers: [false, false, false, false] }
];

const levels = [
  "Introduction", "Basic I/O", "Conditionals", "Loops",
  "List", "String", "Functions", "OOP",
  "Files and Exception", "Recursion", "Search Algorithms", "Sort Algorithms",
  "Linked Lists", "Stacks and Queues", "Binary Trees", "Implement ADT from ADT"
];

// === THEORY POINTS ===
const theoryContainer = document.getElementById("theory-points");
theoryPoints.forEach((point, i) => {
  const a = document.createElement("a");
  a.href = `pages/theory/${point.id}.html`;
  a.className = "point-box";

  const title = document.createElement("h4");
  title.textContent = `P${i + 1}: ${point.title}`;
  a.appendChild(title);

  const bar = document.createElement("div");
  bar.className = "progress-bar";
  point.layers.forEach(done => {
    const segment = document.createElement("div");
    segment.className = done ? "done" : "not-done";
    bar.appendChild(segment);
  });
  if (point.layers.every(x => x)) {
    bar.classList.add("complete");
  }
  a.appendChild(bar);

  const labels = document.createElement("div");
  labels.className = "progress-labels";
  labels.innerHTML = `
    <span>Basic Understanding</span>
    <span>Exam-Style Questions</span>
    <span>Past Paper Questions</span>
    <span>Test Validation</span>
  `;
  a.appendChild(labels);
  theoryContainer.appendChild(a);
});

// === PROGRAMMING LEVELS ===
const levelContainer = document.getElementById("programming-levels");
levels.forEach((title, i) => {
  const levelNum = i + 1;
  const levelBox = document.createElement("div");
  levelBox.className = "level-box unlocked";
  levelBox.style.background = "#4CAF50";
  levelBox.setAttribute("data-status", "✅");
  levelBox.onclick = () => window.location.href = `pages/levels/level${levelNum}.html`;

  levelBox.innerHTML = `<h4>Level ${levelNum}</h4><p>${title}</p>`;
  levelContainer.appendChild(levelBox);

  if (levelNum < levels.length) {
    const arrow = document.createElement("div");
    arrow.className = "arrow-down";
    arrow.innerHTML = '<svg viewBox="0 0 100 50"><path d="M0,0 Q50,50 100,0" stroke="#888" stroke-width="4" fill="none"/></svg>';
    levelContainer.appendChild(arrow);
  }
});

// === LOGIN LOGIC ===
document.addEventListener("DOMContentLoaded", function () {
  const student = localStorage.getItem("studentId");
  if (student) {
    document.getElementById("student-name-bar").textContent = "Computer Science Journey progress of " + student;
  }
});

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
    location.reload();
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  localStorage.removeItem("studentId");
  location.reload();
}
