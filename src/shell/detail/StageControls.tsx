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
  onWidth: (next: WidthPreset) => void;
  theme: StageTheme;
  onTheme: () => void;
}

const BUTTON = `h-8 rounded-control px-3 font-mono text-meta transition-colors duration-fast ${FOCUS_RING}`;
const ON = 'bg-surface-2 text-text shadow-[inset_0_0_0_1px_rgb(var(--color-accent)/0.5)]';
const OFF = 'text-text-2 hover:text-text';

/**
 * Stage width presets and the stage theme button. The theme button names the stage's current theme
 * ("Light stage" / "Dark stage") and flips it on click, the same pattern as the frame button.
 */
export default function StageControls({ width, onWidth, theme, onTheme }: Props) {
  const dark = theme === 'dark';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Stage width" className="flex items-center gap-1 rounded-control border border-line bg-surface p-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={width === preset.id}
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
        className={`${BUTTON} inline-flex items-center gap-2 border border-line bg-surface text-text hover:border-text-2`}
      >
        <span
          aria-hidden="true"
          className={`h-3 w-3 rounded-full border border-text-2/70 ${dark ? 'bg-[rgb(var(--p-stage-dark))]' : 'bg-[rgb(var(--p-stage-light))]'}`}
        />
        {dark ? 'Dark stage' : 'Light stage'}
      </button>
    </div>
  );
}
