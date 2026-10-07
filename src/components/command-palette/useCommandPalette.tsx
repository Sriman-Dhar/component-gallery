import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export type OpenSource = 'trigger' | 'hotkey';

interface Options {
  hotkey: boolean;
  staticOpen: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where the overlay mounts; null means document.body, where the rest of the page is made inert while open. */
  container: HTMLElement | null;
  trigger: RefObject<HTMLElement>;
  input: RefObject<HTMLInputElement>;
  overlay: RefObject<HTMLElement>;
}

/** Top of the stage frame lands this far below the viewport top when a hotkey open brings it into view (clears a fixed site header). */
const BRING_INTO_VIEW_TOP = 96;
/** A scoped palette needs this much of its container on screen (the panel's full height), or the open scrolls it into view. */
const MIN_VISIBLE = 560;

function isHotkey(event: KeyboardEvent): boolean {
  return (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && (event.key === 'k' || event.key === 'K' || event.code === 'KeyK');
}

/**
 * Open and close state for the palette. Registers Cmd+K / Ctrl+K when `hotkey` is on, remembers the element focused
 * before opening and restores it on close, locks page scroll (restoring the exact position), and makes the page inert
 * when the overlay sits on document.body. Closing releases all of that inside the same handler, so a command run
 * after close already finds focus back where it started.
 */
export function useCommandPalette({ hotkey, staticOpen, open, onOpenChange, container, trigger, input, overlay }: Options) {
  const [ownOpen, setOwnOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const isOpen = staticOpen || (open ?? ownOpen);
  const trapping = useRef(false);
  const returnTo = useRef<HTMLElement | null>(null);
  const source = useRef<OpenSource>('hotkey');
  const release = useRef<() => void>(() => undefined);

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setOwnOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const openPalette = useCallback(
    (from: OpenSource) => {
      if (isOpen) return;
      const focused = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
      // Safari does not focus a clicked button: a trigger open always returns to the trigger.
      returnTo.current = focused ?? (from === 'trigger' ? trigger.current : null);
      source.current = from;
      setClosing(false);
      setOpen(true);
    },
    [isOpen, setOpen, trigger],
  );

  /** Close, hand focus back, then call `after` (a command's run), in that order. */
  const close = useCallback(
    (after?: () => void) => {
      if (!isOpen || staticOpen) return;
      release.current();
      setOpen(false);
      setClosing(true);
      after?.();
    },
    [isOpen, staticOpen, setOpen],
  );

  const finishClose = useCallback(() => setClosing(false), []);

  // Engage on open: bring a scoped stage into view, lock scroll, make the page inert, trap focus, focus the input.
  useEffect(() => {
    if (!isOpen || staticOpen) return;
    if (!returnTo.current && document.activeElement instanceof HTMLElement) returnTo.current = document.activeElement;
    const html = document.documentElement;
    const saved = { x: window.scrollX, y: window.scrollY, overflow: html.style.overflow, pad: html.style.paddingRight };
    if (container) {
      // A hotkey can fire with the stage scrolled away; bring its top into view (close scrolls back exactly).
      const top = container.getBoundingClientRect().top;
      const need = Math.min(container.clientHeight, MIN_VISIBLE);
      if (top < 0 || top + need > window.innerHeight) window.scrollBy({ top: top - BRING_INTO_VIEW_TOP, behavior: 'instant' });
    }
    const gutter = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (gutter > 0) html.style.paddingRight = `${gutter}px`;
    const inerted = container
      ? []
      : [...document.body.children].filter((el) => el !== overlay.current && !el.hasAttribute('inert'));
    inerted.forEach((el) => el.setAttribute('inert', ''));
    trapping.current = true;
    input.current?.focus({ preventScroll: true });

    let done = false;
    release.current = () => {
      if (done) return;
      done = true;
      trapping.current = false;
      inerted.forEach((el) => el.removeAttribute('inert'));
      html.style.overflow = saved.overflow;
      html.style.paddingRight = saved.pad;
      window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      const back = returnTo.current?.isConnected ? returnTo.current : trigger.current;
      returnTo.current = null;
      back?.focus({ preventScroll: true });
    };
    // A close from outside (the controlled prop, unmount) releases here; an own close already did.
    return () => release.current();
  }, [isOpen, staticOpen, container, input, overlay, trigger]);

  // The latest state for the long-lived listeners below.
  const live = useRef({ isOpen, openPalette, close });
  useLayoutEffect(() => {
    live.current = { isOpen, openPalette, close };
  });

  // Cmd+K / Ctrl+K toggles. Never registered for a static palette (the index tile) or with hotkey off.
  useEffect(() => {
    if (!hotkey || staticOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || !isHotkey(event)) return;
      event.preventDefault();
      if (live.current.isOpen) live.current.close();
      else live.current.openPalette('hotkey');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkey, staticOpen]);

  // A press outside the overlay (the page beside a scoped palette) closes it.
  useEffect(() => {
    if (!isOpen || staticOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (overlay.current?.contains(target) || trigger.current?.contains(target)) return;
      // After the press has moved focus where it lands, so the restore is the last word.
      window.setTimeout(() => live.current.close(), 0);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [isOpen, staticOpen, overlay, trigger]);

  return { isOpen, closing, source, trapping, openPalette, close, finishClose };
}
