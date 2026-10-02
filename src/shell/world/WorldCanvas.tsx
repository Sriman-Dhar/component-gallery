import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { HalfFloatType } from 'three';
import type { ThemeName } from '../../lib/theme';
import FrameDriver from './FrameDriver';
import { ignite, settle } from './ignition';
import { useWorldUniforms } from './useWorldUniforms';
import WorldBodies from './WorldBodies';
import WorldDirector from './WorldDirector';
import WorldNebula from './WorldNebula';
import WorldParticles from './WorldParticles';
import { FOV, particleCount, startTier } from './worldLayout';

/** Full-screen canvas DPR band (PERF.md rule 3: a full-viewport canvas caps at 1.5). */
const DPR_MAX = 1.5;
const DPR_MIN = 1;

interface Props {
  still: boolean;
  shipped: number;
  litWeeks: number[];
  onReady: () => void;
  onLost: () => void;
}

function Scene({ still, shipped, litWeeks, low }: Omit<Props, 'onReady' | 'onLost'> & { low: boolean }) {
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [redraw, setRedraw] = useState(0);
  const onTheme = useCallback((next: ThemeName) => {
    setTheme(next);
    setRedraw((n) => n + 1);
  }, []);
  const uniforms = useWorldUniforms(onTheme);
  const [count] = useState(() => particleCount(window.innerWidth));

  useEffect(() => {
    uniforms.uDof.value = low ? 0 : 1;
  }, [uniforms, low]);

  useEffect(() => {
    if (still) {
      settle(uniforms);
      return;
    }
    return ignite(uniforms);
  }, [uniforms, still]);

  const dark = theme === 'dark';
  return (
    <>
      <WorldDirector uniforms={uniforms} still={still} />
      <WorldNebula uniforms={uniforms} on={!low} />
      <WorldBodies uniforms={uniforms} shipped={shipped} />
      <WorldParticles uniforms={uniforms} count={count} low={low} shipped={shipped} litWeeks={litWeeks} />
      <EffectComposer multisampling={0} frameBufferType={HalfFloatType} depthBuffer={false}>
        <Bloom mipmapBlur levels={low ? 5 : 7} intensity={dark ? 1.05 : 0} luminanceThreshold={0.92} luminanceSmoothing={0.2} radius={0.74} />
        <Vignette offset={0.32} darkness={dark ? 0.62 : 0.18} />
      </EffectComposer>
      <FrameDriver still={still} redraw={redraw} />
    </>
  );
}

/**
 * The Living Orrery's one canvas: fixed behind the DOM, opaque (it paints the frame's bg and nebula itself),
 * no antialias (a particle field), no own loop (FrameDriver). DPR 1 to 1.5, stepped by a 55 fps floor;
 * a fallback from the monitor drops to the low tier (half the particles, no depth blur, no nebula).
 */
export default function WorldCanvas({ still, shipped, litWeeks, onReady, onLost }: Props) {
  const [low, setLow] = useState(() => startTier() === 'low');
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, DPR_MAX));
  const current = useRef(dpr);
  current.current = dpr;
  // Already at the floor and still slow: the low tier is the next step down.
  const decline = () => (current.current <= DPR_MIN ? setLow(true) : setDpr(Math.max(DPR_MIN, current.current - 0.25)));

  return (
    <Canvas
      aria-hidden="true"
      frameloop="never"
      dpr={dpr}
      camera={{ fov: FOV, near: 0.02, far: 40, position: [0, 1, 2.5] }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onLost();
        });
        onReady();
      }}
    >
      <PerformanceMonitor
        bounds={() => [55, 61]}
        flipflops={3}
        onFallback={() => setLow(true)}
        onIncline={() => setDpr((d) => Math.min(DPR_MAX, d + 0.25))}
        onDecline={decline}
      />
      <Scene still={still} shipped={shipped} litWeeks={litWeeks} low={low} />
    </Canvas>
  );
}
