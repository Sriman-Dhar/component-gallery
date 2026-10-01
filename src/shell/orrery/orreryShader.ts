import { spriteGlsl } from '../rail/railShader';
import { FOCAL, VIEW_TILT } from './orreryModel';

/**
 * The orrery particle shader. Mirrors project() in orreryModel.ts: a point on its ring (or in the core or
 * the dust shell) is inclined, turned by the ring's node plus the system yaw, tilted toward the viewer and
 * given a gentle perspective. Screen units are CSS pixels (orthographic camera, zoom 1, origin at center).
 */
export const orreryVertex = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uYaw;
uniform float uSide;
uniform float uWidth;
uniform float uHeight;
uniform float uPixel;
uniform float uFeed;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec4 uRings[3];
attribute float aKind;
attribute float aRing;
attribute float aU;
attribute vec3 aJit;
attribute float aSeed;
attribute float aBright;
attribute float aTone;
attribute vec2 aScatter;
varying float vAlpha;
varying float vHeat;
varying float vTone;
varying float vWarm;
varying float vSpec;

vec3 rotY(vec3 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
}

void main() {
  float isCore = 1.0 - step(0.5, abs(aKind - 2.0));
  float isDust = step(2.5, aKind);
  float onRing = 1.0 - isCore - isDust;
  float isNode = 1.0 - step(0.5, abs(aKind - 1.0));
  float t = smoothstep(aSeed * 0.35, 0.65 + aSeed * 0.35, uAssemble);

  // Ring points: around the ring, inclined, then turned by the ring's node and the system yaw.
  vec4 ring = uRings[int(aRing + 0.5)];
  float th = 6.2831853 * aU + ring.w * uTime;
  vec3 local = vec3(ring.x * cos(th), 0.0, ring.x * sin(th)) + aJit;
  local = vec3(local.x, local.y - local.z * sin(ring.y), local.z * cos(ring.y));
  vec3 p = rotY(local, ring.z + uYaw) * onRing;

  // The core breathes and turns a little faster; the dust shell drifts slowly against the rings.
  float breath = 1.0 + 0.1 * sin(uTime * 1.3 + aSeed * 6.2831);
  p += rotY(aJit * breath, uYaw * 1.6) * isCore;
  p += rotY(aJit, uYaw * 0.35 + uTime * 0.02) * isDust;

  // View tilt and perspective.
  float tilt = ${VIEW_TILT.toFixed(4)};
  float y3 = p.y * cos(tilt) - p.z * sin(tilt);
  float z3 = p.y * sin(tilt) + p.z * cos(tilt);
  float persp = ${FOCAL.toFixed(4)} / (${FOCAL.toFixed(4)} - z3);
  vec2 screen = vec2(p.x, y3) * persp * uSide;
  vec2 pos = mix(aScatter * vec2(uWidth, uHeight), screen, t);

  // Pointer gravity: points near the pointer lean toward it.
  vec2 toPointer = uPointer - pos;
  float pull = smoothstep(130.0, 0.0, length(toPointer)) * uPointerOn * t * (1.0 - isDust);
  pos += toPointer * pull * 0.2;

  // The rail's pulse rises into the orrery once per cycle: a band of light sweeps up from its foot.
  float bandY = mix(-0.6, 0.6, uFeed) * uSide;
  float live = step(0.001, uFeed) * (1.0 - step(0.999, uFeed));
  float heat = smoothstep(0.08 * uSide, 0.0, abs(screen.y - bandY)) * live * (1.0 - isDust) * t;
  heat += isCore * smoothstep(0.3, 0.0, abs(uFeed - 0.5)) * live;
  vHeat = heat;

  // Key light from the front: near points brighter, the far side of each ring falls into shade.
  float front = clamp(z3 / 0.42 * 0.5 + 0.5, 0.0, 1.0);
  float key = 0.18 + 0.82 * front * front;
  float dust = 0.55 + 0.45 * sin(uTime * 0.7 + aSeed * 30.0);
  vAlpha = ((0.2 + aBright * 0.8) * (0.3 + 0.7 * t) * key + heat * 0.9 + pull * 0.4) * mix(1.0, dust, isDust);
  vTone = aTone;
  vWarm = isCore + isNode * aBright;
  // The core's tight highlight: its innermost points burn near white, like a specular hot spot.
  vSpec = isCore * (1.0 - smoothstep(0.004, 0.016, length(aJit)));

  // Size attenuates with depth (perspective squared), so near points are visibly larger than far ones.
  float size = 1.4 + aSeed * 1.4 + aBright * 2.2 + heat * 3.0 + isCore * 0.8;
  gl_PointSize = mix(size, 0.9 + aSeed * 1.0, isDust) * persp * persp * uPixel;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
}
`;

/** Warm points run the amber ramp (body to core); cool points (unshipped slots, dust) take the rim. */
export const orreryFragment = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uCool;
varying float vAlpha;
varying float vHeat;
varying float vTone;
varying float vWarm;
varying float vSpec;
${spriteGlsl}
void main() {
  float a = sprite();
  if (a < 0.01) discard;
  vec3 warm = mix(uBody, uCore, clamp(vHeat + a * 0.45 + vWarm * 0.35, 0.0, 1.0));
  vec3 color = mix(warm, mix(uCool, uCore, vHeat), vTone);
  color = mix(color, mix(uCore, vec3(1.0), 0.6), vSpec * step(0.6, a));
  gl_FragColor = vec4(color, a * min(vAlpha, 1.0));
}
`;
