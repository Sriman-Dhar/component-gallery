import { useSyncExternalStore } from 'react';
import { POSTER_YAW } from '../orrery/orreryModel';
import { createSpin } from '../orrery/orrerySpin';

/**
 * The world's inputs, one plain mutable object shared by the DOM layer (scroll, pointer, ignition) and the
 * scene's frame loop. DOM code writes, the frame loop reads: no React state per frame, nothing allocated.
 */
export const world = {
  /** Scroll progress through the dive, 0 (hero) to 1 (rail formed). ScrollTrigger writes the target. */
  diveTarget: 0,
  /** The damped dive the scene renders with. */
  dive: 0,
  /** Pointer in NDC (-1..1, y up) and how present it is (0..1). */
  pointer: { x: 0, y: 0, on: 0 },
  /** The last click: NDC position and the scene time it happened at. */
  shock: { x: 0, y: 0, at: -100 },
  /** System yaw: base spin, drag, inertia. */
  spin: createSpin(POSTER_YAW),
  /** The rail anchor in document pixels (left, top of its box, width) and its baseline inside the box. */
  rail: { left: 0, top: 0, width: 0, base: 84, ok: false },
  /** Week labels the rail pulse warms while the rail is formed. */
  labels: [] as SVGTextElement[],
};

export type WorldStatus = 'off' | 'live' | 'still';

let status: WorldStatus = 'off';
const listeners = new Set<() => void>();

/** The scene reports whether it is drawing (live), drew one composed frame (still) or is absent (off). */
export function setWorldStatus(next: WorldStatus): void {
  if (next === status) return;
  status = next;
  if (typeof document !== 'undefined') document.documentElement.dataset.world = next;
  listeners.forEach((notify) => notify());
}

/** DOM surfaces that defer to the scene (the rail poster) subscribe to its status. */
export function useWorldStatus(): WorldStatus {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    () => status,
    () => 'off',
  );
}
