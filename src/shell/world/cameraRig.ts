import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { BASE_SPIN, RINGS } from '../orrery/orreryModel';
import { ELEVATION, FOV, heroFraming, WORLD_R } from './worldLayout';

const target = new Vector3();
const origin = new Vector3();

/**
 * Places the camera for a flight value (0 hero framing .. 1 through the ring plane and under it): it swoops
 * in, its elevation falls through zero between the middle and outer rings (the outer ring rushes past), and
 * the lens shift that held the sun off center relaxes. Writes the shift into the projection matrix directly,
 * so every 3D program gets it for free. `tilt` and `bank` come from the hero drag (orrerySpin). Returns the sun's NDC position for the nebula.
 */
export function placeCamera(camera: PerspectiveCamera, width: number, height: number, flight: number, sway: number, tilt = 0, bank = 0) {
  const { distance, shift } = heroFraming(width, height);
  const reach = MathUtils.smoothstep(flight, 0, 0.62);
  const d = MathUtils.lerp(distance, 0.82, reach);
  const elevation = MathUtils.lerp(ELEVATION + tilt, -0.5, flight);
  const azimuth = flight * 0.55 + sway;
  camera.position.set(
    d * Math.cos(elevation) * Math.sin(azimuth),
    d * Math.sin(elevation),
    d * Math.cos(elevation) * Math.cos(azimuth),
  );
  camera.lookAt(target.set(0, -0.25 * flight, 0));
  // A dragged system leans the view into the turn; the dive straightens it out.
  if (bank) camera.rotateZ(bank * (1 - flight));
  camera.fov = FOV + flight * 18;
  camera.aspect = width / Math.max(1, height);
  camera.near = 0.02;
  camera.far = 40;
  camera.updateProjectionMatrix();
  const sx = MathUtils.lerp(shift[0], 0, flight);
  const sy = MathUtils.lerp(shift[1], 0, flight);
  camera.projectionMatrix.elements[8] = -sx;
  camera.projectionMatrix.elements[9] = -sy;
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  camera.updateMatrixWorld();
  const sun = origin.set(0, 0, 0).project(camera);
  return { x: sun.x, y: sun.y, focus: camera.position.length() };
}

const body = new Vector3();
const ahead = new Vector3();
const tangent = new Vector3();
const outward = new Vector3();

/** A slot's body in world space at time t and yaw: the shader's ringPoint() in JS. */
export function bodyAt(out: Vector3, ring: number, u: number, t: number, yaw: number): Vector3 {
  const { radius, inc, node, speed } = RINGS[ring];
  const th = Math.PI * 2 * u + speed * t;
  const lx = radius * Math.cos(th);
  const lz0 = radius * Math.sin(th);
  const ly = -lz0 * Math.sin(inc);
  const lz = lz0 * Math.cos(inc);
  const a = node + yaw;
  return out.set(lx * Math.cos(a) + lz * Math.sin(a), ly, -lx * Math.sin(a) + lz * Math.cos(a)).multiplyScalar(WORLD_R);
}

/**
 * Close orbit (detail header): the camera rides just behind and above this component's body, looking along
 * its orbit, so the body is lit from the side by the sun out of shot and its own ring runs off behind it.
 * The lens shift puts the body on its socket (`anchor`, NDC), at `radiusPx` on screen. Returns the camera's distance to
 * the body for the depth blur.
 */
export function placeClose(camera: PerspectiveCamera, width: number, height: number, ring: number, u: number, t: number, yaw: number, anchor: { x: number; y: number }, radiusPx: number) {
  bodyAt(body, ring, u, t, yaw);
  bodyAt(ahead, ring, u, t + 0.5, yaw + BASE_SPIN * 0.5);
  tangent.subVectors(ahead, body).normalize();
  outward.copy(body).setY(0).normalize();
  // The camera stands off so the lit body (radius 0.042) fills its socket: radiusPx on screen.
  const focal = height / 2 / Math.tan(MathUtils.degToRad(FOV) / 2);
  const d = MathUtils.clamp((0.042 * focal) / Math.max(8, radiusPx), 0.3, 2.4);
  camera.position.copy(body).addScaledVector(tangent, d * 0.82).addScaledVector(outward, -d * 0.35);
  camera.position.y += d * 0.42;
  camera.lookAt(body);
  camera.fov = FOV;
  camera.aspect = width / Math.max(1, height);
  camera.near = 0.02;
  camera.far = 40;
  camera.updateProjectionMatrix();
  camera.projectionMatrix.elements[8] = -anchor.x;
  camera.projectionMatrix.elements[9] = -anchor.y;
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  camera.updateMatrixWorld();
  return camera.position.distanceTo(body);
}
