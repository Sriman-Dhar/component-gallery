import type { MouseEvent } from 'react';
import { useFrameTheme } from '../lib/theme';
import { wipeTheme } from '../lib/themeWipe';
import { FOCUS_RING } from './focus';

/** Frame theme switch, a pill. The new theme wipes in as a circle from the button's centre. */
export default function ThemeToggle() {
  const theme = useFrameTheme();
  const dark = theme === 'dark';

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    wipeTheme(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={dark}
      className={`group inline-flex h-9 items-center gap-2.5 rounded-full border border-line bg-surface/60 pl-1.5 pr-3.5 font-mono text-meta text-text transition-colors duration-fast hover:border-text-2 ${FOCUS_RING}`}
    >
      <span aria-hidden="true" className="relative inline-block h-6 w-10 rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_rgb(var(--color-line))]">
        <span
          className={`absolute left-0 top-1 h-4 w-4 rounded-full transition-transform duration-base ease-out ${
            dark ? 'translate-x-5 bg-glow shadow-[0_0_10px_rgb(var(--color-accent)/0.7)]' : 'translate-x-1 bg-text-2'
          }`}
        />
      </span>
      Dark frame
    </button>
  );
}
