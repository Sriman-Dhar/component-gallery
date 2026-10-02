/** The display face the particle numerals are cast in (Archivo expanded, as the DOM numerals). */
export const GLYPH_FONT = '800 200px Archivo';

const cache = new Map<string, Float32Array | null>();

/**
 * The ink of a label set in the display face, as points: (x, y) pairs in label heights, x measured left of
 * the label's right edge (so 0 or less), y down from the top of the digits (0 to 1). Drawn once on a detached
 * 2D canvas that never enters the page. Null where 2D canvas is unavailable (tests, old browsers).
 */
export function glyphPoints(label: string): Float32Array | null {
  const key = `${label}|${document.fonts?.check?.(GLYPH_FONT) ?? false}`;
  if (cache.has(key)) return cache.get(key) ?? null;
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  let points: Float32Array | null = null;
  if (ctx) {
    ctx.font = GLYPH_FONT;
    ctx.fontStretch = 'expanded';
    const m = ctx.measureText(label);
    const ascent = Math.ceil(m.actualBoundingBoxAscent) || 140;
    const width = Math.ceil(m.actualBoundingBoxRight + m.actualBoundingBoxLeft) || 260;
    ctx.canvas.width = width + 8;
    ctx.canvas.height = ascent + 8;
    ctx.font = GLYPH_FONT;
    ctx.fontStretch = 'expanded';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, 4 + m.actualBoundingBoxLeft, 4 + ascent);
    const { data } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const ink: number[] = [];
    for (let y = 0; y < ctx.canvas.height; y += 2) {
      for (let x = 0; x < ctx.canvas.width; x += 2) {
        if (data[(y * ctx.canvas.width + x) * 4 + 3] > 140) ink.push((x - 4 - width) / ascent, (y - 4) / ascent);
      }
    }
    points = ink.length ? Float32Array.from(ink) : null;
  }
  cache.set(key, points);
  return points;
}
