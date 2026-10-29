// Theme choice. Dark is the brand default; the visitor can switch to light and the choice is remembered.

export const THEMES = /** @type {const} */ (['dark', 'light']);
export const STORAGE_KEY = 'theme';

/** @param {unknown} stored value read from localStorage (may be null, garbage or missing) */
export const resolveTheme = (stored) => (stored === 'light' ? 'light' : 'dark');

/** @param {string} current */
export const nextTheme = (current) => (current === 'light' ? 'dark' : 'light');

/** Label for the toggle button: it names the action, not the current state. */
export const toggleLabel = (/** @type {string} */ current) => (current === 'light' ? 'Switch to dark theme' : 'Switch to light theme');

/** Browser UI colour (address bar) for each theme. */
export const themeColor = (/** @type {string} */ theme) => (theme === 'light' ? '#f5eaec' : '#000000');
