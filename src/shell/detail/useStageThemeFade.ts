import { useEffect, useRef, type RefObject } from 'react';
import { gsap, motionAllowed } from '../../lib/motion';
import type { StageTheme } from './StageControls';

/**
 * The stage theme wipes: on a switch, a veil painted in the old stage colour sits over the new one and is
 * wiped off left to right over 360ms, while a warm rim pulses along the top edge, so the grid, the wash and the
 * demo all turn together. A wipe, not a fade: the two colours never mix into a grey slab. Reduced motion: instant.
 */
export function useStageThemeFade(veil: RefObject<HTMLElement>, rim: RefObject<HTMLElement>, theme: StageTheme): void {
  const last = useRef(theme);
  useEffect(() => {
    const from = last.current;
    last.current = theme;
    const el = veil.current;
    const line = rim.current;
    if (from === theme || !el || !line || !motionAllowed()) return;
    el.style.background = `rgb(var(--p-stage-${from}))`;
    const tl = gsap
      .timeline()
      .fromTo(el, { opacity: 1, clipPath: 'inset(0 0 0 0%)' }, { clipPath: 'inset(0 0 0 100%)', duration: 0.36, ease: 'power2.inOut' })
      .set(el, { opacity: 0, clipPath: 'none' })
      .fromTo(line, { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power3.out' }, 0)
      .to(line, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.2);
    return () => {
      tl.kill();
      gsap.set([el, line], { opacity: 0, clipPath: 'none' });
    };
  }, [veil, rim, theme]);
}
