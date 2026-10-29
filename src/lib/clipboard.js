// Copy text with the async Clipboard API and a legacy fallback. Dependencies are injectable for tests.

/**
 * @param {string} text
 * @param {{clipboard?: {writeText: (t: string) => Promise<void>} | null, legacy?: (t: string) => boolean}} [env]
 * @returns {Promise<boolean>} true when the text was copied
 */
export async function copyToClipboard(text, env = {}) {
  const clipboard = env.clipboard === undefined ? globalThis.navigator?.clipboard : env.clipboard;
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the legacy path (for example when permission is denied) */
    }
  }
  return (env.legacy ?? legacyCopy)(text);
}

/** @param {string} text */
function legacyCopy(text) {
  if (typeof document === 'undefined') return false;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
