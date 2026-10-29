// Contact form UI: wires the DOM to the validation and submission logic in src/lib.
import { rules, validateContact, summarizeErrors } from '../../lib/validation.js';
import { submitContact } from '../../lib/api/contact.js';
import { safe } from '../../lib/safe.js';
import { confirmAction } from './confirm.js';

const FIELDS = /** @type {const} */ (['name', 'email', 'subject', 'message']);

export function initContactForm() {
  safe('contact-form', () => {
    const form = /** @type {HTMLFormElement | null} */ (document.querySelector('form.cf'));
    if (!form) return;
    const endpoint = form.dataset.endpoint || '';
    const to = form.dataset.to || '';
    const status = /** @type {HTMLElement} */ (form.querySelector('[data-status]'));
    const summary = /** @type {HTMLElement} */ (form.querySelector('.cf__summary'));
    const copyBtn = /** @type {HTMLButtonElement} */ (form.querySelector('[data-copy]'));
    const submitBtn = /** @type {HTMLButtonElement} */ (form.querySelector('button[type=submit]'));
    const clearBtn = /** @type {HTMLButtonElement} */ (form.querySelector('[data-clear]'));
    const input = (/** @type {string} */ n) => /** @type {HTMLInputElement} */ (form.elements.namedItem(n));
    let lastText = '';

    const setError = (/** @type {string} */ name, /** @type {string} */ message) => {
      const out = document.getElementById(`cf-${name}-err`);
      if (out) { out.textContent = message; out.hidden = !message; }
      input(name).setAttribute('aria-invalid', String(Boolean(message)));
    };
    const setStatus = (/** @type {string} */ message, /** @type {'ok' | ''} */ kind = '') => {
      status.textContent = message;
      if (kind) status.dataset.kind = kind; else status.removeAttribute('data-kind');
    };

    for (const name of FIELDS) {
      input(name).addEventListener('blur', () => { if (input(name).value) setError(name, rules[name](input(name).value)); });
      input(name).addEventListener('input', () => { if (input(name).getAttribute('aria-invalid') === 'true') setError(name, rules[name](input(name).value)); });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('');
      copyBtn.hidden = true;
      const values = /** @type {import('../../lib/validation.js').ContactValues} */ (Object.fromEntries(FIELDS.map((n) => [n, input(n).value])));
      const errors = validateContact(values);
      for (const name of FIELDS) setError(name, errors[name] ?? '');
      const bad = FIELDS.filter((n) => errors[n]);
      if (bad.length) { summary.hidden = false; summary.textContent = summarizeErrors(bad.length); input(bad[0]).focus(); return; }
      summary.hidden = true;
      if (input('_gotcha').value) return; // honeypot: silently ignore bots

      submitBtn.disabled = true;
      submitBtn.classList.add('is-busy');
      form.setAttribute('aria-busy', 'true');
      if (endpoint) setStatus('Sending…');
      const result = await submitContact(values, { endpoint, to });
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-busy');
      form.removeAttribute('aria-busy');
      lastText = result.copyText;
      setStatus(result.message, result.kind === 'sent' ? 'ok' : '');
      if (result.kind === 'sent') form.reset();
      else copyBtn.hidden = false;
      if (result.kind === 'compose' && result.mailto) window.location.href = result.mailto;
    });

    clearBtn.addEventListener('click', async () => {
      const hasText = FIELDS.some((n) => input(n).value.trim());
      if (hasText) {
        const yes = await confirmAction({ title: 'Clear the form?', message: 'The text you have typed will be removed. This cannot be undone.', confirmLabel: 'Clear form', cancelLabel: 'Keep editing' });
        if (!yes) return;
      }
      form.reset();
      for (const n of FIELDS) setError(n, '');
      summary.hidden = true;
      copyBtn.hidden = true;
      setStatus('Form cleared.');
      input('name').focus();
    });

    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(lastText); setStatus(`Message copied. Paste it into an email to ${to}.`, 'ok'); }
      catch { setStatus('Copy is not available in this browser. Select the text in the message box and copy it manually.'); }
    });
  });
}
