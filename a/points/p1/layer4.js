import { supabase } from '../../../supabaseClient.js';

const studentName = localStorage.getItem('student_name');
const username = localStorage.getItem('username');
const platform = localStorage.getItem('platform');
const pointId = (location.pathname.split('/')
  .find(p => /^p\d+$/i.test(p)) || 'P1').toUpperCase();

document.getElementById('point-title').textContent = pointId;
if (studentName) {
  document.getElementById('student-name').textContent = '👤 ' + studentName;
}
if (platform) {
  document.getElementById('platform-name').textContent = '🎓 Platform: ' + platform;
}

fetch('layer4_questions.json')
  .then(r => r.json())
  .then(renderQuestions);

function renderQuestions(questions) {
  const container = document.getElementById('qa-container');
  questions.forEach((q, i) => {
    const row = document.createElement('div');
    row.className = 'qa-row';
    row.innerHTML = `
      <div class="qa-question"><strong>Q${i + 1}.</strong> ${q.question}</div>
      <div class="qa-answer">${q.answer}</div>
    `;
    container.appendChild(row);
  });
}

async function markReady() {
  const { error } = await supabase.from('a_theory_progress').upsert({
    username,
    point_id: pointId.toLowerCase(),
    reached_layer: 'R'
  }, { onConflict: ['username','point_id'] });

  const msg = document.getElementById('ready-message');
  if (error) {
    console.error('Failed to update progress', error);
    msg.textContent = '❌ Failed to inform the teacher.';
  } else {
    msg.textContent = 'The teacher has been informed that you are ready and you will sit for a validation test soon.';
  }
  msg.style.display = 'block';
}

document.getElementById('ready-btn').addEventListener('click', markReady);
