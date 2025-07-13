import { SUPABASE_URL, SUPABASE_KEY } from '../../supabaseClient.js';

export async function renderTheoryPoints() {
  console.log("📦 Loading theory points from index.json...");
  const username = localStorage.getItem("username");

  if (!username) {
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
  if (username) {
    try {
      const { data, error } = await fetchProgress(username);
      if (error) throw error;

      data.forEach(entry => {
        progressMap[entry.point_id.toLowerCase()] = entry;
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
    console.debug('[theoryRenderer] Rendering point', point.id);
    const entry = progressMap[point.id.toLowerCase()] || {};
    const reached = entry.reached_layer || '0';
    const layerStates = [1, 2, 3, 4].map(n => Number(reached) >= n ? "green" : "grey");

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
        <span>Basics</span>
        <span>Application</span>
        <span>Exam-style questions</span>
        <span>Past paper questions</span>
      </div>
    `;
    box.onclick = () => {
      localStorage.setItem("current_point", point.id);
      window.location.href = `./points/${point.id}/layer1.html`;
    };
    container.appendChild(box);
    console.debug('[theoryRenderer] Added box for', point.id);
  });
  console.log('[theoryRenderer] Finished rendering theory points');
}

async function fetchProgress(username) {
  const platform = localStorage.getItem('platform');
  const tables = {
    A_Level: 'a_theory_progress',
    AS_Level: 'as_theory_progress',
    IGCSE: 'igcse_theory_progress'
  };
  const table = tables[platform];
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&username=eq.${encodeURIComponent(username)}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });

  const data = await res.json();  return { data };}