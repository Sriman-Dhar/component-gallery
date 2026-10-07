import { useEffect, useLayoutEffect, useRef } from 'react';
import type { PaletteItem } from './types';

/** The second key of a sequence (G then L) must follow within this long. */
const SEQUENCE_MS = 1200;
/** Keys typed here are text, never shortcuts. */
const TYPING = 'input, textarea, select, [contenteditable="true"], [contenteditable=""]';

function keyOf(event: KeyboardEvent): string | null {
  return event.key.length === 1 ? event.key.toUpperCase() : null;
}

function find(items: PaletteItem[], keys: string[]): PaletteItem | undefined {
  const wanted = keys.join(' ');
  return items.find((item) => item.shortcut && item.shortcut.join(' ').toUpperCase() === wanted);
}

/**
 * The keys on the rows' keycaps, live while the palette is closed (Linear's model: the palette teaches the app's
 * shortcuts; inside it, typing always searches, so "roof" never fires R). Single keys (C) and sequences (G then L);
 * ignored with a modifier held, while typing in a field, or during IME composition.
 */
export function useItemShortcuts(items: PaletteItem[], enabled: boolean, isOpen: boolean, onRun: (item: PaletteItem) => void) {
  const live = useRef({ items, isOpen, onRun });
  useLayoutEffect(() => {
    live.current = { items, isOpen, onRun };
  });

  useEffect(() => {
    if (!enabled) return;
    let pending: { key: string; at: number } | null = null;
    const onKeyDown = (event: KeyboardEvent) => {
      const { items: list, isOpen: open, onRun: run } = live.current;
      if (open || event.defaultPrevented || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof Element && event.target.closest(TYPING)) return;
      const key = keyOf(event);
      if (!key) return;
      const fresh = pending && event.timeStamp - pending.at < SEQUENCE_MS ? pending.key : null;
      pending = null;
      const hit = (fresh ? find(list, [fresh, key]) : undefined) ?? find(list, [key]);
      if (hit) {
        event.preventDefault();
        run(hit);
        return;
      }
      if (list.some((item) => item.shortcut?.length === 2 && item.shortcut[0].toUpperCase() === key)) {
        pending = { key, at: event.timeStamp };
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
