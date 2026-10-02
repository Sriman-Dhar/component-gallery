import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from '../../lib/motion';

/**
 * True while anything of the scene is on screen. The index canvas is fixed and the story runs to the coda,
 * so it always is; the detail and 404 canvases sit at the top of the page and scroll away with it.
 */
function sceneVisible(fixed: boolean, canvas: HTMLCanvasElement): boolean {
  return fixed || window.scrollY < canvas.offsetHeight;
}

/**
 * The single loop. The canvas never runs its own rAF (frameloop "never"): GSAP's ticker, which already
 * drives every DOM tween on the page, advances the scene. Paused in a hidden tab and once the scene has
 * scrolled away (the canvas is hidden too, so the compositor skips it). Still mode renders on demand only (resize, theme, and on scroll for the fixed index still).
 */
export default function FrameDriver({ still, redraw, fixed }: { still: boolean; redraw: number; fixed: boolean }) {
  const advance = useThree((s) => s.advance);
  const canvas = useThree((s) => s.gl.domElement);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!still) return;
    const id = requestAnimationFrame(() => advance(performance.now() / 1000));
    // The fixed still keeps its frozen frame but re-draws on scroll (the browser fires scroll once per frame, so no
    // loop of its own), so its veils follow the type they keep clear of.
    const scrolled = () => advance(performance.now() / 1000);
    if (fixed) window.addEventListener('scroll', scrolled, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', scrolled);
    };
  }, [still, fixed, advance, size, redraw]);

  useEffect(() => {
    if (still) return;
    let shown = true;
    const tick = (time: number) => {
      const visible = !document.hidden && sceneVisible(fixed, canvas);
      if (visible !== shown) {
        shown = visible;
        canvas.style.visibility = visible ? 'visible' : 'hidden';
      }
      if (visible) advance(time);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [still, advance, canvas, fixed]);

  return null;
}
