import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

class FakeNode {
  constructor() {
    this.parentNode = null;
    this.childNodes = [];
    this.ownerDocument = null;
  }

  appendChild(child) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.childNodes.push(child);
    if (this.tagName === 'FORM') {
      propagateForm(child, this);
    } else if (this.form && child instanceof FakeElement && !child.form) {
      propagateForm(child, this.form);
    }
    return child;
  }
}

function propagateForm(node, form) {
  if (!(node instanceof FakeElement)) return;
  node.form = form;
  for (const child of node.childNodes) {
    propagateForm(child, form);
  }
}

class FakeElement extends FakeNode {
  constructor(tagName) {
    super();
    this.tagName = String(tagName || '').toUpperCase();
    this.attributes = new Map();
    this.style = {};
    this.classList = new Set();
    this.textContent = '';
    this.name = '';
    this.type = this.tagName === 'INPUT' ? 'text' : undefined;
    this.form = null;
    this.value = '';
  }

  get className() {
    return Array.from(this.classList).join(' ');
  }

  set className(value) {
    this.setAttribute('class', value);
  }

  setAttribute(name, value = '') {
    const key = name.toLowerCase();
    this.attributes.set(key, String(value));
    if (key === 'class') {
      this.classList = new Set(String(value).split(/\s+/).filter(Boolean));
    } else if (key === 'name') {
      this.name = String(value);
    } else if (key === 'type') {
      this.type = String(value).toLowerCase();
    } else if (key === 'readonly') {
      this.readOnly = true;
    } else if (key === 'disabled') {
      this.disabled = true;
    }
  }

  getAttribute(name) {
    const key = name.toLowerCase();
    if (!this.attributes.has(key)) return null;
    return this.attributes.get(key);
  }

  hasAttribute(name) {
    return this.attributes.has(name.toLowerCase());
  }

  insertAdjacentElement(position, element) {
    if (position !== 'afterend') {
      throw new Error('Only afterend supported in fake DOM');
    }
    const parent = this.parentNode;
    if (!parent) throw new Error('Element has no parent');
    const siblings = parent.childNodes;
    const index = siblings.indexOf(this);
    element.parentNode = parent;
    element.ownerDocument = this.ownerDocument;
    siblings.splice(index + 1, 0, element);
    if (parent.tagName === 'FORM') {
      propagateForm(element, parent);
    } else if (parent.form) {
      propagateForm(element, parent.form);
    }
    return element;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return siblings[index + 1] || null;
  }

  matches(selector) {
    return matchesSelector(this, selector);
  }
}

class FakeDocument extends FakeNode {
  constructor() {
    super();
    this.ownerDocument = this;
    this.documentElement = new FakeElement('html');
    this.documentElement.ownerDocument = this;
    this.body = new FakeElement('body');
    this.body.ownerDocument = this;
    this.documentElement.appendChild(this.body);
    this._listeners = new Map();
  }

  createElement(tagName) {
    const el = new FakeElement(tagName);
    el.ownerDocument = this;
    return el;
  }

  addEventListener(type, handler) {
    const list = this._listeners.get(type) || [];
    list.push(handler);
    this._listeners.set(type, list);
  }

  getListeners(type) {
    return this._listeners.get(type) || [];
  }

  resetListeners() {
    this._listeners.clear();
  }
}

function matchesSelector(element, selector) {
  if (!selector) return false;
  return selector.split(',').some(sel => matchSingle(element, sel.trim()));
}

function matchSingle(element, selector) {
  if (!selector) return false;
  const parts = selector.match(/(^[a-z]+)|\[[^\]]+\]|\.[^\.\[]+/gi) || [];
  let tag = null;
  const attributes = [];
  const classes = [];
  for (const part of parts) {
    if (part.startsWith('[')) {
      const attr = part.slice(1, -1);
      const [rawName, rawValue] = attr.split('=');
      const name = rawName.trim().toLowerCase();
      if (rawValue === undefined) {
        attributes.push({ name, value: null });
      } else {
        const value = rawValue.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        attributes.push({ name, value });
      }
    } else if (part.startsWith('.')) {
      classes.push(part.slice(1));
    } else {
      tag = part.toLowerCase();
    }
  }
  if (tag && element.tagName.toLowerCase() !== tag) return false;
  for (const cls of classes) {
    if (!element.classList.has(cls)) return false;
  }
  for (const attr of attributes) {
    if (attr.value === null) {
      if (!element.hasAttribute(attr.name)) return false;
    } else {
      const val = element.getAttribute(attr.name);
      if (val === null) return false;
      if (String(val) !== attr.value) return false;
    }
  }
  return true;
}

function createEventTarget(document, type, target, init) {
  const event = {
    type,
    target,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };
  return Object.assign(event, init || {});
}

export function createTestEnvironment(config = {}) {
  const document = new FakeDocument();
  const window = {
    document,
    setTimeout,
    clearTimeout,
    PASTE_GUARD_CONFIG: config,
    PASTE_GUARD_ALLOW_SELECTOR: config.allowSelector || ''
  };
  window.window = window;
  window.HTMLElement = FakeElement;
  document.defaultView = window;

  const context = {
    window,
    document,
    HTMLElement: FakeElement,
    setTimeout,
    clearTimeout
  };
  context.self = window;
  context.globalThis = window;

  const script = readFileSync(new URL('../../assets/js/paste-guard.js', import.meta.url), 'utf8');
  runInNewContext(script, context, { filename: 'paste-guard.js' });

  function trigger(type, target, init) {
    const event = createEventTarget(document, type, target, init);
    for (const handler of document.getListeners(type)) {
      handler.call(document, event);
    }
    return event;
  }

  return {
    document,
    window,
    trigger,
    createElement: (...args) => document.createElement(...args),
    destroy() {
      document.resetListeners();
    }
  };
}

export { FakeElement };
