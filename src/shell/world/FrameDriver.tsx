import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from '../../lib/motion';
import { world } from './worldState';

/** True while anything of the scene is on screen: before the rail formed, or while the rail is in view. */
function sceneVisible(): boolean {
  if (world.dive < 0.98 || !world.rail.ok) return true;
  return world.rail.top - window.scrollY + world.rail.base + 80 > 0;
}

/**
 * The single loop. The canvas never runs its own rAF (frameloop "never"): GSAP's ticker, which already
 * drives every DOM tween on the page, advances the scene. Paused in a hidden tab and once the scene has
 * scrolled away (the canvas is hidden too, so the compositor skips it). Still mode renders on demand only.
 */
export default function FrameDriver({ still, redraw }: { still: boolean; redraw: number }) {
  const advance = useThree((s) => s.advance);
  const canvas = useThree((s) => s.gl.domElement);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!still) return;
    const id = requestAnimationFrame(() => advance(performance.now() / 1000));
    return () => cancelAnimationFrame(id);
  }, [still, advance, size, redraw]);

  useEffect(() => {
    if (still) return;
    let shown = true;
    const tick = (time: number) => {
      const visible = !document.hidden && sceneVisible();
      if (visible !== shown) {
        shown = visible;
        canvas.style.visibility = visible ? 'visible' : 'hidden';
      }
      if (visible) advance(time);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [still, advance, canvas]);

  return null;
}
