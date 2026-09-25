export type RailVariant = 'hero' | 'compact' | 'unlit';

/** Box height and baseline (px) per variant. The hero is tall so the particles have room to scatter. */
export const RAIL_BOX: Record<RailVariant, { height: number; base: number }> = {
  hero: { height: 168, base: 84 },
  compact: { height: 52, base: 20 },
  unlit: { height: 52, base: 20 },
};
