import { VEIL_COUNT } from '../worldState';
import { commonGlsl, veilGlsl } from './common';

/**
 * The 30 component bodies as lit spheres riding the rings (instanced, positions from the same ring math as
 * the particles). The sun at the origin is the key light: a lit hemisphere in the amber ramp (ember shadow,
 * amber body, white-hot sub-solar point) with a cool fresnel rim on the far side. Shipped bodies burn HDR so
 * the bloom takes them; future bodies are dark glass with only the rim and a faint key.
 */
export const bodyVertex = /* glsl */ `
${commonGlsl}
attribute float aSlotRing;
attribute float aSlotU;
attribute float aLit;
attribute float aOrder;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vLit;
varying float vNear;
void main() {
  float arrive = smoothstep(aOrder * 0.6, aOrder * 0.6 + 0.4, uArrive);
  vec3 center = ringPoint(aSlotRing, aSlotU, vec3(0.0)) * mix(2.4, 1.0, arrive);
  float solo = uSolo < 0.0 ? 1.0 : 1.0 - step(0.5, abs(aOrder * 30.0 - uSolo));
  vec4 at = projectionMatrix * viewMatrix * vec4(center, 1.0);
  // Behind the words a body sinks away rather than sit on a letter.
  float scale = mix(0.024, 0.042, aLit) * arrive * uBodies * solo * (1.0 - veil(at.xy / at.w)) * mix(1.0, 0.8, uLight * (1.0 - aLit));
  vec3 world = center + position * scale;
  vNormal = normalize(normal);
  vWorld = world;
  vLit = aLit;
  // How close to the lens (the dive flies past bodies at depth < 0.9; the hero keeps them past 1.3).
  vNear = 1.0 - smoothstep(0.35, 0.9, -(viewMatrix * vec4(center, 1.0)).z);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

export const bodyFragment = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uCool;
uniform vec3 uDeep;
uniform vec3 uBg;
uniform float uLight;
uniform float uIgnite;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vLit;
varying float vNear;
void main() {
  vec3 n = normalize(vNormal);
  vec3 toSun = normalize(-vWorld);
  vec3 toCam = normalize(cameraPosition - vWorld);
  float ndl = max(dot(n, toSun), 0.0);
  float fres = pow(1.0 - max(dot(n, toCam), 0.0), 3.0);
  vec3 ramp = mix(uDeep * 0.35, uBody, smoothstep(0.0, 0.6, ndl));
  ramp = mix(ramp, uCore, smoothstep(0.55, 1.0, ndl));
  vec3 hot = mix(ramp, vec3(1.0), pow(ndl, 12.0) * 0.8);
  vec3 lit = hot * mix(2.6, 1.0, uLight) * (0.35 + 0.65 * uIgnite);
  vec3 dark = mix(uDeep * 0.12, uBody * 0.5, ndl * 0.35);
  // On the light frame a future body is smoked glass, not an ink blot: lifted toward the paper.
  dark = mix(dark, mix(uDeep, vec3(0.86), 0.62), uLight * 0.75);
  // A shipped body is self-lit: its night side keeps an ember core and a warm atmosphere rim that the bloom
  // spreads into a halo, so the two shipped planets read as special at rest, from any angle, before any hover.
  // In the dark frame the night side burns past the bloom threshold, so a far-side planet still haloes.
  float night = mix(1.4 * (0.55 + 0.75 * (1.0 - ndl)), 0.5 * (0.55 + 0.25 * (1.0 - ndl)), uLight);
  lit += uBody * night + uCore * pow(fres, 1.6) * mix(2.2, 0.9, uLight);
  vec3 color = mix(dark, lit, vLit) + uCool * fres * (1.0 - ndl) * mix(0.9, 0.2, vLit);
  // On paper a future body rushing past the lens melts into the ground and leaves only its rim, so the
  // depth blur never smears it into a grey disc.
  color = mix(color, uBg, vNear * uLight * (1.0 - vLit) * (1.0 - smoothstep(0.2, 0.6, fres)));
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * The sun: a camera-facing disc with an HDR core, a corona and a slow flicker; uIgnite flares it on load. At
 * the end of the dive it leaves the ring plane and docks on the rail as today's marker (uSunDock), a small
 * fixed-size star. On the 404 it gutters (uGutter): an uneven, failing light.
 */
export const sunVertex = /* glsl */ `
uniform float uIgnite;
uniform float uBodies;
uniform vec3 uSunDock;
uniform vec2 uViewport;
uniform float uSolo;
uniform vec4 uVeil[${VEIL_COUNT}];
varying vec2 vUv;
varying float vVeil;
${veilGlsl}
void main() {
  vUv = position.xy;
  vec4 view = viewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  float flare = 1.0 + 1.4 * smoothstep(0.0, 0.25, uIgnite) * (1.0 - smoothstep(0.25, 0.9, uIgnite));
  // Close orbit: the sun is a distant small star at the frame's edge, never a wash behind the type.
  view.xy += position.xy * 0.62 * flare * mix(0.2, 1.0, uBodies) * (uSolo < 0.0 ? 1.0 : 0.22);
  vec4 clip = projectionMatrix * view;
  vec2 docked = uSunDock.xy + position.xy * 92.0 * 2.0 / uViewport;
  gl_Position = vec4(mix(clip.xy / clip.w, docked, uSunDock.z), 0.0, 1.0);
  vec4 c0 = projectionMatrix * viewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vVeil = veil(mix(c0.xy / c0.w, uSunDock.xy, uSunDock.z));
}
`;

export const sunFragment = /* glsl */ `
uniform float uBodies;
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uDeep;
uniform vec3 uSunDock;
uniform float uIgnite;
uniform float uTime;
uniform float uLight;
uniform float uGutter;
uniform float uSolo;
uniform float uStill;
uniform float uSunClear;
varying vec2 vUv;
varying float vVeil;
void main() {
  float r = length(vUv);
  float hide = 1.0 - vVeil * mix(0.85, 1.0, uStill);
  float a = atan(vUv.y, vUv.x);
  float flick = 1.0 + 0.06 * sin(uTime * 3.1) + 0.04 * sin(a * 7.0 + uTime * 0.7);
  float core = smoothstep(0.075, 0.0, r);
  float corona = exp(-r * 9.0) * flick;
  float rays = exp(-r * 5.0) * pow(abs(sin(a * 6.0 + uTime * 0.15)), 18.0) * 0.25 * (1.0 - uLight);
  vec3 color = vec3(1.0, 0.97, 0.9) * core * 6.0 + uCore * corona * 2.2 + uBody * (rays + exp(-r * 3.5) * 0.25);
  float alpha = clamp(core + corona + rays, 0.0, 1.0);
  // Guttering: three beating flickers multiply into uneven dips, the light cools toward ember.
  float k = sin(uTime * 7.3) * sin(uTime * 2.1 + 1.3) * sin(uTime * 13.7 + 0.4);
  float gutter = clamp(0.3 + 0.55 * k * k + 0.2 * sin(uTime * 1.7), 0.06, 1.0);
  color = mix(color, uDeep * 3.0 * (core + corona) + uBody * corona, uGutter * 0.6) * mix(1.0, gutter, uGutter);
  float strength = (uSolo < 0.0 ? 1.0 : 0.3) * uIgnite * mix(mix(0.3, 1.0, uBodies), 0.9, uSunDock.z);
  if (uLight > 0.5) {
    // Paper: light cannot add, so the sun is ink. A crisp warm disc (bright amber centre to a deep rim), a thin
    // ink ring flare, six fine ink rays and a warm halo; normal blending, so every term carries its own alpha.
    float disc = smoothstep(0.1, 0.088, r);
    vec3 face = mix(uBody * 1.2, uDeep, smoothstep(0.0, 0.095, r));
    float ring = smoothstep(0.006, 0.0, abs(r - 0.15)) * 0.45 * flick;
    float spokes = exp(-r * 9.0) * pow(abs(sin(a * 6.0 + uTime * 0.15)), 40.0) * 0.9 * smoothstep(0.1, 0.13, r);
    float halo = exp(-r * 10.0) * 0.5 * (1.0 - disc);
    float ink = clamp((ring + spokes) * 1.6, 0.0, 1.0);
    vec3 paper = mix(mix(uBody, uDeep, ink), face, disc);
    float cover = clamp(disc + ring + spokes + halo, 0.0, 1.0) * mix(1.0, 0.75, uGutter * (1.0 - gutter));
    // The paper still leaves out a sun whose ring would reach the type (uSunClear), never a half-veiled ghost.
    gl_FragColor = vec4(paper, cover * strength * hide * mix(1.0, uSunClear, uStill));
    return;
  }
  color *= strength * hide;
  gl_FragColor = vec4(color, alpha * uIgnite * hide);
}
`;
