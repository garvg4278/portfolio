// Skills page: filter by depth of experience.
import { createStore } from '../../lib/store.js';
import { safe } from '../../lib/safe.js';

export function initSkillFilter() {
  safe('skill-filter', () => {
    const root = document.querySelector('[data-skillmap]');
    if (!root) return;
    const buttons = /** @type {HTMLButtonElement[]} */ ([...root.querySelectorAll('.sm__bar button')]);
    const items = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('li[data-level]')]);
    const groups = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[data-group]')]);
    const empty = /** @type {HTMLElement | null} */ (root.querySelector('.sm__empty'));
    const store = createStore({ level: 'all' });
    store.subscribe(({ level }) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === level)));
      items.forEach((li) => { li.hidden = level !== 'all' && li.dataset.level !== level; });
      groups.forEach((g) => { g.hidden = !g.querySelector('li:not([hidden])'); });
      if (empty) empty.hidden = groups.some((g) => !g.hidden);
    });
    buttons.forEach((b) => b.addEventListener('click', () => store.set({ level: b.dataset.f ?? 'all' })));
  });
}
