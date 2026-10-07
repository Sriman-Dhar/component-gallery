import type { CSSProperties } from 'react';

/** A finish as the card's props see it. */
export interface Finish {
  id: string;
  label: string;
}

/** Ring highlight, ring body, ring shade and core glow, as `r g b` triples (page primitives with literal fallbacks). */
interface Tone {
  hi: string;
  mid: string;
  lo: string;
  core: string;
}

export interface FinishSpec extends Finish {
  light: Tone;
  dark: Tone;
}

const p = (name: string, rgb: string) => `var(--p-${name}, ${rgb})`;
const AMBER_200 = p('amber-200', '255 195 138');
const AMBER_500 = p('amber-500', '255 138 42');
const AMBER_700 = p('amber-700', '173 74 5');
const AMBER_900 = p('amber-900', '138 62 10');
const AMBER_950 = p('amber-950', '122 55 8');
const RIM_300 = p('rim-300', '124 147 201');
const RIM_600 = p('rim-600', '74 102 168');
const MIST_0 = p('mist-0', '255 255 255');
const MIST_250 = p('mist-250', '217 217 225');
const MIST_400 = p('mist-400', '156 156 171');
const INK_600 = p('ink-600', '93 93 107');
const INK_950 = p('ink-950', '11 11 14');
const INK_990 = p('ink-990', '18 18 22');

/** The three finishes. Brass glows warm on the dark stage; Graphite reads near black on the light one. */
export const FINISH_SPECS: FinishSpec[] = [
  {
    id: 'brass',
    label: 'Brass',
    dark: { hi: AMBER_200, mid: AMBER_500, lo: AMBER_900, core: AMBER_200 },
    light: { hi: AMBER_500, mid: AMBER_700, lo: AMBER_950, core: AMBER_500 },
  },
  {
    id: 'graphite',
    label: 'Graphite',
    // Dark: the rim is lifted a step (mist 400 body over an ink 600 shade), so graphite keeps its shape on the near black case.
    dark: { hi: MIST_250, mid: MIST_400, lo: INK_600, core: AMBER_500 },
    light: { hi: INK_600, mid: INK_990, lo: INK_950, core: AMBER_500 },
  },
  {
    id: 'frost',
    label: 'Frost',
    dark: { hi: MIST_0, mid: MIST_250, lo: RIM_300, core: RIM_300 },
    // Light: frost stays near white (a white face over a cool shade), so the swatch matches its name on both stages.
    light: { hi: MIST_0, mid: MIST_250, lo: RIM_600, core: RIM_600 },
  },
];

export const DEFAULT_FINISHES: Finish[] = FINISH_SPECS.map(({ id, label }) => ({ id, label }));

/** The tones for a finish id; an unknown id (a custom finish) borrows Brass's metal under its own label. */
export function finishSpec(id: string, finishes: Finish[] = DEFAULT_FINISHES): FinishSpec {
  const known = FINISH_SPECS.find((f) => f.id === id);
  if (known) return known;
  const label = finishes.find((f) => f.id === id)?.label ?? id;
  return { ...FINISH_SPECS[0], id, label };
}

/**
 * Both stage themes' tones as custom properties. FINISH_VARS (a class list) picks the light set by default and
 * the dark set under a dark stage, so the finish follows the stage with no JavaScript.
 */
export function finishStyle(spec: FinishSpec): CSSProperties {
  const vars: Record<string, string> = {};
  (['hi', 'mid', 'lo', 'core'] as const).forEach((key) => {
    vars[`--fl-${key}`] = spec.light[key];
    vars[`--fd-${key}`] = spec.dark[key];
  });
  return vars as CSSProperties;
}

export const FINISH_VARS = [
  '[--f-hi:var(--fl-hi)] [--f-mid:var(--fl-mid)] [--f-lo:var(--fl-lo)] [--f-core:var(--fl-core)]',
  '[[data-stage-theme=dark]_&]:[--f-hi:var(--fd-hi)] [[data-stage-theme=dark]_&]:[--f-mid:var(--fd-mid)]',
  '[[data-stage-theme=dark]_&]:[--f-lo:var(--fd-lo)] [[data-stage-theme=dark]_&]:[--f-core:var(--fd-core)]',
].join(' ');

/** The vitrine's spoken description, updated with the finish. */
export function describeFinish(label: string): string {
  return `Desk armillary in ${label.toLowerCase()} finish: three nested rings around a glowing core.`;
}
