import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, isValidEmail, summarizeErrors, MESSAGE_MIN } from '../src/lib/validation.js';

const ok = { name: 'Asha Rao', email: 'asha@example.com', subject: 'Hiring', message: 'We would like to talk about a DevOps role.' };

test('accepts a complete, valid message', () => assert.deepEqual(validateContact(ok), {}));
test('rejects every empty field and names each one', () => {
  const errors = validateContact({ name: '', email: '', subject: '', message: '' });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name', 'subject']);
});
test('email check', () => {
  for (const good of ['a@b.co', 'first.last+tag@sub.example.org']) assert.equal(isValidEmail(good), true, good);
  for (const bad of ['', 'bad', 'a@b', 'a b@c.com', '@x.com', 'a@b.c']) assert.equal(isValidEmail(bad), false, bad);
});
test('message length boundary', () => {
  assert.ok(validateContact({ ...ok, message: 'x'.repeat(MESSAGE_MIN - 1) }).message);
  assert.equal(validateContact({ ...ok, message: 'x'.repeat(MESSAGE_MIN) }).message, undefined);
});
test('whitespace-only input is invalid', () => assert.ok(validateContact({ ...ok, name: '   ' }).name));
test('summary wording', () => {
  assert.match(summarizeErrors(1), /1 field needs attention/);
  assert.match(summarizeErrors(3), /3 fields need attention/);
});
