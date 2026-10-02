import { SLOT_COUNT } from '../orrery/orreryModel';
import { world } from './worldState';

/*
 * Hit tests on the bodies the scene projected (bodyScreen.ts writes world.bodies each frame). Kept free of
 * three.js: the hero's pointer input runs on the index before the 3D chunk loads, so the chunk is never
 * preloaded for routes that do not mount the scene.
 */

/** A body sunk behind the hero words (the veil) is not there to hover. */
function behindWords(x: number, y: number): boolean {
  return world.veil.some((v) => v.width > 0 && x > v.left - window.scrollX && x < v.left - window.scrollX + v.width && y > v.top - window.scrollY && y < v.top - window.scrollY + v.height);
}

/** The body under a viewport point (with a forgiving 12px margin), or -1. */
export function bodyUnder(x: number, y: number): number {
  const b = world.bodies;
  if (!b.on) return -1;
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < SLOT_COUNT; i++) {
    if (behindWords(b.xyr[i * 3], b.xyr[i * 3 + 1])) continue;
    const d = Math.hypot(x - b.xyr[i * 3], y - b.xyr[i * 3 + 1]);
    if (d < b.xyr[i * 3 + 2] + 12 && d < bestD) {
      best = i;
      bestD = d;
    }
  }
  return best;
}
