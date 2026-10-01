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
attribute float aKind;
attribute vec2 aScatter;
varying float vAlpha;
varying float vHeat;

void main() {
  float isReflect = 1.0 - step(0.5, abs(aKind - 1.0));
  float isDust = step(1.5, aKind);
  float isRail = 1.0 - isReflect - isDust;
  float t = smoothstep(aSeed * 0.35, 0.65 + aSeed * 0.35, uAssemble);

  // Rail and reflection share the line's breath; the reflection hangs below it, mirrored.
  float breath = sin(uTime * 0.9 + aSeed * 6.2831) * (1.5 + abs(aOff) * 0.22);
  float x = (aU - 0.5) * uWidth + cos(uTime * 0.5 + aSeed * 12.0) * 1.4;
  vec2 home = vec2(x, mix(aOff + breath, -(aOff + breath * 0.5), isReflect));

  // Dust drifts slowly to the right, wraps, and sits behind the rail at parallax against the pointer.
  float dustX = (fract(aU + uTime * (0.004 + aSeed * 0.006)) - 0.5) * uWidth;
  float dustY = aOff * uHeight + sin(uTime * 0.3 + aSeed * 20.0) * 4.0;
  home = mix(home, vec2(dustX, dustY) - uPointer * 0.05 * uPointerOn, isDust);

  vec2 p = mix(aScatter * vec2(uWidth, uHeight), home, t);

  // The pointer bends the rail; the reflection bends toward the pointer's mirror image.
  vec2 target = vec2(uPointer.x, mix(uPointer.y, -uPointer.y, isReflect));
  vec2 toPointer = target - p;
  float pull = smoothstep(150.0, 0.0, length(toPointer)) * uPointerOn * t * (1.0 - isDust);
  p += toPointer * pull * 0.24;

  // The pulse: a sharp head and an afterglow that decays behind it.
  float d = uPulse - aU;
  float head = smoothstep(0.035, 0.0, abs(d));
  float trail = step(0.0, d) * exp(-d * 11.0) * 0.5;
  float heat = max(head, trail) * t * (1.0 - isDust);
  vHeat = heat;

  float depthFade = 1.0 - smoothstep(3.0, 40.0, aOff);
  float layer = isRail + isReflect * 0.8 * depthFade + isDust;
  vAlpha = ((0.22 + aBright * 0.78) * (0.3 + 0.7 * t) + heat * 0.9 + pull * 0.4) * layer;
  vAlpha *= mix(1.0, 0.55 + 0.45 * sin(uTime * 0.7 + aSeed * 30.0), isDust);
  float size = 1.8 + aSeed * 2.4 + aBright * 3.2 + heat * 4.0;
  gl_PointSize = mix(size, 1.2 + aSeed * 1.6, isDust) * uPixel;
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
