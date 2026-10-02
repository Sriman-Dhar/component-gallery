import { commonGlsl } from './common';

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
void main() {
  float arrive = smoothstep(aOrder * 0.6, aOrder * 0.6 + 0.4, uArrive);
  vec3 center = ringPoint(aSlotRing, aSlotU, vec3(0.0)) * mix(2.4, 1.0, arrive);
  float scale = mix(0.024, 0.042, aLit) * arrive * uBodies;
  vec3 world = center + position * scale;
  vNormal = normalize(normal);
  vWorld = world;
  vLit = aLit;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

export const bodyFragment = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uCool;
uniform vec3 uDeep;
uniform float uLight;
uniform float uIgnite;
varying vec3 vNormal;
varying vec3 vWorld;
varying float vLit;
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
  vec3 color = mix(dark, lit, vLit) + uCool * fres * (1.0 - ndl) * mix(0.9, 0.5, vLit);
  gl_FragColor = vec4(color, 1.0);
}
`;

/** The sun: a camera-facing disc with an HDR core, a corona and a slow flicker; uIgnite flares it on load. */
export const sunVertex = /* glsl */ `
uniform float uIgnite;
uniform float uBodies;
varying vec2 vUv;
void main() {
  vUv = position.xy;
  vec4 view = viewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  float flare = 1.0 + 1.4 * smoothstep(0.0, 0.25, uIgnite) * (1.0 - smoothstep(0.25, 0.9, uIgnite));
  view.xy += position.xy * 0.62 * flare * mix(0.2, 1.0, uBodies);
  gl_Position = projectionMatrix * view;
}
`;

export const sunFragment = /* glsl */ `
uniform float uBodies;
uniform vec3 uCore;
uniform vec3 uBody;
uniform float uIgnite;
uniform float uTime;
uniform float uLight;
varying vec2 vUv;
void main() {
  float r = length(vUv);
  float a = atan(vUv.y, vUv.x);
  float flick = 1.0 + 0.06 * sin(uTime * 3.1) + 0.04 * sin(a * 7.0 + uTime * 0.7);
  float core = smoothstep(0.075, 0.0, r);
  float corona = exp(-r * 9.0) * flick;
  float rays = exp(-r * 5.0) * pow(abs(sin(a * 6.0 + uTime * 0.15)), 18.0) * 0.25 * (1.0 - uLight);
  vec3 color = vec3(1.0, 0.97, 0.9) * core * 6.0 + uCore * corona * 2.2 + uBody * (rays + exp(-r * 3.5) * 0.25);
  float alpha = clamp(core + corona + rays, 0.0, 1.0);
  color *= uIgnite * mix(1.0, 0.45, uLight) * mix(0.3, 1.0, uBodies);
  gl_FragColor = vec4(color, alpha * uIgnite);
}
`;
