import { WORLD_R } from '../worldLayout';

/**
 * Uniforms and helpers every world program shares. One uniform object feeds the particles, the bodies, the
 * sun and the nebula, so time, yaw, ignition and stage can never drift apart between them.
 */
export const commonGlsl = /* glsl */ `
uniform float uTime;
uniform float uYaw;
uniform vec4 uRings[3];
uniform float uStage;
uniform float uIgnite;
uniform float uDraw;
uniform float uArrive;
uniform float uBodies;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec3 uShock;
uniform vec2 uViewport;
uniform float uPixel;
uniform vec4 uRail;
uniform float uPulse;
uniform float uDof;
uniform float uFocus;
uniform float uLight;
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uCool;
uniform vec3 uDeep;

vec3 rotY(vec3 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
}

// A point on ring r at fraction u (plus a local jitter), inclined, turned by its node and the system yaw.
// Mirrors project() in orrery/orreryModel.ts, so the SVG poster and the live scene are the same object.
vec3 ringPoint(float r, float u, vec3 jit) {
  vec4 ring = uRings[int(r + 0.5)];
  float th = 6.2831853 * u + ring.w * uTime;
  vec3 l = vec3(ring.x * cos(th), 0.0, ring.x * sin(th)) + jit;
  l = vec3(l.x, l.y - l.z * sin(ring.y), l.z * cos(ring.y));
  return rotY(l, ring.z + uYaw) * ${WORLD_R.toFixed(3)};
}

// Pointer gravity well and click shockwave, in NDC with the aspect corrected. Returns the displaced point;
// 'lit' gains the light the effects add.
vec2 forces(vec2 ndc, float reach, inout float lit) {
  float aspect = uViewport.x / uViewport.y;
  vec2 d = (ndc - uPointer) * vec2(aspect, 1.0);
  float r = length(d) + 1e-4;
  float well = exp(-r * r / 0.035) * uPointerOn * reach;
  vec2 bend = -d * well * 0.42 + vec2(-d.y, d.x) * well * 0.18;
  vec2 s = (ndc - uShock.xy) * vec2(aspect, 1.0);
  float sr = length(s) + 1e-4;
  float front = uShock.z * 1.25;
  float band = exp(-pow((sr - front) / 0.07, 2.0)) * exp(-uShock.z * 1.4) * step(0.0, uShock.z) * reach;
  vec2 push = s / sr * band * 0.06;
  lit += well * 0.6 + band * 1.4;
  return ndc + (bend + push) / vec2(aspect, 1.0);
}
`;

/** The soft sprite every particle shares; blur (0..1) widens it into a dim bokeh disc for the far ring. */
export const spriteGlsl = /* glsl */ `
float sprite(float blur) {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float edge = mix(0.52, 0.98, blur);
  float core = 1.0 - smoothstep(mix(0.3, 0.55, blur), edge, d);
  float halo = pow(max(0.0, 1.0 - d), 3.0) * 0.35 * (1.0 - blur);
  return max(core, halo);
}
`;
