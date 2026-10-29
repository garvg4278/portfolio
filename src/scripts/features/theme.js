// Theme toggle: reads the saved choice, applies it, and keeps the button label and browser colour in sync.
import { createStore } from '../../lib/store.js';
import { safe } from '../../lib/safe.js';
import { resolveTheme, nextTheme, toggleLabel, themeColor, STORAGE_KEY } from '../../lib/theme.js';

export function initThemeToggle() {
  safe('theme', () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    const store = createStore({ theme: resolveTheme(document.documentElement.dataset.theme) });
    store.subscribe(({ theme }) => {
      document.documentElement.dataset.theme = theme;
      button.setAttribute('aria-label', toggleLabel(theme));
      button.setAttribute('aria-pressed', String(theme === 'light'));
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor(theme));
    });
    button.addEventListener('click', () => {
      const theme = nextTheme(store.get().theme);
      store.set({ theme });
      try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* storage can be blocked; the choice then lasts for this page only */ }
    });
  });
}
