/**
 * The palette's own custom properties, light stage by default and flipped under a dark stage. Page primitives are only
 * read with literal fallbacks, so the palette keeps its look when lifted out of this gallery (week 1 idiom).
 */
const LIGHT = [
  '[--pal-surface:var(--p-mist-0,255_255_255)] [--pal-surface-2:var(--p-mist-100,244_244_247)] [--pal-line:var(--p-mist-250,217_217_225)]',
  '[--pal-ink:var(--p-ink-990,18_18_22)] [--pal-ink-2:var(--p-ink-600,93_93_107)]',
  '[--pal-scrim:var(--p-ink-990,18_18_22)] [--pal-scrim-alpha:0.32]',
  // The key light: amber 50 fill with an amber 700 edge bar on paper.
  '[--pal-light:var(--p-amber-50,255_236_214)] [--pal-light-alpha:1] [--pal-edge:var(--p-amber-700,173_74_5)]',
  '[--pal-heat:var(--p-amber-700,173_74_5)] [--pal-key-top:var(--p-amber-500,255_138_42)] [--pal-key:var(--p-amber-700,173_74_5)]',
  '[--pal-rim:var(--p-rim-600,74_102_168)] [--pal-focus:var(--p-amber-700,173_74_5)]',
  '[--pal-shadow:var(--p-ink-990,18_18_22)] [--pal-shadow-alpha:0.18]',
];

/** Written out in full (not generated) so Tailwind sees every class. */
const DARK = [
  '[[data-stage-theme=dark]_&]:[--pal-surface:var(--p-ink-925,19_19_24)] [[data-stage-theme=dark]_&]:[--pal-surface-2:var(--p-ink-900,26_26_33)] [[data-stage-theme=dark]_&]:[--pal-line:var(--p-ink-850,38_38_46)]',
  '[[data-stage-theme=dark]_&]:[--pal-ink:var(--p-mist-50,243_243_246)] [[data-stage-theme=dark]_&]:[--pal-ink-2:var(--p-mist-400,156_156_171)]',
  '[[data-stage-theme=dark]_&]:[--pal-scrim:var(--p-ink-950,11_11_14)] [[data-stage-theme=dark]_&]:[--pal-scrim-alpha:0.72]',
  // The key light: amber 500 at 0.16 alpha with an amber 500 edge bar on ink.
  '[[data-stage-theme=dark]_&]:[--pal-light:var(--p-amber-500,255_138_42)] [[data-stage-theme=dark]_&]:[--pal-light-alpha:0.16] [[data-stage-theme=dark]_&]:[--pal-edge:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--pal-heat:var(--p-amber-200,255_195_138)] [[data-stage-theme=dark]_&]:[--pal-key-top:var(--p-amber-200,255_195_138)] [[data-stage-theme=dark]_&]:[--pal-key:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--pal-rim:var(--p-rim-300,124_147_201)] [[data-stage-theme=dark]_&]:[--pal-focus:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--pal-shadow:var(--p-ink-950,11_11_14)] [[data-stage-theme=dark]_&]:[--pal-shadow-alpha:0.7]',
];

export const PALETTE_THEME = [...LIGHT, ...DARK].join(' ');

/** Flat scrim colour plus a vignette painted once (never a blur): darker toward the edges, clear under the panel. */
export const SCRIM_FILL =
  'radial-gradient(120% 90% at 50% 0%, transparent 35%, rgb(var(--pal-scrim) / calc(var(--pal-scrim-alpha) * 0.5)) 100%), rgb(var(--pal-scrim) / var(--pal-scrim-alpha))';

/** The panel's lift, tinted to the stage. */
export const PANEL_SHADOW =
  '0 40px 80px -32px rgb(var(--pal-shadow) / var(--pal-shadow-alpha)), 0 2px 8px -2px rgb(var(--pal-shadow) / calc(var(--pal-shadow-alpha) * 0.6))';

/** The key light along the top edge (amber 200 to 500 on ink) and the cool rim along the far edge. */
export const KEY_LINE = 'linear-gradient(90deg, transparent, rgb(var(--pal-key-top)) 22%, rgb(var(--pal-key)) 58%, transparent)';
export const RIM_LINE = 'linear-gradient(90deg, transparent 8%, rgb(var(--pal-rim) / 0.55) 50%, transparent 92%)';

/** One focus ring for every control in the palette: 2px with a 2px offset. */
export const FOCUS_RING =
  'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--pal-focus))]';

/** Keycap: Geist Mono on a hairline cap with a heavier bottom edge. */
export const KEYCAP =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-b-2 border-[rgb(var(--pal-line))] bg-[rgb(var(--pal-surface-2))] px-1 font-mono text-[11px] leading-none text-[rgb(var(--pal-ink-2))]';
