import { BufferAttribute, BufferGeometry } from 'three';
import { WEEK_COUNT, weekCenter } from '../../lib/ruler';

/** Hard ceiling from the brief's WebGL budget. */
export const MAX_POINTS = 4000;

function gaussian(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/** Particle count for a canvas width: sparser on phones, never past the budget. */
export function pointCount(width: number): number {
  return Math.min(MAX_POINTS, Math.round(width * 2.6));
}

/**
 * 70% of the points form the filament along the line; 30% gather at the 13 week nodes, four times
 * denser and brighter where a week has shipped. Built once; the shader animates everything.
 */
export function buildRailGeometry(count: number, litWeeks: number[]): BufferGeometry {
  const u = new Float32Array(count);
  const off = new Float32Array(count);
  const seed = new Float32Array(count);
  const bright = new Float32Array(count);
  const scatter = new Float32Array(count * 2);
  const lit = new Set(litWeeks);
  const weights = Array.from({ length: WEEK_COUNT }, (_, i) => (lit.has(i + 1) ? 4 : 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  const filament = Math.round(count * 0.7);

  for (let i = 0; i < count; i++) {
    seed[i] = Math.random();
    scatter[i * 2] = Math.random() - 0.5;
    scatter[i * 2 + 1] = Math.random() - 0.5;
    if (i < filament) {
      u[i] = Math.random();
      const haze = Math.random() < 0.28;
      off[i] = gaussian() * (haze ? 34 : 4);
      bright[i] = haze ? 0.08 : 0.34;
      continue;
    }
    let pick = Math.random() * total;
    let week = 1;
    while (pick > weights[week - 1]) pick -= weights[week++ - 1];
    const isLit = lit.has(week);
    u[i] = weekCenter(week) + gaussian() * (isLit ? 0.012 : 0.006);
    off[i] = gaussian() * (isLit ? 14 : 7);
    bright[i] = isLit ? 1 : 0.4;
  }

  const geometry = new BufferGeometry();
  // Positions are unused (the shader computes them) but three needs the attribute to size the draw.
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aU', new BufferAttribute(u, 1));
  geometry.setAttribute('aOff', new BufferAttribute(off, 1));
  geometry.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geometry.setAttribute('aBright', new BufferAttribute(bright, 1));
  geometry.setAttribute('aScatter', new BufferAttribute(scatter, 2));
  return geometry;
}

/** Reads an "r g b" token from :root as a 0..1 triple for a shader uniform. */
export function tokenRgb(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [r = 255, g = 255, b = 255] = raw.split(/\s+/).map(Number);
  return [r / 255, g / 255, b / 255];
}
