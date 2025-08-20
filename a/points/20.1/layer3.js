import { supabase, tableName } from '../../../supabaseClient.js';

const username = localStorage.getItem('username');
const studentName = localStorage.getItem('student_name');
const platform = localStorage.getItem('platform');
const pointId = '20.1';
const progressKey = `layer3-progress-${pointId}`;

const questionContainer = document.getElementById('questions-container');
const notesList = document.getElementById('notes-list');
const exportBtn = document.getElementById('export-btn');
const layer4Btn = document.getElementById('layer4-btn');
const notesTitle = document.getElementById('notes-title');

let totalQuestions = 0;
const savedNotes = new Set();

if (username && notesTitle) {
  notesTitle.textContent = `📝 ${username}'s Notes`;
}

if (studentName) {
  document.getElementById('student-name').textContent = '👤 ' + studentName;
}
if (platform) {
  document.getElementById('platform-name').textContent = '🎓 Platform: ' + platform;
}
document.getElementById('point-title').textContent = pointId;

async function loadSaved() {
  if (!username) return {};
  const { data, error } = await supabase
    .from(tableName('layer3'))
    .select('*')
    .eq('username', username)
    .eq('point_id', pointId.toLowerCase());
  if (error) {
    console.error('Load error', error);
    return {};
  }
  const map = {};
  (data || []).forEach(row => { map[row.question_number] = row; });
  return map;
}

function addNoteToReview(qNum, note, time) {
  if (!note) return;
  const li = document.createElement('li');
  li.textContent = `Q${qNum}: ${note}`;
  notesList.appendChild(li);
}

function checkAllNotesSaved() {
  if (layer4Btn) {
    layer4Btn.disabled = savedNotes.size < totalQuestions;
  }
}

async function updateProgress() {
  const tables = {
    A_Level: 'a_theory_progress',
    AS_Level: 'as_theory_progress',
    IGCSE: 'igcse_theory_progress'
  };
  const table = tables[platform];
  if (!username || !table) return;
  const { data: existing } = await supabase
    .from(table)
    .select('reached_layer')
    .eq('username', username)
    .eq('point_id', pointId.toLowerCase())
    .maybeSingle();
  const score = v => v === 'R' ? 4 : (parseInt(v, 10) || 0);
  if (score(existing?.reached_layer) < 3) {
    const { error } = await supabase
      .from(table)
      .upsert(
        { username, point_id: pointId.toLowerCase(), reached_layer: 3 },
        { onConflict: ['username', 'point_id'] }
      );
    if (error) console.error('Upsert error:', error);
  }
}

async function render() {
  const saved = await loadSaved();
  const lastCompleted = parseInt(localStorage.getItem(progressKey) || '0', 10);
  fetch('layer3_questions.json')
    .then(r => r.json())
    .then(questions => {
      totalQuestions = questions.length;
      questions.forEach(q => {
        const wrapper = document.createElement('div');
        wrapper.className = 'task-box';
        const savedRow = saved[q.question_number] || {};
        wrapper.innerHTML = `
          <h3>Q${q.question_number}: ${q.question}</h3>
          <textarea data-q="${q.question_number}" class="answer-text" placeholder="Your answer...">${savedRow.student_answer || ''}</textarea>
          <button class="submit-btn">Submit Answer</button>
          <div class="mark-scheme" style="display:${savedRow.student_answer ? 'block' : 'none'};"><strong>Model Answer</strong>: ${q.mark_scheme}</div>
          <textarea data-note="${q.question_number}" class="note-text" placeholder="Note what you missed in your answer, it will be saved as a personal note for future review.">${savedRow.correction_note || ''}</textarea>
          <button class="save-note-btn">Save Note</button>
        `;
        const textarea = wrapper.querySelector('.answer-text');
        const btn = wrapper.querySelector('.submit-btn');
        const ms = wrapper.querySelector('.mark-scheme');
        const noteTA = wrapper.querySelector('.note-text');
        const saveBtn = wrapper.querySelector('.save-note-btn');

        if (savedRow.student_answer) {
          textarea.disabled = true;
          btn.disabled = true;
        }
        if (savedRow.correction_note) {
          addNoteToReview(q.question_number, savedRow.correction_note, savedRow.corrected_at || savedRow.submitted_at);
          savedNotes.add(q.question_number);
        }

        btn.addEventListener('click', async () => {
          const ans = textarea.value.trim();
          if (!ans) return;
          btn.disabled = true;
          textarea.disabled = true;
          ms.style.display = 'block';
          const { data, error } = await supabase.from(tableName('layer3')).upsert({
            username,
            point_id: pointId.toLowerCase(),
            question_number: q.question_number,
            student_answer: ans,
            submitted_at: new Date().toISOString()
          }, { onConflict: ['username','point_id','question_number'] });
          if (error || !data?.length) {
            console.error('Save answer error', error);
            textarea.disabled = false;
            btn.disabled = false;
            alert('Failed to save answer.');
            return;
          }
          localStorage.setItem(progressKey, q.question_number);
          if (q.question_number >= totalQuestions) {
            localStorage.removeItem(progressKey);
          }
        });

        saveBtn.addEventListener('click', async () => {
          const note = noteTA.value.trim();
          if (!note) return;
          const { data, error } = await supabase.from(tableName('layer3')).upsert({
            username,
            point_id: pointId.toLowerCase(),
            question_number: q.question_number,
            student_answer: textarea.value.trim(),
            correction_note: note,
            corrected_at: new Date().toISOString()
          }, { onConflict: ['username','point_id','question_number'] });
          if (error || !data?.length) {
            console.error('Save note error', error);
            noteTA.disabled = false;
            saveBtn.disabled = false;
            alert('Failed to save note.');
            return;
          }
          addNoteToReview(q.question_number, note, new Date());
          savedNotes.add(q.question_number);
          checkAllNotesSaved();
          alert('The note has been successfully saved in your personalized notebook.');

        });

        questionContainer.appendChild(wrapper);
      });
      checkAllNotesSaved();
      const answered = Object.keys(saved).length;
      if (answered >= totalQuestions) {
        localStorage.removeItem(progressKey);
      } else if (lastCompleted && lastCompleted < totalQuestions) {
        const next = document.querySelector(`[data-q="${lastCompleted + 1}"]`);
        if (next) next.scrollIntoView({ behavior: 'smooth' });
      }
    });
}

exportBtn.addEventListener('click', async () => {
  const { data, error } = await supabase
    .from(tableName('layer3'))
    .select('*')
    .eq('username', username)
    .eq('point_id', pointId.toLowerCase())
    .not('correction_note', 'is', null);
  if (error) return console.error('Fetch notes error', error);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  const pdfTitle = username ? `${username}'s Layer 3 Reflection Notes` : 'Layer 3 Reflection Notes';
  doc.text(pdfTitle, 10, 20);
  const margin = 20;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin + 10;
  (data || []).forEach(row => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    const text = `Q${row.question_number} (${new Date(row.corrected_at || row.submitted_at).toLocaleString()})`;
    doc.text(text, 10, y);
    y += 6;
    const split = doc.splitTextToSize(row.correction_note || '', 180);
    if (y + split.length * 6 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(split, 10, y);
    y += split.length * 6 + 4;
  });
  doc.save(`layer3_reflection_notes_${username}.pdf`);
});

render();

if (layer4Btn) {
  layer4Btn.addEventListener('click', async () => {
    await updateProgress();
    window.location.href = 'layer4.html';
  });
}
