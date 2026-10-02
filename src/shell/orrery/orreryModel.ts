/**
 * The orrery's geometry, shared by the world's shaders (glsl/common.ts), its particle builder and the SVG
 * poster, so the still and the live scene are the same object. Lengths are fractions of S, the box width; the box is
 * ORRERY_ASPECT wide to 1 tall, which fits the tilted rings with no dead band above or below them.
 *
 * Three nearly coplanar rings (an orrery, not an atom: small inclinations, one shared plane seen from
 * above). The 30 components ride them in ship order, ten per ring, inner ring first.
 */

export const SLOT_COUNT = 30;
export const SLOTS_PER_RING = 10;

export interface Ring {
  /** Radius as a fraction of S. */
  radius: number;
  /** Inclination against the shared plane (rad). */
  inc: number;
  /** Where the ring's tilt axis points (rad, about the up axis). */
  node: number;
  /** How fast its slots travel along it (rad/s). */
  speed: number;
}

export const RINGS: Ring[] = [
  { radius: 0.19, inc: 0.12, node: 0.4, speed: 0.05 },
  { radius: 0.3, inc: -0.17, node: 2.2, speed: 0.033 },
  { radius: 0.41, inc: 0.21, node: 4.1, speed: 0.022 },
];

/** Box width over box height. */
export const ORRERY_ASPECT = 1.3;

/** The shared plane is seen from this far above its edge (rad). */
export const VIEW_TILT = 0.56;
/** Focal length in S: a gentle perspective, near points a little larger and brighter. */
export const FOCAL = 2.2;
/** One full turn of the system every 40s. */
export const BASE_SPIN = (Math.PI * 2) / 40;
/** The yaw the poster is drawn at: the lit inner slots sit at the front. */
export const POSTER_YAW = 0.9;

/** Ring and position (0..1 around it) of a component slot; each ring starts a little later than the last. */
export function slotOf(index: number): { ring: number; u: number } {
  const ring = Math.min(RINGS.length - 1, Math.floor(index / SLOTS_PER_RING));
  return { ring, u: (index % SLOTS_PER_RING) / SLOTS_PER_RING + ring * 0.05 };
}

export interface Projected {
  x: number;
  y: number;
  /** Depth toward the viewer, in S. */
  z: number;
  /** Perspective scale. */
  s: number;
}

/** A point on a ring at time t and system yaw, projected to the screen (S units, y up). Mirrors the shader. */
export function project(ring: number, u: number, t: number, yaw: number): Projected {
  const { radius, inc, node, speed } = RINGS[ring];
  const th = Math.PI * 2 * u + speed * t;
  const lx = radius * Math.cos(th);
  const lz0 = radius * Math.sin(th);
  const ly = -lz0 * Math.sin(inc);
  const lz = lz0 * Math.cos(inc);
  const a = node + yaw;
  const x = lx * Math.cos(a) + lz * Math.sin(a);
  const z = -lx * Math.sin(a) + lz * Math.cos(a);
  const y3 = ly * Math.cos(VIEW_TILT) - z * Math.sin(VIEW_TILT);
  const z3 = ly * Math.sin(VIEW_TILT) + z * Math.cos(VIEW_TILT);
  const s = FOCAL / (FOCAL - z3);
  return { x: x * s, y: y3 * s, z: z3, s };
}
