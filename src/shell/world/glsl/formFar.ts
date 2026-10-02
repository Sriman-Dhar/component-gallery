import { VIEW_TILT } from '../../orrery/orreryModel';

// The coda: the same orrery seen from far away, small and still, centered on the coda's anchor (uFar: center
// px, px per orrery unit). Its own fixed view, so the scene camera's flight never reaches it; the only motion
// is the slots' travel at half speed and a very slow turn. Shipped slots are amber knots, the rest cool.
export const FAR_GLSL = /* glsl */ `
Form formFar() {
  Form f;
  float isCore = 1.0 - step(0.5, abs(aKind - 2.0));
  float isDust = step(2.5, aKind);
  float isNode = 1.0 - step(0.5, abs(aKind - 1.0));
  float onRing = 1.0 - isCore - isDust;
  vec4 ring = uRings[int(aRing + 0.5)];
  float th = 6.2831853 * aU + ring.w * uTime * 0.5;
  vec3 l = vec3(ring.x * cos(th), 0.0, ring.x * sin(th)) + aJit * 0.5;
  l = vec3(l.x, l.y - l.z * sin(ring.y), l.z * cos(ring.y));
  l = rotY(l, ring.z + 0.9 + uTime * 0.012) * onRing + aJit * (isCore * 0.45 + isDust * 2.4);
  float e = ${VIEW_TILT.toFixed(3)};
  float y = l.y * cos(e) - l.z * sin(e);
  float z = l.y * sin(e) + l.z * cos(e);
  float s = 2.2 / (2.2 - z);
  f.ndc = pxToNdc(uFar.xy + vec2(l.x, -y) * s * uFar.z);
  float front = clamp(z / 0.41 * 0.5 + 0.5, 0.0, 1.0);
  float twinkle = 0.6 + 0.4 * sin(uTime * 0.5 + aSeed * 40.0);
  f.bright = onRing * (0.12 + aBright * 0.62) * (0.45 + 0.55 * front) + isCore * 1.3 + isDust * aBright * 0.5 * twinkle;
  f.bright *= step(-9000.0, uFar.y);
  f.warm = mix(1.0 - aTone, 1.0, isCore);
  f.heat = isCore * 0.7 + isNode * (1.0 - aTone) * 0.3;
  f.blur = 0.0;
  f.size = (0.9 + aSeed * 0.9 + aBright * 1.4 + isCore * 0.8) * s * 0.85;
  return f;
}
`;
