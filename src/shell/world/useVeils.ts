import { useEffect } from 'react';
import { measureVeils, world } from './worldState';

/**
 * Measures the page's veil boxes (data-world-veil: the type the scene keeps clear of) on mount, once the
 * fonts and the route transition settle, and on resize. Cleared on unmount, so no route inherits another's.
 */
export function useVeils(): void {
  useEffect(() => {
    measureVeils();
    const late = window.setTimeout(measureVeils, 900);
    document.fonts?.ready.then(measureVeils);
    window.addEventListener('resize', measureVeils);
    return () => {
      window.clearTimeout(late);
      window.removeEventListener('resize', measureVeils);
      world.veil.forEach((box) => (box.width = 0));
    };
  }, []);
}
