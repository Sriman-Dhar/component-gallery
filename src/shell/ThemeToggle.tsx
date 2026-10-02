import type { MouseEvent } from 'react';
import { useFrameTheme, type ThemeName } from '../lib/theme';
import { wipeTheme } from '../lib/themeWipe';
import Segmented, { type Segment } from './Segmented';

const ICON = 'h-3.5 w-3.5';
const OPTIONS: Segment<ThemeName>[] = [
  {
    id: 'dark',
    label: 'Dark',
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true" className={ICON} fill="currentColor">
        <path d="M13.5 10.2A5.8 5.8 0 0 1 5.8 2.5a5.8 5.8 0 1 0 7.7 7.7Z" />
      </svg>
    ),
  },
  {
    id: 'light',
    label: 'Light',
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="2.8" />
        <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
      </svg>
    ),
  },
];

/**
 * Frame theme: both choices visible, the current one lit (a switch that names its state reads as a guess).
 * The new theme wipes in as a circle from the pressed button's center.
 */
export default function ThemeToggle() {
  const theme = useFrameTheme();
  const pick = (_: ThemeName, event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    wipeTheme(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };
  return <Segmented label="Frame theme" options={OPTIONS} value={theme} onPick={pick} compact />;
}
