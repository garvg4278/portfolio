import test from 'node:test';
import assert from 'node:assert/strict';
import { submitContact, buildMailto } from '../src/lib/api/contact.js';
import { postJson, ApiError } from '../src/lib/api/http.js';

const v = { name: 'Asha', email: 'asha@example.com', subject: 'Role & team', message: 'Hello there, a longer message.' };
const to = 'me@example.com';
const res = (status) => async () => ({ ok: status >= 200 && status < 300, status });

test('without an endpoint it composes an email and does NOT claim success', async () => {
  const r = await submitContact(v, { endpoint: '', to });
  assert.equal(r.kind, 'compose');
  assert.match(r.message, /Nothing has been sent yet/);
  assert.ok(r.mailto.startsWith(`mailto:${to}?subject=Role%20%26%20team`));
});
test('mailto encodes subject and body', () => {
  const m = buildMailto(v, to);
  assert.ok(m.includes(encodeURIComponent('Hello there')));
  assert.ok(!m.includes(' '));
});
test('reports success only after an OK response', async () => {
  const r = await submitContact(v, { endpoint: 'https://f.example/x', to, fetchImpl: res(200) });
  assert.equal(r.kind, 'sent');
});
test('a rejected response is reported as not sent', async () => {
  const r = await submitContact(v, { endpoint: 'https://f.example/x', to, fetchImpl: res(422) });
  assert.equal(r.kind, 'rejected');
  assert.match(r.message, /422/);
  assert.match(r.message, /Nothing was sent/);
});
test('a network failure is reported as not sent', async () => {
  const r = await submitContact(v, { endpoint: 'https://f.example/x', to, fetchImpl: async () => { throw new TypeError('fail'); } });
  assert.equal(r.kind, 'unreachable');
});
test('a timeout is reported as not sent', async () => {
  const slow = (_u, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('x'), { name: 'AbortError' }))));
  const r = await submitContact(v, { endpoint: 'https://f.example/x', to, fetchImpl: slow, timeoutMs: 20 });
  assert.equal(r.kind, 'unreachable');
  assert.match(r.message, /timed out/);
});
test('postJson throws ApiError with status for non-2xx', async () => {
  await assert.rejects(() => postJson('https://f.example', {}, { fetchImpl: res(500) }), (e) => e instanceof ApiError && e.status === 500 && e.kind === 'http');
});
