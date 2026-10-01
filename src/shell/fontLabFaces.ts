/**
 * Font lab (temporary, dev only): the display candidates and the tuning each one needs to look its best.
 * Strip the lab by deleting this file, FontLab.tsx and its one mount line in Layout.tsx.
 *
 * Every display surface carries Tailwind's font-medium or font-semibold, so the lab retunes by that role:
 * - strong: font-semibold surfaces (hero name, lit fraction, №, detail title, brand, 404).
 * - quiet: font-medium surfaces (ghost /30, section headings, tile names).
 * Clash is the committed default: its entry has no tuning, so the page renders exactly as shipped.
 */
export interface LabRole {
  weight: number;
  tracking: string;
}

export interface LabFace {
  id: string;
  name: string;
  /** The full --font-display stack. */
  stack: string;
  strong?: LabRole;
  quiet?: LabRole;
  /** font-stretch for families loaded with a width axis (Archivo expanded). */
  stretch?: string;
  /** Brand in the header: optional uppercase and its own tracking. */
  brand?: { uppercase: boolean; tracking: string };
}

const TAIL = 'ui-sans-serif, system-ui, sans-serif';

export const DEFAULT_FACE = 'clash';

export const LAB_FACES: LabFace[] = [
  { id: 'clash', name: 'Clash Display', stack: `'Clash Display', 'Clash Fallback', ${TAIL}` },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    stack: `'Space Grotesk', ${TAIL}`,
    strong: { weight: 700, tracking: '-0.04em' },
    quiet: { weight: 500, tracking: '-0.015em' },
    brand: { uppercase: false, tracking: '-0.02em' },
  },
  {
    id: 'unbounded',
    name: 'Unbounded',
    stack: `'Unbounded', ${TAIL}`,
    strong: { weight: 600, tracking: '-0.045em' },
    quiet: { weight: 500, tracking: '-0.025em' },
    brand: { uppercase: false, tracking: '-0.02em' },
  },
  {
    id: 'archivo',
    name: 'Archivo Expanded',
    stack: `'Archivo', ${TAIL}`,
    stretch: 'expanded',
    strong: { weight: 700, tracking: '-0.03em' },
    quiet: { weight: 600, tracking: '-0.01em' },
    brand: { uppercase: true, tracking: '0.02em' },
  },
  {
    id: 'outfit',
    name: 'Outfit',
    stack: `'Outfit', ${TAIL}`,
    strong: { weight: 600, tracking: '-0.035em' },
    quiet: { weight: 500, tracking: '-0.01em' },
    brand: { uppercase: false, tracking: '-0.01em' },
  },
  {
    id: 'sora',
    name: 'Sora',
    stack: `'Sora', ${TAIL}`,
    strong: { weight: 600, tracking: '-0.04em' },
    quiet: { weight: 500, tracking: '-0.02em' },
    brand: { uppercase: false, tracking: '-0.02em' },
  },
];

/** One Google Fonts request for the five candidates (Clash already loads from Fontshare in index.html). */
export const LAB_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,500..700&family=Outfit:wght@500..700' +
  '&family=Sora:wght@500..700&family=Space+Grotesk:wght@500..700&family=Unbounded:wght@500..700&display=swap';

/** The override sheet for one face; empty for the committed default. */
export function labCss(face: LabFace): string {
  if (face.id === DEFAULT_FACE) return '';
  const root = 'html[data-font-lab]';
  const rules = [`${root} .font-display { ${face.stretch ? `font-stretch: ${face.stretch};` : ''} }`];
  if (face.strong) {
    rules.push(`${root} .font-display.font-semibold { font-weight: ${face.strong.weight}; letter-spacing: ${face.strong.tracking}; }`);
  }
  if (face.quiet) {
    rules.push(`${root} .font-display.font-medium { font-weight: ${face.quiet.weight}; letter-spacing: ${face.quiet.tracking}; }`);
  }
  if (face.brand) {
    const upper = face.brand.uppercase ? 'text-transform: uppercase;' : '';
    rules.push(`${root} header a.font-display.font-semibold { letter-spacing: ${face.brand.tracking}; ${upper} }`);
  }
  return rules.join('\n');
}
