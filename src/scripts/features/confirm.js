// Confirmation dialog for actions that cannot be undone. One shared <dialog id="confirm-dialog"> per page.
import { safe } from '../../lib/safe.js';

/**
 * @param {{title: string, message: string, confirmLabel?: string, cancelLabel?: string}} options
 * @returns {Promise<boolean>} true if the visitor confirmed
 */
export function confirmAction({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  const dlg = /** @type {HTMLDialogElement | null} */ (document.getElementById('confirm-dialog'));
  if (!dlg || typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  /** @type {HTMLElement} */ (dlg.querySelector('[data-title]')).textContent = title;
  /** @type {HTMLElement} */ (dlg.querySelector('[data-message]')).textContent = message;
  /** @type {HTMLElement} */ (dlg.querySelector('[data-confirm]')).textContent = confirmLabel;
  /** @type {HTMLElement} */ (dlg.querySelector('[data-cancel]')).textContent = cancelLabel;
  const opener = /** @type {HTMLElement | null} */ (document.activeElement);
  return new Promise((resolve) => {
    dlg.returnValue = 'cancel';
    dlg.addEventListener('close', () => { opener?.focus(); resolve(dlg.returnValue === 'confirm'); }, { once: true });
    dlg.showModal();
  });
}

export function initConfirmDialog() {
  safe('confirm', () => {
    const dlg = document.getElementById('confirm-dialog');
    dlg?.addEventListener('click', (e) => { if (e.target === dlg) /** @type {HTMLDialogElement} */ (dlg).close('cancel'); });
  });
}
