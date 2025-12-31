
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.exercise'));
  const nav = document.getElementById('nav');
  const expandAllBtn = document.getElementById('expandAll');
  const collapseAllBtn = document.getElementById('collapseAll');

  // Build sidebar nav
  const frag = document.createDocumentFragment();
  cards.forEach((card) => {
    const idx = card.getAttribute('data-idx');
    const a = document.createElement('a');
    a.href = `#ex-${idx}`;
    a.className = 'nav-item';
    a.textContent = `Exercise ${idx}`;
    frag.appendChild(a);
  });
  nav.appendChild(frag);

  // Toggle per-card mark scheme
  cards.forEach((card) => {
    const btn = card.querySelector('.toggle-ms');
    const ms = card.querySelector('.mark-scheme');
    btn.addEventListener('click', () => {
      const isHidden = ms.hasAttribute('hidden');
      if (isHidden) {
        ms.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Hide mark scheme';
      } else {
        ms.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Show mark scheme';
      }
    });
  });

  // Global controls
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      cards.forEach((card) => {
        const ms = card.querySelector('.mark-scheme');
        const btn = card.querySelector('.toggle-ms');
        if (ms && ms.hasAttribute('hidden')) {
          ms.removeAttribute('hidden');
          if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Hide mark scheme'; }
        }
      });
    });
  }
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      cards.forEach((card) => {
        const ms = card.querySelector('.mark-scheme');
        const btn = card.querySelector('.toggle-ms');
        if (ms && !ms.hasAttribute('hidden')) {
          ms.setAttribute('hidden', '');
          if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Show mark scheme'; }
        }
      });
    });
  }
});
