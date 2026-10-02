import { commonGlsl, spriteGlsl } from './common';
import { formationsGlsl } from './formations';

/**
 * The particle program. Each particle owns a home in every formation (attributes); uStage moves the whole
 * swarm from formation i to i + 1, each particle on its own delay, along a curve that pours down from where it
 * was and straightens into where it goes. No per-particle JS ever runs per frame.
 */
export const particleVertex = /* glsl */ `
${commonGlsl}
attribute float aKind;
attribute float aRing;
attribute float aU;
attribute vec3 aJit;
attribute float aSeed;
attribute float aBright;
attribute float aTone;
attribute float aRailKind;
attribute float aRailU;
attribute float aRailOff;
attribute float aRailBright;
attribute vec4 aGrid;
attribute vec3 aGlyph;
varying float vAlpha;
varying float vWarm;
varying float vHeat;
varying float vBlur;
${formationsGlsl}

void main() {
  float s = clamp(uStage, 0.0, float(FORMATION_COUNT - 1));
  int i = int(min(floor(s), float(FORMATION_COUNT - 2)));
  float k = s - float(i);
  k = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, k);
  Form a = formAt(i);
  Form b = formAt(i + 1);
  // The stream: drop from the old home toward the new one's height, then slide into place.
  vec2 bend = vec2(a.ndc.x + sin(aSeed * 40.0 + uTime * 0.8) * 0.06, b.ndc.y + cos(aSeed * 23.0) * 0.05);
  vec2 ndc = (1.0 - k) * (1.0 - k) * a.ndc + 2.0 * k * (1.0 - k) * bend + k * k * b.ndc;
  float lit = 0.0;
  ndc = keepOut(forces(ndc, mix(1.0, 0.45, clamp(s, 0.0, 1.0)), lit), aSeed);
  float travel = 4.0 * k * (1.0 - k);
  vAlpha = (mix(a.bright, b.bright, k) + lit * 0.5 + travel * 0.35) * mix(1.0, 0.5, uGutter);
  vWarm = mix(a.warm, b.warm, k);
  vHeat = mix(a.heat, b.heat, k) + lit * 0.4 + travel * 0.25;
  vBlur = mix(a.blur, b.blur, k);
  // Close orbit: points near the lens stay fine and faint, so the body and its ring read, not a bokeh soup.
  float close = step(0.0, uSolo);
  vAlpha *= (1.0 - close * vBlur * 0.6) * (1.0 - veil(ndc));
  gl_PointSize = clamp(mix(a.size, b.size, k) * (1.0 + lit * 0.5), 0.5, mix(16.0, 7.0, close)) * uPixel;
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;

/**
 * Warm points run the amber ramp (deep ember, body, white-hot core) and go HDR so the bloom catches them;
 * cool points (future slots, dust) take the rim. On the light frame the ramp darkens and stays under 1.
 */
export const particleFragment = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uBody;
uniform vec3 uCool;
uniform vec3 uDeep;
uniform float uLight;
varying float vAlpha;
varying float vWarm;
varying float vHeat;
varying float vBlur;
${spriteGlsl}
void main() {
  float a = sprite(vBlur);
  if (a < 0.01) discard;
  float heat = clamp(vHeat + a * 0.4, 0.0, 1.0);
  vec3 warm = mix(mix(uDeep, uBody, smoothstep(0.0, 0.5, vAlpha)), uCore, heat);
  vec3 color = mix(mix(uCool, uCore, vHeat), warm, vWarm);
  float hdr = mix(1.0 + vHeat * 2.2 + step(1.2, vAlpha) * 0.8, 1.0, uLight);
  float alpha = a * min(vAlpha, 1.0) * (1.0 - vBlur * 0.55);
  // On paper there is no bloom: a dense or soft cluster deepens toward warm ink and thins, so the flare reads
  // as a darker burn, never a flat orange blob.
  float burn = uLight * clamp(vBlur + max(vAlpha - 1.0, 0.0) * 0.5, 0.0, 0.7);
  color = mix(color, uDeep * 0.8, burn);
  alpha *= 1.0 - burn * 0.45;
  gl_FragColor = vec4(color * hdr, alpha);
}
`;
