export type RailVariant = 'hero' | 'compact' | 'unlit';

/** Box height and baseline (px) per variant. The hero is tall so the particles have room to scatter. */
export const RAIL_BOX: Record<RailVariant, { height: number; base: number }> = {
  hero: { height: 168, base: 84 },
  compact: { height: 52, base: 20 },
  unlit: { height: 52, base: 20 },
};

/**
 * How lit a point at `at` (0..1 along the rail) is when the pulse head is at `head`: 1 under the head,
 * an afterglow behind it that decays, nothing ahead of it. The particle shader's shape, a little wider so
 * a 12px label has time to show it.
 */
export function pulseHeat(head: number, at: number): number {
  const d = head - at;
  const near = Math.max(0, 1 - Math.abs(d) / 0.05);
  const glow = d >= 0 ? Math.exp(-d * 9) * 0.7 : 0;
  return Math.max(near, glow);
}
