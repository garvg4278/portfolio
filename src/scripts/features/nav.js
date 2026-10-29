// Mobile navigation: toggle button, Escape to close, close on link click or when the viewport grows.
import { safe } from '../../lib/safe.js';

export function initNav() {
  safe('nav', () => {
    const toggle = /** @type {HTMLButtonElement | null} */ (document.querySelector('.nav__toggle'));
    const menu = document.getElementById('menu');
    if (!toggle || !menu) return;
    const setOpen = (/** @type {boolean} */ open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.dataset.open = String(open);
    };
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (e) => { if (/** @type {HTMLElement} */ (e.target).closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 901px)').addEventListener('change', (m) => m.matches && setOpen(false));
  });
}
