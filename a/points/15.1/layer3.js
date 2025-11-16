const POINT_ID = '15.1';
const CONFIG_PATH = 'layer3-question-config.json';

const els = {
  pointTitle: document.getElementById('point-title'),
  studentName: document.getElementById('student-name'),
  platformName: document.getElementById('platform-name'),
  questionImage: document.getElementById('question-image'),
  regenerateFallback: document.getElementById('regenerate-fallback'),
  onedriveLink: document.getElementById('onedrive-link'),
  layer4Btn: document.getElementById('layer4-btn')
};

const studentName = localStorage.getItem('student_name') || '';
const platform = localStorage.getItem('platform') || '';

const state = {
  config: null
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
function handleLayer4Click() {
  window.location.href = 'layer4.html';
}

function bindEvents() {
  if (els.regenerateFallback) {
    els.regenerateFallback.addEventListener('click', () => {
      renderFallbackImage();
    });
  }

  if (els.layer4Btn) {
    els.layer4Btn.addEventListener('click', handleLayer4Click);
  }
}

initHeader();
bindEvents();
loadConfig();
