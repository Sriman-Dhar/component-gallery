import { useSyncExternalStore } from 'react';

/**
 * The pathname of the view on screen, which trails the location by the leaving view's fade (RouteTransition).
 * The scene follows it, so the old world holds and fades under the route carry instead of cutting on click.
 */
let shown: string | null = null;
const listeners = new Set<() => void>();

export function setShownPath(path: string): void {
  if (path === shown) return;
  shown = path;
  listeners.forEach((fn) => fn());
}

/** Records the first view's pathname without a notify, so the first route change already trails it. */
export function primeShownPath(path: string): void {
  shown ??= path;
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** The shown view's pathname; `fallback` (the location's) until the first swap. */
export function useShownPath(fallback: string): string {
  return useSyncExternalStore(subscribe, () => shown) ?? fallback;
}
