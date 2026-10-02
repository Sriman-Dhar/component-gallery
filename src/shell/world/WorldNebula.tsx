import { useEffect, useMemo } from 'react';
import { PlaneGeometry, ShaderMaterial } from 'three';
import { gsap, motionAllowed } from '../../lib/motion';
import type { WorldUniforms } from './useWorldUniforms';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * The backdrop: the frame's bg colour with a very faint nebula (two octaves of value noise, ember near the
 * sun, a cool breath far from it) that drifts against the camera for parallax. The warm pool is the hero's
 * atmosphere, so it never switches off: the low tier only eases it to 80% over 1.5s (one full-screen quad is
 * cheap next to the particles it saves).
 */
const fragment = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uDeep;
uniform vec3 uCool;
uniform float uTime;
uniform float uLight;
uniform float uIgnite;
uniform float uNebula;
uniform vec2 uSun;
uniform vec2 uParallax;
uniform vec2 uViewport;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uViewport.x / uViewport.y, 1.0);
  vec2 q = p * 2.2 + uParallax + vec2(uTime * 0.006, 0.0);
  float n = noise(q) * 0.65 + noise(q * 2.3 + 4.1) * 0.35;
  vec2 s = (vUv * 2.0 - 1.0 - uSun) * vec2(uViewport.x / uViewport.y, 1.0);
  float nearSun = exp(-dot(s, s) * 1.1);
  vec3 neb = uDeep * nearSun * (0.35 + 0.65 * n) * 0.36 + uCool * (1.0 - nearSun) * smoothstep(0.45, 0.9, n) * 0.05;
  vec3 color = uBg + neb * uNebula * uIgnite * (1.0 - uLight * 0.85);
  gl_FragColor = vec4(color, 1.0);
}
`;

/** The low tier's nebula strength: a floor well above half the lit state, so a tier drop changes no mood. */
const LOW_TIER_NEBULA = 0.8;

export default function WorldNebula({ uniforms, low }: { uniforms: WorldUniforms; low: boolean }) {
  const geometry = useMemo(() => new PlaneGeometry(2, 2), []);
  const material = useMemo(
    () => new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, depthTest: false, depthWrite: false }),
    [uniforms],
  );
  useEffect(() => {
    const value = low ? LOW_TIER_NEBULA : 1;
    const tween = gsap.to(uniforms.uNebula, { value, duration: motionAllowed() ? 1.5 : 0, ease: 'sine.inOut' });
    return () => {
      tween.kill();
    };
  }, [uniforms, low]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={0} />;
}
