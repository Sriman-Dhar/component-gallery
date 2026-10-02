/**
 * The Living Orrery is one particle system that moves between FORMATIONS, and one scene that runs in a MODE.
 *
 * Formations are ordered: the shader blends formation i into i + 1 by a continuous stage value (uStage), so a
 * formation is a GLSL function plus its slot in this list. Part A ships orbit (the 3D orrery) and rail (the
 * 90-day light rail, DOM-anchored). Part B appends, in this order, without touching the existing ones:
 *   halos  per-tile glowing contours behind the shipped tiles (DOM-anchored, like rail)
 *   glyph  the oversized component numbers as particle glyphs (DOM-anchored)
 *   far    the distant calm orrery behind the footer (3D, like orbit, from a far camera)
 * Each needs: its name here, its GLSL in glsl/formations.ts (FORMATION_GLSL), its attributes in worldGeometry.ts,
 * and a stage mapping in stageFor() below.
 *
 * Modes pick the camera, the stage mapping and the sun: Part A ships 'index'. Part B adds 'close' (detail
 * page header, close orbit around one body) and 'dark' (404, all bodies dark, the sun guttering); sceneModeFor()
 * is where a route gets its mode.
 */
export const FORMATIONS = ['orbit', 'rail'] as const;
export type FormationName = (typeof FORMATIONS)[number];

export type WorldMode = 'index';

/** Which mode a route's scene runs in, or null for no scene (Part A: the index only). */
export function sceneModeFor(pathname: string): WorldMode | null {
  return pathname === '/' ? 'index' : null;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** The index choreography, all from one dive value (0 hero .. 1 rail formed). */
export function diveBeats(dive: number) {
  return {
    /** Camera flight through the ring plane. */
    flight: smooth(0, 0.72, dive),
    /** Formation stage: 0 orbit, 1 rail (Part B continues to 2 halos, 3 glyph, 4 far). */
    stage: smooth(0.3, 0.97, dive),
    /** The 3D bodies and the sun step back as the particles leave them. */
    bodies: 1 - smooth(0.22, 0.6, dive),
  };
}
