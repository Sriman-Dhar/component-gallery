import { forwardRef } from 'react';
import { ApertureMark } from './PaletteIcon';
import { FOCUS_RING, KEYCAP, PALETTE_THEME } from './paletteTheme';

interface Props {
  label: string;
  expanded: boolean;
  /** When the hotkey is registered the trigger names it, visibly and in aria-keyshortcuts. */
  hotkey: boolean;
  onOpen: () => void;
  className?: string;
}

function isApple(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

/** The visible way in, for pointer and touch: a search-field shaped button with the shortcut written beside it. */
const PaletteTrigger = forwardRef<HTMLButtonElement, Props>(function PaletteTrigger(
  { label, expanded, hotkey, onOpen, className = '' },
  ref,
) {
  const apple = isApple();
  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-keyshortcuts={hotkey ? 'Meta+K Control+K' : undefined}
      onClick={onOpen}
      className={`${PALETTE_THEME} group inline-flex min-h-12 w-full max-w-[360px] items-center gap-3 rounded-[12px] border border-[rgb(var(--pal-line))] bg-[rgb(var(--pal-surface))] pl-4 pr-3 text-left text-[15px] text-[rgb(var(--pal-ink-2))] transition-colors duration-150 hover:border-[rgb(var(--pal-rim)/0.6)] hover:text-[rgb(var(--pal-ink))] active:scale-[0.99] motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      <ApertureMark size={18} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hotkey ? (
        <span aria-hidden="true" className="flex shrink-0 items-center gap-1 [@media(pointer:coarse)]:hidden">
          <kbd className={KEYCAP}>{apple ? '⌘' : 'Ctrl'}</kbd>
          <kbd className={KEYCAP}>K</kbd>
        </span>
      ) : null}
    </button>
  );
});

export default PaletteTrigger;
