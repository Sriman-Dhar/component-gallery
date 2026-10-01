import { Canvas } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import AdaptiveDpr, { startDpr } from '../rail/AdaptiveDpr';
import type { RailPointer } from '../rail/RailParticles';
import OrreryParticles from './OrreryParticles';
import type { Spin } from './orrerySpin';

interface Props {
  shipped: number;
  active: boolean;
  pointer: MutableRefObject<RailPointer>;
  spin: MutableRefObject<Spin>;
  onReady: () => void;
  onLost: () => void;
}

/**
 * The orrery's WebGL layer, built like the rail's: lazy-loaded with three, DPR up to 2 and adaptive
 * (AdaptiveDpr), antialiased, frames on demand. A lost context unmounts it and leaves the SVG poster.
 */
export default function OrreryCanvas({ shipped, active, pointer, spin, onReady, onLost }: Props) {
  return (
    <Canvas
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      dpr={startDpr()}
      frameloop="demand"
      orthographic
      camera={{ zoom: 1, position: [0, 0, 10] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onLost();
        });
        onReady();
      }}
    >
      <AdaptiveDpr />
      <OrreryParticles shipped={shipped} active={active} pointer={pointer} spin={spin} />
    </Canvas>
  );
}
