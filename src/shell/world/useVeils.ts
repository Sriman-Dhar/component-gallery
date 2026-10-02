import { useEffect } from 'react';
import { measureVeils, world } from './worldState';

/**
 * Measures the page's veil boxes (data-world-veil: the type the scene keeps clear of) on mount, once the
 * fonts and the route transition settle, on resize, and whenever the page's height changes (late demos and
 * previews move the coda and footer down). A second late read lands after the hero words' own rise. `still`: the
 * reduced-motion frame, which also keeps clear of data-world-veil-still. Cleared on unmount, so no route inherits another's.
 */
export function useVeils(still: boolean): void {
  useEffect(() => {
    const measure = () => measureVeils(still);
    measure();
    const late = window.setTimeout(measure, 900);
    const settled = window.setTimeout(measure, 1800);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    const page = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    page?.observe(document.body);
    return () => {
      page?.disconnect();
      window.clearTimeout(late);
      window.clearTimeout(settled);
      window.removeEventListener('resize', measure);
      world.veil.forEach((box) => (box.width = 0));
    };
  }, [still]);
}
