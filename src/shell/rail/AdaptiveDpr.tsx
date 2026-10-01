import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/** The hero canvases render at the device's DPR up to 2 (crisp on retina), and never step below 1.5. */
export const DPR_CEIL = 2;
export const DPR_FLOOR = 1.5;
const TARGET_FPS = 55;

/** Starting DPR for a hero canvas: the device's, capped. */
export function startDpr(): number {
  return Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, DPR_CEIL);
}

/**
 * Adaptive resolution: measures fps over 1s windows of rendered frames and, after two slow windows in a
 * row (under 55fps), steps the canvas DPR down by 0.25, never below min(device DPR, 1.5). The first two
 * windows (shader compile, assemble) and any gap over 250ms (tab away, offscreen pause) are not counted.
 */
export default function AdaptiveDpr() {
  const { setDpr, viewport } = useThree();
  const win = useRef({ t: 0, n: 0, slow: 0, warm: 0 });

  useFrame((_, delta) => {
    const w = win.current;
    if (delta > 0.25) {
      w.t = 0;
      w.n = 0;
      return;
    }
    w.t += delta;
    w.n += 1;
    if (w.t < 1) return;
    const fps = w.n / w.t;
    w.t = 0;
    w.n = 0;
    if (w.warm < 2) {
      w.warm += 1;
      return;
    }
    w.slow = fps < TARGET_FPS ? w.slow + 1 : 0;
    const floor = Math.min(window.devicePixelRatio || 1, DPR_FLOOR);
    if (w.slow >= 2 && viewport.dpr > floor) {
      setDpr(Math.max(floor, viewport.dpr - 0.25));
      w.slow = 0;
    }
  });

  return null;
}
