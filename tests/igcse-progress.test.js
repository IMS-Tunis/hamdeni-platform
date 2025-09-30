import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();

global.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(key, value);
  },
  clear() {
    storage.clear();
  }
};

const { fetchProgressCounts } = await import('../igcse/modules/supabase.js');

test('IGCSE student with level 1 completed is reported with 1 passed level', async () => {
  storage.clear();
  localStorage.setItem('username', 'alice');
  localStorage.setItem('platform', 'IGCSE');

  const responses = {
    theory: {
      ok: true,
      async json() {
        return [];
      },
      async text() {
        return '';
      }
    },
    level: {
      ok: true,
      async json() {
        return [
          { level_number: 1, level_done: true },
          { level_number: 2, level_done: false }
        ];
      },
      async text() {
        return '';
      }
    }
  };

  global.fetch = async url => {
    if (url.includes('theory')) return responses.theory;
    if (url.includes('programming')) return responses.level;
    throw new Error('Unexpected url: ' + url);
  };

  const result = await fetchProgressCounts();

  assert.equal(result.levels, 1);
  assert.equal(result.points, 0);
  assert.ok(result.term1Grade >= 0);
});
