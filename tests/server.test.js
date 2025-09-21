import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server/app.js';

async function withServer(fn) {
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  try {
    await fn(port, server);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('server injects paste guard script into html responses', async () => {
  await withServer(async port => {
    const res = await fetch(`http://127.0.0.1:${port}/index.html`);
    assert.equal(res.ok, true);
    const html = await res.text();
    assert(html.includes('<script defer src="/assets/js/paste-guard.js"></script>'));
  });
});

test('server captures cp flags on submission', async () => {
  await withServer(async (port, server) => {
    const body = 'answer=typed&answer__cp=1&notes=manual';
    const res = await fetch(`http://127.0.0.1:${port}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    assert.equal(res.ok, true);
    const payload = await res.json();
    assert.deepEqual(payload.data, { answer: 'typed', notes: 'manual' });
    assert.equal(payload.flags.answer, '[CP]');
    assert.equal(payload.flags.notes, '');
    assert.deepEqual(payload.attempted, ['answer']);
    assert.equal(server.submissions.length > 0, true);
  });
});
