// A tiny observable store. UI features keep their state here and render from it, instead of scattering variables.

/**
 * @template T
 * @param {T} initial
 */
export function createStore(initial) {
  /** @type {T} */
  let state = initial;
  /** @type {Set<(state: T, prev: T) => void>} */
  const listeners = new Set();
  return {
    get: () => state,
    /** @param {Partial<T> | ((state: T) => Partial<T>)} patch */
    set(patch) {
      const prev = state;
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      listeners.forEach((fn) => fn(state, prev));
    },
    /**
     * Calls `fn` immediately and on every change. Returns an unsubscribe function.
     * @param {(state: T, prev: T) => void} fn
     */
    subscribe(fn) {
      listeners.add(fn);
      fn(state, state);
      return () => listeners.delete(fn);
    },
  };
}
