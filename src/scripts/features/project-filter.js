// Projects page: category filter with a live count, URL-hash deep links and no layout jump.
import { createStore } from '../../lib/store.js';
import { safe } from '../../lib/safe.js';

export function initProjectFilter() {
  safe('project-filter', () => {
    const grid = /** @type {HTMLElement | null} */ (document.querySelector('[data-grid]'));
    if (!grid) return;
    const items = /** @type {HTMLElement[]} */ ([...grid.querySelectorAll(':scope > li')]);
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('.pj__bar button')]);
    const count = document.querySelector('[data-count]');
    const known = new Set(buttons.map((b) => b.dataset.f));
    const store = createStore({ filter: 'all', push: false });

    store.subscribe(({ filter, push }, prev) => {
      if (filter === prev.filter && !push && grid.dataset.ready) return;
      grid.dataset.ready = '1';
      grid.style.minHeight = `${grid.offsetHeight}px`; // hold the height so the page below does not jump
      let shown = 0;
      for (const li of items) {
        const show = filter === 'all' || li.dataset.cat === filter;
        li.hidden = !show;
        li.classList.remove('pop');
        if (show) { shown++; void li.offsetWidth; li.classList.add('pop'); }
      }
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
      if (count) count.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}.`;
      if (push) history.replaceState(null, '', filter === 'all' ? location.pathname : `#${filter}`);
      setTimeout(() => { grid.style.minHeight = ''; }, 350);
    });

    buttons.forEach((b) => b.addEventListener('click', () => store.set({ filter: b.dataset.f ?? 'all', push: true })));
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (known.has(h)) store.set({ filter: h, push: false });
    };
    fromHash();
    addEventListener('hashchange', fromHash);
  });
}
