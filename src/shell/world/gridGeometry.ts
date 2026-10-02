import { BufferAttribute, type BufferGeometry } from 'three';
import { glyphPoints } from './glyphSampler';

/** What the grid shows: the shipped tiles' running numbers in grid order, and whether a next slot closes it. */
export interface GridPlan {
  labels: string[];
  next: boolean;
}

/** Share of a shipped tile's particles that cast its numeral; the rest hold its halo. */
const GLYPH_SHARE = 0.46;

function gaussian(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/**
 * The grid homes: each particle belongs to one tile (shipped tiles weighted 3 to 1 over the next slot), with
 * a place around its halo (a tight filament, a looser haze outward) and, on shipped tiles, a share of them a
 * point of the numeral (aGlyph, filled by castGlyphs).
 */
export function addGridAttributes(geometry: BufferGeometry, count: number, plan: GridPlan): void {
  const tiles = plan.labels.length + (plan.next ? 1 : 0);
  const grid = new Float32Array(count * 4);
  const glyph = new Float32Array(count * 3);
  const weights = Array.from({ length: tiles }, (_, i) => (i < plan.labels.length ? 3 : 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  for (let i = 0; i < count && tiles; i++) {
    let left = Math.random() * total;
    let tile = 0;
    while (tile < tiles - 1 && (left -= weights[tile]) > 0) tile++;
    const lit = tile < plan.labels.length ? 1 : 0;
    const haze = Math.random() < 0.3;
    grid.set([tile, Math.random(), Math.abs(gaussian()) * (haze ? 22 : 3), lit], i * 4);
    glyph[i * 3 + 2] = lit && Math.random() < GLYPH_SHARE ? 1 : 0;
  }
  geometry.setAttribute('aGrid', new BufferAttribute(grid, 4));
  geometry.setAttribute('aGlyph', new BufferAttribute(glyph, 3));
  castGlyphs(geometry, plan);
}

/** Places every numeral particle on a random point of its tile's numeral ink; run again once the face loads. */
export function castGlyphs(geometry: BufferGeometry, plan: GridPlan): void {
  const grid = geometry.getAttribute('aGrid') as BufferAttribute | undefined;
  const glyph = geometry.getAttribute('aGlyph') as BufferAttribute | undefined;
  if (!grid || !glyph) return;
  const ink = plan.labels.map((label) => glyphPoints(label));
  for (let i = 0; i < glyph.count; i++) {
    if (glyph.getZ(i) < 0.5) continue;
    const points = ink[grid.getX(i)];
    if (!points) {
      glyph.setZ(i, 0);
      continue;
    }
    const at = Math.floor(Math.random() * (points.length / 2)) * 2;
    glyph.setXY(i, points[at] + (Math.random() - 0.5) * 0.012, points[at + 1] + (Math.random() - 0.5) * 0.012);
  }
  glyph.needsUpdate = true;
}
