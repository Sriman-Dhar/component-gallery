import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { shipped as entries } from '../../lib/catalogue';
import { SLOT_COUNT, slotOf } from '../orrery/orreryModel';
import { bodyAt } from './cameraRig';
import { world } from './worldState';

const at = new Vector3();
const view = new Vector3();
const sun = new Vector3();

/** World radius of a lit (shipped) body and of a dark one: the body shader's scale. */
const LIT_R = 0.042;
const DARK_R = 0.024;
/** Extra lift (px) of the hover label over the body, on top of its own 10px. */
const TAG_LIFT = 26;
/** View-space radius of the sun's bright corona: a shipped body behind it inside this reads as missing. */
const CORONA_R = 0.12;

/**
 * Projects the 30 bodies to viewport pixels for the hero's hover labels (30 projections, no allocation), and
 * moves the label onto the hovered one. Off once the bodies step back for the dive. Returns true while a
 * shipped body sits behind the sun's corona (eclipsed).
 */
export function projectBodies(camera: PerspectiveCamera, width: number, height: number, time: number, show: boolean): boolean {
  const shipped = entries.length;
  const b = world.bodies;
  b.on = show;
  if (!show) {
    if (world.tag && world.hover >= 0) world.tag.style.opacity = '0';
    return false;
  }
  const focal = height / 2 / Math.tan(MathUtils.degToRad(camera.fov) / 2);
  const sunDepth = sun.set(0, 0, 0).applyMatrix4(camera.matrixWorldInverse).z;
  sun.set(0, 0, 0).project(camera);
  const sunX = (sun.x * 0.5 + 0.5) * width;
  const sunY = (0.5 - sun.y * 0.5) * height;
  const corona = (CORONA_R * focal) / Math.max(0.1, -sunDepth);
  let eclipsed = false;
  for (let i = 0; i < SLOT_COUNT; i++) {
    const { ring, u } = slotOf(i);
    bodyAt(at, ring, u, time, world.spin.yaw);
    const depth = view.copy(at).applyMatrix4(camera.matrixWorldInverse).z;
    at.project(camera);
    b.xyr[i * 3] = (at.x * 0.5 + 0.5) * width;
    b.xyr[i * 3 + 1] = (0.5 - at.y * 0.5) * height;
    b.xyr[i * 3 + 2] = ((i < shipped ? LIT_R : DARK_R) * focal) / Math.max(0.1, -depth);
    if (i < shipped && depth < sunDepth && Math.hypot(b.xyr[i * 3] - sunX, b.xyr[i * 3 + 1] - sunY) < corona) eclipsed = true;
  }
  const tag = world.tag;
  if (tag && world.hover >= 0) {
    const i = world.hover;
    // Lifted past the hot cursor ring's reach (22px) above the body's top edge, so the ring never crosses the words.
    tag.style.transform = `translate3d(${b.xyr[i * 3].toFixed(1)}px, ${(b.xyr[i * 3 + 1] - b.xyr[i * 3 + 2] - TAG_LIFT).toFixed(1)}px, 0)`;
  }
  return eclipsed;
}
