import { Fragment } from 'react';
import PaletteIcon from './PaletteIcon';
import { KEYCAP } from './paletteTheme';
import type { MatchRange, PaletteItem, PaletteRow as Row } from './types';

/** The label with its matched characters lit: a <mark> in the heat colour and a heavier weight, never colour alone. */
export function Highlight({ text, ranges }: { text: string; ranges: MatchRange[] }) {
  if (ranges.length === 0) return <>{text}</>;
  const parts: JSX.Element[] = [];
  let at = 0;
  ranges.forEach(([start, end], i) => {
    if (start > at) parts.push(<Fragment key={`t${i}`}>{text.slice(at, start)}</Fragment>);
    parts.push(
      <mark key={`m${i}`} className="bg-transparent font-semibold text-[rgb(var(--pal-heat))]">
        {text.slice(start, end)}
      </mark>,
    );
    at = end;
  });
  if (at < text.length) parts.push(<Fragment key="tail">{text.slice(at)}</Fragment>);
  return <>{parts}</>;
}

export function Keycaps({ keys }: { keys: string[] }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {keys.map((key, i) => (
        <kbd key={`${key}${i}`} className={KEYCAP}>
          {key}
        </kbd>
      ))}
    </span>
  );
}

interface Props {
  row: Row;
  id: string;
  active: boolean;
  compact: boolean;
  onHover: (index: number) => void;
  onRun: (item: PaletteItem) => void;
}

/**
 * One option. It never takes focus (focus stays in the input); the light behind it marks the active one. A keyword
 * hit names its keyword beside the label; a command that opens a page ends in a chevron. On touch (compact) the
 * hint shows as a second line, since there is no preview pane there.
 */
export default function PaletteRow({ row, id, active, compact, onHover, onRun }: Props) {
  const { item } = row;
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-index={row.index}
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch' && !active) onHover(row.index);
      }}
      onClick={() => onRun(item)}
      className={`relative z-[1] flex cursor-pointer select-none items-center gap-3 rounded-[8px] px-3 text-[14px] leading-5 ${
        compact ? 'h-14' : 'h-11'
      }`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-[6px] transition-colors duration-150 motion-reduce:transition-none ${
          active ? 'text-[rgb(var(--pal-edge))]' : 'text-[rgb(var(--pal-ink-2))]'
        }`}
      >
        <PaletteIcon kind={item.icon} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[rgb(var(--pal-ink))]">
          <Highlight text={item.label} ranges={row.ranges} />
          {row.via ? (
            <span className="ml-2 font-mono text-[12px] text-[rgb(var(--pal-ink-2))]">
              <span className="sr-only">, matches </span>
              <mark className="bg-transparent font-semibold text-[rgb(var(--pal-heat))]">{row.via}</mark>
            </span>
          ) : null}
          {item.hint && !compact ? <span className="sr-only">. {item.hint}</span> : null}
        </span>
        {item.hint && compact ? <span className="truncate text-[12px] leading-4 text-[rgb(var(--pal-ink-2))]">{item.hint}</span> : null}
      </span>
      {item.shortcut && !compact ? <Keycaps keys={item.shortcut} /> : null}
      {item.page ? (
        <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-[rgb(var(--pal-ink-2))]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M4.5 2.5 8 6l-3.5 3.5" />
        </svg>
      ) : null}
    </div>
  );
}
