import type { KeyboardEvent, RefObject } from 'react';
import { ApertureMark } from './PaletteIcon';
import { FOCUS_RING } from './paletteTheme';

interface Props {
  input: RefObject<HTMLInputElement>;
  query: string;
  onQuery: (query: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  listboxId: string;
  activeId?: string;
  readOnly: boolean;
  /** Touch and narrow layouts get a visible Close button: there may be no Escape key. */
  showClose: boolean;
  onClose: () => void;
}

/** The search field (an APG combobox: focus stays here, the active option is named by aria-activedescendant). */
export default function PaletteHeader(props: Props) {
  return (
    <div className="flex min-h-14 shrink-0 items-center gap-3 border-b border-[rgb(var(--pal-line))] pl-4 pr-2">
      <ApertureMark />
      <input
        ref={props.input}
        type="text"
        role="combobox"
        aria-label="Search commands"
        aria-expanded="true"
        aria-controls={props.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={props.activeId}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="go"
        readOnly={props.readOnly}
        value={props.query}
        placeholder={props.placeholder}
        onChange={(event) => props.onQuery(event.target.value)}
        onKeyDown={props.onKeyDown}
        className="h-14 min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[rgb(var(--pal-ink))] outline-none placeholder:text-[rgb(var(--pal-ink-2))]"
      />
      {props.showClose ? (
        <button
          type="button"
          onClick={props.onClose}
          className={`inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-[8px] px-3 text-[14px] font-medium text-[rgb(var(--pal-ink-2))] hover:text-[rgb(var(--pal-ink))] ${FOCUS_RING}`}
        >
          Close
        </button>
      ) : (
        <kbd className="mr-2 hidden shrink-0 rounded-[4px] border border-[rgb(var(--pal-line))] px-1.5 py-0.5 font-mono text-[11px] text-[rgb(var(--pal-ink-2))] sm:inline">
          esc
        </kbd>
      )}
    </div>
  );
}
