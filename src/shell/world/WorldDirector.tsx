import { useFrame, useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { stepSpin } from '../orrery/orrerySpin';
import { frameClose, frameDark, frameIndex, type Frame } from './directors';
import type { WorldUniforms } from './useWorldUniforms';
import { world } from './worldState';
import type { WorldMode } from './worldModes';

interface Props {
  uniforms: WorldUniforms;
  still: boolean;
  mode: WorldMode;
  /** Close mode: this component's slot (0-based ship order). */
  slot: number;
}

/**
 * The frame: reads the shared world inputs (scroll, pointer, click, drag), damps them so nothing looks
 * robotic, and hands the mode's frame (directors.ts) the uniforms and the camera. `still` freezes time for
 * the reduced-motion frame.
 */
export default function WorldDirector({ uniforms: u, still, mode, slot }: Props) {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const time = still ? 6 : state.clock.elapsedTime;
    if (!still) stepSpin(world.spin, dt);
    u.uTime.value = time;
    u.uYaw.value = world.spin.yaw;
    u.uViewport.value.set(size.width, size.height);
    u.uPixel.value = viewport.dpr;

    const ease = 1 - Math.exp(-dt * 6);
    const p = u.uPointer.value;
    p.x += (world.pointer.x - p.x) * ease;
    p.y += (world.pointer.y - p.y) * ease;
    u.uPointerOn.value += (world.pointer.on - u.uPointerOn.value) * (1 - Math.exp(-dt * 4));
    u.uShock.value.set(world.shock.x, world.shock.y, time - world.shock.at);

    const sway = still ? 0 : Math.sin(time * 0.05) * 0.04 + p.x * 0.05 * u.uPointerOn.value;
    const frame: Frame = { u, camera: state.camera as PerspectiveCamera, width: size.width, height: size.height, time, dt, still, sway };
    if (mode === 'close') frameClose(frame, slot);
    else if (mode === 'dark') frameDark(frame);
    else frameIndex(frame);
  });

  return null;
}
