
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("theory-points");
  fetch("points/index.json")
    .then(response => response.json())
    .then(points => {
      points.forEach((point, i) => {
        const link = document.createElement("a");
        link.href = `points/${point.id}/layer1.html`;
        link.textContent = `P${i + 1}: ${point.title}`;
        link.className = "point-box";
        container.appendChild(link);
      });
    });
});
