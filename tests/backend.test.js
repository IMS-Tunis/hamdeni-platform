import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPasteFlags } from '../server/paste-flags.js';

test('applyPasteFlags marks attempted fields with [CP]', () => {
  const { data, flags, attempted } = applyPasteFlags([
    ['answer', 'typed'],
    ['answer__cp', '1'],
    ['notes', 'hello'],
  ]);
  assert.deepEqual(data, { answer: 'typed', notes: 'hello' });
  assert.equal(flags.answer, '[CP]');
  assert.equal(flags.notes, '');
  assert.deepEqual(attempted, ['answer']);
});

test('applyPasteFlags ignores cp markers without source field', () => {
  const { data, flags, attempted } = applyPasteFlags({ 'ghost__cp': '1', user: 'sam' });
  assert.deepEqual(data, { user: 'sam' });
  assert.equal(flags.user, '');
  assert.deepEqual(attempted, []);
});
