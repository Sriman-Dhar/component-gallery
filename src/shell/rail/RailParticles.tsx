import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { AdditiveBlending, Color, NormalBlending, ShaderMaterial } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from '../../lib/motion';
import { useFrameTheme } from '../../lib/theme';
import { buildRailGeometry, pointCount, tokenRgb } from './railGeometry';
import { railFragment, railVertex } from './railShader';

export interface RailPointer {
  x: number;
  y: number;
  on: number;
}

interface Props {
  litWeeks: number[];
  /** False when the hero is offscreen or the tab is hidden: no ticker, no frames. */
  active: boolean;
  pointer: MutableRefObject<RailPointer>;
}

/** The particle light rail: assembles from scatter (1.2s), breathes, bends to the pointer, pulses every 4s. */
export default function RailParticles({ litWeeks, active, pointer }: Props) {
  const { size, invalidate, viewport } = useThree();
  const theme = useFrameTheme();
  const count = pointCount(size.width);
  const litKey = litWeeks.join(',');

  const geometry = useMemo(() => buildRailGeometry(count, litWeeks), [count, litKey]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: railVertex,
        fragmentShader: railFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uPulse: { value: -0.2 },
          uWidth: { value: 1 },
          uHeight: { value: 1 },
          uPixel: { value: 1 },
          uPointer: { value: [0, 0] },
          uPointerOn: { value: 0 },
          uCore: { value: new Color() },
          uBody: { value: new Color() },
        },
      }),
    [],
  );
  const u = material.uniforms;

  // Colors and blending follow the frame theme: additive light on dark, normal blending on light.
  useEffect(() => {
    (u.uCore.value as Color).setRGB(...tokenRgb('--color-glow'));
    (u.uBody.value as Color).setRGB(...tokenRgb('--color-accent'));
    material.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
    invalidate();
  }, [theme, material, u, invalidate]);

  // Assemble once (1.2s), then the pulse loop: 1.6s travel + 2.4s rest = every 4s.
  const pulse = useRef<gsap.core.Timeline>();
  useEffect(() => {
    const assemble = gsap.to(u.uAssemble, { value: 1, duration: 1.2, ease: 'power3.out' });
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.4, delay: 1.2 });
    tl.fromTo(u.uPulse, { value: -0.1 }, { value: 1.1, duration: 1.6, ease: 'power1.inOut' });
    pulse.current = tl;
    return () => {
      assemble.kill();
      tl.kill();
    };
  }, [u]);

  // Frames only while active: the GSAP ticker requests one render per tick; offscreen it all stops.
  useEffect(() => {
    if (!active) {
      pulse.current?.pause();
      return;
    }
    pulse.current?.resume();
    gsap.ticker.add(invalidate);
    return () => gsap.ticker.remove(invalidate);
  }, [active, invalidate]);

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );
  useEffect(() => () => material.dispose(), [material]);

  // Refs and uniforms only; never React state in the frame loop.
  useFrame((state, delta) => {
    u.uTime.value = state.clock.elapsedTime;
    u.uWidth.value = size.width;
    u.uHeight.value = size.height;
    u.uPixel.value = viewport.dpr;
    const p = u.uPointer.value as number[];
    const target = pointer.current;
    p[0] += (target.x - p[0]) * Math.min(1, delta * 6);
    p[1] += (target.y - p[1]) * Math.min(1, delta * 6);
    u.uPointerOn.value += (target.on - u.uPointerOn.value) * Math.min(1, delta * 4);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
