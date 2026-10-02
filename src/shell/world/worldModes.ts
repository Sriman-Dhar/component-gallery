import { findShipped } from '../../lib/catalogue';

/**
 * The Living Orrery is one particle system that moves between FORMATIONS, and one scene that runs in a MODE.
 *
 * Formations are ordered: the shader blends formation i into i + 1 by a continuous stage value (uStage), so a
 * formation is a GLSL function plus its slot in this list. Each needs: its name here, its GLSL in
 * glsl/formations.ts (FORMATION_GLSL), its attributes in worldGeometry.ts / gridGeometry.ts, and a stage
 * mapping in indexStage() below.
 *   orbit  the 3D orrery (hero)
 *   rail   the 90-day light rail (DOM-anchored)
 *   halos  per-tile glowing contours behind the shipped tiles (DOM-anchored), the next slot a cool dashed one
 *   glyph  the oversized component numbers as particle glyphs rising behind their tiles (DOM-anchored)
 *   far    the distant calm orrery in the coda above the footer (DOM-anchored, its own fixed far view)
 *
 * Modes pick the camera, the stage mapping and the sun: 'index' (the whole scroll story), 'close' (detail page
 * header, close orbit around this component's body) and 'dark' (404, every body dark, the sun guttering).
 */
export const FORMATIONS = ['orbit', 'rail', 'halos', 'glyph', 'far'] as const;
export type FormationName = (typeof FORMATIONS)[number];

export type WorldMode = 'index' | 'close' | 'dark';

const DETAIL = /^\/components\/([^/]+)\/?$/;

/** Which mode a route's scene runs in: the index, a shipped component's page, or anything else (the 404). */
export function sceneModeFor(pathname: string): WorldMode {
  if (pathname === '/') return 'index';
  const slug = DETAIL.exec(pathname)?.[1];
  return slug && findShipped(slug) ? 'close' : 'dark';
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** The index choreography's first act, all from one dive value (0 hero .. 1 rail formed). */
export function diveBeats(dive: number) {
  return {
    /** Camera flight through the ring plane. */
    flight: smooth(0, 0.72, dive),
    /** Formation stage: 0 orbit, 1 rail. */
    stage: smooth(0.3, 0.97, dive),
    /** The 3D bodies step back as the particles leave them. */
    bodies: 1 - smooth(0.22, 0.6, dive),
    /** The sun leaves the ring plane and docks on the rail as today's marker. */
    dock: smooth(0.45, 0.95, dive),
  };
}

/**
 * The whole index stage from three scroll values: the dive (orbit to rail), the grid (rail to halos, then
 * halos to glyphs) and the coda (glyphs to the far orrery). They come one after another down the page, so
 * the sum climbs 0 to 4 without two transitions ever sharing particles.
 */
export function indexStage(dive: number, grid: number, coda: number): number {
  return diveBeats(dive).stage + smooth(0, 0.5, grid) + smooth(0.55, 1, grid) + smooth(0, 1, coda);
}
