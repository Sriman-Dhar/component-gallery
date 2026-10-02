import { useEffect, useState } from 'react';
import { measureBox, world } from './worldState';

/** Clear space kept between the bottom of the close-orbit canvas and the stage (px). */
const STAGE_GAP = 24;

/**
 * Detail page: the close-orbit canvas runs from the top of the page down to just above the stage (the
 * component must stay crisp, so no WebGL behind it), and the body sits on the header's № glyph. Measures
 * both on mount, once fonts and the route transition settle, and on resize; returns the canvas height.
 */
export function useCloseFrame(on: boolean): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!on) return;
    const measure = () => {
      const stage = document.getElementById('stage');
      measureBox(world.close, document.querySelector('[data-world-anchor="close"]'));
      if (stage) setHeight(Math.max(240, Math.round(stage.getBoundingClientRect().top + window.scrollY - STAGE_GAP)));
    };
    measure();
    const late = window.setTimeout(measure, 900);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(late);
      window.removeEventListener('resize', measure);
      measureBox(world.close, null);
    };
  }, [on]);
  return height;
}
