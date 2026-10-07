import { FOCUS_RING, KEYCAP } from './paletteTheme';

interface Props {
  compact: boolean;
  hasRecent: boolean;
  onClearRecent: () => void;
}

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd key={key} className={KEYCAP}>
          {key}
        </kbd>
      ))}
      {label}
    </span>
  );
}

/** Key hints for the keyboard, and Clear recent when there is something to clear. Touch layouts keep only the latter. */
export default function PaletteFooter({ compact, hasRecent, onClearRecent }: Props) {
  if (compact && !hasRecent) return null;
  return (
    <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-t border-[rgb(var(--pal-line))] px-4 text-[12px] text-[rgb(var(--pal-ink-2))]">
      {compact ? (
        <span />
      ) : (
        <span className="flex items-center gap-4">
          <Hint keys={['↑', '↓']} label="move" />
          <Hint keys={['↵']} label="run" />
          <Hint keys={['esc']} label="close" />
        </span>
      )}
      {hasRecent ? (
        <button
          type="button"
          onClick={onClearRecent}
          className={`-mr-2 inline-flex min-h-11 items-center rounded-[8px] px-2 text-[12px] font-medium text-[rgb(var(--pal-ink-2))] underline decoration-[rgb(var(--pal-line))] underline-offset-4 hover:text-[rgb(var(--pal-ink))] ${FOCUS_RING}`}
        >
          Clear recent
        </button>
      ) : null}
    </div>
  );
}
