import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { shipped as entries } from '../../lib/catalogue';
import { SLOT_COUNT, slotOf } from '../orrery/orreryModel';
import { bodyAt } from './cameraRig';
import { world } from './worldState';

const at = new Vector3();
const view = new Vector3();

/** World radius of a lit (shipped) body and of a dark one: the body shader's scale. */
const LIT_R = 0.042;
const DARK_R = 0.024;

/**
 * Projects the 30 bodies to viewport pixels for the hero's hover labels (30 projections, no allocation), and
 * moves the label onto the hovered one. Off once the bodies step back for the dive.
 */
export function projectBodies(camera: PerspectiveCamera, width: number, height: number, time: number, show: boolean) {
  const shipped = entries.length;
  const b = world.bodies;
  b.on = show;
  if (!show) {
    if (world.tag && world.hover >= 0) world.tag.style.opacity = '0';
    return;
  }
  const focal = height / 2 / Math.tan(MathUtils.degToRad(camera.fov) / 2);
  for (let i = 0; i < SLOT_COUNT; i++) {
    const { ring, u } = slotOf(i);
    bodyAt(at, ring, u, time, world.spin.yaw);
    const depth = view.copy(at).applyMatrix4(camera.matrixWorldInverse).z;
    at.project(camera);
    b.xyr[i * 3] = (at.x * 0.5 + 0.5) * width;
    b.xyr[i * 3 + 1] = (0.5 - at.y * 0.5) * height;
    b.xyr[i * 3 + 2] = ((i < shipped ? LIT_R : DARK_R) * focal) / Math.max(0.1, -depth);
  }
  const tag = world.tag;
  if (tag && world.hover >= 0) {
    const i = world.hover;
    tag.style.transform = `translate3d(${b.xyr[i * 3].toFixed(1)}px, ${(b.xyr[i * 3 + 1] - b.xyr[i * 3 + 2]).toFixed(1)}px, 0)`;
  }
}

/** A body sunk behind the hero words (the veil) is not there to hover. */
function behindWords(x: number, y: number): boolean {
  return world.veil.some((v) => v.width > 0 && x > v.left - window.scrollX && x < v.left - window.scrollX + v.width && y > v.top - window.scrollY && y < v.top - window.scrollY + v.height);
}

/** The body under a viewport point (with a forgiving 12px margin), or -1. */
export function bodyUnder(x: number, y: number): number {
  const b = world.bodies;
  if (!b.on) return -1;
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < SLOT_COUNT; i++) {
    if (behindWords(b.xyr[i * 3], b.xyr[i * 3 + 1])) continue;
    const d = Math.hypot(x - b.xyr[i * 3], y - b.xyr[i * 3 + 1]);
    if (d < b.xyr[i * 3 + 2] + 12 && d < bestD) {
      best = i;
      bestD = d;
    }
  }
  return best;
}
