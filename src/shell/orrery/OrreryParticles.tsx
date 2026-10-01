import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { AdditiveBlending, Color, NormalBlending, ShaderMaterial, Vector4 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from '../../lib/motion';
import { railPulse } from '../../lib/railPulse';
import { useFrameTheme } from '../../lib/theme';
import { tokenRgb } from '../rail/railGeometry';
import type { RailPointer } from '../rail/RailParticles';
import { buildOrreryGeometry } from './orreryGeometry';
import { orreryCount, RINGS } from './orreryModel';
import { orreryFragment, orreryVertex } from './orreryShader';
import { stepSpin, type Spin } from './orrerySpin';

interface Props {
  shipped: number;
  /** False when the hero is offscreen or the tab is hidden: no ticker, no frames. */
  active: boolean;
  pointer: MutableRefObject<RailPointer>;
  spin: MutableRefObject<Spin>;
}

/** Where the rail's pulse leaves its end and rises into the orrery. */
const HANDOFF = 1;

/**
 * The orrery scene: assembles from scatter (1.4s, just after the rail starts), turns once every 40s, leans
 * toward the pointer, spins under a drag and eases back, and catches the rail's pulse once per cycle.
 */
export default function OrreryParticles({ shipped, active, pointer, spin }: Props) {
  const { size, invalidate, viewport } = useThree();
  const theme = useFrameTheme();
  const side = size.width;
  const count = orreryCount(side);

  const geometry = useMemo(() => buildOrreryGeometry(count, shipped), [count, shipped]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: orreryVertex,
        fragmentShader: orreryFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uYaw: { value: 0 },
          uSide: { value: 1 },
          uWidth: { value: 1 },
          uHeight: { value: 1 },
          uPixel: { value: 1 },
          uFeed: { value: 0 },
          uPointer: { value: [0, 0] },
          uPointerOn: { value: 0 },
          uRings: { value: RINGS.map((r) => new Vector4(r.radius, r.inc, r.node, r.speed)) },
          uCore: { value: new Color() },
          uBody: { value: new Color() },
          uCool: { value: new Color() },
        },
      }),
    [],
  );
  const u = material.uniforms;

  // Colors and blending follow the frame theme: additive light on dark, normal blending on light.
  useEffect(() => {
    (u.uCore.value as Color).setRGB(...tokenRgb('--color-glow'));
    (u.uBody.value as Color).setRGB(...tokenRgb('--color-accent'));
    (u.uCool.value as Color).setRGB(...tokenRgb('--color-rim'));
    material.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
    invalidate();
  }, [theme, material, u, invalidate]);

  useEffect(() => {
    const assemble = gsap.to(u.uAssemble, { value: 1, duration: 1.4, delay: 0.2, ease: 'power3.out' });
    return () => {
      assemble.kill();
    };
  }, [u]);

  // Frames only while active: the GSAP ticker requests one render per tick; offscreen it all stops.
  useEffect(() => {
    if (!active) return;
    gsap.ticker.add(invalidate);
    return () => gsap.ticker.remove(invalidate);
  }, [active, invalidate]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const lastHead = useRef(railPulse.head);
  const feed = useRef<gsap.core.Tween>();
  useEffect(
    () => () => {
      feed.current?.kill();
    },
    [],
  );

  // Refs and uniforms only; never React state in the frame loop.
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    stepSpin(spin.current, dt);
    u.uYaw.value = spin.current.yaw;
    u.uTime.value = state.clock.elapsedTime;
    u.uSide.value = side;
    u.uWidth.value = size.width;
    u.uHeight.value = size.height;
    u.uPixel.value = viewport.dpr;
    const p = u.uPointer.value as number[];
    const target = pointer.current;
    p[0] += (target.x - p[0]) * Math.min(1, dt * 6);
    p[1] += (target.y - p[1]) * Math.min(1, dt * 6);
    u.uPointerOn.value += (target.on - u.uPointerOn.value) * Math.min(1, dt * 4);

    const head = railPulse.head;
    if (lastHead.current < HANDOFF && head >= HANDOFF) {
      feed.current?.kill();
      feed.current = gsap.fromTo(u.uFeed, { value: 0.001 }, { value: 1, duration: 1.8, ease: 'sine.inOut' });
    }
    lastHead.current = head;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
