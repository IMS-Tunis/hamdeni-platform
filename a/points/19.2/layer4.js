import { supabase, tableName } from '../../../supabaseClient.js';

const studentName = localStorage.getItem('student_name');
const username = localStorage.getItem('username');
const platform = localStorage.getItem('platform');
const pointId = (location.pathname.split('/')
  .find(p => /^p\d+$/i.test(p)) || '19.2').toUpperCase();
const readyKey = `${pointId.toLowerCase()}_layer4_ready`;

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

    const question = document.createElement('div');
    question.className = 'qa-question';
    question.innerHTML = `<strong>Q${i + 1}.</strong> ${q.question}<br>`;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Show Answer';
    toggleBtn.className = 'toggle-answer-btn';
    question.appendChild(toggleBtn);

    const answer = document.createElement('div');
    answer.className = 'qa-answer';
    answer.textContent = q.answer;
    answer.style.display = 'none';

    toggleBtn.addEventListener('click', () => {
      const show = answer.style.display === 'none';
      answer.style.display = show ? 'block' : 'none';
      toggleBtn.textContent = show ? 'Hide Answer' : 'Show Answer';
    });

    row.appendChild(question);
    row.appendChild(answer);
    container.appendChild(row);
  });
}

async function markReady() {
  const { data: existing } = await supabase
    .from(tableName('theory_progress'))
    .select('reached_layer')
    .eq('username', username)
    .eq('point_id', pointId.toLowerCase())
    .maybeSingle();
  const score = v => v === 'R' ? 4 : (parseInt(v, 10) || 0);
  let error = null;
  if (score(existing?.reached_layer) < 4) {
    ({ error } = await supabase.from(tableName('theory_progress')).upsert({
      username,
      point_id: pointId.toLowerCase(),
      reached_layer: 'R'
    }, { onConflict: ['username','point_id'] }));
  }

  const btn = document.getElementById('ready-btn');
  const msg = document.getElementById('ready-message');
  if (error) {
    console.error('Failed to update progress', error);
    msg.textContent = '❌ Failed to inform the teacher.';
    btn.disabled = false;
  } else {
    msg.textContent = 'The teacher has been informed that you are ready for the test. You will sit for a validation test soon.';
    localStorage.setItem(readyKey, 'true');
  }
  msg.style.display = 'block';
}

const readyBtn = document.getElementById('ready-btn');
const readyMsg = document.getElementById('ready-message');

if (localStorage.getItem(readyKey)) {
  readyBtn.disabled = true;
  readyMsg.textContent = 'The teacher has been informed that you are ready for the test. You will sit for a validation test soon.';
  readyMsg.style.display = 'block';
}

readyBtn.addEventListener('click', () => {
  readyBtn.disabled = true;
  markReady();
});
