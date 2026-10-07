import type { PaletteItem } from './types';

type Kind = NonNullable<PaletteItem['icon']>;

/** Four plain geometric marks (reticle, diamond, screen, ring with a dot), drawn on one 16px grid at one stroke. */
const PATHS: Record<Kind, JSX.Element> = {
  target: (
    <>
      <circle cx="8" cy="8" r="4.5" />
      <path d="M8 1.5v2.5M8 12v2.5M1.5 8h2.5M12 8h2.5" />
    </>
  ),
  action: <path d="M8 2.5 13.5 8 8 13.5 2.5 8Z" />,
  screen: (
    <>
      <rect x="2" y="3" width="12" height="8.5" rx="1.5" />
      <path d="M5.5 13.5h5" />
    </>
  ),
  help: (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function PaletteIcon({ kind = 'action' }: { kind?: Kind }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[kind]}
    </svg>
  );
}

/** The aperture mark: an iris ring with its opening, in the key light (trigger and search field). */
export function ApertureMark({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width={size} height={size} className="shrink-0 text-[rgb(var(--pal-key))]">
      <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}
