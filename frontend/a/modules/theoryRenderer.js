
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tsmzmuclrnyryuvanlxl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw"
);

export async function renderTheoryPoints() {
  const response = await fetch("../points/index.json");
  const theoryList = await response.json();
  const container = document.getElementById("theory-container");
  container.innerHTML = "";

  const student_id = localStorage.getItem("student_id");
  const platform = localStorage.getItem("platform");
  let progressData = [];

  if (student_id && platform) {
    const { data, error } = await supabase
      .from(`${platform}_theory_progress`)
      .select("*")
      .eq("studentid", student_id);

    if (data) progressData = data;
  }

  theoryList.forEach((point) => {
    const card = document.createElement("div");
    card.className = "theory-box";
    card.onclick = () => {
      localStorage.setItem("current_point_id", point.point_id);
      window.location.href = `../points/${point.point_id.toLowerCase()}/layer1.html`;
    };

    const progress = progressData.find((p) => p.point_id === point.point_id);
    const layers = ["layer1_done", "layer2_done", "layer3_done", "layer4_done"];

    let bars = layers
      .map((layer) => {
        const filled = progress?.[layer] ? "green" : "gray";
        return `<div class="segment" style="background:${filled}"></div>`;
      })
      .join("");

    card.innerHTML = `
      <div class="point-title">${point.point_id}: ${point.title}</div>
      <div class="progress-bar">${bars}</div>
    `;
    container.appendChild(card);
  });
}
