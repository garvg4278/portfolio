// Small formatting helpers.

/**
 * "2026-10-24" -> "24 October 2026". Returns the input unchanged if it is not a valid date.
 * @param {string} iso
 */
export const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
};

/**
 * Reading progress from 0 to 1.
 * @param {number} scrollY
 * @param {number} docHeight total scroll height
 * @param {number} viewport window height
 */
export const scrollProgress = (scrollY, docHeight, viewport) => {
  const max = docHeight - viewport;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / max));
};
