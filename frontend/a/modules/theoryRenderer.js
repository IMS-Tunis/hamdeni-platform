// theoryRenderer.js - Updated with new progress bar design
export function renderTheoryPoints(theoryData = null) {
  const container = document.getElementById("theory-points");
  
  // Default theory points structure
  const defaultPoints = [
    {
      id: "p1",
      title: "P1: User-defined data types",
      stages: ["Basic Understanding", "Exam-Style Questions", "Past Paper Questions", "Test Validation"],
      completed: 4 // Example: all stages completed
    },
    {
      id: "p2", 
      title: "P2: File handling and exception handling",
      stages: ["Basic Understanding", "Exam-Style Questions", "Past Paper Questions", "Test Validation"],
      completed: 2 // Example: 2 stages completed
    },
    {
      id: "p3",
      title: "P3: Object-oriented programming",
      stages: ["Basic Understanding", "Exam-Style Questions", "Past Paper Questions", "Test Validation"], 
      completed: 0 // Example: no progress
    },
    {
      id: "p4",
      title: "P4: Algorithms and data structures",
      stages: ["Basic Understanding", "Exam-Style Questions", "Past Paper Questions", "Test Validation"],
      completed: 1 // Example: 1 stage completed
    },
    {
      id: "p5",
      title: "P5: Database concepts",
      stages: ["Basic Understanding", "Exam-Style Questions", "Past Paper Questions", "Test Validation"],
      completed: 3 // Example: 3 stages completed
    }
  ];

  const pointsToRender = theoryData || defaultPoints;
  
  container.innerHTML = pointsToRender.map(point => createPointHTML(point)).join('');
}

function createPointHTML(point) {
  const progressPercentage = (point.completed / point.stages.length) * 100;
  
  return `
    <div class="point-box">
      <h4>${point.title}</h4>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="progress-labels">
          ${point.stages.map(stage => `<span>${stage}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// Alternative function if you want to handle individual stage completion
export function createPointHTMLWithStageTracking(point) {
  // Assuming point.stageStatus is an array of booleans [true, false, false, false]
  const completedStages = point.stageStatus ? point.stageStatus.filter(Boolean).length : 0;
  const progressPercentage = (completedStages / point.stages.length) * 100;
  
  return `
    <div class="point-box">
      <h4>${point.title}</h4>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="progress-labels">
          ${point.stages.map(stage => `<span>${stage}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// Utility function to update progress for a specific point
export function updatePointProgress(pointId, completedStages) {
  const pointElement = document.querySelector(`[data-point-id="${pointId}"]`);
  if (pointElement) {
    const progressFill = pointElement.querySelector('.progress-fill');
    const progressPercentage = (completedStages / 4) * 100; // Assuming 4 stages
    progressFill.style.width = `${progressPercentage}%`;
  }
}