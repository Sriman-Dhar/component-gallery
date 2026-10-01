import { BufferAttribute, BufferGeometry } from 'three';
import { RINGS, SLOT_COUNT, slotOf } from './orreryModel';

/** Point kinds, read by the shader. */
export const ORRERY_KIND = { filament: 0, node: 1, core: 2, dust: 3 } as const;

/** Budget shares: the rings' filament, the 30 component clusters, the core, the dust (the rest). */
const SHARE = { filament: 0.6, nodes: 0.24, core: 0.11 };

function gaussian(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/** A ring drawn by circumference, so every ring's thread has the same density. */
function pickRing(): number {
  const total = RINGS.reduce((sum, r) => sum + r.radius, 0);
  let pick = Math.random() * total;
  for (let i = 0; i < RINGS.length; i++) {
    pick -= RINGS[i].radius;
    if (pick <= 0) return i;
  }
  return RINGS.length - 1;
}

/** A slot index drawn by weight: shipped slots are picked six times as often (brighter, denser clusters). */
function pickSlot(shipped: number): number {
  const total = shipped * 6 + (SLOT_COUNT - shipped);
  let pick = Math.random() * total;
  for (let i = 0; i < SLOT_COUNT; i++) {
    pick -= i < shipped ? 6 : 1;
    if (pick <= 0) return i;
  }
  return SLOT_COUNT - 1;
}

/**
 * The orrery in one draw call: filament along the three rings (the rail's line, bent into orbits), a
 * cluster per component slot (lit and dense when shipped, a cool speck when not), a breathing core and a
 * faint dust shell. Positions live in the shader; this only seeds each point's place in the system.
 */
export function buildOrreryGeometry(count: number, shipped: number): BufferGeometry {
  const kind = new Float32Array(count);
  const ring = new Float32Array(count);
  const u = new Float32Array(count);
  const jit = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const bright = new Float32Array(count);
  const tone = new Float32Array(count);
  const scatter = new Float32Array(count * 2);
  const filament = Math.round(count * SHARE.filament);
  const nodes = filament + Math.round(count * SHARE.nodes);
  const core = nodes + Math.round(count * SHARE.core);

  for (let i = 0; i < count; i++) {
    seed[i] = Math.random();
    scatter[i * 2] = Math.random() - 0.5;
    scatter[i * 2 + 1] = Math.random() - 0.5;
    let spread = 0;
    if (i < filament) {
      kind[i] = ORRERY_KIND.filament;
      ring[i] = pickRing();
      u[i] = Math.random();
      const haze = Math.random() < 0.12;
      spread = haze ? 0.02 : 0.0035;
      bright[i] = haze ? 0.08 : 0.5;
    } else if (i < nodes) {
      kind[i] = ORRERY_KIND.node;
      const slot = pickSlot(shipped);
      const lit = slot < shipped;
      const at = slotOf(slot);
      ring[i] = at.ring;
      u[i] = at.u;
      spread = lit ? 0.016 : 0.006;
      bright[i] = lit ? 1 : 0.42;
      tone[i] = lit ? 0 : 1;
    } else if (i < core) {
      kind[i] = ORRERY_KIND.core;
      spread = 0.024;
      bright[i] = 0.55 + Math.random() * 0.45;
    } else {
      kind[i] = ORRERY_KIND.dust;
      spread = 0.3;
      bright[i] = 0.08 + Math.random() * 0.22;
      tone[i] = 1;
    }
    jit[i * 3] = gaussian() * spread;
    jit[i * 3 + 1] = gaussian() * spread * (kind[i] === ORRERY_KIND.filament ? 0.5 : 1);
    jit[i * 3 + 2] = gaussian() * spread;
  }

  const geometry = new BufferGeometry();
  // Positions are unused (the shader computes them) but three needs the attribute to size the draw.
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aKind', new BufferAttribute(kind, 1));
  geometry.setAttribute('aRing', new BufferAttribute(ring, 1));
  geometry.setAttribute('aU', new BufferAttribute(u, 1));
  geometry.setAttribute('aJit', new BufferAttribute(jit, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geometry.setAttribute('aBright', new BufferAttribute(bright, 1));
  geometry.setAttribute('aTone', new BufferAttribute(tone, 1));
  geometry.setAttribute('aScatter', new BufferAttribute(scatter, 2));
  return geometry;
}
