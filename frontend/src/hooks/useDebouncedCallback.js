import { useRef, useCallback, useEffect } from 'react';

/**
 * Returns a debounced version of `fn`. Used for auto-save and live search
 * so we don't fire a request on every keystroke.
 */
export function useDebouncedCallback(fn, delay = 800) {
  const timer = useRef(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const debounced = useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay]
  );

  // Cancel any pending call on unmount.
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  return debounced;
}
