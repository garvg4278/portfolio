// Contact-form validation rules. Pure functions, shared by the UI and the unit tests.

/** @typedef {{name: string, email: string, subject: string, message: string}} ContactValues */
/** @typedef {Partial<Record<keyof ContactValues, string>>} ContactErrors */

export const MESSAGE_MIN = 20;

/** @param {string} value */
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/** @type {Record<keyof ContactValues, (value: string) => string>} Each rule returns an error message, or '' when valid. */
export const rules = {
  name: (v) => (v.trim().length < 2 ? 'Enter your name.' : ''),
  email: (v) => (isValidEmail(v) ? '' : 'Enter a valid email address, like name@example.com.'),
  subject: (v) => (v.trim().length < 3 ? 'Enter a subject of at least 3 characters.' : ''),
  message: (v) => (v.trim().length < MESSAGE_MIN ? `Write at least ${MESSAGE_MIN} characters so I have enough to reply to.` : ''),
};

/**
 * @param {ContactValues} values
 * @returns {ContactErrors} Only the invalid fields are present.
 */
export const validateContact = (values) => {
  /** @type {ContactErrors} */
  const errors = {};
  for (const key of /** @type {(keyof ContactValues)[]} */ (Object.keys(rules))) {
    const message = rules[key](values[key] ?? '');
    if (message) errors[key] = message;
  }
  return errors;
};

/**
 * @param {number} count
 * @returns {string} The summary shown above the form.
 */
export const summarizeErrors = (count) => `${count} ${count === 1 ? 'field needs' : 'fields need'} attention. Fix ${count === 1 ? 'it' : 'them'} and try again.`;
