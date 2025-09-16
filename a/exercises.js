(function(){
  const dataEl = document.getElementById('data');
  const raw = dataEl ? dataEl.textContent.trim() : '{}';
  let root;
  try { root = JSON.parse(raw); } catch(e){ root = { data: [] }; }

  const flat = [];
  (root.data || []).forEach(group => {
    const items = Array.isArray(group.items) ? group.items : [];
    items.forEach(item => {
      flat.push({
        question: item.question || "",
        question_self_contained: item.question_self_contained || item.question || "",
        mark_scheme_answer: item.mark_scheme_answer || "",
        // 🔄 No default generic sentence — explanation must come from JSON
        explanation: typeof item.explanation === 'string' ? item.explanation : ""
      });
    });
  });

  const nav = document.getElementById('nav');
  const container = document.getElementById('pointsContainer');
  const expandAllBtn = document.getElementById('expandAll');
  const collapseAllBtn = document.getElementById('collapseAll');

  function escapeHTML(str){
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[s]);
  }
  function formatMultiline(text){
    return escapeHTML(text).replace(/\n/g,'<br>');
  }
  function hasExplanation(text){
    return typeof text === 'string' && text.trim() !== '';
  }

  function renderNav(){
    if (!nav) return;
    nav.innerHTML = '';
    flat.forEach((_, idx) => {
      const a = document.createElement('a');
      a.href = `#ex-${idx+1}`;
      a.className = 'nav-item';
      a.textContent = `Exercise ${idx+1}`;
      a.addEventListener('click', () => setActive(idx+1));
      nav.appendChild(a);
    });
  }

  function renderCards(){
    if (!container) return;
    container.innerHTML = '';
    flat.forEach((it, idx) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.id = `ex-${idx+1}`;

      const header = document.createElement('div');
      header.className = 'card-header';

      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = `Exercise ${idx+1}`;
      header.appendChild(title);

      const q = document.createElement('div');
      q.className = 'question';
      q.innerHTML = formatMultiline(it.question_self_contained || it.question || '');

      const toggle = document.createElement('button');
      toggle.className = 'btn';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Show mark scheme';

      const msWrap = document.createElement('div');
      msWrap.className = 'ms-wrap';

      const msTitle = document.createElement('div');
      msTitle.className = 'ms-title';
      msTitle.textContent = 'Mark scheme';

      const pre = document.createElement('pre');
      pre.className = 'ms';
      // <pre> preserves newlines, so textContent is fine for line breaks
      pre.textContent = it.mark_scheme_answer || '';

      msWrap.appendChild(msTitle);
      msWrap.appendChild(pre);

      // ✅ Only render Explanation section if JSON provides it
      if (hasExplanation(it.explanation)) {
        const exTitle = document.createElement('div');
        exTitle.className = 'explain-title';
        exTitle.textContent = 'Explanation';

        const exText = document.createElement('p');
        exText.className = 'explain';
        // Render multiline explanations with <br> support
        exText.innerHTML = formatMultiline(it.explanation);

        msWrap.appendChild(exTitle);
        msWrap.appendChild(exText);
      }

      toggle.addEventListener('click', () => {
        const showing = msWrap.classList.toggle('show');
        toggle.textContent = showing ? 'Hide mark scheme' : 'Show mark scheme';
        toggle.setAttribute('aria-expanded', String(showing));
      });

      card.appendChild(header);
      card.appendChild(q);
      card.appendChild(toggle);
      card.appendChild(msWrap);
      container.appendChild(card);
    });
  }

  function expandAll(){
    document.querySelectorAll('.card .btn').forEach(btn => {
      const wrap = btn.nextElementSibling;
      if(wrap && !wrap.classList.contains('show')){
        wrap.classList.add('show');
        btn.textContent = 'Hide mark scheme';
        btn.setAttribute('aria-expanded','true');
      }
    });
  }
  function collapseAll(){
    document.querySelectorAll('.card .btn').forEach(btn => {
      const wrap = btn.nextElementSibling;
      if(wrap && wrap.classList.contains('show')){
        wrap.classList.remove('show');
        btn.textContent = 'Show mark scheme';
        btn.setAttribute('aria-expanded','false');
      }
    });
  }
  function setActive(n){
    const items = Array.from(document.querySelectorAll('.nav-item'));
    items.forEach(el => el.classList.remove('active'));
    const target = items[n-1];
    if(target) target.classList.add('active');
  }

  if (expandAllBtn) expandAllBtn.addEventListener('click', expandAll);
  if (collapseAllBtn) collapseAllBtn.addEventListener('click', collapseAll);

  renderNav();
  renderCards();
  setActive(1);
})();
/* === Mock Test: clone left button for identical style, load JSON, wire modal === */
(function(){
  function qs(sel){ return document.querySelector(sel); }
  function qsid(id){ return document.getElementById(id); }
  function text(n){ return (n.textContent || n.innerText || '').trim(); }

  function ensureMiddleButton(){
    var footer = qs('footer.footer'); if(!footer) return null;
    var btns = Array.prototype.slice.call(footer.querySelectorAll('button, a'));
    var left = btns.find(b => /i need help/i.test(text(b)));
    var right = btns.find(b => /i'?m ready for the test/i.test(text(b)));
    if(!left || !right) return null;

    // If already present, reuse it
    var existing = qsid('openMockTest');
    if (existing) return existing;

    // Clone the left button to inherit all CSS classes and visual style
    var mid = left.cloneNode(true);
    mid.id = 'openMockTest';
    mid.textContent = 'Test yourself';
    if (mid.tagName.toLowerCase() === 'a') mid.href = '#';
    // Our click opens the modal
    mid.addEventListener('click', function(ev){ ev.preventDefault(); openModal(); });

    // Insert between the two buttons
    footer.insertBefore(mid, right);
    return mid;
  }

  function setupUnavailableNotice(){
    var footer = qs('footer.footer'); if (!footer) return;
    var btns = Array.prototype.slice.call(footer.querySelectorAll('button, a'));
    var left = btns.find(b => /i need help/i.test(text(b)));
    var right = btns.find(b => /i'?m ready for the test/i.test(text(b)));
    var targets = [left, right].filter(Boolean);
    if (targets.length === 0) return;

    var messageId = 'ctaUnavailableNotice';
    var message = qsid(messageId);
    if (!message) {
      message = document.createElement('p');
      message.id = messageId;
      message.className = 'action-unavailable-note';
      message.textContent = 'Inform the teacher directly, this button is not implemented yet.';
      message.setAttribute('role', 'status');
      message.setAttribute('aria-live', 'polite');
      message.hidden = true;
      footer.appendChild(message);
    }

    targets.forEach(function(btn){
      btn.addEventListener('click', function(){
        if (message.hidden) message.hidden = false;
      });
    });
  }

  function openModal(){
    var m = qsid('mockTestModal'); if(!m) return;
    m.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    var m = qsid('mockTestModal'); if(!m) return;
    m.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    var ans = qsid('mockTestAnswer'); var tog = qsid('toggleMockAnswer');
    if(ans) ans.classList.add('mock-hidden');
    if(tog){ tog.setAttribute('aria-expanded','false'); tog.textContent = 'Show answer'; }
  }
  function toggleAnswer(){
    var ans = qsid('mockTestAnswer'); var tog = qsid('toggleMockAnswer');
    if (!ans || !tog) return;
    var hidden = ans.classList.contains('mock-hidden');
    if (hidden) { ans.classList.remove('mock-hidden'); tog.setAttribute('aria-expanded','true'); tog.textContent = 'Hide answer'; }
    else { ans.classList.add('mock-hidden'); tog.setAttribute('aria-expanded','false'); tog.textContent = 'Show answer'; }
  }

  function populateFromJSON(){
    var raw = qsid('mockTestData'); if(!raw) return;
    var data; try { data = JSON.parse((raw.textContent || '').trim()); } catch(e){ return; }
    var mt = data.mock_test || {};
    var titleEl = qsid('mockTestTitle'); if(titleEl && mt.title) titleEl.textContent = mt.title;
    var qCode = qs('#mockTestModal .mock-modal-body .mock-code'); if(qCode) qCode.textContent = mt.question_self_contained || mt.question || '';
    var ansCode = qs('#mockTestAnswer .mock-code'); if(ansCode) ansCode.textContent = mt.mark_scheme_answer || '';
    var ansP = qs('#mockTestAnswer p'); if(ansP) ansP.textContent = mt.explanation || '';
  }

  function wireModal(){
    var closeBtn = qsid('closeMockTest');
    var dismissBtn = qsid('dismissMockTest');
    var toggleBtn = qsid('toggleMockAnswer');
    var modal = qsid('mockTestModal');
    if (closeBtn)  closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleAnswer);
    if (modal) modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });
  }

  function init(){
    ensureMiddleButton();   // clones left button so style is identical
    setupUnavailableNotice();
    populateFromJSON();     // fixes \n and \u2190 by using proper JSON escapes
    wireModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Normalize any double-escaped sequences coming from JSON (defensive) */
(function(){
  function deescape(s){
    if (typeof s !== 'string') return s;
    // turn "\n" into real newline and "\u2190" into "←", etc.
    return s
      .replace(/\\n/g, '\n')
      .replace(/\\u([0-9a-fA-F]{4})/g, function(_, hex){ return String.fromCharCode(parseInt(hex,16)); });
  }

  try {
    var raw = document.getElementById('mockTestData');
    if (!raw) return;
    var data = JSON.parse((raw.textContent || '').trim());
    var mt = data && data.mock_test ? data.mock_test : null;
    if (!mt) return;

    var qEl  = document.querySelector('#mockTestModal .mock-modal-body .mock-code');
    var aPre = document.querySelector('#mockTestAnswer .mock-code');
    var aP   = document.querySelector('#mockTestAnswer p');

    if (qEl)  qEl.textContent  = deescape(mt.question_self_contained || mt.question || '');
    if (aPre) aPre.textContent = deescape(mt.mark_scheme_answer || '');
    if (aP)   aP.textContent   = deescape(mt.explanation || '');
  } catch(e){ /* no-op */ }
})();
