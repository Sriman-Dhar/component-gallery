import { useEffect, useRef, type RefObject } from 'react';
import { gsap, motionAllowed } from '../../lib/motion';
import type { StageTheme } from './StageControls';

/**
 * The stage theme cross-fades: on a switch, a veil painted in the old stage colour sits over the new one and
 * fades out over 320ms, while a warm rim pulses along the top edge, so the grid, the wash and the demo all
 * turn together instead of cutting. Reduced motion: the switch is instant.
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
      .fromTo(el, { opacity: 1 }, { opacity: 0, duration: 0.32, ease: 'power2.out' })
      .fromTo(line, { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power3.out' }, 0)
      .to(line, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.2);
    return () => {
      tl.kill();
      gsap.set([el, line], { opacity: 0 });
    };
  }, [veil, rim, theme]);
}
