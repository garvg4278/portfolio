// Mounts a decorative 3D scene in a page header, lazily, with the pointer tracked over the whole page.
import { safe } from '../../lib/safe.js';
import { lazyScene } from './lazy-scene.js';

/**
 * @param {string} selector
 * @param {string} variant
 * @param {Record<string, unknown>} [extra]
 */
export function initPageScene(selector, variant, extra = {}) {
  safe(`scene:${variant}`, () => {
    const el = /** @type {HTMLElement | null} */ (document.querySelector(selector));
    if (el) lazyScene(el, { variant, pointerHost: document.body, ...extra });
  });
}
