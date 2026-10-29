import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutFlow, wrapLabel } from '../src/lib/flow-layout.js';

test('short labels stay on one line, long labels wrap to at most two', () => {
  assert.deepEqual(wrapLabel('GHCR'), ['GHCR']);
  assert.deepEqual(wrapLabel('Build and check'), ['Build and', 'check']);
  assert.ok(wrapLabel('A very long label that keeps going and going').length <= 2);
});
for (const n of [1, 2, 3, 4, 5, 6]) {
  test(`${n} steps: all nodes inside the canvas, ${n - 1} edges`, () => {
    const l = layoutFlow(Array.from({ length: n }, (_, i) => `Step ${i + 1}`));
    assert.equal(l.nodes.length, n);
    assert.equal(l.edges.length, n - 1);
    for (const nd of l.nodes) {
      assert.ok(nd.x - l.bw / 2 >= 0 && nd.x + l.bw / 2 <= l.width, `x in bounds for ${nd.i}`);
      assert.ok(nd.y - l.bh / 2 >= 0 && nd.y + l.bh / 2 <= l.height, `y in bounds for ${nd.i}`);
    }
  });
}
test('second row flows right to left (snake)', () => {
  const l = layoutFlow(['a', 'b', 'c', 'd', 'e']);
  assert.ok(l.nodes[3].x > l.nodes[4].x);
  assert.equal(l.nodes[2].x, l.nodes[3].x);
});
