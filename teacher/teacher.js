
import { supabase } from '../supabaseClient.js';
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

function usesReachedLayer() {
  return selectedPlatform === 'A_Level';
}

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
          if (Number(found.reached_layer) >= i) checkbox.checked = true;
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

  const reached =
    selectedPlatform === 'A_Level' ? (data[0]?.reached_level || 0) : null;

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
    if (selectedPlatform === 'A_Level') {
      if (idx + 1 <= reached) checkbox.checked = true;
    } else {
      const found = (data || []).find(d => Number(d.level_number) === idx + 1);
      if (found && found.level_done) checkbox.checked = true;
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
    let reached_layer = 0;
    pointInputs.forEach(input => {
      if (input.checked) {
        reached_layer = Math.max(reached_layer, Number(input.dataset.layer));
      }
    });

    try {
      if (usesReachedLayer()) {
        await supabase
          .from(tTable)
          .upsert({
            username: selectedStudent.username,
            point_id: point.toLowerCase(),
            reached_layer
          });
      } else {
        const update = { username: selectedStudent.username, point_id: point.toLowerCase() };
        for (let i = 1; i <= 4; i++) {
          const input = document.querySelector(`[data-point='${point}'][data-layer='${i}']`);
          update[`layer${i}_done`] = input.checked;
        }
        await supabase.from(tTable).upsert(update);
      }
    } catch (err) {
      console.error('[teacher] Failed updating point', point, err);
    }

  }

  if (selectedPlatform === 'A_Level') {
    let reached = 0;
    for (let level of programmingLevels) {
      const input = document.querySelector(`[data-level='${level}']`);
      if (input.checked) reached = Math.max(reached, Number(level));
    }
    try {
      await supabase
        .from(lTable)
        .upsert(
          { username: selectedStudent.username, reached_level: reached },
          { onConflict: 'username' }
        );

    } catch (err) {
      console.error('[teacher] Failed saving reached_level', err);
    }
  } else {
    for (let level of programmingLevels) {
      console.debug('[teacher] Updating level', level);
      const input = document.querySelector(`[data-level='${level}']`);
      const update = {
        username: selectedStudent.username,
        level_number: Number(level),
        level_done: input.checked
      };

      try {
        await supabase
          .from(lTable)
          .delete()
          .match({ username: selectedStudent.username.trim(), level_number: Number(level) });
        await supabase.from(lTable).insert(update);
      } catch (err) {
        console.error('[teacher] Failed updating level', level, err);
      }
    }
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

if (cancelAddStudentBtn) {
  cancelAddStudentBtn.onclick = () => {
    addStudentModal.style.display = 'none';
  };
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
        await supabase.from('a_programming_progress').insert({
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
