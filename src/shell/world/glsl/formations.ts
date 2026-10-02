import { FORMATIONS } from '../worldModes';

/**
 * One GLSL function per formation, keyed by name. Each returns where a particle sits in NDC (xy), its
 * depth blur, brightness, warmth (0 cool .. 1 amber) and point size in CSS px. Part B adds halos, glyph and
 * far here and in FORMATIONS; formAt() and the blend in particles.ts pick them up unchanged.
 */
const FORMATION_GLSL: Record<string, string> = {
  // The 3D orrery: ring filament drawn on by angle, slot clusters arriving, a breathing core, a dust shell.
  orbit: /* glsl */ `
Form formOrbit() {
  Form f;
  float isCore = 1.0 - step(0.5, abs(aKind - 2.0));
  float isDust = step(2.5, aKind);
  float isNode = 1.0 - step(0.5, abs(aKind - 1.0));
  float onRing = 1.0 - isCore - isDust;
  float arrive = smoothstep(aSeed * 0.5, 0.5 + aSeed * 0.5, uArrive);
  vec3 p = ringPoint(aRing, aU, aJit * mix(1.0, 3.0 + aSeed * 4.0, (1.0 - arrive) * isNode)) * onRing;
  float breath = 1.0 + 0.1 * sin(uTime * 1.3 + aSeed * 6.2831);
  p += rotY(aJit * breath * mix(0.2, 1.0, uIgnite), uYaw * 1.6) * isCore * 2.6;
  p += rotY(aJit, uYaw * 0.35 + uTime * 0.02) * isDust * 2.6;
  vec4 view = viewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * view;
  f.ndc = clip.xy / clip.w;
  float depth = -view.z;
  f.blur = clamp(abs(depth - uFocus) / 1.6, 0.0, 1.0) * uDof * (1.0 - isCore);
  // Ring draw-on: the filament appears by angle with a hot head at the drawing front.
  float drawn = smoothstep(aU - 0.035, aU, uDraw * 1.04);
  float head = exp(-pow((uDraw * 1.04 - aU) / 0.02, 2.0)) * step(uDraw, 0.999);
  float ringShow = mix(1.0, drawn, 1.0 - isNode) * mix(1.0, arrive, isNode);
  float show = onRing * ringShow + isCore * uIgnite + isDust * smoothstep(0.2, 1.0, uIgnite);
  // Key light from the sun: the near side of each ring is brighter, the far side falls into shade.
  vec3 toCam = normalize(cameraPosition - p);
  float front = clamp(dot(normalize(p + 1e-4), toCam) * 0.5 + 0.5, 0.0, 1.0);
  float key = 0.25 + 0.75 * front;
  float dust = 0.55 + 0.45 * sin(uTime * 0.7 + aSeed * 30.0);
  f.bright = (0.2 + aBright * 0.8) * key * show * mix(1.0, dust, isDust) + head * onRing * 2.0;
  f.bright *= 1.0 + isCore * 1.6 * uIgnite;
  f.warm = mix(1.0 - aTone, 1.0, isCore);
  f.heat = 0.0;
  float persp = 2.4 / max(0.25, depth);
  float size = (1.3 + aSeed * 1.3 + aBright * 2.0 + isCore * 0.8) * persp;
  f.size = mix(size, (0.8 + aSeed) * persp, isDust) * (1.0 + f.blur * 2.2);
  f.bright *= step(0.06, depth);
  return f;
}
`,
  // The 90-day light rail in viewport pixels from the DOM anchor: filament, week clusters, reflection, dust.
  rail: /* glsl */ `
Form formRail() {
  Form f;
  float isReflect = 1.0 - step(0.5, abs(aRailKind - 1.0));
  float isDust = step(1.5, aRailKind);
  float breath = sin(uTime * 0.9 + aSeed * 6.2831) * (1.5 + abs(aRailOff) * 0.22);
  float x = uRail.x + aRailU * uRail.z + cos(uTime * 0.5 + aSeed * 12.0) * 1.4;
  float up = mix(aRailOff + breath, -(aRailOff + breath * 0.5), isReflect);
  float dustX = uRail.x + fract(aRailU + uTime * (0.004 + aSeed * 0.006)) * uRail.z;
  vec2 px = mix(vec2(x, uRail.y + uRail.w - up), vec2(dustX, uRail.y + uRail.w + aRailOff * 150.0), isDust);
  f.ndc = vec2(px.x / uViewport.x * 2.0 - 1.0, 1.0 - px.y / uViewport.y * 2.0);
  float d = uPulse - aRailU;
  float heat = max(smoothstep(0.035, 0.0, abs(d)), step(0.0, d) * exp(-d * 11.0) * 0.5) * (1.0 - isDust);
  float depthFade = 1.0 - smoothstep(3.0, 40.0, aRailOff);
  float layer = (1.0 - isReflect - isDust) + isReflect * 0.8 * depthFade + isDust * 0.7;
  f.bright = ((0.22 + aRailBright * 0.78) + heat * 1.6) * layer;
  f.blur = 0.0;
  f.warm = 1.0;
  f.size = mix(1.8 + aSeed * 2.4 + aRailBright * 3.2 + heat * 4.0, 1.2 + aSeed * 1.6, isDust) * 0.62;
  f.heat = heat;
  return f;
}
`,
};

const names = FORMATIONS.map((n) => `form${n[0].toUpperCase()}${n.slice(1)}`);

/** Every formation's function, then formAt(i) choosing among them in registry order. */
export const formationsGlsl = /* glsl */ `
struct Form { vec2 ndc; float blur; float bright; float warm; float size; float heat; };
${FORMATIONS.map((n) => FORMATION_GLSL[n]).join('\n')}
Form formAt(int i) {
${names.map((fn, i) => `  if (i == ${i}) return ${fn}();`).join('\n')}
  return ${names[names.length - 1]}();
}
const int FORMATION_COUNT = ${FORMATIONS.length};
`;
