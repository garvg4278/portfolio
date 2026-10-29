// Page-wide visual effects: scroll reveal for headings and grids, and the project-card tilt.
import { safe } from '../../lib/safe.js';

export function initReveal() {
  safe('reveal', () => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
  });
}

/** Perspective tilt: fine pointers only, never with reduced motion. */
export function initTilt() {
  safe('tilt', () => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cardOf = (/** @type {EventTarget | null} */ t) => /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (t).closest?.('[data-tilt]') ?? null);
    document.addEventListener('pointermove', (ev) => {
      const card = cardOf(ev.target);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
      card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
    document.addEventListener('pointerout', (ev) => {
      const card = cardOf(ev.target);
      if (card && !card.contains(/** @type {Node | null} */ (ev.relatedTarget))) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
    });
  });
}
