import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme, nextTheme, toggleLabel, themeColor } from '../src/lib/theme.js';
import { copyToClipboard } from '../src/lib/clipboard.js';
import { formatDate, scrollProgress } from '../src/lib/format.js';

test('theme: dark by default, light only when explicitly saved, garbage falls back to dark', () => {
  assert.equal(resolveTheme(null), 'dark');
  assert.equal(resolveTheme(undefined), 'dark');
  assert.equal(resolveTheme('light'), 'light');
  assert.equal(resolveTheme('dark'), 'dark');
  assert.equal(resolveTheme('<script>'), 'dark');
});
test('theme: toggle flips, label names the action, browser colour matches', () => {
  assert.equal(nextTheme('dark'), 'light');
  assert.equal(nextTheme('light'), 'dark');
  assert.match(toggleLabel('dark'), /light/);
  assert.match(toggleLabel('light'), /dark/);
  assert.equal(themeColor('dark'), '#000000');
  assert.equal(themeColor('light'), '#f5eaec');
});
test('clipboard: uses the async API when it works', async () => {
  let got = '';
  assert.equal(await copyToClipboard('hello', { clipboard: { writeText: async (t) => { got = t; } } }), true);
  assert.equal(got, 'hello');
});
test('clipboard: falls back when the API throws or is missing', async () => {
  const legacy = () => true;
  assert.equal(await copyToClipboard('x', { clipboard: { writeText: async () => { throw new Error('denied'); } }, legacy }), true);
  assert.equal(await copyToClipboard('x', { clipboard: null, legacy }), true);
  assert.equal(await copyToClipboard('x', { clipboard: null, legacy: () => false }), false);
});
test('format: dates', () => {
  assert.equal(formatDate('2026-10-24'), '24 October 2026');
  assert.equal(formatDate('not-a-date'), 'not-a-date');
});
test('format: scroll progress is clamped and safe on short pages', () => {
  assert.equal(scrollProgress(0, 2000, 800), 0);
  assert.equal(scrollProgress(600, 2000, 800), 0.5);
  assert.equal(scrollProgress(5000, 2000, 800), 1);
  assert.equal(scrollProgress(0, 700, 800), 0);
  assert.equal(scrollProgress(-50, 2000, 800), 0);
});
