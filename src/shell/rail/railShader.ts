/**
 * The rail particle shader. Every particle has a home on the line (aU along it, aOff across it) and a
 * scattered start (aScatter). All motion runs here, driven by uniforms; JS never rewrites positions.
 * Coordinates are CSS pixels (orthographic camera, zoom 1, origin at the canvas center).
 */
export const railVertex = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uPulse;
uniform float uWidth;
uniform float uHeight;
uniform float uPixel;
uniform vec2 uPointer;
uniform float uPointerOn;
attribute float aU;
attribute float aOff;
attribute float aSeed;
attribute float aBright;
attribute vec2 aScatter;
varying float vAlpha;
varying float vHeat;

void main() {
  float t = smoothstep(aSeed * 0.35, 0.65 + aSeed * 0.35, uAssemble);
  float breath = sin(uTime * 0.9 + aSeed * 6.2831) * (1.5 + abs(aOff) * 0.22);
  vec2 home = vec2((aU - 0.5) * uWidth + cos(uTime * 0.5 + aSeed * 12.0) * 1.4, aOff + breath);
  vec2 p = mix(aScatter * vec2(uWidth, uHeight), home, t);

  vec2 toPointer = uPointer - p;
  float pull = smoothstep(150.0, 0.0, length(toPointer)) * uPointerOn * t;
  p += toPointer * pull * 0.24;

  float heat = smoothstep(0.05, 0.0, abs(aU - uPulse)) * t;
  vHeat = heat;
  vAlpha = (0.22 + aBright * 0.78) * (0.3 + 0.7 * t) + heat * 0.9 + pull * 0.4;
  gl_PointSize = (1.8 + aSeed * 2.4 + aBright * 3.2 + heat * 4.0) * uPixel;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
}
`;

/** A soft round sprite computed per fragment (no texture to load or dispose). */
export const railFragment = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uBody;
varying float vAlpha;
varying float vHeat;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  if (a < 0.01) discard;
  vec3 color = mix(uBody, uCore, clamp(vHeat + a * 0.45, 0.0, 1.0));
  gl_FragColor = vec4(color, a * min(vAlpha, 1.0));
}
`;
