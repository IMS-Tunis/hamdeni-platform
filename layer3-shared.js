import { supabase, tableName } from './supabaseClient.js';

/**
 * Initialize Layer 3 logic for a point.
 *
 * This sets up rendering of questions, saving of answers and notes,
 * progress tracking and optional navigation to Layer 4.
 *
 * The HTML page must provide elements with the following ids:
 *   - questions-container
 *   - notes-list
 *   - export-btn
 *   - layer4-btn (optional)
 *   - notes-title
 *   - student-name
 *   - platform-name
 *   - point-title
 *
 * @param {string} pointId - Identifier of the point (e.g. "1.1").
 * @param {Object} [options]
 * @param {string} [options.questionsFile='layer3_questions.json'] -
 *   Path to the questions JSON relative to the HTML page.
 */
export default function initLayer3(pointId, options = {}) {
  const { questionsFile = 'layer3_questions.json' } = options;

  const username = localStorage.getItem('username');
  const studentName = localStorage.getItem('student_name');
  const platform = localStorage.getItem('platform');
  const progressKey = `layer3-progress-${pointId}`;

  if (!document.getElementById('layer3-question-style')) {
    const style = document.createElement('style');
    style.id = 'layer3-question-style';
    style.textContent = `
      .task-box h3 {
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
  }

  const questionContainer = document.getElementById('questions-container');
  const notesList = document.getElementById('notes-list');
  const exportBtn = document.getElementById('export-btn');
  const layer4Btn = document.getElementById('layer4-btn');
  const notesTitle = document.getElementById('notes-title');

  const LAYER4_DISABLED_MESSAGE = 'finish all questions before moveing to layer 4';

  const LAYER4_TOOLTIP_ID = 'layer4-disabled-tooltip';
  let layer4Tooltip;
  let layer4TooltipStyleApplied = false;

  function ensureLayer4Tooltip() {
    if (!layer4TooltipStyleApplied) {
      const style = document.createElement('style');
      style.textContent = `
        .layer4-disabled-tooltip {
          position: absolute;
          background: rgba(17, 24, 39, 0.95);
          color: #fff;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          line-height: 1.3;
          max-width: min(240px, calc(100vw - 2rem));
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
          z-index: 1000;
        }
        .layer4-disabled-tooltip.visible {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
      layer4TooltipStyleApplied = true;
    }
    if (!layer4Tooltip) {
      layer4Tooltip = document.getElementById(LAYER4_TOOLTIP_ID);
    }
    if (!layer4Tooltip) {
      layer4Tooltip = document.createElement('div');
      layer4Tooltip.id = LAYER4_TOOLTIP_ID;
      layer4Tooltip.className = 'layer4-disabled-tooltip';
      layer4Tooltip.textContent = LAYER4_DISABLED_MESSAGE;
      layer4Tooltip.setAttribute('role', 'tooltip');
      layer4Tooltip.setAttribute('aria-hidden', 'true');
      layer4Tooltip.style.top = '-9999px';
      layer4Tooltip.style.left = '-9999px';
      document.body.appendChild(layer4Tooltip);
    }
    return layer4Tooltip;
  }

  function hideLayer4Tooltip() {
    if (layer4Tooltip) {
      layer4Tooltip.classList.remove('visible');
      layer4Tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  function showLayer4Tooltip(target) {
    const tooltip = ensureLayer4Tooltip();
    tooltip.textContent = LAYER4_DISABLED_MESSAGE;
    tooltip.style.top = '-9999px';
    tooltip.style.left = '-9999px';
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');

    const rect = target.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    let top = rect.top + scrollY - tooltipRect.height - 12;
    if (top < scrollY + 8) {
      top = rect.bottom + scrollY + 12;
    }

    let left = rect.left + scrollX + (rect.width - tooltipRect.width) / 2;
    const minLeft = scrollX + 8;
    const maxLeft = scrollX + viewportWidth - tooltipRect.width - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    const maxTop = scrollY + viewportHeight - tooltipRect.height - 8;
    if (top > maxTop) top = maxTop;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  if (layer4Btn) {
    ensureLayer4Tooltip();
    layer4Btn.setAttribute('aria-describedby', LAYER4_TOOLTIP_ID);
    layer4Btn.addEventListener('mouseenter', () => {
      if (layer4Btn.disabled) {
        showLayer4Tooltip(layer4Btn);
      } else {
        hideLayer4Tooltip();
      }
    });
    layer4Btn.addEventListener('mouseleave', hideLayer4Tooltip);
    layer4Btn.addEventListener('click', hideLayer4Tooltip);
    window.addEventListener('scroll', hideLayer4Tooltip, true);
    window.addEventListener('resize', hideLayer4Tooltip);

  }

  let totalQuestions = 0;
  const answeredQuestions = new Set();
  const questionLabels = new Map();
  const DIGITS_ONLY = /^\d+$/;

  function getQuestionKeys(questionNumber, index) {
    const raw = typeof questionNumber === 'number'
      ? questionNumber.toString()
      : (questionNumber ?? '').toString().trim();
    const fallback = (index + 1).toString();
    const keys = [];
    if (raw) keys.push(raw);
    if (!DIGITS_ONLY.test(raw)) keys.push(fallback);
    return Array.from(new Set(keys));
  }

  function getDisplayNumber(questionNumber, index) {
    const raw = typeof questionNumber === 'number'
      ? questionNumber.toString()
      : (questionNumber ?? '').toString().trim();
    return raw || (index + 1).toString();
  }

  function getDbQuestionNumber(questionNumber, index) {
    const keys = getQuestionKeys(questionNumber, index);
    const numeric = keys.find(key => DIGITS_ONLY.test(key));
    const parsed = parseInt(numeric || (index + 1).toString(), 10);
    return Number.isFinite(parsed) ? parsed : index + 1;
  }

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
    (data || []).forEach(row => {
      const key = row?.question_number;
      if (key !== undefined && key !== null) {
        map[String(key)] = row;
      }
    });
    return map;
  }

  function addNoteToReview(qNum, note) {
    if (!note) return;
    const existing = Array.from(notesList.children).find(
      item => item.dataset?.question === qNum
    );
    if (existing) {
      existing.textContent = `Q${qNum}: ${note}`;
      return;
    }
    const li = document.createElement('li');
    li.dataset.question = qNum;
    li.textContent = `Q${qNum}: ${note}`;
    notesList.appendChild(li);
  }

  function updateLayer4ButtonState() {
    if (!layer4Btn) return;
    const shouldDisable = totalQuestions === 0 || answeredQuestions.size < totalQuestions;
    layer4Btn.disabled = shouldDisable;
    if (!shouldDisable) {
      hideLayer4Tooltip();
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
    answeredQuestions.clear();
    totalQuestions = 0;
    updateLayer4ButtonState();
    const lastCompleted = parseInt(localStorage.getItem(progressKey) || '0', 10);
    fetch(questionsFile)
        .then(r => r.json())
        .then(questions => {
          totalQuestions = questions.length;
          questionLabels.clear();
          questions.forEach((q, index) => {
          const displayNumber = getDisplayNumber(q.question_number, index);
          const dbQuestionNumber = getDbQuestionNumber(q.question_number, index);
          const candidates = getQuestionKeys(q.question_number, index);
          const savedRow = candidates
            .map(key => saved[String(key)])
            .find(Boolean) || {};
          questionLabels.set(String(dbQuestionNumber), displayNumber);
          const wrapper = document.createElement('div');
          wrapper.className = 'task-box';
          wrapper.innerHTML = `
            <h3>Q${displayNumber}: ${q.question}</h3>
            <textarea data-q="${dbQuestionNumber}" class="answer-text" placeholder="Your answer...">${savedRow.student_answer || ''}</textarea>
            <button class="submit-btn">Submit Answer</button>
            <div class="mark-scheme" style="display:${savedRow.student_answer ? 'block' : 'none'};"><strong>Model Answer</strong>: ${q.mark_scheme}</div>
            <textarea data-note="${dbQuestionNumber}" class="note-text" placeholder="Note what you missed in your answer, it will be saved as a personal note for future review.">${savedRow.correction_note || ''}</textarea>
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
            answeredQuestions.add(String(dbQuestionNumber));
          }
          if (savedRow.correction_note) {
            addNoteToReview(displayNumber, savedRow.correction_note);
          }

          btn.addEventListener('click', async () => {
            const ans = textarea.value.trim();
            if (!ans) return;
            btn.disabled = true;
            textarea.disabled = true;
            ms.style.display = 'block';
            const { data, error } = await supabase
              .from(tableName('layer3'))
              .upsert(
                {
                  username,
                  point_id: pointId.toLowerCase(),
                  question_number: dbQuestionNumber,
                  student_answer: ans,
                  submitted_at: new Date().toISOString()
                },
                { onConflict: ['username','point_id','question_number'] }
              )
              .select();
            if (error) {
              console.error('Save answer error', error);
              alert('Failed to save answer.');
              return;
            }
            console.log('Saved answer', data);
            answeredQuestions.add(String(dbQuestionNumber));
            updateLayer4ButtonState();
            localStorage.setItem(progressKey, String(dbQuestionNumber));
            if (dbQuestionNumber >= totalQuestions) {
              localStorage.removeItem(progressKey);
            }
          });

          saveBtn.addEventListener('click', async () => {
            const note = noteTA.value.trim();
            if (!note) return;
            const { data, error } = await supabase
              .from(tableName('layer3'))
              .upsert(
                {
                  username,
                  point_id: pointId.toLowerCase(),
                  question_number: dbQuestionNumber,
                  student_answer: textarea.value.trim(),
                  correction_note: note,
                  corrected_at: new Date().toISOString()
                },
                { onConflict: ['username','point_id','question_number'] }
              )
              .select();
            if (error) {
              console.error('Save note error', error);
              alert('Failed to save note.');
              return;
            }
            console.log('Saved note', data);
            addNoteToReview(displayNumber, note);
            updateLayer4ButtonState();
            alert('The note has been successfully saved in your personalized notebook.');
          });

          questionContainer.appendChild(wrapper);
        });
        updateLayer4ButtonState();
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
    let pageWidth = doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    const bulletIndent = 6;
    const pointTitleText = document.getElementById('point-title')?.textContent?.trim();
    const normalizedPointTitle = pointTitleText || `Point ${pointId}`;
    const pdfTitle = `Layer 3 Reflection Notes – ${normalizedPointTitle}`;

    const drawHeader = (isFirstPage = false) => {
      pageWidth = doc.internal.pageSize.getWidth();
      pageHeight = doc.internal.pageSize.getHeight();
      const titleSize = isFirstPage ? 20 : 16;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(titleSize);
      doc.setTextColor(20, 50, 90);
      doc.text(pdfTitle, pageWidth / 2, margin, { align: 'center' });
      doc.setDrawColor(20, 50, 90);
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 4, pageWidth - margin, margin + 4);

      let headerBottom = margin + 10;
      if (username) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Student: ${username}`, pageWidth / 2, margin + 12, { align: 'center' });
        headerBottom = margin + 20;
      }

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      return headerBottom + 6;
    };

    let y = drawHeader(true);
    const printableNotes = (data || [])
      .filter(row => (row?.correction_note || '').trim())
      .sort((a, b) => (Number(a?.question_number) || 0) - (Number(b?.question_number) || 0));

    if (!printableNotes.length) {
      doc.text('No notes available for this point yet.', margin, y);
    } else {
      printableNotes.forEach(row => {
        const key = row?.question_number != null ? String(row.question_number) : '';
        const label = questionLabels.get(key) || row.question_number || '';
        const noteText = (row.correction_note || '').trim();
        const wrapped = doc.splitTextToSize(noteText, pageWidth - margin * 2 - bulletIndent);
        const blockHeight = lineHeight * (1 + wrapped.length) + 4;

        if (y + blockHeight > pageHeight - margin) {
          doc.addPage();
          y = drawHeader(false);
        }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(20, 50, 90);
        const bulletLabel = label ? `• Q${label}` : '• Note';
        doc.text(bulletLabel, margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        y += lineHeight;
        doc.text(wrapped, margin + bulletIndent, y);
        y += wrapped.length * lineHeight + 4;
      });
    }

    const safePoint = (pointId || 'point').toString().replace(/[^a-z0-9]+/gi, '_');
    const safeUser = (username || 'student').toString().replace(/[^a-z0-9]+/gi, '_');
    doc.save(`layer3_reflection_notes_${safePoint}_${safeUser}.pdf`);
  });

  render();

  if (layer4Btn) {
    layer4Btn.addEventListener('click', async () => {
      await updateProgress();
      window.location.href = 'layer4.html';
    });
  }
}
