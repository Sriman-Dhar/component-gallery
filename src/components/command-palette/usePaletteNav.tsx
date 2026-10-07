import { useCallback, useState } from 'react';

export type NavKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

/** The pure step: where the light goes for a key, over `count` visible rows. Arrows wrap; Home and End jump. */
export function navStep(active: number, key: NavKey, count: number): number {
  if (count <= 0) return 0;
  switch (key) {
    case 'ArrowDown':
      return (active + 1) % count;
    case 'ArrowUp':
      return (active - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
  }
}

export function isNavKey(key: string): key is NavKey {
  return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End';
}

/**
 * The active row over the flattened visible list. A new query resets it to the first row (derived during render,
 * so there is never a frame where the old index points into the new list).
 */
export function usePaletteNav(count: number, query: string) {
  const [state, setState] = useState({ query, index: 0 });
  const raw = state.query === query ? state.index : 0;
  const active = count > 0 ? Math.min(raw, count - 1) : -1;

  const setActive = useCallback((index: number) => setState({ query, index }), [query]);
  const step = useCallback(
    (key: NavKey) => setState((s) => ({ query, index: navStep(s.query === query ? Math.min(s.index, count - 1) : 0, key, count) })),
    [query, count],
  );

  return { active, setActive, step };
}
