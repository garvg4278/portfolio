// Interactive architecture flow: select a step to read it and highlight its connections.
import { createStore } from '../../lib/store.js';
import { safe } from '../../lib/safe.js';

export function initFlowDiagrams() {
  document.querySelectorAll('[data-flow]').forEach((root) => safe('flow-diagram', () => {
    const steps = JSON.parse(root.querySelector('[data-steps]')?.textContent || '[]');
    if (!steps.length) return;
    const items = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('.flow__step')]);
    const title = root.querySelector('[data-title]');
    const detail = root.querySelector('[data-detail]');
    const store = createStore({ index: 0 });
    store.subscribe(({ index }) => {
      items.forEach((li, k) => {
        const button = /** @type {HTMLElement} */ (li.querySelector('button'));
        li.classList.toggle('is-on', k === index);
        li.classList.toggle('is-link', k === index || k === index - 1); // connections into and out of the selected step
        if (k === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      });
      if (title) title.textContent = steps[index].label;
      if (detail) detail.textContent = steps[index].detail;
    });
    root.addEventListener('click', (e) => {
      const b = /** @type {HTMLElement} */ (e.target).closest('button[data-i]');
      if (b instanceof HTMLElement) store.set({ index: Number(b.dataset.i) });
    });
  }));
}
