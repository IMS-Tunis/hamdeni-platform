export async function renderTheoryPoints() {
  console.log("📦 Loading theory points from index.json...");
  const studentId = localStorage.getItem("student_id");

  if (!studentId) {
    console.warn("🚫 No student logged in. Rendering default grey boxes.");
  }

  // Step 1: Load point metadata
  let points = [];
  try {
    const response = await fetch("./points/index.json");
    if (!response.ok) throw new Error("Failed to load index.json");
    points = await response.json();
  } catch (err) {
    console.error("❌ Error loading index.json:", err);
    return;
  }

  // Step 2: Load progress from Supabase (if logged in)
  let progressMap = {};
  if (studentId) {
    try {
      const { data, error } = await fetchProgress(studentId);
      if (error) throw error;

      data.forEach(entry => {
        progressMap[entry.point_id] = entry;
      });
    } catch (err) {
      console.error("❌ Failed to fetch Supabase progress:", err);
    }
  }

  // Step 3: Render theory boxes
  const container = document.getElementById("theory-points");
  if (!container) {
    console.error("❌ theory-points container not found");
    return;
  }

  points.forEach(point => {
    const entry = progressMap[point.id] || {};
    const layerStates = [
      entry.layer1_done ? "green" : "grey",
      entry.layer2_done ? "green" : "grey",
      entry.layer3_done ? "green" : "grey",
      entry.layer4_done ? "green" : "grey"
    ];

    const box = document.createElement("div");
    box.className = "theory-box theory-clickable";
    box.innerHTML = `
      <h3>${point.title}</h3>
      <div class="progress-bar">
        <div class="segment ${layerStates[0]}"></div>
        <div class="segment ${layerStates[1]}"></div>
        <div class="segment ${layerStates[2]}"></div>
        <div class="segment ${layerStates[3]}"></div>
      </div>
      <div class="labels">
        <span>Basic Understanding</span>
        <span>Exam-Style</span>
        <span>Past Paper</span>
        <span>Test</span>
      </div>
    `;
    box.onclick = () => {
      localStorage.setItem("current_point", point.id);
      window.location.href = `./points/${point.id}/layer1.html`;
    };
    container.appendChild(box);
  });
}

async function fetchProgress(studentId) {
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
  const url = `https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/a_theory_progress?select=*&studentid=eq.${studentId}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });

  const data = await res.json();
  return { data };
}