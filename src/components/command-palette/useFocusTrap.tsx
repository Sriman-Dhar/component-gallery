import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'input:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

function focusablesIn(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
}

/**
 * While `active` holds, Tab and Shift+Tab cycle inside `panel` and focus never leaves it: a focus that lands outside
 * (a click on the page beside a scoped palette, a script) is sent back to `fallback`. `active` is a ref read at event
 * time, so a close can release focus inside the same handler.
 */
export function useFocusTrap(panel: RefObject<HTMLElement>, fallback: RefObject<HTMLElement>, active: RefObject<boolean>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const root = panel.current;
      if (event.key !== 'Tab' || !root || !active.current) return;
      const items = focusablesIn(root);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : at < 0 || at === items.length - 1 ? 0 : at + 1;
      event.preventDefault();
      items[next].focus();
    };

    const onFocusIn = (event: FocusEvent) => {
      const root = panel.current;
      if (root && active.current && event.target instanceof Node && !root.contains(event.target)) fallback.current?.focus({ preventScroll: true });
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [panel, fallback, active]);
}
