import { useLayoutEffect, useState, type RefObject } from 'react';

/** Below this overlay width the panel becomes a full-width top sheet. Measured on the overlay, not the window, so the stage's 375 frame gets the sheet on a wide screen. */
export const SHEET_BELOW = 640;

function coarsePointer(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Sheet or floating panel, from the overlay's own width and the pointer. Also keeps `--pal-vvh` at the height of the
 * visual viewport below the overlay's top, so a top sheet never sits under the on-screen keyboard.
 */
export function usePaletteLayout(overlay: RefObject<HTMLElement>, hostWidth: number) {
  // The first frame already has the right layout (the iris measures it): start from the host's width.
  const [narrow, setNarrow] = useState(() => hostWidth > 0 && hostWidth < SHEET_BELOW);
  const [coarse] = useState(coarsePointer);

  useLayoutEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const measure = () => setNarrow(el.clientWidth > 0 && el.clientWidth < SHEET_BELOW);
    const vv = window.visualViewport;
    const fit = () => {
      if (!vv) return;
      const top = Math.max(0, el.getBoundingClientRect().top);
      el.style.setProperty('--pal-vvh', `${Math.round(vv.height + vv.offsetTop - top)}px`);
    };
    measure();
    fit();
    vv?.addEventListener('resize', fit);
    if (typeof ResizeObserver === 'undefined') return () => vv?.removeEventListener('resize', fit);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      vv?.removeEventListener('resize', fit);
    };
  }, [overlay]);

  return { compact: narrow || coarse, coarse };
}
