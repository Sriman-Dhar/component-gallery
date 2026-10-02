import type { PerspectiveCamera } from 'three';
import { positionOf, weekCenter } from '../../lib/ruler';
import { slotOf } from '../orrery/orreryModel';
import { bankOf, hurryPastSun } from '../orrery/orrerySpin';
import { pulseHeat } from '../rail/railLayout';
import { projectBodies } from './bodyScreen';
import { placeCamera, placeClose } from './cameraRig';
import type { WorldUniforms } from './useWorldUniforms';
import { type Box, world } from './worldState';
import { diveBeats, indexStage } from './worldModes';

/** What every mode's frame gets from the director. */
export interface Frame {
  u: WorldUniforms;
  camera: PerspectiveCamera;
  width: number;
  height: number;
  time: number;
  dt: number;
  still: boolean;
  /** Pointer sway for the camera (radians of azimuth). */
  sway: number;
}

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

const today = positionOf(new Date());
let glyphFormedAt = -1;

function toViewport(box: Box): [number, number] {
  return [box.left - window.scrollX, box.top - window.scrollY];
}

/** The veil boxes (data-world-veil) into the canvas's px: the fixed index canvas is the viewport, the detail
 * and 404 canvases sit at the top of the document, so document px are canvas px there. */
function setVeils(u: WorldUniforms, fixed: boolean) {
  world.veil.forEach((box, i) => {
    const [x, y] = fixed ? toViewport(box) : [box.left, box.top];
    u.uVeil.value[i].set(x, y, box.width, box.height);
  });
}

/** No DOM-anchored formation and no keep-out (detail and 404). */
function clearAnchors(u: WorldUniforms) {
  u.uSolo.value = -1;
  u.uTileCount.value = 0;
  u.uKeep.value.set(0, 0, 0, 0);
  u.uFar.value.set(0, -9999, 1);
  u.uSunDock.value.set(0, 0, 0);
  u.uRail.value.set(0, -9999, 1, 84);
  u.uPulse.value = -1;
}

/** The index: the dive, the rail, the grid's halos and numerals, the coda's far orrery, the sun on the rail. */
export function frameIndex({ u, camera, width, height, time, dt, still, sway }: Frame) {
  const damp = still ? 1 : 1 - Math.exp(-dt * 5);
  world.dive += (world.diveTarget - world.dive) * damp;
  world.grid += (world.gridTarget - world.grid) * damp;
  world.coda += (world.codaTarget - world.coda) * damp;
  const beats = diveBeats(world.dive);
  const stage = indexStage(world.dive, world.grid, world.coda);
  u.uStage.value = stage;
  u.uBodies.value = beats.bodies;
  u.uGutter.value = 0;

  const r = world.rail;
  const top = r.ok ? r.top - window.scrollY : -9999;
  u.uRail.value.set(r.left - window.scrollX, top, Math.max(1, r.width), r.base);
  const formed = stage > 0.85 && stage < 1.6 && !still;
  const head = formed ? pulseHead(time) : -1;
  u.uPulse.value = head;
  warmLabels(head, formed);
  const dockX = r.left - window.scrollX + today * r.width;
  u.uSunDock.value.set((dockX / width) * 2 - 1, 1 - ((top + r.base) / height) * 2, r.ok ? beats.dock : 0);

  const { rects, count } = world.tiles;
  for (let i = 0; i < count; i++) {
    u.uTiles.value[i].set(rects[i * 4] - window.scrollX, rects[i * 4 + 1] - window.scrollY, rects[i * 4 + 2], rects[i * 4 + 3]);
  }
  u.uTileCount.value = count;
  if (stage > 2.92 && glyphFormedAt < 0) glyphFormedAt = time;
  if (stage < 2.5) glyphFormedAt = -1;
  u.uGlyphBeat.value = glyphFormedAt < 0 ? 0 : Math.exp(-(time - glyphFormedAt) * 0.6);

  const k = world.keep;
  const [kx, ky] = toViewport(k);
  u.uKeep.value.set(kx, ky, k.width, k.height);
  const f = world.far;
  const [fx, fy] = toViewport(f);
  u.uFar.value.set(fx + f.width / 2, f.width ? fy + f.height / 2 : -9999, Math.min(f.width * 0.9, f.height * 1.5, 900));

  const sun = placeCamera(camera, width, height, beats.flight, sway, world.spin.tilt, bankOf(world.spin));
  // The nebula's ember follows the sun down onto the rail, so today's marker carries the warm light.
  const dock = u.uSunDock.value;
  u.uSun.value.set(sun.x + (dock.x - sun.x) * dock.z, sun.y + (dock.y - sun.y) * dock.z);
  u.uFocus.value = sun.focus;
  setVeils(u, true);
  if (projectBodies(camera, width, height, time, beats.bodies > 0.6 && !still)) hurryPastSun(world.spin, dt);
  u.uParallax.value.set(u.uPointer.value.x * 0.04 + beats.flight * 0.5, u.uPointer.value.y * 0.04 - beats.flight * 0.8);
}

/** Detail header: close orbit around this component's body, the body in the header's socket beside the title. */
export function frameClose({ u, camera, width, height, time }: Frame, slot: number) {
  clearAnchors(u);
  u.uStage.value = 0;
  u.uBodies.value = 1;
  u.uGutter.value = 0;
  u.uSolo.value = slot;
  // At this range the lit body would blow out the bloom: the close orbit runs a lower exposure.
  u.uIgnite.value = 0.6;
  // The body sits in its socket, a box the header keeps empty beside the title (data-world-anchor="close"), so
  // it never lands on the numeral or the summary; its ring runs off behind.
  const c = world.close;
  const anchor = c.width
    ? { x: ((c.left + c.width / 2) / width) * 2 - 1, y: 1 - ((c.top + c.height / 2) / height) * 2 }
    : { x: 0.6, y: 0.5 };
  const { ring, u: at } = slotOf(slot);
  u.uFocus.value = placeClose(camera, width, height, ring, at, time, world.spin.yaw, anchor, c.width ? Math.min(c.width, c.height) * 0.4 : 60);
  u.uSun.value.set(anchor.x - 1.2, anchor.y + 0.6);
  setVeils(u, false);
  u.uParallax.value.set(u.uPointer.value.x * 0.03, u.uPointer.value.y * 0.03);
}

/** 404: the hero framing with every body dark and the sun guttering. */
export function frameDark({ u, camera, width, height, sway }: Frame) {
  clearAnchors(u);
  u.uStage.value = 0;
  u.uBodies.value = 1;
  u.uGutter.value = 1;
  const sun = placeCamera(camera, width, height, 0, sway);
  u.uSun.value.set(sun.x, sun.y);
  u.uFocus.value = sun.focus;
  setVeils(u, false);
  u.uParallax.value.set(u.uPointer.value.x * 0.04, u.uPointer.value.y * 0.04);
}
