/**
 * Pure tilt math, no DOM and no GSAP, so every value the card animates to can be unit tested.
 * Kept as .tsx (like week 1's hooks) so the detail page's source panel, which lists .tsx files, shows it.
 */

/** Perspective on the card root, in px. */
export const PERSPECTIVE = 1100;
/** The front glass sits this far in front of the case's back wall, in front of every ring at full spread. */
export const GLASS_Z = 160;
/** The glass is drawn smaller by this factor so that, seen through the perspective, it exactly covers the vitrine. */
export const GLASS_SCALE = 1 - GLASS_Z / PERSPECTIVE;
/** The vitrine: inset from the card edge (padding plus the 1px border) and its fixed height. */
export const VITRINE = { inset: 9, height: 280 } as const;
/** Largest tilt the prop accepts, in degrees, and the default. */
export const TILT_LIMIT = 14;
export const DEFAULT_TILT = 10;
/** Extra depth between the outer and inner rings at full tilt, in px. */
export const MAX_SPREAD = 18;
/** Tilt magnitude (degrees, both axes combined) that opens the rings all the way: a corner at the default tilt. */
const SPREAD_AT = DEFAULT_TILT * Math.SQRT2;

/** Where the glare and the rim rest, as -1..1 offsets from the glass centre: the key light upper left, the rim lower right. */
export const GLARE_PARK = { x: -0.52, y: -0.56 } as const;
export const RIM_PARK = { x: 0.6, y: 0.64 } as const;
/** Rim opacity at rest and at full tilt. */
export const RIM_REST = 0.55;
const RIM_FULL = 1;

/**
 * The three gimbal rings: outer to inner. Each sits in its own plane (true 3D, not an ellipse drawing), and
 * `spread` is the share of the Z spread it takes at full tilt: the outer ring comes forward, the inner one
 * steps back, the middle one holds. GSAP re-applies the pose as a set so its z tweens keep the angles.
 */
export const RINGS = [
  { size: 136, pose: { rotationY: 58 }, css: 'rotateY(58deg)', spread: 1 },
  { size: 114, pose: { rotationX: 72 }, css: 'rotateX(72deg)', spread: 0 },
  { size: 94, pose: { rotation: 28, rotationX: 56 }, css: 'rotate(28deg) rotateX(56deg)', spread: -1 },
] as const;

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));

/** The prop's tilt, clamped to 0..14 degrees. Non numbers fall back to the default. */
export function clampTilt(max: number | undefined): number {
  return Number.isFinite(max) ? clamp(0, TILT_LIMIT, max as number) : DEFAULT_TILT;
}

/** Pointer position as -1..1 from the box centre on each axis, clamped at the box edge. */
export function glareFor(px: number, py: number, rect: Box): { x: number; y: number } {
  const x = rect.width > 0 ? (px - (rect.left + rect.width / 2)) / (rect.width / 2) : 0;
  const y = rect.height > 0 ? (py - (rect.top + rect.height / 2)) / (rect.height / 2) : 0;
  return { x: clamp(-1, 1, x) || 0, y: clamp(-1, 1, y) || 0 };
}

/**
 * Rotation in degrees that turns the card's face toward the pointer: the side under the pointer recedes.
 * rotateY follows x, rotateX follows -y (CSS y points down). Both are clamped to `max`.
 */
export function tiltFor(px: number, py: number, rect: Box, max: number): { rx: number; ry: number } {
  const limit = clampTilt(max);
  const { x, y } = glareFor(px, py, rect);
  return { rx: -y * limit || 0, ry: x * limit || 0 };
}

/** Extra Z spread of the rings for a tilt: 0 at rest, MAX_SPREAD at a full corner tilt, never more. */
export function spreadFor(rx: number, ry: number): number {
  return clamp(0, MAX_SPREAD, (Math.hypot(rx, ry) / SPREAD_AT) * MAX_SPREAD);
}

/**
 * The cool rim: it moves to the edge opposite the pointer and brightens as the pointer leaves the centre.
 * Near the centre it eases back toward its parked lower right corner so it never jumps.
 */
export function rimFor(gx: number, gy: number): { x: number; y: number; strength: number } {
  const t = clamp(0, 1, Math.hypot(gx, gy) * 1.4);
  return {
    x: RIM_PARK.x + (-gx * 1.1 - RIM_PARK.x) * t,
    y: RIM_PARK.y + (-gy * 1.1 - RIM_PARK.y) * t,
    strength: RIM_REST + (RIM_FULL - RIM_REST) * t,
  };
}

/** The vitrine's on-screen box, derived from the untransformed card root's box. */
export function vitrineBox(card: Box): Box {
  return {
    left: card.left + VITRINE.inset,
    top: card.top + VITRINE.inset,
    width: Math.max(0, card.width - VITRINE.inset * 2),
    height: VITRINE.height,
  };
}
