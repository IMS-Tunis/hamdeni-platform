import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createTestEnvironment, FakeElement } from './helpers/fake-dom.js';

let env;

beforeEach(() => {
  env = createTestEnvironment();
});

afterEach(() => {
  env?.destroy();
  env = null;
});

function buildFormField(name, type = 'text') {
  const form = env.createElement('form');
  const input = env.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('name', name);
  form.appendChild(input);
  env.document.body.appendChild(form);
  return { form, input };
}

test('blocks paste events and flags the field', () => {
  const { form, input } = buildFormField('essay');
  const event = env.trigger('paste', input);
  assert.equal(event.defaultPrevented, true, 'paste should be prevented');
  const hidden = form.childNodes.find(node => node instanceof FakeElement && node.type === 'hidden');
  assert(hidden, 'hidden cp flag should be appended');
  assert.equal(hidden.name, 'essay__cp');
  assert.equal(hidden.value, '1');
  const warning = input.nextSibling;
  assert(warning, 'warning element should exist');
  assert.equal(warning.classList.has('pg-warning'), true);
  assert.equal(warning.textContent, 'Pasting is disabled here. Please type your answer.');
  assert.equal(warning.style.display, 'block');
});

test('drop attempts are blocked and flagged', () => {
  const { form, input } = buildFormField('notes');
  const event = env.trigger('drop', input);
  assert.equal(event.defaultPrevented, true, 'drop should be prevented');
  const hidden = form.childNodes.find(node => node instanceof FakeElement && node.type === 'hidden');
  assert(hidden, 'hidden cp flag should be appended for drop');
});

test('keyboard paste shortcuts are blocked', () => {
  const { input } = buildFormField('answer');
  const event = env.trigger('keydown', input, { key: 'v', ctrlKey: true, metaKey: false, shiftKey: false });
  assert.equal(event.defaultPrevented, true, 'Ctrl+V should be prevented');
});

test('allowlist selector skips guarded behaviour', () => {
  env.destroy();
  env = createTestEnvironment({ allowSelector: 'input[name="allowed"]' });
  const allowedForm = env.createElement('form');
  const allowed = env.createElement('input');
  allowed.setAttribute('type', 'text');
  allowed.setAttribute('name', 'allowed');
  allowedForm.appendChild(allowed);
  env.document.body.appendChild(allowedForm);

  const blockedForm = env.createElement('form');
  const blocked = env.createElement('input');
  blocked.setAttribute('type', 'text');
  blocked.setAttribute('name', 'blocked');
  blockedForm.appendChild(blocked);
  env.document.body.appendChild(blockedForm);

  const allowedEvent = env.trigger('paste', allowed);
  assert.equal(allowedEvent.defaultPrevented, false, 'allowlisted field should permit paste');
  const blockedEvent = env.trigger('paste', blocked);
  assert.equal(blockedEvent.defaultPrevented, true, 'non-allowlisted field should be blocked');
  const hidden = blockedForm.childNodes.find(node => node instanceof FakeElement && node.type === 'hidden');
  assert(hidden, 'blocked field should receive cp flag');
});

test('hidden cp fields are only added to attempted inputs', () => {
  const form = env.createElement('form');
  const typed = env.createElement('input');
  typed.setAttribute('type', 'text');
  typed.setAttribute('name', 'typed');
  const pasted = env.createElement('input');
  pasted.setAttribute('type', 'text');
  pasted.setAttribute('name', 'pasted');
  form.appendChild(typed);
  form.appendChild(pasted);
  env.document.body.appendChild(form);

  env.trigger('paste', pasted);

  const names = form.childNodes
    .filter(node => node instanceof FakeElement && node.name)
    .map(node => node.name);
  assert.deepEqual(names.sort(), ['pasted', 'pasted__cp', 'typed']);
});

test('warning automatically hides after configured duration', async () => {
  env.destroy();
  env = createTestEnvironment({ warnDuration: 10 });
  const { input } = buildFormField('autoHide');
  env.trigger('paste', input);
  const warning = input.nextSibling;
  assert.equal(warning.style.display, 'block');
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.equal(warning.style.display, 'none');
});
