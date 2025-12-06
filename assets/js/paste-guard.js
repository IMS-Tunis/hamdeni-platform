(function () {
  "use strict";

  if (window.PASTE_GUARD_READY) {
    return;
  }

  // Optional runtime configuration
  // window.PASTE_GUARD_CONFIG = {
  //   allowSelector: 'input[name="email"]',
  //   warnDuration: 2000,
  //   message: 'Custom warning text',
  //   selectorList: ['input[type="text"]', 'textarea']
  // };

  const globalConfig = window.PASTE_GUARD_CONFIG || {};
  const DEFAULT_ALLOW = "";
  const ALLOW_PASTE_SELECTOR = typeof globalConfig.allowSelector === "string"
    ? globalConfig.allowSelector
    : (window.PASTE_GUARD_ALLOW_SELECTOR || DEFAULT_ALLOW);

  const WARN_MS = Number.isFinite(globalConfig.warnDuration)
    ? Math.max(0, Number(globalConfig.warnDuration))
    : 2500;

  const WARN_MESSAGE = typeof globalConfig.message === "string"
    ? globalConfig.message
    : "Pasting is disabled here. Please type your answer.";

  const GUARDED_SELECTOR = (globalConfig.selectorList || [
    'input[type="text"]',
    'input[type="search"]',
    'input[type="email"]',
    'input[type="url"]',
    'input[type="tel"]',
    'input[type="number"]',
    'input[type="password"]',
    'textarea'
  ]).join(', ');

  const EXCLUDE_SELECTOR = 'input[readonly], input[disabled], textarea[readonly], textarea[disabled]';

  const hiddenFlags = new WeakMap();
  const warnings = new WeakMap();

  window.PASTE_GUARD_READY = true;
  window.PASTE_GUARD_READY_AT = Date.now();
  try {
    document.documentElement.dataset.pasteGuard = 'active';
  } catch (_) {
    // Best-effort marker only; ignore environments where dataset is not writable
  }
  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info('[Paste Guard] Listeners attached at', new Date(window.PASTE_GUARD_READY_AT).toISOString());
  }

  function isGuarded(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (!el.matches(GUARDED_SELECTOR)) return false;
    if (el.matches(EXCLUDE_SELECTOR)) return false;
    if (ALLOW_PASTE_SELECTOR && el.matches(ALLOW_PASTE_SELECTOR)) return false;
    return true;
  }

  function ensureHiddenFlag(el) {
    if (!el || !el.form || !el.name) return null;
    if (hiddenFlags.has(el)) return hiddenFlags.get(el);

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = el.name + '__cp';
    hidden.value = '1';
    el.form.appendChild(hidden);
    hiddenFlags.set(el, hidden);
    return hidden;
  }

  function showWarning(el) {
    if (!el) return;
    let warn = warnings.get(el);
    if (!warn) {
      warn = document.createElement('div');
      warn.className = 'pg-warning';
      warn.setAttribute('role', 'alert');
      warn.setAttribute('aria-live', 'polite');
      Object.assign(warn.style, {
        fontSize: '0.9rem',
        marginTop: '4px',
        color: '#b00020',
        display: 'none'
      });
      el.insertAdjacentElement('afterend', warn);
      warnings.set(el, warn);
    }
    warn.textContent = WARN_MESSAGE;
    warn.style.display = 'block';
    clearTimeout(warn._hideTimer);
    warn._hideTimer = window.setTimeout(() => {
      warn.style.display = 'none';
    }, WARN_MS);
  }

  function blockAndFlag(event) {
    const target = event.target;
    if (!isGuarded(target)) return;
    event.preventDefault();
    ensureHiddenFlag(target);
    showWarning(target);
  }

  function onPaste(event) {
    blockAndFlag(event);
  }

  function onDrop(event) {
    blockAndFlag(event);
  }

  function onKeydown(event) {
    const target = event.target;
    if (!isGuarded(target)) return;
    const key = String(event.key).toLowerCase();
    const combo = ((event.ctrlKey || event.metaKey) && key === 'v') || (event.shiftKey && key === 'insert');
    if (!combo) return;
    event.preventDefault();
    ensureHiddenFlag(target);
    showWarning(target);
  }

  function onBeforeInput(event) {
    const target = event.target;
    if (!isGuarded(target)) return;
    if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
      event.preventDefault();
      ensureHiddenFlag(target);
      showWarning(target);
    }
  }

  document.addEventListener('paste', onPaste, true);
  document.addEventListener('drop', onDrop, true);
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('beforeinput', onBeforeInput, true);
})();
