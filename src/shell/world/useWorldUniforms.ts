import { useEffect, useMemo } from 'react';
import { Color, SRGBColorSpace, Vector2, Vector3, Vector4 } from 'three';
import { useFrameTheme, type ThemeName } from '../../lib/theme';
import { tokenRgb } from '../../lib/tokens';
import { RINGS } from '../orrery/orreryModel';
import { MAX_TILES } from './worldState';

export type WorldUniforms = ReturnType<typeof createUniforms>;

function createUniforms() {
  return {
    uTime: { value: 0 },
    uYaw: { value: 0 },
    uRings: { value: RINGS.map((r) => new Vector4(r.radius, r.inc, r.node, r.speed)) },
    uStage: { value: 0 },
    uIgnite: { value: 0 },
    uDraw: { value: 0 },
    uArrive: { value: 0 },
    uBodies: { value: 1 },
    uPointer: { value: new Vector2() },
    uPointerOn: { value: 0 },
    uShock: { value: new Vector3(0, 0, -1) },
    uViewport: { value: new Vector2(1, 1) },
    uPixel: { value: 1 },
    uRail: { value: new Vector4(0, -9999, 1, 84) },
    uPulse: { value: -1 },
    uDof: { value: 1 },
    uFocus: { value: 2.4 },
    uLight: { value: 0 },
    uCore: { value: new Color() },
    uBody: { value: new Color() },
    uCool: { value: new Color() },
    uDeep: { value: new Color() },
    uBg: { value: new Color() },
    uNebula: { value: 1 },
    /** Sun position in NDC and the nebula's parallax offset, written by the camera rig. */
    uSun: { value: new Vector2() },
    uParallax: { value: new Vector2() },
    /** Tile boxes in viewport px (left, top, width, height), how many are live, and when the glyphs formed. */
    uTiles: { value: Array.from({ length: MAX_TILES }, () => new Vector4(0, -9999, 1, 1)) },
    uTileCount: { value: 0 },
    uGlyphBeat: { value: 0 },
    /** The coda's far orrery: center in viewport px and px per orrery unit. */
    uFar: { value: new Vector3(0, -9999, 1) },
    /** A viewport px box the particles flow around (left, top, width, height); width 0 = none. */
    uKeep: { value: new Vector4(0, 0, 0, 0) },
    /** The sun docked on the rail as today's marker: NDC position and how docked (0..1). */
    uSunDock: { value: new Vector3(0, 0, 0) },
    /** 404: the sun gutters and the whole system runs dim (0 normal .. 1 dark). */
    uGutter: { value: 0 },
    /** Close orbit: this component's slot (the only body drawn, points kept fine), or -1 in other modes. */
    uSolo: { value: -1 },
  };
}

/** Token colors in linear space (the composer encodes to sRGB once, at the end). */
function paint(u: WorldUniforms, theme: ThemeName) {
  const set = (c: Color, token: string) => c.setRGB(...tokenRgb(token), SRGBColorSpace);
  set(u.uCore.value, '--color-glow');
  set(u.uBody.value, '--color-accent');
  set(u.uCool.value, '--color-rim');
  set(u.uDeep.value, '--color-accent-deep');
  set(u.uBg.value, '--color-bg');
  u.uLight.value = theme === 'light' ? 1 : 0;
}

/**
 * The one uniform object every world program shares. Colors follow the frame theme; `onTheme` lets the
 * caller switch blending and redraw a still frame.
 */
export function useWorldUniforms(onTheme: (theme: ThemeName) => void): WorldUniforms {
  const uniforms = useMemo(createUniforms, []);
  const theme = useFrameTheme();
  useEffect(() => {
    paint(uniforms, theme);
    onTheme(theme);
  }, [uniforms, theme, onTheme]);
  return uniforms;
}
