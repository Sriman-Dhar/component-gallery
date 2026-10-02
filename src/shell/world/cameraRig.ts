import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { ELEVATION, FOV, heroFraming } from './worldLayout';

const target = new Vector3();
const origin = new Vector3();

/**
 * Places the camera for a flight value (0 hero framing .. 1 through the ring plane and under it): it swoops
 * in, its elevation falls through zero between the middle and outer rings (the outer ring rushes past), and
 * the lens shift that held the sun off center relaxes. Writes the shift into the projection matrix directly,
 * so every 3D program gets it for free. Returns the sun's NDC position for the nebula.
 */
export function placeCamera(camera: PerspectiveCamera, width: number, height: number, flight: number, sway: number) {
  const { distance, shift } = heroFraming(width, height);
  const reach = MathUtils.smoothstep(flight, 0, 0.62);
  const d = MathUtils.lerp(distance, 0.82, reach);
  const elevation = MathUtils.lerp(ELEVATION, -0.5, flight);
  const azimuth = flight * 0.55 + sway;
  camera.position.set(
    d * Math.cos(elevation) * Math.sin(azimuth),
    d * Math.sin(elevation),
    d * Math.cos(elevation) * Math.cos(azimuth),
  );
  camera.lookAt(target.set(0, -0.25 * flight, 0));
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
