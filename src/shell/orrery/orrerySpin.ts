import { BASE_SPIN } from './orreryModel';

/** Radians of yaw per pixel dragged. */
const RAD_PER_PX = 0.008;
/** The fastest a flick may spin the system (rad/s). */
const MAX_VEL = 7;

/** The orrery's yaw: a constant base spin, a drag that takes over, inertia that eases back to the base. */
export interface Spin {
  yaw: number;
  vel: number;
  dragging: boolean;
  lastX: number;
  lastT: number;
}

export function createSpin(yaw = 0): Spin {
  return { yaw, vel: BASE_SPIN, dragging: false, lastX: 0, lastT: 0 };
}

/** Advance one frame (dt in seconds). Free spin decays toward the base rate with a ~0.9s time constant. */
export function stepSpin(spin: Spin, dt: number): void {
  if (spin.dragging) return;
  spin.vel += (BASE_SPIN - spin.vel) * (1 - Math.exp(-dt * 1.1));
  spin.yaw += spin.vel * dt;
}

export function dragStart(spin: Spin, x: number, now: number): void {
  spin.dragging = true;
  spin.lastX = x;
  spin.lastT = now;
}

/** The pointer moved to x at `now` (ms): yaw follows it, and its speed becomes the flick velocity. */
export function dragMove(spin: Spin, x: number, now: number): void {
  if (!spin.dragging) return;
  const dx = x - spin.lastX;
  const dt = Math.max(1, now - spin.lastT) / 1000;
  spin.yaw += dx * RAD_PER_PX;
  const instant = Math.max(-MAX_VEL, Math.min(MAX_VEL, (dx * RAD_PER_PX) / dt));
  spin.vel = spin.vel * 0.5 + instant * 0.5;
  spin.lastX = x;
  spin.lastT = now;
}

/** Release: a pointer that stopped before letting go keeps no flick. */
export function dragEnd(spin: Spin, now: number): void {
  if (!spin.dragging) return;
  spin.dragging = false;
  if (now - spin.lastT > 90) spin.vel = 0;
}
