
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const { SUPABASE_URL, SUPABASE_ANON_KEY, TEACHER_PASSWORD } = window.APP_CONFIG;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .eq('platform', selectedPlatform);

  if (error) {
    console.error('Failed to load students:', error);
    alert('Error loading students');
    return;
  }

  const list = document.getElementById('student-list');
  list.innerHTML = '';
  students.forEach(s => {
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
  document.getElementById('student-title').textContent = "Progress of " + username;
  document.getElementById('save-progress').style.display = 'block';

  const tTable = platformTable('theory');
  const lTable = platformTable('programming');

  const { data: tData, error: tErr } = await supabase.from(tTable).select('*').eq('studentid', username);
  if (tErr) {
    console.error('Failed to load theory progress:', tErr);
    alert('Error loading theory progress');
    return;
  }
  renderTheory(tData || []);

  const { data: lData, error: lErr } = await supabase.from(lTable).select('*').eq('studentid', username);
  if (lErr) {
    console.error('Failed to load programming progress:', lErr);
    alert('Error loading programming progress');
    return;
  }
  renderLevels(lData || []);
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

  document.getElementById('save-progress').disabled = true;
  const msg = document.getElementById('save-msg');
  msg.textContent = "Saving...";

  for (let point of theoryPoints) {
    const pointInputs = document.querySelectorAll(`[data-point='${point}']`);
    const update = {
      studentid: selectedStudent,
      point_id: point
    };
    pointInputs.forEach(input => {
      update["layer" + input.dataset.layer + "_done"] = input.checked;
    });

    const { error } = await supabase
      .from(tTable)
      .upsert(update, { onConflict: 'studentid,point_id' });
    if (error) {
      console.error('Failed to save theory progress:', error);
      msg.textContent = 'Error saving progress';
      document.getElementById('save-progress').disabled = false;
      return;
    }

  }

  for (let level of programmingLevels) {
    const input = document.querySelector(`[data-level='${level}']`);
    const update = {
      studentid: selectedStudent,
      level_number: level,
      level_done: input.checked
    };

    const { error } = await supabase
      .from(lTable)
      .upsert(update, { onConflict: 'studentid,level_number' });
    if (error) {
      console.error('Failed to save programming progress:', error);
      msg.textContent = 'Error saving progress';
      document.getElementById('save-progress').disabled = false;
      return;
    }

  }

  msg.textContent = "✅ Progress saved.";
  document.getElementById('save-progress').disabled = false;
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
