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

/** Stage width presets and the stage theme switch. Text labels, aria-pressed, no icon-only controls. */
export default function StageControls({ width, onWidth, theme, onTheme }: Props) {
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
        aria-pressed={theme === 'dark'}
        onClick={onTheme}
        className={`${BUTTON} border border-line ${theme === 'dark' ? ON : `${OFF} bg-surface`}`}
      >
        Dark stage
      </button>
    </div>
  );
}
