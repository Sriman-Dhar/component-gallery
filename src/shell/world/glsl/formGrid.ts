/**
 * The grid's two formations, both DOM-anchored to the tile boxes (uTiles, viewport px). aGrid = (tile index,
 * place 0..1 around the tile, outward offset px, 1 shipped / 0 the next slot); aGlyph = (x left of the
 * numeral's right edge, y down from its top, both in numeral heights; 1 when the particle draws the numeral).
 */

/** A point at fraction u around a rounded tile box (clockwise from its top-left), pushed `off` px outward. */
const haloPoint = /* glsl */ `
vec2 haloPoint(vec4 r, float u, float off) {
  float w = r.z;
  float h = r.w;
  float d = u * 2.0 * (w + h);
  vec2 p = d < w ? vec2(d, 0.0)
    : d < w + h ? vec2(w, d - w)
    : d < 2.0 * w + h ? vec2(2.0 * w + h - d, h)
    : vec2(0.0, 2.0 * (w + h) - d);
  float rad = 18.0;
  vec2 q = clamp(p, vec2(rad), vec2(w, h) - rad);
  vec2 n = p - q;
  return r.xy + q + n / max(length(n), 1e-3) * (rad + off);
}
`;

// Per-tile contours: a loose glowing filament hugging each tile, a comet of light orbiting it, brighter
// while the pointer is over the tile. The next slot's halo is cool, dashed and runs the other way.
export const HALOS_GLSL = /* glsl */ `
${haloPoint}
Form formHalos() {
  Form f;
  vec4 r = uTiles[int(aGrid.x + 0.5)];
  float lit = aGrid.w;
  float u = fract(aGrid.y + uTime * mix(-0.004, 0.006, lit));
  float off = aGrid.z + sin(uTime * 0.8 + aSeed * 30.0) * 1.4;
  vec2 px = haloPoint(r, u, off);
  f.ndc = pxToNdc(px);
  float head = fract(uTime * 0.07 + aGrid.x * 0.37);
  float du = abs(u - head);
  du = min(du, 1.0 - du);
  float comet = exp(-du * du / 0.0012) * lit;
  vec2 pp = ndcToPx(uPointer);
  vec2 inBox = step(r.xy, pp) * step(pp, r.xy + r.zw);
  float hover = inBox.x * inBox.y * uPointerOn;
  float near = 1.0 - smoothstep(1.0, 20.0, abs(aGrid.z));
  float dash = mix(step(0.5, fract(u * 56.0)), 1.0, lit);
  float live = step(aGrid.x + 0.5, uTileCount);
  f.bright = (mix(0.07, 0.62, near) + comet * 1.5 + hover * 0.7 * near) * dash * mix(0.6, 1.0, lit) * live;
  f.warm = lit;
  f.heat = comet + hover * 0.4;
  f.blur = 0.0;
  f.size = (1.1 + aSeed * 1.5 + comet * 2.6 + near * 0.6) * 0.72;
  return f;
}
`;

// The running numbers as particle glyphs, right-aligned on each shipped tile and rising from behind it: the
// lower half is hidden by the tile, the upper half stands in the gutter above. They burn for a beat when they
// form (uGlyphBeat), then rest as a quiet glow. Particles not drawing a numeral stay on the halo, dimmer.
export const GLYPH_GLSL = /* glsl */ `
Form formGlyph() {
  Form halo = formHalos();
  vec4 r = uTiles[int(aGrid.x + 0.5)];
  float h = min(170.0, r.z * 0.42);
  vec2 corner = vec2(r.x + r.z * 0.94, r.y - h * 0.48);
  vec2 shimmer = vec2(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 23.0)) * 0.7;
  vec2 px = corner + aGlyph.xy * h + shimmer;
  float on = aGlyph.z * aGrid.w;
  Form f;
  f.ndc = mix(halo.ndc, pxToNdc(px), on);
  float glow = (0.32 + aSeed * 0.4) * (1.0 + uGlyphBeat * 1.8) * step(aGrid.x + 0.5, uTileCount);
  f.bright = mix(halo.bright * 0.75, glow, on);
  f.warm = mix(halo.warm, 1.0, on);
  f.heat = mix(halo.heat, 0.12 + uGlyphBeat * 0.85, on);
  f.blur = 0.0;
  f.size = mix(halo.size, 1.3 + aSeed * 1.5 + uGlyphBeat * 1.2, on);
  return f;
}
`;
