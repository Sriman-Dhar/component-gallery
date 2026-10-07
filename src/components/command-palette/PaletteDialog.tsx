import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import PaletteFooter from './PaletteFooter';
import PaletteHeader from './PaletteHeader';
import PalettePreview from './PalettePreview';
import PaletteResults from './PaletteResults';
import { KEY_LINE, PALETTE_THEME, PANEL_SHADOW, RIM_LINE, SCRIM_FILL } from './paletteTheme';
import type { RecentStore } from './recent';
import { buildSections } from './sections';
import type { PaletteItem } from './types';
import { useApertureMotion, type Point } from './useApertureMotion';
import type { OpenSource } from './useCommandPalette';
import { useFocusTrap } from './useFocusTrap';
import { usePaletteLayout } from './usePaletteLayout';
import { isNavKey, usePaletteNav } from './usePaletteNav';

/** The count is announced once typing settles. */
const ANNOUNCE_MS = 150;

interface Props {
  items: PaletteItem[];
  groupOrder: string[];
  placeholder: string;
  store: RecentStore;
  initialQuery: string;
  staticOpen: boolean;
  closing: boolean;
  source: OpenSource;
  /** Body mounts carry the stage theme over from the trigger; scoped mounts inherit it. */
  theme?: string;
  fixed: boolean;
  /** A fixed overlay's top in viewport px (under a sticky header). */
  top: number;
  /** Width of what the overlay covers, read at open, so the first frame has the right layout. */
  hostWidth: number;
  trigger: RefObject<HTMLElement>;
  input: RefObject<HTMLInputElement>;
  overlay: RefObject<HTMLDivElement>;
  trapping: RefObject<boolean>;
  onClose: (after?: () => void) => void;
  onClosed: () => void;
}

/** Where the iris opens from, in panel coordinates: the trigger's centre when it is on screen, else null (top centre). */
function originFrom(source: OpenSource, trigger: HTMLElement | null, panel: HTMLElement): Point | null {
  if (source !== 'trigger' || !trigger) return null;
  const t = trigger.getBoundingClientRect();
  if (t.bottom <= 0 || t.top >= window.innerHeight) return null;
  const p = panel.getBoundingClientRect();
  return { x: t.left + t.width / 2 - p.left, y: t.top + t.height / 2 - p.top };
}

/** The open palette: scrim, panel (header input, grouped results, preview, footer hints) and the live count. */
export default function PaletteDialog(props: Props) {
  const { items, groupOrder, store, staticOpen, closing, input, overlay, onClose } = props;
  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-opt-${index}`;
  const [query, setQuery] = useState(props.initialQuery);
  const [recent, setRecent] = useState(() => store.read());
  /** The open sub page (a command with `page`), or null at the root. */
  const [page, setPage] = useState<PaletteItem | null>(null);
  const [announce, setAnnounce] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const origin = useRef<Point | null>(null);

  const visible = page?.page ?? items;
  const sections = useMemo(() => buildSections(visible, query, recent, page ? [] : groupOrder), [visible, query, recent, page, groupOrder]);
  // The nav resets on a new query and on a page change alike.
  const { active, setActive, step } = usePaletteNav(sections.rows.length, page ? `${page.id}\u0000${query}` : query);
  const activeItem = sections.rows[active]?.item ?? null;
  const { compact, coarse } = usePaletteLayout(overlay, props.hostWidth);
  const motion = useApertureMotion({ scope: overlay, panel, scrim, light });
  useFocusTrap(panel, input, props.trapping);

  // The iris opens once, on mount; a static palette is simply there.
  useLayoutEffect(() => {
    if (staticOpen || !panel.current) return;
    origin.current = originFrom(props.source, props.trigger.current, panel.current);
    motion.open(origin.current);
    // Mount only: the source and trigger of this opening are fixed for its life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (closing) motion.close(origin.current, props.onClosed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  // The light follows the active row; the list scrolls only as far as needed to keep that row in view.
  useLayoutEffect(() => {
    const row = active >= 0 ? content.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`) : null;
    if (!row || !light.current) {
      motion.moveLight(null);
      return;
    }
    motion.moveLight({
      y: row.offsetTop,
      height: row.offsetHeight,
      base: light.current.offsetHeight || row.offsetHeight,
    });
    const box = scroller.current;
    if (!box) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    // The block: 'nearest' rule done by hand, so the locked page never scrolls with the list.
    if (top < box.scrollTop) box.scrollTop = active === 0 ? 0 : top;
    else {
      // The pinned "Showing 50 of N" cue covers the list's foot, so a row is in view only above it.
      const cue = content.current?.querySelector<HTMLElement>('[data-more]')?.offsetHeight ?? 0;
      if (bottom > box.scrollTop + box.clientHeight - cue) box.scrollTop = bottom - box.clientHeight + cue + 8;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sections, compact]);

  useEffect(() => {
    const q = query.trim();
    const total = sections.total;
    const count = `${total} ${total === 1 ? 'result' : 'results'}`;
    const timer = window.setTimeout(() => {
      // An empty query on a page still says where you are and how much is there.
      setAnnounce(q ? (total === 0 ? `No results for ${q}` : count) : page ? `${page.label}: ${count}` : '');
    }, ANNOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, sections.total, page]);

  const goTo = (next: PaletteItem | null) => {
    setPage(next);
    setQuery('');
    input.current?.focus({ preventScroll: true });
  };

  const run = (item: PaletteItem) => {
    if (closing || staticOpen) return;
    if (item.page) {
      goTo(item);
      return;
    }
    setRecent(store.push(item.id));
    onClose(item.run);
  };

  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isNavKey(event.key)) {
      event.preventDefault();
      step(event.key);
    } else if (event.key === 'Enter' && activeItem) {
      event.preventDefault();
      run(activeItem);
    } else if (event.key === 'Backspace' && page && query === '') {
      // Backspace on an empty query steps back out of a page (Raycast and Linear both do this).
      event.preventDefault();
      goTo(null);
    }
  };

  const onPanelKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  const clearRecent = () => {
    store.clear();
    setRecent([]);
    input.current?.focus({ preventScroll: true });
  };

  const panelLayout = compact
    ? 'inset-x-0 top-0 h-[min(100%,var(--pal-vvh,100%))] rounded-b-[14px] border-x-0 border-t-0'
    : 'left-1/2 top-[clamp(24px,9%,88px)] h-[min(520px,calc(100%-clamp(24px,9%,88px)-24px))] w-[min(680px,calc(100%-48px))] -translate-x-1/2 rounded-[14px]';

  return (
    <div
      ref={overlay}
      data-stage-theme={props.theme}
      style={props.fixed && props.top ? { top: props.top } : undefined}
      className={`${props.fixed ? 'fixed' : 'absolute'} inset-0 z-[40] font-sans ${closing ? 'pointer-events-none' : ''}`}
    >
      {/* The theme lives one level in: its dark set is keyed on a [data-stage-theme] ancestor, which a body mount's overlay is. */}
      <div className={`${PALETTE_THEME} absolute inset-0`}>
        <div ref={scrim} aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM_FILL }} onClick={() => onClose()} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={onPanelKey}
          className={`absolute flex flex-col overflow-hidden border border-[rgb(var(--pal-line))] bg-[rgb(var(--pal-surface))] text-[rgb(var(--pal-ink))] ${panelLayout}`}
          style={{ boxShadow: PANEL_SHADOW }}
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: KEY_LINE }} />
          <PaletteHeader
            input={input}
            query={query}
            onQuery={setQuery}
            onKeyDown={onInputKey}
            placeholder={props.placeholder}
            listboxId={listboxId}
            activeId={active >= 0 ? optionId(active) : undefined}
            readOnly={staticOpen}
            crumb={page?.label}
            onBack={() => goTo(null)}
            showClose={compact || coarse}
            onClose={() => onClose()}
          />
          <div className="flex min-h-0 flex-1">
            <PaletteResults
              listboxId={listboxId}
              groups={sections.groups}
              shown={sections.rows.length}
              total={sections.total}
              query={query}
              active={active}
              compact={compact}
              optionId={optionId}
              onHover={setActive}
              onRun={run}
              onSuggest={(word) => {
                setQuery(word);
                input.current?.focus({ preventScroll: true });
              }}
              scroller={scroller}
              content={content}
              light={light}
            />
            {compact ? null : <PalettePreview item={activeItem} />}
          </div>
          <PaletteFooter compact={compact} hasRecent={recent.length > 0} onClearRecent={clearRecent} />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: RIM_LINE }} />
          <p aria-live="polite" className="sr-only">
            {announce}
          </p>
        </div>
      </div>
    </div>
  );
}
