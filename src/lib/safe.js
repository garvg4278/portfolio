// Run a UI feature without letting one failure break the rest of the page.

/**
 * @param {string} name used in the console message
 * @param {() => void} fn
 */
export function safe(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[${name}] feature failed to start:`, err);
  }
}
