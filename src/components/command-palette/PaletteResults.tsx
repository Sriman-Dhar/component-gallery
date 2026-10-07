import type { RefObject } from 'react';
import PaletteRow from './PaletteRow';
import type { PaletteGroup, PaletteItem } from './types';

/** What the no-match state offers instead of a dead end. */
const TRY = ['dome', 'log', 'weather'];

interface Props {
  listboxId: string;
  groups: PaletteGroup[];
  shown: number;
  total: number;
  query: string;
  active: number;
  compact: boolean;
  optionId: (index: number) => string;
  onHover: (index: number) => void;
  onRun: (item: PaletteItem) => void;
  onSuggest: (query: string) => void;
  scroller: RefObject<HTMLDivElement>;
  content: RefObject<HTMLDivElement>;
  light: RefObject<HTMLDivElement>;
}

/**
 * The grouped listbox. One light element sits behind the rows and glides to the active one, so moving through results
 * reads as one lens sweeping the list. Group headers are labels of their group (APG grouped listbox).
 */
export default function PaletteResults(props: Props) {
  const { listboxId, groups, shown, total, query, active, compact, optionId, onHover, onRun, onSuggest } = props;
  const empty = groups.length === 0;

  return (
    <div ref={props.scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
      <div ref={props.content} className="relative">
        <div
          ref={props.light}
          aria-hidden="true"
          className={`pointer-events-none invisible absolute inset-x-0 top-0 rounded-[8px] bg-[rgb(var(--pal-light)/var(--pal-light-alpha))] opacity-0 will-change-transform ${
            compact ? 'h-12' : 'h-11'
          }`}
        >
          <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-[rgb(var(--pal-edge))]" />
        </div>
        <div id={listboxId} role="listbox" aria-label="Commands">
          {groups.map((group) => {
            const headerId = `${listboxId}-${group.name.replace(/\W+/g, '-').toLowerCase()}`;
            return (
              <div key={group.name} role="group" aria-labelledby={headerId}>
                <div
                  id={headerId}
                  role="presentation"
                  className="flex h-8 items-end px-3 pb-1.5 font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-[rgb(var(--pal-rim))]"
                >
                  {group.name}
                </div>
                {group.rows.map((row) => (
                  <PaletteRow
                    key={row.item.id}
                    row={row}
                    id={optionId(row.index)}
                    active={row.index === active}
                    compact={compact}
                    onHover={onHover}
                    onRun={onRun}
                  />
                ))}
              </div>
            );
          })}
        </div>
        {empty && query.trim() ? (
          <div className="flex flex-col gap-3 px-3 py-8 text-[14px] leading-5">
            <p className="text-[rgb(var(--pal-ink))]">
              Nothing matches <span className="font-semibold">{query.trim()}</span>.
            </p>
            <p className="flex flex-wrap items-center gap-2 text-[rgb(var(--pal-ink-2))]">
              Try
              {TRY.map((word) => (
                <button
                  key={word}
                  type="button"
                  tabIndex={-1}
                  onClick={() => onSuggest(word)}
                  className="inline-flex min-h-[32px] items-center rounded-full border border-[rgb(var(--pal-line))] px-3 font-mono text-[12px] text-[rgb(var(--pal-ink))] outline-none hover:border-[rgb(var(--pal-rim))] [@media(pointer:coarse)]:min-h-[44px]"
                >
                  {word}
                </button>
              ))}
            </p>
          </div>
        ) : null}
        {total > shown ? (
          <p className="px-3 pb-2 pt-3 font-mono text-[12px] leading-4 text-[rgb(var(--pal-ink-2))]">
            Showing {shown} of {total.toLocaleString('en-US')}. Keep typing to narrow.
          </p>
        ) : null}
      </div>
    </div>
  );
}
