
export function renderTheoryPoints() {
  console.log("📦 Loading theory points from index.json...");
  fetch("./points/index.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load index.json");
      return response.json();
    })
    .then(points => {
      console.log("✅ Loaded points:", points);
      const container = document.getElementById("theory-points");
      if (!container) {
        console.error("❌ theory-points container not found");
        return;
      }

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
          <div class="labels">
            <span>Basic Understanding</span>
            <span>Exam-Style Questions</span>
            <span>Past Paper Questions</span>
            <span>Test Validation</span>
          </div>
        `;
        box.onclick = () => {
          localStorage.setItem("current_point", point.id);
          window.location.href = `./points/${point.id}/layer1.html`;
        };
        container.appendChild(box);
      });
    })
    .catch(error => {
      console.error("❌ Error loading points:", error);
    });
}
