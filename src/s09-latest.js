/*
 * Section 09 — Out-of-order responses
 *
 * Returns a function track(promise).
 * Every call gets a number.
 * Only the MOST RECENT call's result counts.
 *
 * result:
 * { stale: false, value }  → latest request
 * { stale: true }          → older request
 *
 * If promise rejects:
 * - Latest request → rethrow error
 * - Older request → return { stale: true }
 */

export function createLatestOnly() {
  let latest = 0;

  return async (promise) => {
    latest++;

    const mine = latest;

    try {
      const value = await promise;

      if (mine === latest) {
        return {
          stale: false,
          value,
        };
      }

      return {
        stale: true,
      };

    } catch (error) {

      if (mine === latest) {
        throw error;
      }

      return {
        stale: true,
      };
    }
  };
}

/*
 * STRETCH — debounce(fn, ms)
 *
 * Waits until fn has NOT been called for ms milliseconds.
 * Then calls fn once with the LAST arguments.
 *
 * Example:
 * Typing "learn" quickly → searches only for "learn".
 */

export function debounce(fn, ms) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}