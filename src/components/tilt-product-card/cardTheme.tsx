/**
 * The card's own custom properties, light stage by default and flipped under a dark stage. Page primitives are only
 * read with literal fallbacks, so the card keeps its look when lifted out of this gallery (week 1 idiom).
 */
const LIGHT = [
  '[--tc-surface:var(--p-mist-0,255_255_255)] [--tc-line:var(--p-mist-250,217_217_225)]',
  '[--tc-ink:var(--p-ink-990,18_18_22)] [--tc-ink-2:var(--p-ink-600,93_93_107)] [--tc-muted:var(--p-mist-150,236_236_241)]',
  '[--tc-cta:var(--p-amber-700,173_74_5)] [--tc-cta-hover:var(--p-amber-950,122_55_8)] [--tc-cta-ink:var(--p-mist-0,255_255_255)]',
  '[--tc-focus:var(--p-amber-700,173_74_5)]',
  '[--tc-back-1:var(--p-mist-0,255_255_255)] [--tc-back-2:var(--p-mist-150,236_236_241)] [--tc-back-glow:var(--p-amber-500,255_138_42)] [--tc-back-glow-alpha:0.07]',
  '[--tc-inner:var(--p-ink-990,18_18_22)] [--tc-inner-alpha:0.09]',
  '[--tc-plinth-top:var(--p-mist-150,236_236_241)] [--tc-plinth-front:var(--p-mist-250,217_217_225)] [--tc-plinth-lip:var(--p-mist-0,255_255_255)]',
  // Light glare: a white highlight with an amber 700 tint where it falls off.
  '[--tc-glare:var(--p-mist-0,255_255_255)] [--tc-glare-alpha:0.9] [--tc-glare-edge:var(--p-amber-700,173_74_5)] [--tc-glare-edge-alpha:0.1]',
  '[--tc-rim:var(--p-rim-600,74_102_168)]',
  '[--tc-shadow:var(--p-ink-990,18_18_22)] [--tc-shadow-alpha:0.14]',
];

/** Written out in full (not generated) so Tailwind sees every class. */
const DARK = [
  '[[data-stage-theme=dark]_&]:[--tc-surface:var(--p-ink-925,19_19_24)] [[data-stage-theme=dark]_&]:[--tc-line:var(--p-ink-850,38_38_46)]',
  '[[data-stage-theme=dark]_&]:[--tc-ink:var(--p-mist-50,243_243_246)] [[data-stage-theme=dark]_&]:[--tc-ink-2:var(--p-mist-400,156_156_171)] [[data-stage-theme=dark]_&]:[--tc-muted:var(--p-ink-850,38_38_46)]',
  '[[data-stage-theme=dark]_&]:[--tc-cta:var(--p-amber-500,255_138_42)] [[data-stage-theme=dark]_&]:[--tc-cta-hover:var(--p-amber-200,255_195_138)] [[data-stage-theme=dark]_&]:[--tc-cta-ink:var(--p-ink-990,18_18_22)]',
  '[[data-stage-theme=dark]_&]:[--tc-focus:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--tc-back-1:var(--p-ink-900,26_26_33)] [[data-stage-theme=dark]_&]:[--tc-back-2:var(--p-ink-950,11_11_14)] [[data-stage-theme=dark]_&]:[--tc-back-glow-alpha:0.12]',
  '[[data-stage-theme=dark]_&]:[--tc-inner:var(--p-ink-950,11_11_14)] [[data-stage-theme=dark]_&]:[--tc-inner-alpha:0.6]',
  '[[data-stage-theme=dark]_&]:[--tc-plinth-top:var(--p-ink-850,38_38_46)] [[data-stage-theme=dark]_&]:[--tc-plinth-front:var(--p-ink-900,26_26_33)] [[data-stage-theme=dark]_&]:[--tc-plinth-lip:var(--p-ink-600,93_93_107)]',
  // Dark glare: amber at about 0.22 alpha.
  '[[data-stage-theme=dark]_&]:[--tc-glare:var(--p-amber-200,255_195_138)] [[data-stage-theme=dark]_&]:[--tc-glare-alpha:0.22] [[data-stage-theme=dark]_&]:[--tc-glare-edge:var(--p-amber-500,255_138_42)] [[data-stage-theme=dark]_&]:[--tc-glare-edge-alpha:0.08]',
  '[[data-stage-theme=dark]_&]:[--tc-rim:var(--p-rim-300,124_147_201)]',
  '[[data-stage-theme=dark]_&]:[--tc-shadow:var(--p-ink-950,11_11_14)] [[data-stage-theme=dark]_&]:[--tc-shadow-alpha:0.7]',
];

export const CARD_THEME = [...LIGHT, ...DARK].join(' ');

/** The case's drop shadow, tinted to the stage (no pure black). */
export const CARD_SHADOW = '0 30px 60px -30px rgb(var(--tc-shadow) / var(--tc-shadow-alpha)), 0 2px 6px -2px rgb(var(--tc-shadow) / calc(var(--tc-shadow-alpha) * 0.6))';

/** The vitrine's back wall: a lit floor glow under the object over a soft top to bottom ramp, plus an inner shadow. */
export const VITRINE_BACK =
  'radial-gradient(55% 40% at 50% 74%, rgb(var(--tc-back-glow) / var(--tc-back-glow-alpha)), transparent 70%), linear-gradient(rgb(var(--tc-back-1)), rgb(var(--tc-back-2)))';
export const VITRINE_INNER = 'inset 0 1px 12px rgb(var(--tc-inner) / var(--tc-inner-alpha)), inset 0 0 0 1px rgb(var(--tc-line))';
