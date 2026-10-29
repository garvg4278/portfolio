// Copy buttons (email address, code snippets): copy, show "Copied", announce politely to screen readers.
import { safe } from '../../lib/safe.js';
import { copyToClipboard } from '../../lib/clipboard.js';

export function initCopyButtons() {
  safe('copy', () => {
    const live = document.getElementById('live-status');
    document.addEventListener('click', async (e) => {
      const btn = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (e.target).closest('[data-copy-text]'));
      if (!btn) return;
      const label = btn.querySelector('[data-copy-label]') ?? btn;
      const original = btn.dataset.label ?? label.textContent ?? 'Copy';
      btn.dataset.label = original;
      const ok = await copyToClipboard(btn.dataset.copyText ?? '');
      label.textContent = ok ? 'Copied' : 'Copy failed';
      if (live) live.textContent = ok ? `Copied: ${btn.dataset.copyName ?? 'text'}` : 'Copy failed. Select the text and copy it manually.';
      clearTimeout(Number(btn.dataset.timer));
      btn.dataset.timer = String(setTimeout(() => { label.textContent = original; }, 1800));
    });
  });
}
