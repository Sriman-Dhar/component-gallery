import { VIEW_TILT } from '../orrery/orreryModel';

/** World units per orrery unit: the outer ring (0.41) sits at a radius of about 1.07. */
export const WORLD_R = 2.6;
/** Vertical field of view of the scene camera (deg). */
export const FOV = 34;
/** The camera looks down on the ring plane from the poster's elevation (rad), so the still matches the scene. */
export const ELEVATION = VIEW_TILT;

export interface Framing {
  /** Camera distance from the sun. */
  distance: number;
  /** Lens shift in NDC: where the sun sits on screen (x right, y up). */
  shift: [number, number];
}

/**
 * Hero framing per viewport. Wide screens: the system fills the frame, sun right of center so the type on
 * the left reads over the dark side of the rings. Tall screens (phones): the orrery sits above the type,
 * its outer ring bleeding just past both edges.
 */
export function heroFraming(width: number, height: number): Framing {
  const aspect = width / Math.max(1, height);
  const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
  const outer = 0.41 * WORLD_R * 2;
  if (aspect < 0.9) {
    return { distance: outer / (2 * tan * aspect * 1.24), shift: [0, 0.36] };
  }
  const fill = aspect > 1.45 ? 0.82 : 0.96;
  return { distance: Math.max(2.4, outer / (2 * tan * aspect * fill)), shift: [aspect > 1.45 ? 0.34 : 0.24, 0.02] };
}

/** Particle count for the viewport: one budget, sparser on small screens. The low tier draws half. */
export function particleCount(width: number): number {
  if (width >= 1024) return 11000;
  if (width >= 640) return 7000;
  return 4200;
}

/** Starting quality tier: low on small CPU/memory budgets; the frame-rate monitor can still drop to low. */
export function startTier(): 'high' | 'low' {
  if (typeof navigator === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency || 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 ? 'low' : 'high';
}
