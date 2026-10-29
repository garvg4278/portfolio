// Minimal HTTP client with a timeout and normalised errors. Every network call in the site goes through here.

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{status?: number, kind: 'http' | 'network' | 'timeout'}} details
   */
  constructor(message, { status, kind }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.kind = kind;
  }
}

/**
 * POST JSON and resolve only for a 2xx response.
 * @param {string} url
 * @param {unknown} body
 * @param {{timeoutMs?: number, fetchImpl?: typeof fetch}} [options]
 * @returns {Promise<{status: number}>}
 * @throws {ApiError} for non-2xx responses, network failures and timeouts
 */
export async function postJson(url, body, { timeoutMs = 10000, fetchImpl = globalThis.fetch } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new ApiError(`Request failed with status ${res.status}`, { status: res.status, kind: 'http' });
    return { status: res.status };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err && /** @type {any} */ (err).name === 'AbortError') throw new ApiError('The request timed out', { kind: 'timeout' });
    throw new ApiError('The network request failed', { kind: 'network' });
  } finally {
    clearTimeout(timer);
  }
}
