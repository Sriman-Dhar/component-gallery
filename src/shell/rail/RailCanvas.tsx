import { Canvas } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import RailParticles, { type RailPointer } from './RailParticles';

interface Props {
  litWeeks: number[];
  active: boolean;
  pointer: MutableRefObject<RailPointer>;
  onReady: () => void;
  onLost: () => void;
  onPulse?: (head: number) => void;
}

/**
 * The WebGL layer of the hero rail. Lazy-loaded (three lives in its own chunk), DPR capped, frames on
 * demand. A lost context unmounts the canvas and leaves the SVG poster.
 */
export default function RailCanvas({ litWeeks, active, pointer, onReady, onLost, onPulse }: Props) {
  return (
    <Canvas
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      frameloop="demand"
      orthographic
      camera={{ zoom: 1, position: [0, 0, 10] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onLost();
        });
        onReady();
      }}
    >
      <RailParticles litWeeks={litWeeks} active={active} pointer={pointer} onPulse={onPulse} />
    </Canvas>
  );
}
