import { supabase } from '../../../supabaseClient.js';

const username = localStorage.getItem('username');
const studentName = localStorage.getItem('student_name');
const platform = localStorage.getItem('platform');
const pointId = 'P1';

const questionContainer = document.getElementById('questions-container');
const notesList = document.getElementById('notes-list');
const exportBtn = document.getElementById('export-btn');

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
    .from('a_layer3')
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

async function render() {
  const saved = await loadSaved();
  fetch('layer3_questions.json')
    .then(r => r.json())
    .then(questions => {
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
        }

        btn.addEventListener('click', async () => {
          const ans = textarea.value.trim();
          if (!ans) return;
          btn.disabled = true;
          textarea.disabled = true;
          ms.style.display = 'block';
          await supabase.from('a_layer3').upsert({
            username,
            point_id: pointId.toLowerCase(),
            question_number: q.question_number,
            student_answer: ans,
            submitted_at: new Date().toISOString()
          }, { onConflict: ['username','point_id','question_number'] });
        });

        saveBtn.addEventListener('click', async () => {
          const note = noteTA.value.trim();
          if (!note) return;
          await supabase.from('a_layer3').upsert({
            username,
            point_id: pointId.toLowerCase(),
            question_number: q.question_number,
            student_answer: textarea.value.trim(),
            correction_note: note,
            corrected_at: new Date().toISOString()
          }, { onConflict: ['username','point_id','question_number'] });
          addNoteToReview(q.question_number, note, new Date());
        });

        questionContainer.appendChild(wrapper);
      });
    });
}

exportBtn.addEventListener('click', async () => {
  const { data, error } = await supabase
    .from('a_layer3')
    .select('*')
    .eq('username', username)
    .eq('point_id', pointId.toLowerCase())
    .not('correction_note', 'is', null);
  if (error) return console.error('Fetch notes error', error);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Layer 3 Reflection Notes', 10, 20);
  let y = 30;
  (data || []).forEach(row => {
    const text = `Q${row.question_number}`;
    doc.text(text, 10, y);
    y += 6;
    const split = doc.splitTextToSize(row.correction_note || '', 180);
    doc.text(split, 10, y);
    y += split.length * 6 + 4;
  });
  doc.save(`layer3_reflection_notes_${username}.pdf`);
});

render();
