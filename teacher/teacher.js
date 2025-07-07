
import { supabase } from '../supabaseClient.js';

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

let selectedStudent = null;
let selectedPlatform = null;
let theoryPoints = [];
let programmingLevels = [];

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
      document.querySelectorAll("#student-list li").forEach(e => e.classList.remove("selected"));
      li.classList.add("selected");
      loadStudentProgress(s.username);
    };
    list.appendChild(li);
  });
};

async function loadStudentProgress(username) {
  selectedStudent = username;
  console.log('[teacher] Loading progress for', username);
  document.getElementById('student-title').textContent = "Progress of " + username;
  document.getElementById('save-progress').style.display = 'block';

  const tTable = platformTable('theory');
  const lTable = platformTable('programming');
  console.debug('[teacher] Tables used:', tTable, lTable);

  try {
    const { data: tData, error: tErr } = await supabase.from(tTable).select('*').eq('studentid', username);
    if (tErr) throw tErr;
    renderTheory(tData || []);
  } catch (err) {
    console.error('[teacher] Failed to load theory progress:', err);
  }

  try {
    const { data: lData, error: lErr } = await supabase.from(lTable).select('*').eq('studentid', username);
    if (lErr) throw lErr;
    renderLevels(lData || []);
  } catch (err) {
    console.error('[teacher] Failed to load programming progress:', err);
  }
}

function renderTheory(data) {
  const container = document.getElementById('theory-progress');
  container.innerHTML = '<h4>Theory Progress</h4>';
  theoryPoints = ["13_1","13_2","13_3","14_1","14_2","15_1","15_2","16_1","16_2","17_1","18_1","19_1","19_2","20_1","20_2"];

  theoryPoints.forEach(id => {
    const row = document.createElement('div');
    row.className = 'point-row';

    const label = document.createElement('div');
    label.className = 'point-label';
    label.textContent = "P" + (theoryPoints.indexOf(id)+1) + " – " + id;
    row.appendChild(label);

    for (let i = 1; i <= 4; i++) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.point = id;
      checkbox.dataset.layer = i;
      const found = (data || []).find(d => d.point_id === id);
      if (found && found['layer' + i + '_done']) checkbox.checked = true;
      row.appendChild(checkbox);
    }

    container.appendChild(row);
  });
}

function renderLevels(data) {
  const container = document.getElementById('programming-progress');
  container.innerHTML = '<h4>Programming Progress</h4>';
  programmingLevels = Array.from({ length: 16 }, (_, i) => i + 1);

  programmingLevels.forEach(level => {
    const row = document.createElement('div');
    row.className = 'level-row';

    const label = document.createElement('div');
    label.className = 'level-label';
    label.textContent = "Level " + level;
    row.appendChild(label);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.level = level;
    const found = (data || []).find(d => d.level_number === level);
    if (found && found.level_done) checkbox.checked = true;
    row.appendChild(checkbox);

    container.appendChild(row);
  });
}

document.getElementById('save-progress').onclick = async () => {
  if (!selectedStudent || !selectedPlatform) return alert("Select student first.");
  const tTable = platformTable('theory');
  const lTable = platformTable('programming');
  console.log('[teacher] Saving progress for', selectedStudent, 'using tables', tTable, lTable);

  document.getElementById('save-progress').disabled = true;
  const msg = document.getElementById('save-msg');
  msg.textContent = "Saving...";

  for (let point of theoryPoints) {
    console.debug('[teacher] Updating point', point);
    const pointInputs = document.querySelectorAll(`[data-point='${point}']`);
    const update = {
      studentid: selectedStudent,
      point_id: point
    };
    pointInputs.forEach(input => {
      update["layer" + input.dataset.layer + "_done"] = input.checked;
    });

    try {
      await supabase
        .from(tTable)
        .delete()
        .match({ studentid: selectedStudent.trim(), point_id: point });
      await supabase.from(tTable).insert(update);
    } catch (err) {
      console.error('[teacher] Failed updating point', point, err);
    }

  }

  for (let level of programmingLevels) {
    console.debug('[teacher] Updating level', level);
    const input = document.querySelector(`[data-level='${level}']`);
    const update = {
      studentid: selectedStudent,
      level_number: level,
      level_done: input.checked
    };

    try {
      await supabase
        .from(lTable)
        .delete()
        .match({ studentid: selectedStudent.trim(), level_number: level });
      await supabase.from(lTable).insert(update);
    } catch (err) {
      console.error('[teacher] Failed updating level', level, err);
    }

  }

  msg.textContent = "✅ Progress saved.";
  document.getElementById('save-progress').disabled = false;
  console.log('[teacher] Progress saved for', selectedStudent);
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
// Wrap in DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', () => {
  const addStudentBtn = document.getElementById('open-add-student');
  const addStudentModal = document.getElementById('add-student-modal');
  const cancelAddStudentBtn = document.getElementById('cancel-add-student');
  const addStudentForm = document.getElementById('add-student-form');
  const addStudentMsg = document.getElementById('add-student-msg');

  if (addStudentBtn) {
    addStudentBtn.onclick = () => {
      if (addStudentForm) addStudentForm.reset();
      if (addStudentMsg) addStudentMsg.textContent = '';
      if (addStudentModal) addStudentModal.style.display = 'flex';
    };
  }

  if (cancelAddStudentBtn) {
    cancelAddStudentBtn.onclick = () => {
      if (addStudentModal) addStudentModal.style.display = 'none';
    };
  }

  if (addStudentForm) {
    addStudentForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = document.getElementById('new-username').value.trim();
      const password = document.getElementById('new-password').value.trim();
      const platform = document.getElementById('new-platform').value;
      const studentid = document.getElementById('new-studentid').value.trim();

      if (!username || !password || !platform || !studentid) {
        alert('Please fill in all fields.');
        return;
      }

      try {
        const { error } = await supabase.from('students').insert({
          username,
          password,
          platform,
          studentid
        });

        if (error) throw error;

        alert('Student created successfully!');
        if (addStudentModal) addStudentModal.style.display = 'none';
      } catch (err) {
        console.error('Error creating student:', err);
        alert('Error creating student: ' + err.message);
      }
    };
  }
});
