import { gsap } from '../../lib/motion';
import type { WorldUniforms } from './useWorldUniforms';

const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * The ignition, 2.0s: darkness, the sun flares and settles (0.1 to 1.0s), the rings draw on by angle from
 * a hot head (0.35 to 1.5s), the 30 bodies fly in to their slots in ship order (0.9 to 2.0s). Any input
 * completes it at once. Returns the cleanup.
 */
export function ignite(u: WorldUniforms): () => void {
  const tl = gsap.timeline();
  tl.fromTo(u.uIgnite, { value: 0 }, { value: 1, duration: 0.9, ease: 'power2.out' }, 0.1)
    .fromTo(u.uDraw, { value: 0 }, { value: 1, duration: 1.15, ease: 'power2.inOut' }, 0.35)
    .fromTo(u.uArrive, { value: 0 }, { value: 1, duration: 1.1, ease: 'expo.out' }, 0.9);
  const skip = () => {
    tl.progress(1);
    detach();
  };
  const detach = () => SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
  SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));
  tl.eventCallback('onComplete', detach);
  return () => {
    detach();
    tl.kill();
  };
}

/** The settled state with no animation (reduced motion, or a context restored mid-visit). */
export function settle(u: WorldUniforms): void {
  u.uIgnite.value = 1;
  u.uDraw.value = 1;
  u.uArrive.value = 1;
}
