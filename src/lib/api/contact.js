// Contact submission. One function, three honest outcomes; it never reports success unless the form service said OK.
import { postJson, ApiError } from './http.js';

/** @typedef {import('../validation.js').ContactValues} ContactValues */
/**
 * @typedef {{kind: 'sent' | 'compose' | 'rejected' | 'unreachable', message: string, mailto?: string, copyText: string}} ContactResult
 */

/**
 * @param {ContactValues} values
 * @param {string} to
 */
export const buildMailto = (values, to) => {
  const body = `${values.message}\n\n— ${values.name} (${values.email})`;
  return `mailto:${to}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
};

/** @param {ContactValues} v */
export const copyText = (v) => `From: ${v.name} <${v.email}>\nSubject: ${v.subject}\n\n${v.message}`;

/**
 * @param {ContactValues} values
 * @param {{endpoint: string, to: string, fetchImpl?: typeof fetch, timeoutMs?: number}} config
 * @returns {Promise<ContactResult>}
 */
export async function submitContact(values, { endpoint, to, fetchImpl, timeoutMs }) {
  const text = copyText(values);
  if (!endpoint) {
    return {
      kind: 'compose',
      mailto: buildMailto(values, to),
      copyText: text,
      message: `Your email app should open with the message ready. Nothing has been sent yet: press Send there. If nothing opens, copy the message or write to ${to}.`,
    };
  }
  try {
    await postJson(endpoint, values, { fetchImpl, timeoutMs });
    return { kind: 'sent', copyText: text, message: 'Message sent. Thank you, I will reply to the email address you gave.' };
  } catch (err) {
    if (err instanceof ApiError && err.kind === 'http') {
      return { kind: 'rejected', copyText: text, message: `The form service did not accept the message (status ${err.status}). Nothing was sent. Please email ${to} instead.` };
    }
    return { kind: 'unreachable', copyText: text, message: `The message could not be sent${err instanceof ApiError && err.kind === 'timeout' ? ' (the request timed out)' : ''}. Check your connection or email ${to} directly.` };
  }
}
