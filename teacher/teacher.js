
import { supabase, tableName } from '../supabaseClient.js';
import { levels as levelDefs } from '../a/modules/levelRenderer.js';

console.log('[teacher] teacher.js loaded');

const TEACHER_PASSWORD = 'wxcv';

if (!localStorage.getItem("teacher-auth")) {
  const pass = prompt("Enter teacher password:");
  if (pass !== TEACHER_PASSWORD) {
    alert("Access denied.");
    window.location.href = "/index.html";
  } else {
    localStorage.setItem("teacher-auth", "1");
  }
}

let selectedStudent = null; // { id, username }
let selectedPlatform = null;
let theoryPoints = [];
let programmingLevels = [];
let currentStudents = [];
let gradesChart = null;

const LAYER_WEIGHTS = Object.freeze({
  0: 0,
  1: 1,
  2: 3,
  3: 6,
  4: 10
});

function parseLayerValue(value) {
  if (typeof value === 'string' && value.trim().toUpperCase() === 'R') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function weightForLayer(value) {
  const parsed = parseLayerValue(value);
  return LAYER_WEIGHTS[parsed] ?? 0;
}

function platformLabel(value) {
  return value ? value.replace(/_/g, ' ') : '';
}

// All platforms now store theory progress using a single
// `reached_layer` column. Previously only the A Level table
// used this format which caused the teacher dashboard to
// mis-handle AS Level and IGCSE students. Treat every
// platform as using `reached_layer` so the dashboard loads
// and saves progress correctly.
function usesReachedLayer() {
  return true;
}

// Programming progress now uses a single reached_level column for every
// platform. Previously AS Level stored one row per level which caused
// inconsistencies when loading or saving progress.
function reachedLevelPlatform() {
  return (
    selectedPlatform === 'A_Level' ||
    selectedPlatform === 'IGCSE' ||
    selectedPlatform === 'AS_Level'
  );
}

const showGradesBtn = document.getElementById('show-term-grades');
const gradesModal = document.getElementById('grades-modal');
const closeGradesBtn = document.getElementById('close-grades');
const gradesPlatformLabel = document.getElementById('grades-platform-label');
const gradesTableContainer = document.getElementById('grades-table-container');

if (showGradesBtn) showGradesBtn.disabled = true;

document.getElementById('load-students').onclick = async () => {
  selectedPlatform = document.getElementById('platform').value;
  console.log('[teacher] Loading students for', selectedPlatform);
  let students = [];
  let error = null;
  try {
    const res = await supabase
      .from('students')
      .select('*')
      .eq('platform', selectedPlatform);
    students = res.data;
    error = res.error;
  } catch (err) {
    error = err;
  }

  const list = document.getElementById('student-list');
  const msg = document.getElementById('load-msg');
  msg.textContent = '';
  list.innerHTML = '';
  currentStudents = [];
  if (showGradesBtn) showGradesBtn.disabled = true;

  if (error) {
    console.error('Failed to fetch students:', error);
    msg.textContent = '❌ Unable to load students.';
    return;
  }

  if (!students || students.length === 0) {
    msg.textContent = 'No students found.';
    console.warn('[teacher] No students returned for', selectedPlatform);
    return;
  }

  console.log(`[teacher] Loaded ${students.length} students`);
  currentStudents = students;
  if (showGradesBtn) showGradesBtn.disabled = students.length === 0;

  students.forEach(s => {
    console.debug('[teacher] Adding student to list:', s.username);
    const li = document.createElement('li');
    li.textContent = s.username;
    li.onclick = () => {
      document.querySelectorAll('#student-list li').forEach(e => e.classList.remove('selected'));
      li.classList.add('selected');
      loadStudentProgress(s);
    };
    list.appendChild(li);
  });
};

async function loadStudentProgress(student) {
  selectedStudent = { id: student.id, username: student.username };
  const username = student.username;
  console.log('[teacher] Loading progress for', username);
  document.getElementById('student-title').textContent = "Progress of " + username;
  document.getElementById('save-progress').style.display = 'block';

  const tTable = platformTable('theory');
  const lTable = platformTable('programming');
  console.debug('[teacher] Tables used:', tTable, lTable);

  try {
    const { data: tData, error: tErr } = await supabase
      .from(tTable)
      .select('*')
      .eq('username', username);
    if (tErr) throw tErr;
    await renderTheory(tData || []);
  } catch (err) {
    console.error('[teacher] Failed to load theory progress:', err);
  }

  try {
    const { data: lData, error: lErr } = await supabase
      .from(lTable)
      .select('*')
      .eq('username', username);
    if (lErr) throw lErr;
    renderLevels(lData || []);
  } catch (err) {
    console.error('[teacher] Failed to load programming progress:', err);
  }
}

async function renderTheory(data) {
  const container = document.getElementById('theory-progress');
  container.innerHTML = '<h4>Theory Progress</h4>';

  // Determine which points index to load based on the selected platform
  const dirMap = { A_Level: 'a', AS_Level: 'as', IGCSE: 'igcse' };
  const platformDir = dirMap[selectedPlatform] || 'a';
  const indexPath = `../${platformDir}/points/index.json`;

  let points = [];
  try {
    const res = await fetch(indexPath);
    if (!res.ok) throw new Error('Failed to load index.json');
    points = await res.json();
  } catch (err) {
    console.error('[teacher] Error loading point index:', err);
    container.insertAdjacentText('beforeend', ' Unable to load points.');
    return;
  }

  theoryPoints = points.map(p => p.id);

  points.forEach((point, idx) => {
    const id = point.id;
    const row = document.createElement('div');
    row.className = 'point-row';

    const label = document.createElement('div');
    label.className = 'point-label';
    label.textContent = point.title || `P${idx + 1} – ${id}`;
    row.appendChild(label);

    for (let i = 1; i <= 4; i++) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.point = id;
      checkbox.dataset.layer = i;
      const found = (data || []).find(
        d => d.point_id && d.point_id.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        if (usesReachedLayer()) {
          const raw = found.reached_layer;
          const reached = raw === 'R' ? 3 : parseInt(raw, 10);
          if (reached >= i) checkbox.checked = true;
        } else if (found[`layer${i}_done`]) {
          checkbox.checked = true;
        }
      }
      row.appendChild(checkbox);
    }

    container.appendChild(row);
  });
}

function renderLevels(data) {
  const container = document.getElementById('programming-progress');
  container.innerHTML = '<h4>Programming Progress</h4>';
  programmingLevels = levelDefs.map((_, i) => i + 1);

  // Determine progress using a single reached_level value for every platform.
  let reached = 0;
  if (reachedLevelPlatform()) {
    const raw = data[0]?.reached_level || 0;
    reached = raw === 'R' ? 3 : parseInt(raw, 10);
  }

  levelDefs.forEach((lvl, idx) => {
    const row = document.createElement('div');
    row.className = 'level-row';

    const label = document.createElement('div');
    label.className = 'level-label';
    label.textContent = `Level ${idx + 1} – ${lvl.title}`;
    row.appendChild(label);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.level = idx + 1;

    if (reachedLevelPlatform()) {
      if (idx + 1 <= reached) checkbox.checked = true;
    } else {
      const found = data.find(d => d.level_number === idx + 1);
      if (found?.level_done) checkbox.checked = true;
    }

    row.appendChild(checkbox);
    container.appendChild(row);
  });
}

document.getElementById('save-progress').onclick = async () => {
  if (!selectedStudent || !selectedPlatform) return alert("Select student first.");
  const tTable = platformTable('theory');
  const lTable = platformTable('programming');
  console.log('[teacher] Saving progress for', selectedStudent.username, 'using tables', tTable, lTable);

  document.getElementById('save-progress').disabled = true;
  const msg = document.getElementById('save-msg');
  msg.textContent = "Saving...";

  for (let point of theoryPoints) {
    console.debug('[teacher] Updating point', point);
    const pointInputs = document.querySelectorAll(`[data-point='${point}']`);
    let reached_layer = '0';
    pointInputs.forEach(input => {
      if (input.checked) {
        if (parseInt(input.dataset.layer, 10) > parseInt(reached_layer, 10)) {
          reached_layer = input.dataset.layer;
        }
      }
    });

    try {
      if (usesReachedLayer()) {
        await supabase
          .from(tTable)
          .upsert(
            {
              username: selectedStudent.username,
              point_id: point.toLowerCase(),
              reached_layer
            },
            { onConflict: 'username,point_id' }
          );
      } else {
        const update = { username: selectedStudent.username, point_id: point.toLowerCase() };
        for (let i = 1; i <= 4; i++) {
          const input = document.querySelector(`[data-point='${point}'][data-layer='${i}']`);
          update[`layer${i}_done`] = input.checked;
        }
        await supabase
          .from(tTable)
          .upsert(update, { onConflict: 'username,point_id' });
      }
    } catch (err) {
      console.error('[teacher] Failed updating point', point, err);
    }

  }

  let maxLevel = 0;
  for (let level of programmingLevels) {
    const input = document.querySelector(`[data-level='${level}']`);
    if (input.checked) maxLevel = level;
  }

  try {
    await supabase
      .from(lTable)
      .upsert(
        {
          username: selectedStudent.username,
          reached_level: maxLevel
        },
        { onConflict: 'username' }
      );
  } catch (err) {
    console.error('[teacher] Failed saving reached_level', err);
  }

  msg.textContent = "✅ Progress saved.";
  document.getElementById('save-progress').disabled = false;
  console.log('[teacher] Progress saved for', selectedStudent.username);
};


function platformTable(type) {
  const map = {
    A_Level: {
      theory: 'a_theory_progress',
      programming: 'a_programming_progress'
    },
    AS_Level: {
      theory: 'as_theory_progress',
      programming: 'as_programming_progress'
    },
    IGCSE: {
      theory: 'igcse_theory_progress',
      programming: 'igcse_programming_progress'
    }
  };
  return map[selectedPlatform][type];
}

// Add Student modal handlers
const addStudentBtn = document.getElementById('open-add-student');
const addStudentModal = document.getElementById('add-student-modal');
const cancelAddStudentBtn = document.getElementById('cancel-add-student');
const addStudentForm = document.getElementById('add-student-form');
const addStudentMsg = document.getElementById('add-student-msg');

if (addStudentBtn) {
  addStudentBtn.onclick = () => {
    addStudentForm.reset();
    addStudentMsg.textContent = '';
    addStudentModal.style.display = 'flex';
  };
}

if (closeGradesBtn) {
  closeGradesBtn.onclick = () => {
    if (gradesModal) gradesModal.style.display = 'none';
  };
}

if (gradesModal) {
  gradesModal.addEventListener('click', evt => {
    if (evt.target === gradesModal) {
      gradesModal.style.display = 'none';
    }
  });
}

document.addEventListener('keydown', evt => {
  if (evt.key === 'Escape' && gradesModal && gradesModal.style.display === 'flex') {
    gradesModal.style.display = 'none';
  }
});

if (showGradesBtn) {
  showGradesBtn.onclick = async () => {
    if (!selectedPlatform) {
      alert('Select a platform and load students first.');
      return;
    }

    if (!currentStudents.length) {
      alert('No students loaded yet. Please filter students first.');
      return;
    }

    const originalLabel = showGradesBtn.textContent;
    showGradesBtn.disabled = true;
    showGradesBtn.textContent = 'Loading grades...';

    try {
      const gradeRows = await fetchTerm1Grades();
      renderGradesModal(gradeRows);
    } catch (err) {
      console.error('Failed to load Term 1 grades', err);
      alert('Unable to load Term 1 grades. Please try again later.');
    } finally {
      showGradesBtn.disabled = currentStudents.length === 0;
      showGradesBtn.textContent = originalLabel;
    }
  };
}

if (cancelAddStudentBtn) {
  cancelAddStudentBtn.onclick = () => {
    addStudentModal.style.display = 'none';
  };
}

async function fetchTerm1Grades() {
  const usernames = currentStudents.map(s => s.username);
  if (!usernames.length) return [];

  const tTable = platformTable('theory');
  const lTable = platformTable('programming');

  console.log('[teacher] Fetching Term 1 grades for', usernames.length, 'students');

  try {
    const [{ data: theoryData, error: theoryErr }, { data: levelData, error: levelErr }] = await Promise.all([
      supabase
        .from(tTable)
        .select('username, point_id, reached_layer')
        .in('username', usernames),
      supabase
        .from(lTable)
        .select('username, reached_level, level_number, level_done')
        .in('username', usernames)
    ]);

    if (theoryErr) throw theoryErr;
    if (levelErr) throw levelErr;

    return currentStudents.map(student =>
      computeTerm1Overview(student.username, theoryData || [], levelData || [])
    );
  } catch (err) {
    console.error('Error fetching Term 1 grade data:', err);
    throw err;
  }
}

function computeTerm1Overview(username, theoryRows, levelRows) {
  const normalizedUsername = typeof username === 'string' ? username.toLowerCase() : username;
  const theory = theoryRows.filter(row =>
    typeof row.username === 'string' && row.username.toLowerCase() === normalizedUsername
  );
  const levels = levelRows.filter(row =>
    typeof row.username === 'string' && row.username.toLowerCase() === normalizedUsername
  );

  if (selectedPlatform === 'IGCSE') {
    return computeIgcseGrade(username, theory, levels);
  }

  return computeLayeredGrade(username, theory, levels);
}

function computeLayeredGrade(username, theory, levels) {
  const passedPoints = theory.filter(row => String(row.reached_layer) === '4').length;
  const rawGrade = theory.reduce((total, row) => total + weightForLayer(row.reached_layer), 0);
  const term1Grade = Math.max(0, rawGrade - 1);
  const passedLevels = deriveReachedLevel(levels);

  return {
    username,
    points: passedPoints,
    levels: passedLevels,
    term1Grade
  };
}

function computeIgcseGrade(username, theory, levels) {
  const pointLayers = new Map();
  const legacyLayers = [];

  theory.forEach(record => {
    const normalizedPoint =
      typeof record.point_id === 'string' ? record.point_id.trim().toLowerCase() : record.point_id;
    const layer = parseLayerValue(record.reached_layer);

    if (!normalizedPoint) {
      legacyLayers.push(layer);
      return;
    }

    const existingLayer = pointLayers.get(normalizedPoint) ?? 0;
    if (layer > existingLayer) {
      pointLayers.set(normalizedPoint, layer);
    }
  });

  const dedupedLayers = pointLayers.size > 0 ? [...pointLayers.values()] : legacyLayers;
  const passedPoints = dedupedLayers.filter(layer => layer === 4).length;

  const pointScore = dedupedLayers.reduce((score, layer) => {
    if (layer >= 4) return score + 10;
    if (layer === 3) return score + 6;
    if (layer === 2) return score + 3;
    if (layer === 1) return score + 1;
    return score;
  }, 0);

  const passedLevels = deriveReachedLevel(levels);
  const term1Grade = Math.max(0, 20 * passedLevels + pointScore);

  return {
    username,
    points: passedPoints,
    levels: passedLevels,
    term1Grade
  };
}

function deriveReachedLevel(levelRows) {
  if (!levelRows.length) return 0;

  const maxReachedLevel = levelRows.reduce((max, row) => {
    const candidate = Number(row.reached_level);
    if (Number.isFinite(candidate) && candidate > max) {
      return candidate;
    }
    return max;
  }, 0);

  if (maxReachedLevel > 0) return maxReachedLevel;

  const completedLevels = levelRows.filter(row => row.level_done).length;
  return completedLevels;
}

function renderGradesModal(rows) {
  if (!gradesModal) return;

  const sortedRows = [...rows].sort((a, b) => b.term1Grade - a.term1Grade);

  if (gradesPlatformLabel) {
    const platformText = platformLabel(selectedPlatform);
    gradesPlatformLabel.textContent = `${platformText} · ${sortedRows.length} student${sortedRows.length === 1 ? '' : 's'}`;
  }

  if (gradesTableContainer) {
    gradesTableContainer.innerHTML = '';

    if (!sortedRows.length) {
      const emptyState = document.createElement('p');
      emptyState.textContent = 'No grades available yet for this platform.';
      gradesTableContainer.appendChild(emptyState);
    } else {
      const table = document.createElement('table');
      table.className = 'grades-table';

      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Student</th><th>Term 1 Grade</th><th>Points Completed</th><th>Programming Levels</th></tr>';
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      sortedRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.username}</td>
          <td>${Math.round(row.term1Grade)}</td>
          <td>${row.points}</td>
          <td>${row.levels}</td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      gradesTableContainer.appendChild(table);
    }
  }

  const chartCanvas = document.getElementById('grades-chart');
  if (chartCanvas && window.Chart) {
    const ctx = chartCanvas.getContext('2d');
    if (gradesChart) {
      gradesChart.destroy();
    }

    gradesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedRows.map(row => row.username),
        datasets: [
          {
            label: 'Term 1 Grade',
            data: sortedRows.map(row => row.term1Grade),
            backgroundColor: '#3498db'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Grade'
            }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label(context) {
                return `Grade: ${Math.round(context.parsed.y)}`;
              }
            }
          }
        }
      }
    });
  }

  gradesModal.style.display = 'flex';
}

if (addStudentForm) {
  addStudentForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const platform = document.getElementById('new-platform').value;

    if (!username || !password || !platform) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const { error } = await supabase.from('students').insert({
        username,
        password,
        platform
      });

      if (error) throw error;

      if (platform === 'A_Level') {
        await supabase.from(tableName('programming_progress')).insert({
          username: username,
          reached_level: 0
        });
      }

      alert('Student created successfully!');
      addStudentModal.style.display = 'none';
    } catch (err) {
      console.error('Error creating student:', err);
      alert('Error creating student: ' + err.message);
    }
  };
}
