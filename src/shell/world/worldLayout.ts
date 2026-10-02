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
 * the left reads over the dark side of the rings. Tall screens (phones): the orrery sits low enough that its
 * near ring runs down into the title (no dead band between them), the outer ring bleeding past both edges.
 */
export function heroFraming(width: number, height: number): Framing {
  const aspect = width / Math.max(1, height);
  const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
  const outer = 0.41 * WORLD_R * 2;
  if (aspect < 0.9) {
    return { distance: outer / (2 * tan * aspect * 1.5), shift: [0, 0.14] };
  }
  // Near-square screens (1024x768): the headline spans most of the width, so the sun moves past its veil box
  // and lifts above the tagline, so the inner ring (the shipped bodies) never sinks under the words.
  const wide = aspect > 1.45;
  const fill = wide ? 0.82 : 0.9;
  return { distance: Math.max(2.4, outer / (2 * tan * aspect * fill)), shift: wide ? [0.34, 0.02] : [0.56, 0.1] };
}

/** Particle count for the viewport: one budget, sparser on small screens. The low tier draws 70%. */
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
