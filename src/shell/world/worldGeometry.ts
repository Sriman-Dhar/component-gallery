import { BufferAttribute, BufferGeometry } from 'three';
import { WEEK_COUNT, weekCenter } from '../../lib/ruler';
import { RINGS, SLOT_COUNT, slotOf } from '../orrery/orreryModel';

/** Orbit kinds (aKind) and rail kinds (aRailKind), read by the formations' GLSL. */
export const ORBIT_KIND = { filament: 0, node: 1, core: 2, dust: 3 } as const;
export const RAIL_KIND = { line: 0, reflection: 1, dust: 2 } as const;

/** Budget shares by orbit kind; each kind has one rail role, so the rings unroll into the line. */
const SHARE = { filament: 0.58, node: 0.2, core: 0.1 };

function gaussian(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/** Index drawn by weight. */
function pick(weights: number[]): number {
  let left = Math.random() * weights.reduce((sum, w) => sum + w, 0);
  for (let i = 0; i < weights.length; i++) {
    left -= weights[i];
    if (left <= 0) return i;
  }
  return weights.length - 1;
}

/**
 * The swarm, one draw call. Every particle has an orbit home (a ring thread, a component slot cluster, the
 * core, the dust shell) and a rail home (the line, a week cluster, the reflection, the dust): the ring
 * filament becomes the line, slot clusters become week clusters, the core becomes the reflection. Kinds are
 * drawn per particle, not in blocks, so any prefix of the buffer is a fair sample: the low tier simply draws
 * the first half (setDrawRange).
 */
export function buildWorldGeometry(count: number, shipped: number, litWeeks: number[]): BufferGeometry {
  const a = {
    aKind: new Float32Array(count),
    aRing: new Float32Array(count),
    aU: new Float32Array(count),
    aJit: new Float32Array(count * 3),
    aSeed: new Float32Array(count),
    aBright: new Float32Array(count),
    aTone: new Float32Array(count),
    aRailKind: new Float32Array(count),
    aRailU: new Float32Array(count),
    aRailOff: new Float32Array(count),
    aRailBright: new Float32Array(count),
  };
  const ringWeights = RINGS.map((r) => r.radius);
  const slotWeights = Array.from({ length: SLOT_COUNT }, (_, i) => (i < shipped ? 6 : 1));
  const lit = new Set(litWeeks);
  const weekWeights = Array.from({ length: WEEK_COUNT }, (_, i) => (lit.has(i + 1) ? 4 : 1));

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    a.aSeed[i] = Math.random();
    let spread = 0;
    if (roll < SHARE.filament) {
      a.aKind[i] = ORBIT_KIND.filament;
      a.aRing[i] = pick(ringWeights);
      a.aU[i] = Math.random();
      const haze = Math.random() < 0.12;
      spread = haze ? 0.02 : 0.0035;
      a.aBright[i] = haze ? 0.08 : 0.5;
      a.aRailU[i] = a.aU[i];
      const railHaze = Math.random() < 0.28;
      a.aRailOff[i] = gaussian() * (railHaze ? 34 : 4);
      a.aRailBright[i] = railHaze ? 0.08 : 0.34;
    } else if (roll < SHARE.filament + SHARE.node) {
      a.aKind[i] = ORBIT_KIND.node;
      const slot = pick(slotWeights);
      const at = slotOf(slot);
      a.aRing[i] = at.ring;
      a.aU[i] = at.u;
      spread = slot < shipped ? 0.016 : 0.006;
      a.aBright[i] = slot < shipped ? 1 : 0.42;
      a.aTone[i] = slot < shipped ? 0 : 1;
      const week = pick(weekWeights) + 1;
      a.aRailU[i] = weekCenter(week) + gaussian() * (lit.has(week) ? 0.012 : 0.006);
      a.aRailOff[i] = gaussian() * (lit.has(week) ? 15 : 7);
      a.aRailBright[i] = lit.has(week) ? 0.62 : 0.4;
    } else if (roll < SHARE.filament + SHARE.node + SHARE.core) {
      a.aKind[i] = ORBIT_KIND.core;
      spread = 0.024;
      a.aBright[i] = 0.55 + Math.random() * 0.45;
      a.aRailKind[i] = RAIL_KIND.reflection;
      const week = pick(weekWeights) + 1;
      const underNode = Math.random() < 0.55;
      a.aRailU[i] = underNode ? weekCenter(week) + gaussian() * 0.01 : Math.random();
      a.aRailOff[i] = 5 + Math.abs(gaussian()) * 26;
      a.aRailBright[i] = underNode && lit.has(week) ? 0.9 : 0.3;
    } else {
      a.aKind[i] = ORBIT_KIND.dust;
      spread = 0.3;
      a.aBright[i] = 0.08 + Math.random() * 0.22;
      a.aTone[i] = 1;
      a.aRailKind[i] = RAIL_KIND.dust;
      a.aRailU[i] = Math.random();
      a.aRailOff[i] = Math.random() - 0.5;
      a.aRailBright[i] = 0.1 + Math.random() * 0.25;
    }
    a.aJit[i * 3] = gaussian() * spread;
    a.aJit[i * 3 + 1] = gaussian() * spread * (a.aKind[i] === ORBIT_KIND.filament ? 0.5 : 1);
    a.aJit[i * 3 + 2] = gaussian() * spread;
  }

  const geometry = new BufferGeometry();
  // Positions are unused (the shader computes them) but three needs the attribute to size the draw.
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  for (const [name, data] of Object.entries(a)) {
    geometry.setAttribute(name, new BufferAttribute(data, name === 'aJit' ? 3 : 1));
  }
  return geometry;
}
