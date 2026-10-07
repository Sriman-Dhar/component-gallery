import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PaletteDialog from './PaletteDialog';
import PaletteTrigger from './PaletteTrigger';
import { createRecentStore } from './recent';
import type { PaletteItem } from './types';
import { useCommandPalette } from './useCommandPalette';
import { useItemShortcuts } from './useItemShortcuts';
import { coarsePointer } from './usePaletteLayout';

export interface CommandPaletteProps {
  items: PaletteItem[];
  /** Order of groups in results; unknown groups go last. */
  groupOrder?: string[];
  /** Register Cmd+K / Ctrl+K globally. Default true; the gallery tile passes false. */
  hotkey?: boolean;
  /** Default 'Search or jump to'. */
  placeholder?: string;
  /** Default 'Search'. */
  triggerLabel?: string;
  /** localStorage key for recent commands, default 'command-palette:recent'. */
  recentKey?: string;
  /** Default 5. */
  maxRecent?: number;
  /** Where the overlay mounts. Default document.body; the demo passes its stage frame so the width switcher frames it. A coarse pointer always mounts on document.body, as a full-width sheet. */
  container?: HTMLElement | null;
  /** Viewport px a body mounted overlay starts below (a sticky site header), so the touch sheet sits under it. Default 0. */
  sheetTop?: number;
  /** Run the items' keycap shortcuts while the palette is closed. Default true (needs `hotkey`). */
  shortcuts?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render open, with no listeners and no focus moves (the gallery tile only). */
  staticOpen?: boolean;
  /** The query a static palette shows. */
  initialQuery?: string;
  className?: string;
}

/**
 * Aperture: a keyboard first command palette. Cmd+K / Ctrl+K or the trigger opens it like a telescope iris dilating
 * from where it was summoned; typing filters with a fuzzy match whose characters light up; a single amber light glides
 * row to row as the selection; Enter runs and focus goes back where it was. On narrow or touch layouts it is a
 * full-width top sheet with a visible Close button.
 */
export default function CommandPalette({
  items,
  groupOrder = [],
  hotkey = true,
  placeholder = 'Search or jump to',
  triggerLabel = 'Search',
  recentKey = 'command-palette:recent',
  maxRecent = 5,
  container = null,
  sheetTop = 0,
  shortcuts = true,
  open,
  onOpenChange,
  staticOpen = false,
  initialQuery = '',
  className = '',
}: CommandPaletteProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const store = useMemo(() => createRecentStore(recentKey, maxRecent), [recentKey, maxRecent]);
  // Touch gets the true sheet: full viewport width under the site header, never a card inset in a stage frame.
  const [coarse] = useState(coarsePointer);
  const host = coarse ? null : container;
  const palette = useCommandPalette({ hotkey, staticOpen, open, onOpenChange, container: host, trigger, input, overlay });
  const shown = palette.isOpen || palette.closing;
  useItemShortcuts(items, shortcuts && hotkey && !staticOpen, palette.isOpen, (item) => {
    store.push(item.id);
    item.run();
  });

  const dialog = shown ? (
    <PaletteDialog
      items={items}
      groupOrder={groupOrder}
      placeholder={placeholder}
      store={store}
      initialQuery={initialQuery}
      staticOpen={staticOpen}
      closing={palette.closing}
      source={palette.source.current}
      theme={host || staticOpen ? undefined : (trigger.current?.closest<HTMLElement>('[data-stage-theme]')?.dataset.stageTheme ?? undefined)}
      fixed={!host && !staticOpen}
      top={sheetTop}
      hostWidth={staticOpen ? 0 : (host?.clientWidth ?? window.innerWidth)}
      trigger={trigger}
      input={input}
      overlay={overlay}
      trapping={palette.trapping}
      onClose={palette.close}
      onClosed={palette.finishClose}
    />
  ) : null;

  if (staticOpen) {
    return <div className={`relative h-full w-full ${className}`}>{dialog}</div>;
  }

  return (
    <>
      <PaletteTrigger
        ref={trigger}
        label={triggerLabel}
        expanded={palette.isOpen}
        hotkey={hotkey}
        onOpen={() => palette.openPalette('trigger')}
        className={className}
      />
      {dialog ? createPortal(dialog, host ?? document.body) : null}
    </>
  );
}
