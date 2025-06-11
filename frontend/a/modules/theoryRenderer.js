
export function renderTheoryPoints(progressData = []) {
  const container = document.getElementById("theory-points");
  container.innerHTML = "";

  const theoryPoints = [
    { id: '13_1', title: 'User-defined data types' },
    { id: '13_2', title: 'File organisation and access' },
    { id: '13_3', title: 'Floating-point numbers' },
    { id: '14_1', title: 'Protocols' },
    { id: '14_2', title: 'Circuit and packet switching' },
    { id: '15_1', title: 'Processors and Virtual Machines' },
    { id: '15_2', title: 'Boolean Algebra and Logic Circuits' },
    { id: '16_1', title: 'Purposes of an Operating System' },
    { id: '16_2', title: 'Translation Software' },
    { id: '17_1', title: 'Encryption and Digital Certificates' },
    { id: '18_1', title: 'Artificial Intelligence' },
    { id: '19_1', title: 'Algorithms' },
    { id: '19_2', title: 'Recursion' },
    { id: '20_1', title: 'Programming Paradigms' },
    { id: '20_2', title: 'File Processing and Exception Handling' }
  ];

  for (let i = 0; i < theoryPoints.length; i++) {
    const point = theoryPoints[i];
    const row = progressData.find(p => p.point_id === point.id);
    const layers = row
      ? [row.layer1_done, row.layer2_done, row.layer3_done, row.layer4_done]
      : [false, false, false, false];

    const a = document.createElement("a");
    a.href = `pages/theory/${point.id}.html`;
    a.className = "point-box";

    const title = document.createElement("h4");
    title.textContent = `P${i + 1}: ${point.title}`;
    a.appendChild(title);

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    layers.forEach(done => {
      const segment = document.createElement("div");
      segment.className = done ? "done" : "not-done";
      bar.appendChild(segment);
    });
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
    container.appendChild(a);
  }
}
