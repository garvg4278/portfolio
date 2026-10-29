// Education page: open a certificate full size in a native <dialog>, restore focus on close.
import { safe } from '../../lib/safe.js';

export function initCertViewer() {
  safe('cert-viewer', () => {
    const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('cert-dialog'));
    if (!dlg) return;
    const img = /** @type {HTMLImageElement} */ (dlg.querySelector('[data-img]'));
    const cap = /** @type {HTMLElement} */ (dlg.querySelector('[data-cap]'));
    const frame = /** @type {HTMLElement} */ (dlg.querySelector('[data-frame]'));
    img.addEventListener('load', () => frame.classList.remove('is-loading'));
    img.addEventListener('error', () => { frame.classList.remove('is-loading'); cap.textContent = 'The certificate image could not be loaded.'; });
    /** @type {HTMLElement | null} */
    let opener = null;
    document.addEventListener('click', (e) => {
      const t = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest('.cc__thumb'));
      if (t) {
        opener = t;
        frame.classList.add('is-loading');
        img.src = t.dataset.full ?? '';
        img.alt = `Full certificate: ${t.dataset.title ?? ''}`;
        cap.textContent = t.dataset.title ?? '';
        dlg.showModal();
        return;
      }
      if (e.target === dlg) dlg.close(); // click on the backdrop
    });
    dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus(); });
  });
}
