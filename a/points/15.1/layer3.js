import { supabase, tableName } from '../../../supabaseClient.js';

const POINT_ID = '15.1';
const QUESTION_NUMBER = 1;
const HANDWORK_BUCKET = 'layer3-handwork';
const CONFIG_PATH = 'layer3-question-config.json';

const els = {
  pointTitle: document.getElementById('point-title'),
  studentName: document.getElementById('student-name'),
  platformName: document.getElementById('platform-name'),
  questionImage: document.getElementById('question-image'),
  downloadQuestion: document.getElementById('download-question'),
  regenerateFallback: document.getElementById('regenerate-fallback'),
  onedriveLink: document.getElementById('onedrive-link'),
  submissionStatus: document.getElementById('submission-status'),
  fileInput: document.getElementById('work-upload'),
  fileDrop: document.querySelector('.file-drop'),
  previewWrapper: document.getElementById('preview-wrapper'),
  previewImage: document.getElementById('work-preview'),
  typedAnswer: document.getElementById('typed-answer'),
  submitBtn: document.getElementById('submit-answer'),
  markSchemeSection: document.getElementById('mark-scheme'),
  markSchemeList: document.getElementById('mark-scheme-list'),
  layer4Btn: document.getElementById('layer4-btn'),
  notesTitle: document.getElementById('notes-title'),
  noteInput: document.getElementById('note-input'),
  saveNoteBtn: document.getElementById('save-note-btn'),
  noteStatus: document.getElementById('note-status'),
  notesList: document.getElementById('notes-list'),
  exportBtn: document.getElementById('export-btn')
};

const username = localStorage.getItem('username') || '';
const studentName = localStorage.getItem('student_name') || '';
const platform = localStorage.getItem('platform') || '';

let layer3Table = '';
try {
  layer3Table = tableName('layer3');
} catch (err) {
  console.warn('Unable to resolve layer3 table', err);
}

const canPersist = Boolean(layer3Table && username);
const state = {
  config: null,
  selectedFile: null,
  previewUrl: '',
  submission: null
};

function initHeader() {
  if (els.pointTitle) {
    els.pointTitle.textContent = POINT_ID;
  }
  if (studentName && els.studentName) {
    els.studentName.textContent = `👤 ${studentName}`;
  }
  if (platform && els.platformName) {
    els.platformName.textContent = `🎓 Platform: ${platform}`;
  }
  if (username && els.notesTitle) {
    els.notesTitle.textContent = `📝 ${username}'s Notes`;
  }
}

function setSubmissionStatus(message, type = 'info') {
  if (!els.submissionStatus) return;
  els.submissionStatus.textContent = message || '';
  els.submissionStatus.className = type ? type : '';
}

function setNoteStatus(message, type = 'info') {
  if (!els.noteStatus) return;
  els.noteStatus.textContent = message || '';
  els.noteStatus.className = type ? type : '';
}

function revokePreviewUrl() {
  if (state.previewUrl) {
    URL.revokeObjectURL(state.previewUrl);
    state.previewUrl = '';
  }
}

function updatePreview(file) {
  revokePreviewUrl();
  if (!file) {
    state.selectedFile = null;
    els.previewWrapper.hidden = true;
    return;
  }
  state.selectedFile = file;
  const url = URL.createObjectURL(file);
  state.previewUrl = url;
  els.previewImage.src = url;
  els.previewWrapper.hidden = false;
}

function toggleSubmissionInputs(disabled) {
  els.fileInput.disabled = disabled;
  els.typedAnswer.disabled = disabled;
  els.submitBtn.disabled = disabled;
  if (els.fileDrop) {
    els.fileDrop.classList.toggle('disabled', disabled);
  }
}

function populateMarkScheme(list = []) {
  if (!els.markSchemeList) return;
  els.markSchemeList.innerHTML = '';
  list.forEach(line => {
    const li = document.createElement('li');
    li.textContent = line;
    els.markSchemeList.appendChild(li);
  });
}

function toggleMarkScheme(visible) {
  if (!els.markSchemeSection) return;
  els.markSchemeSection.hidden = !visible;
}

async function loadConfig() {
  try {
    const response = await fetch(CONFIG_PATH);
    if (!response.ok) throw new Error('Config not found');
    state.config = await response.json();
    if (state.config?.onedriveFolderUrl && els.onedriveLink) {
      els.onedriveLink.href = state.config.onedriveFolderUrl;
    } else if (els.onedriveLink) {
      els.onedriveLink.style.display = 'none';
    }
    if (state.config?.markSchemeNotes?.length) {
      populateMarkScheme(state.config.markSchemeNotes);
    }
    await showQuestionImage();
  } catch (err) {
    console.error('Failed to load config', err);
    await renderFallbackImage();
  }
}

function drawLinesToCanvas(lines = []) {
  const width = 1200;
  const margin = 50;
  const lineHeight = 40;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '24px "Segoe UI", sans-serif';
  const availableWidth = width - margin * 2;
  const expandedLines = [];
  lines.forEach(rawLine => {
    const content = rawLine ?? '';
    if (content.trim() === '') {
      expandedLines.push('');
      return;
    }
    const words = content.split(' ');
    let current = '';
    words.forEach(word => {
      const tentative = current ? `${current} ${word}` : word;
      if (ctx.measureText(tentative).width > availableWidth) {
        if (current) expandedLines.push(current);
        current = word;
      } else {
        current = tentative;
      }
    });
    if (current) {
      expandedLines.push(current);
    }
  });
  const linesToDraw = expandedLines.length ? expandedLines : [''];
  const height = Math.max(400, margin * 2 + lineHeight * linesToDraw.length);
  canvas.width = width;
  canvas.height = height;
  const drawCtx = canvas.getContext('2d');
  drawCtx.fillStyle = '#ffffff';
  drawCtx.fillRect(0, 0, width, height);
  drawCtx.fillStyle = '#1e293b';
  drawCtx.font = '24px "Segoe UI", sans-serif';
  linesToDraw.forEach((line, index) => {
    drawCtx.fillText(line, margin, margin + index * lineHeight);
  });
  return canvas.toDataURL('image/png');
}

async function renderFallbackImage() {
  const lines = state.config?.fallbackLines?.length
    ? state.config.fallbackLines
    : ['Layer 3 question image unavailable'];
  const dataUrl = drawLinesToCanvas(lines);
  els.questionImage.alt = 'Fallback PNG generated from text';
  els.questionImage.src = dataUrl;
  return dataUrl;
}

async function showQuestionImage() {
  const url = state.config?.questionImageUrl?.trim();
  if (url) {
    return new Promise(resolve => {
      const img = els.questionImage;
      img.onload = () => resolve(true);
      img.onerror = () => {
        console.warn('Unable to load provided PNG. Using fallback.');
        renderFallbackImage().then(() => resolve(false));
      };
      img.alt = state.config?.questionImageAlt || 'Layer 3 question image';
      img.src = url;
    });
  }
  return renderFallbackImage();
}

async function uploadHandwork(file) {
  if (!file) throw new Error('No file selected');
  const safePoint = POINT_ID.replace(/\./g, '-');
  const extension = file.name.split('.').pop() || 'png';
  const uniqueName = `${safePoint}-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const path = `${safePoint}/${username || 'anonymous'}/${uniqueName}`;
  const { error } = await supabase
    .storage
    .from(HANDWORK_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
      upsert: false
    });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from(HANDWORK_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data?.publicUrl || '' };
}

async function saveSubmission(answer, uploadInfo) {
  const payload = {
    username,
    point_id: POINT_ID.toLowerCase(),
    question_number: QUESTION_NUMBER,
    student_answer: answer,
    submitted_at: new Date().toISOString(),
    handwork_image_path: uploadInfo?.path || null,
    handwork_image_url: uploadInfo?.publicUrl || null
  };
  const { data, error } = await supabase
    .from(layer3Table)
    .upsert(payload, { onConflict: ['username', 'point_id', 'question_number'] })
    .select()
    .maybeSingle();
  if (error) throw error;
  state.submission = data || payload;
}

async function loadExistingSubmission() {
  if (!canPersist) return;
  const { data, error } = await supabase
    .from(layer3Table)
    .select('*')
    .eq('username', username)
    .eq('point_id', POINT_ID.toLowerCase())
    .eq('question_number', QUESTION_NUMBER)
    .maybeSingle();
  if (error) {
    console.error('Load submission error', error);
    return;
  }
  if (!data) return;
  state.submission = data;
  if (data.student_answer && els.typedAnswer) {
    els.typedAnswer.value = data.student_answer;
    toggleSubmissionInputs(true);
    toggleMarkScheme(true);
  }
  if (data.handwork_image_url) {
    els.previewImage.src = data.handwork_image_url;
    els.previewWrapper.hidden = false;
  }
  if (data.correction_note) {
    addNoteToList(data.correction_note);
  }
  setSubmissionStatus('You have already submitted this layer.', 'success');
  enableLayer4();
}

function addNoteToList(note) {
  if (!els.notesList) return;
  els.notesList.innerHTML = '';
  const li = document.createElement('li');
  li.textContent = `Q${QUESTION_NUMBER}: ${note}`;
  els.notesList.appendChild(li);
}

async function saveNote() {
  if (!canPersist) {
    setNoteStatus('Please sign in to save notes.', 'error');
    return;
  }
  const note = els.noteInput.value.trim();
  if (!note) {
    setNoteStatus('Write a note before saving.', 'error');
    return;
  }
  els.saveNoteBtn.disabled = true;
  setNoteStatus('Saving note...', 'info');
  try {
    const payload = {
      username,
      point_id: POINT_ID.toLowerCase(),
      question_number: QUESTION_NUMBER,
      correction_note: note,
      corrected_at: new Date().toISOString(),
      student_answer: els.typedAnswer.value.trim() || state.submission?.student_answer || null
    };
    const { error } = await supabase
      .from(layer3Table)
      .upsert(payload, { onConflict: ['username', 'point_id', 'question_number'] });
    if (error) throw error;
    addNoteToList(note);
    els.noteInput.value = '';
    setNoteStatus('Note saved to your notebook.', 'success');
  } catch (err) {
    console.error('Save note error', err);
    setNoteStatus('Unable to save note right now.', 'error');
  } finally {
    els.saveNoteBtn.disabled = false;
  }
}

function exportNotes() {
  if (!window.jspdf || !els.notesList.children.length) {
    alert('There are no saved notes to export yet.');
    return;
  }
  const doc = new window.jspdf.jsPDF();
  doc.setFontSize(14);
  doc.text(`Layer 3 notes - Point ${POINT_ID}`, 14, 20);
  doc.setFontSize(12);
  Array.from(els.notesList.children).forEach((item, index) => {
    doc.text(`${index + 1}. ${item.textContent}`, 14, 40 + index * 12);
  });
  doc.save(`point-${POINT_ID.replace('.', '-')}-notes.pdf`);
}

async function updateProgress() {
  const tables = {
    A_Level: 'a_theory_progress',
    AS_Level: 'as_theory_progress',
    IGCSE: 'igcse_theory_progress'
  };
  const progressTable = tables[platform];
  if (!progressTable || !username) return;
  const { data: existing, error } = await supabase
    .from(progressTable)
    .select('reached_layer')
    .eq('username', username)
    .eq('point_id', POINT_ID.toLowerCase())
    .maybeSingle();
  if (error) {
    console.error('Progress lookup failed', error);
    return;
  }
  const currentScore = value => value === 'R' ? 4 : (parseInt(value, 10) || 0);
  if (currentScore(existing?.reached_layer) < 3) {
    const { error: upsertError } = await supabase
      .from(progressTable)
      .upsert({ username, point_id: POINT_ID.toLowerCase(), reached_layer: 3 }, { onConflict: ['username', 'point_id'] });
    if (upsertError) {
      console.error('Progress update failed', upsertError);
    }
  }
}

function enableLayer4() {
  if (!els.layer4Btn) return;
  els.layer4Btn.disabled = false;
}

function handleLayer4Click() {
  if (els.layer4Btn.disabled) return;
  window.location.href = 'layer4.html';
}

function bindEvents() {
  els.fileInput.addEventListener('change', event => {
    const [file] = event.target.files;
    updatePreview(file);
  });

  els.submitBtn.addEventListener('click', async () => {
    if (!canPersist) {
      setSubmissionStatus('Please sign in before submitting your answer.', 'error');
      return;
    }
    const file = state.selectedFile;
    if (!file && !state.submission?.handwork_image_url) {
      setSubmissionStatus('Upload a clear image of your work first.', 'error');
      return;
    }
    const answer = els.typedAnswer.value.trim();
    if (!answer && !state.submission?.student_answer) {
      setSubmissionStatus('Type your final answer before submitting.', 'error');
      return;
    }
    toggleSubmissionInputs(true);
    setSubmissionStatus('Uploading your work...', 'info');
    try {
      const uploadInfo = file ? await uploadHandwork(file) : { path: state.submission?.handwork_image_path, publicUrl: state.submission?.handwork_image_url };
      await saveSubmission(answer || state.submission?.student_answer || '', uploadInfo);
      setSubmissionStatus('Submission saved successfully! The mark scheme is now unlocked.', 'success');
      toggleMarkScheme(true);
      enableLayer4();
      await updateProgress();
    } catch (err) {
      console.error('Submission failed', err);
      setSubmissionStatus('Could not submit your work. Please try again.', 'error');
      toggleSubmissionInputs(false);
    }
  });

  els.downloadQuestion.addEventListener('click', () => {
    const src = els.questionImage?.currentSrc || els.questionImage?.src;
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `point-${POINT_ID.replace('.', '-')}-question.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  els.regenerateFallback.addEventListener('click', () => {
    renderFallbackImage();
  });

  if (els.layer4Btn) {
    els.layer4Btn.addEventListener('click', handleLayer4Click);
  }

  els.saveNoteBtn.addEventListener('click', saveNote);
  els.exportBtn.addEventListener('click', exportNotes);
}

initHeader();
bindEvents();
loadConfig();
loadExistingSubmission();
if (!canPersist) {
  setSubmissionStatus('Please sign in and choose your platform before submitting.', 'error');
}

window.addEventListener('beforeunload', revokePreviewUrl);
