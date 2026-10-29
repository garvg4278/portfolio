// Page chrome: reading-progress bar and the back-to-top button.
import { safe } from '../../lib/safe.js';
import { scrollProgress } from '../../lib/format.js';

export function initScrollChrome() {
  safe('scroll-chrome', () => {
    const bar = document.querySelector('[data-progress]');
    const top = /** @type {HTMLButtonElement | null} */ (document.querySelector('[data-totop]'));
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      bar?.style.setProperty('--p', scrollProgress(y, document.documentElement.scrollHeight, window.innerHeight).toFixed(4));
      if (top) top.hidden = y < 900;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
    top?.addEventListener('click', () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      document.getElementById('main')?.focus({ preventScroll: true });
    });
  });
}
