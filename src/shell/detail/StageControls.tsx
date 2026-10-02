import Segmented, { type Segment } from '../Segmented';

export type WidthPreset = '375' | '768' | 'full';
export type StageTheme = 'light' | 'dark';

export const PRESETS: Segment<WidthPreset>[] = [
  { id: '375', label: '375' },
  { id: '768', label: '768' },
  { id: 'full', label: 'Full' },
];

const THEMES: Segment<StageTheme>[] = [
  { id: 'dark', label: 'Dark stage' },
  { id: 'light', label: 'Light stage' },
];

interface Props {
  width: WidthPreset;
  /** Presets at least as wide as the stage itself: hidden, since they would change nothing. */
  unavailable: WidthPreset[];
  onWidth: (next: WidthPreset) => void;
  theme: StageTheme;
  onTheme: (next: StageTheme) => void;
}

/** Stage width presets (only those narrower than the stage) and the stage theme, both as lit choices. */
export default function StageControls({ width, unavailable, onWidth, theme, onTheme }: Props) {
  const presets = PRESETS.filter((preset) => !unavailable.includes(preset.id));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Full alone would change nothing (a phone): the whole width group steps aside. */}
      {presets.length > 1 ? <Segmented label="Stage width" options={presets} value={width} onPick={onWidth} /> : <span />}
      <Segmented label="Stage theme" options={THEMES} value={theme} onPick={onTheme} />
    </div>
  );
}
