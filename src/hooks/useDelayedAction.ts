import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a `later(fn, ms)` scheduler whose pending timers are all cleared on
 * unmount, so resetting or leaving a scenario never fires stale updates.
 */
export function useDelayedAction() {
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    };
  }, []);

  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);
}
