import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/lib/store.js';
import { qualityFor, isSoftwareRenderer, forcedByUrl } from '../src/lib/scene-config.js';
import { safe } from '../src/lib/safe.js';

test('store: subscribe fires immediately and on change; unsubscribe stops it', () => {
  const s = createStore({ a: 1, b: 2 });
  const seen = [];
  const off = s.subscribe((st) => seen.push(st.a));
  s.set({ a: 5 });
  off();
  s.set({ a: 9 });
  assert.deepEqual(seen, [1, 5]);
  assert.deepEqual(s.get(), { a: 9, b: 2 });
});
test('store: functional updates and previous state', () => {
  const s = createStore({ n: 1 });
  let prev;
  s.subscribe((_st, p) => { prev = p.n; });
  s.set((st) => ({ n: st.n + 1 }));
  assert.equal(prev, 1);
  assert.equal(s.get().n, 2);
});
test('scene quality: mobile and coarse pointers get the lighter profile', () => {
  const desktop = qualityFor({ coarsePointer: false, width: 1440 });
  const phone = qualityFor({ coarsePointer: true, width: 390 });
  assert.ok(phone.dust < desktop.dust && phone.dprCap < desktop.dprCap && !phone.antialias && desktop.antialias);
  assert.equal(qualityFor({ coarsePointer: false, width: 600 }).mobile, true);
});
test('software renderers are detected; real GPUs are not', () => {
  for (const n of ['Google SwiftShader', 'llvmpipe (LLVM 15)', 'Microsoft Basic Render Driver']) assert.equal(isSoftwareRenderer(n), true, n);
  for (const n of ['ANGLE (NVIDIA GeForce RTX 3060)', 'Apple M2', 'Mali-G78']) assert.equal(isSoftwareRenderer(n), false, n);
  assert.equal(forcedByUrl('?scene=force'), true);
  assert.equal(forcedByUrl(''), false);
});
test('safe() contains a failing feature', () => {
  const original = console.error; let logged = 0; console.error = () => { logged++; };
  assert.doesNotThrow(() => safe('x', () => { throw new Error('boom'); }));
  console.error = original;
  assert.equal(logged, 1);
});
