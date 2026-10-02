import { WORLD_R } from '../worldLayout';
import { MAX_TILES } from '../worldState';

/** Needs uViewport and uVeil[2] declared; the sun program declares its own, the rest get them from commonGlsl. */
export const veilGlsl = /* glsl */ `
// The type the scene must never sit on (hero words, detail header, 404 copy): 1 inside a veil box (viewport
// px, width 0 = none), feathered over 40px, so bodies sink and points dim as they pass behind the words.
float veil(vec2 ndc) {
  vec2 px = vec2((ndc.x * 0.5 + 0.5) * uViewport.x, (0.5 - ndc.y * 0.5) * uViewport.y);
  float v = 0.0;
  for (int i = 0; i < 2; i++) {
    vec4 b = uVeil[i];
    if (b.z < 1.0) continue;
    vec2 d = max(b.xy - px, px - (b.xy + b.zw));
    v = max(v, 1.0 - smoothstep(-8.0, 40.0, max(d.x, d.y)));
  }
  return v;
}

`;

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
uniform vec4 uTiles[${MAX_TILES}];
uniform float uTileCount;
uniform float uGlyphBeat;
uniform vec3 uFar;
uniform vec4 uKeep;
uniform float uGutter;
uniform float uSolo;
uniform vec4 uVeil[2];

// Viewport px (y down) to NDC (y up) and back.
vec2 pxToNdc(vec2 px) { return vec2(px.x / uViewport.x * 2.0 - 1.0, 1.0 - px.y / uViewport.y * 2.0); }
vec2 ndcToPx(vec2 ndc) { return vec2((ndc.x * 0.5 + 0.5) * uViewport.x, (0.5 - ndc.y * 0.5) * uViewport.y); }

${veilGlsl}
// The type the particles flow around: a point inside the keep-out box (plus a margin) is carried to its
// nearest edge, so a stream parts around the fraction instead of crossing it. Each particle keeps its own
// margin (seed), so the parting edge is a soft falloff, never a drawn box.
vec2 keepOut(vec2 ndc, float seed) {
  if (uKeep.z < 1.0) return ndc;
  vec2 px = ndcToPx(ndc);
  float m = 14.0 + seed * 46.0;
  vec2 lo = uKeep.xy - m;
  vec2 hi = uKeep.xy + uKeep.zw + m;
  if (px.x <= lo.x || px.x >= hi.x || px.y <= lo.y || px.y >= hi.y) return ndc;
  vec2 toLo = px - lo;
  vec2 toHi = hi - px;
  float dx = min(toLo.x, toHi.x);
  float dy = min(toLo.y, toHi.y);
  // Carried past the edge by a share of its depth inside, so the parted stream stays loose, not a hard line.
  if (dx < dy) px.x = toLo.x < toHi.x ? lo.x - dx * 0.5 : hi.x + dx * 0.5;
  else px.y = toLo.y < toHi.y ? lo.y - dy * 0.5 : hi.y + dy * 0.5;
  return pxToNdc(px);
}

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
  // The shockwave: a ring of displacement and light racing out from the click, a second softer echo behind it.
  float front = uShock.z * 1.15;
  float fade = exp(-uShock.z * 0.9) * step(0.0, uShock.z) * reach;
  float band = exp(-pow((sr - front) / 0.085, 2.0)) * fade;
  float echo = exp(-pow((sr - front * 0.62) / 0.06, 2.0)) * fade * 0.45;
  vec2 push = s / sr * (band * 0.15 - echo * 0.05);
  lit += well * 0.6 + band * 2.4 + echo * 1.2;
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
