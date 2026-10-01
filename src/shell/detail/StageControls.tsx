import { FOCUS_RING } from '../focus';

export type WidthPreset = '375' | '768' | 'full';
export type StageTheme = 'light' | 'dark';

export const PRESETS: { id: WidthPreset; label: string }[] = [
  { id: '375', label: '375' },
  { id: '768', label: '768' },
  { id: 'full', label: 'Full' },
];

interface Props {
  width: WidthPreset;
  /** Presets at least as wide as the stage itself: shown disabled, since they would change nothing. */
  unavailable: WidthPreset[];
  onWidth: (next: WidthPreset) => void;
  theme: StageTheme;
  onTheme: () => void;
}

/** 44px tall on touch widths, 32px from sm up. */
const BUTTON = `h-11 sm:h-8 rounded-control px-3 font-mono text-meta transition-colors duration-fast ${FOCUS_RING}`;
const ON = 'bg-surface-2 text-text shadow-[inset_0_0_0_1px_rgb(var(--color-accent)/0.5)]';
const OFF = 'text-text-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-text-2';

/**
 * Stage width presets and the stage theme button. The theme button names the stage's current theme
 * ("Light stage" / "Dark stage") and flips it on click, with the same track and thumb as the frame button.
 */
export default function StageControls({ width, unavailable, onWidth, theme, onTheme }: Props) {
  const dark = theme === 'dark';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Stage width" className="flex items-center gap-1 rounded-control border border-line bg-surface p-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={width === preset.id}
            disabled={unavailable.includes(preset.id)}
            title={unavailable.includes(preset.id) ? `The stage is already narrower than ${preset.label} px` : undefined}
            onClick={() => onWidth(preset.id)}
            className={`${BUTTON} ${width === preset.id ? ON : OFF}`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onTheme}
        title={`Switch to the ${dark ? 'light' : 'dark'} stage`}
        className={`${BUTTON} inline-flex items-center gap-2.5 rounded-full border border-line bg-surface pl-1.5 text-text hover:border-text-2`}
      >
        <span aria-hidden="true" className="relative inline-block h-5 w-9 rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_rgb(var(--color-line))]">
          <span
            className={`absolute left-0 top-[3px] h-3.5 w-3.5 rounded-full transition-transform duration-base ease-out motion-reduce:transition-none ${
              dark ? 'translate-x-[19px] bg-[rgb(var(--p-stage-dark))] shadow-[0_0_0_1px_rgb(var(--color-text-2)/0.7)]' : 'translate-x-[3px] bg-[rgb(var(--p-stage-light))] shadow-[0_0_0_1px_rgb(var(--color-text-2)/0.7)]'
            }`}
          />
        </span>
        {dark ? 'Dark stage' : 'Light stage'}
      </button>
    </div>
  );
}
