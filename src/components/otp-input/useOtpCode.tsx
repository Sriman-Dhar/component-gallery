import { useCallback, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';

const DIGIT = /^\d$/;
const onlyDigits = (text: string) => text.replace(/\D/g, '');
const NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'] as const;
type NavKey = (typeof NAV_KEYS)[number];
const isNav = (key: string): key is NavKey => (NAV_KEYS as readonly string[]).includes(key);

/** First empty cell after `from`, then any empty cell before it, else stay put: the code is full. */
function nextEmpty(cells: string[], from: number): number {
  for (let i = from + 1; i < cells.length; i += 1) if (!cells[i]) return i;
  const earlier = cells.findIndex((cell) => !cell);
  return earlier === -1 ? from : earlier;
}

function initialCells(length: number, value: string): string[] {
  const digits = onlyDigits(value).slice(0, length);
  return Array.from({ length }, (_, i) => digits[i] ?? '');
}

interface OtpCodeOptions {
  length: number;
  /** Digits to start with, e.g. for a preview. */
  initial?: string;
  /** While true (verifying), every edit path is ignored; focus and arrow keys still work. */
  locked?: boolean;
  onComplete?: (code: string) => void;
  /** Called on any edit, so a visible error message can step aside. */
  onEdit?: () => void;
  /** Called when more than one digit lands at once (paste, autofill), with the run it filled. */
  onFill?: (start: number, count: number) => void;
}

/**
 * The code's state and every input path: typed digits, mobile input events, iOS one-time-code
 * autofill, paste from any cell, backspace walk, arrow keys. Non digits are dropped silently.
 * Once the code is complete with focus parked on the last cell, further typing is ignored until the
 * user deliberately picks a cell (pointer or arrow keys): typing past the end never overwrites.
 */
export function useOtpCode({ length, initial = '', locked = false, onComplete, onEdit, onFill }: OtpCodeOptions) {
  const [cells, setCells] = useState<string[]>(() => initialCells(length, initial));
  const [endLocked, setEndLocked] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focusCell = useCallback(
    (index: number) => {
      const input = inputs.current[Math.max(0, Math.min(length - 1, index))];
      input?.focus();
      input?.select();
    },
    [length],
  );

  const commit = (next: string[], focusIndex: number) => {
    const wasComplete = cells.every(Boolean);
    const code = next.join('');
    const complete = code.length === length;
    setCells(next);
    setEndLocked(complete && focusIndex === length - 1);
    onEdit?.();
    focusCell(focusIndex);
    if (complete && (!wasComplete || code !== cells.join(''))) onComplete?.(code);
  };

  const setAt = (index: number, digit: string) => {
    const next = [...cells];
    next[index] = digit;
    commit(next, digit ? nextEmpty(next, index) : index);
  };

  /** A whole code lands from the first cell; a partial one fills forward from where it was pasted. */
  const fillFrom = (index: number, digits: string) => {
    const start = digits.length >= length ? 0 : index;
    const next = [...cells];
    const chunk = digits.slice(0, length - start);
    [...chunk].forEach((digit, offset) => (next[start + offset] = digit));
    commit(next, Math.min(length - 1, start + chunk.length));
    if (chunk.length > 1) onFill?.(start, chunk.length);
  };

  /** Typing on the parked last cell of a complete code is past the end: ignore it. */
  const pastEnd = (index: number) => endLocked && index === length - 1;

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const { key } = event;
    if (isNav(key)) {
      event.preventDefault();
      setEndLocked(false);
      focusCell({ ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: length - 1 }[key]);
      return;
    }
    if (key.length !== 1 && key !== 'Backspace' && key !== 'Delete') return; // Tab and friends pass through
    event.preventDefault();
    if (locked) return;
    if (DIGIT.test(key)) {
      if (!pastEnd(index)) setAt(index, key);
    } else if (key === 'Backspace') {
      if (cells[index]) setAt(index, '');
      else if (index > 0) {
        const next = [...cells];
        next[index - 1] = '';
        commit(next, index - 1);
      }
    } else if (key === 'Delete') {
      setAt(index, '');
    }
    // Anything else (letters, spaces, symbols) is ignored, never shown as an error mid-type.
  };

  /** Mobile keyboards and autofill skip keydown, so the change event is the fallback path. */
  const onChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (locked) return;
    const digits = onlyDigits(event.target.value);
    if (!digits) {
      if (!event.target.value) setAt(index, '');
      return;
    }
    if (digits.length >= length) return fillFrom(0, digits);
    if (pastEnd(index)) return;
    if (digits.length === 1) return setAt(index, digits);
    const old = cells[index];
    if (digits.length === 2 && old) return setAt(index, digits[0] === old ? digits[1] : digits[0]);
    fillFrom(index, digits);
  };

  /** Bound on the row, so a paste into any cell is caught, not only the first. */
  const onPaste = (event: ClipboardEvent<HTMLElement>) => {
    const digits = onlyDigits(event.clipboardData.getData('text'));
    event.preventDefault();
    if (!digits || locked) return;
    const index = Number((event.target as HTMLElement).dataset.index ?? 0);
    fillFrom(index, digits);
  };

  /** A pointer press on a cell is a deliberate pick: it may overwrite, even the last cell. */
  const onPick = () => setEndLocked(false);

  const clear = () => {
    setCells(Array(length).fill(''));
    setEndLocked(false);
  };

  return { cells, inputs, endLocked, focusCell, onKeyDown, onChange, onPaste, onPick, clear };
}
