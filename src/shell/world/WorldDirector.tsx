import { useFrame, useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { weekCenter } from '../../lib/ruler';
import { stepSpin } from '../orrery/orrerySpin';
import { pulseHeat } from '../rail/railLayout';
import { placeCamera } from './cameraRig';
import type { WorldUniforms } from './useWorldUniforms';
import { world } from './worldState';
import { diveBeats } from './worldModes';

/** One pulse run every 4s: 2s along the rail (past its end, so the afterglow clears), then 2s of rest. */
function pulseHead(time: number): number {
  const phase = time % 4;
  if (phase >= 2) return 1.4;
  const t = phase / 2;
  return -0.1 + 1.5 * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
}

let labelsWarm = false;

/** The rail's week labels warm as the particle pulse passes them; style writes only, no React state. */
function warmLabels(head: number, on: boolean) {
  if (!on && !labelsWarm) return;
  for (const el of world.labels) {
    const heat = on ? pulseHeat(head, weekCenter(Number(el.dataset.weekLabel))) : 0;
    el.style.setProperty('--heat', heat.toFixed(3));
  }
  labelsWarm = on;
}

/**
 * The frame: reads the shared world inputs (dive, pointer, click, drag) and writes uniforms and the camera.
 * Every input is damped here, so scroll and pointer never look robotic. `still` freezes time for the
 * reduced-motion frame.
 */
export default function WorldDirector({ uniforms: u, still }: { uniforms: WorldUniforms; still: boolean }) {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const time = still ? 6 : state.clock.elapsedTime;
    world.dive += (world.diveTarget - world.dive) * (still ? 1 : 1 - Math.exp(-dt * 5));
    const beats = diveBeats(world.dive);
    if (!still) stepSpin(world.spin, dt);

    u.uTime.value = time;
    u.uYaw.value = world.spin.yaw;
    u.uStage.value = beats.stage;
    u.uBodies.value = beats.bodies;
    u.uViewport.value.set(size.width, size.height);
    u.uPixel.value = viewport.dpr;

    const ease = 1 - Math.exp(-dt * 6);
    const p = u.uPointer.value;
    p.x += (world.pointer.x - p.x) * ease;
    p.y += (world.pointer.y - p.y) * ease;
    u.uPointerOn.value += (world.pointer.on - u.uPointerOn.value) * (1 - Math.exp(-dt * 4));
    u.uShock.value.set(world.shock.x, world.shock.y, time - world.shock.at);

    const r = world.rail;
    const top = r.ok ? r.top - window.scrollY : -9999;
    u.uRail.value.set(r.left - window.scrollX, top, Math.max(1, r.width), r.base);
    const formed = beats.stage > 0.85 && !still;
    const head = formed ? pulseHead(time) : -1;
    u.uPulse.value = head;
    warmLabels(head, formed);

    const sway = still ? 0 : Math.sin(time * 0.05) * 0.04 + p.x * 0.05 * u.uPointerOn.value;
    const sun = placeCamera(state.camera as PerspectiveCamera, size.width, size.height, beats.flight, sway);
    u.uSun.value.set(sun.x, sun.y);
    u.uFocus.value = sun.focus;
    u.uParallax.value.set(p.x * 0.04 + beats.flight * 0.5, p.y * 0.04 - beats.flight * 0.8);
  });

  return null;
}
