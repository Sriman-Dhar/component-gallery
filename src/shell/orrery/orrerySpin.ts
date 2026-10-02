import { BASE_SPIN } from './orreryModel';

/** Radians of yaw per pixel dragged. */
const RAD_PER_PX = 0.008;
/** Radians of camera tilt per pixel dragged vertically. */
const TILT_PER_PX = 0.0035;
/** The furthest the ring plane may tip toward or away from the viewer (rad). */
const TILT_MAX = 0.42;
/** The fastest a flick may spin the system (rad/s). */
const MAX_VEL = 7;

/**
 * The orrery's yaw: a constant base spin, a drag that takes over, inertia that eases back to the base.
 * A vertical drag tips the ring plane (tilt), which springs back once released. A ring of particles turned
 * about its own axis looks the same, so the camera also banks with the spin's excess speed (bankOf): the
 * turn reads even where only the rings are on screen.
 */
export interface Spin {
  yaw: number;
  vel: number;
  tilt: number;
  tiltVel: number;
  dragging: boolean;
  lastX: number;
  lastY: number;
  lastT: number;
}

export function createSpin(yaw = 0): Spin {
  return { yaw, vel: BASE_SPIN, tilt: 0, tiltVel: 0, dragging: false, lastX: 0, lastY: 0, lastT: 0 };
}

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/** Advance one frame (dt in seconds). Free spin decays toward the base rate with a ~0.9s time constant. */
export function stepSpin(spin: Spin, dt: number): void {
  if (spin.dragging) return;
  spin.vel += (BASE_SPIN - spin.vel) * (1 - Math.exp(-dt * 1.1));
  spin.yaw += spin.vel * dt;
  // The tilt is a damped spring back to level: a flick overshoots once, then settles.
  spin.tiltVel += (-spin.tilt * 9 - spin.tiltVel * 4.2) * dt;
  spin.tilt = clamp(spin.tilt + spin.tiltVel * dt, TILT_MAX);
}

/** Camera bank (rad) from the spin's speed above the base: a hard flick leans the view into the turn. */
export function bankOf(spin: Spin): number {
  return clamp((spin.vel - BASE_SPIN) * 0.045, 0.22);
}

export function dragStart(spin: Spin, x: number, now: number, y = 0): void {
  spin.dragging = true;
  spin.lastX = x;
  spin.lastY = y;
  spin.lastT = now;
}

/** The pointer moved to (x, y) at `now` (ms): yaw and tilt follow it, and its speed becomes the flick. */
export function dragMove(spin: Spin, x: number, now: number, y = spin.lastY): void {
  if (!spin.dragging) return;
  const dx = x - spin.lastX;
  const dy = y - spin.lastY;
  const dt = Math.max(1, now - spin.lastT) / 1000;
  spin.yaw += dx * RAD_PER_PX;
  spin.vel = spin.vel * 0.5 + clamp((dx * RAD_PER_PX) / dt, MAX_VEL) * 0.5;
  spin.tilt = clamp(spin.tilt + dy * TILT_PER_PX, TILT_MAX);
  spin.tiltVel = spin.tiltVel * 0.5 + clamp((dy * TILT_PER_PX) / dt, 4) * 0.5;
  spin.lastX = x;
  spin.lastY = y;
  spin.lastT = now;
}

/** Release: a pointer that stopped before letting go keeps no flick. */
export function dragEnd(spin: Spin, now: number): void {
  if (!spin.dragging) return;
  spin.dragging = false;
  if (now - spin.lastT > 90) {
    spin.vel = 0;
    spin.tiltVel = 0;
  }
}
