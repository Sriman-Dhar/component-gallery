import { useCallback, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';

const DIGIT = /^\d$/;
const onlyDigits = (text: string) => text.replace(/\D/g, '');

/** First empty cell after `from`, then any empty cell before it, else stay put: the code is full. */
function nextEmpty(cells: string[], from: number): number {
  for (let i = from + 1; i < cells.length; i += 1) if (!cells[i]) return i;
  const earlier = cells.findIndex((cell) => !cell);
  return earlier === -1 ? from : earlier;
}

interface OtpCodeOptions {
  length: number;
  onComplete?: (code: string) => void;
  /** Called on any edit, so a visible error message can step aside. */
  onEdit?: () => void;
}

/**
 * The code's state and every input path: typed digits, mobile input events, iOS one-time-code
 * autofill, paste from any cell, backspace walk, arrow keys. Non digits are dropped silently.
 */
export function useOtpCode({ length, onComplete, onEdit }: OtpCodeOptions) {
  const [cells, setCells] = useState<string[]>(() => Array(length).fill(''));
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
    setCells(next);
    onEdit?.();
    focusCell(focusIndex);
    const code = next.join('');
    if (code.length === length && (!wasComplete || code !== cells.join(''))) onComplete?.(code);
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
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const { key } = event;
    if (DIGIT.test(key)) {
      event.preventDefault();
      setAt(index, key);
    } else if (key === 'Backspace') {
      event.preventDefault();
      if (cells[index]) setAt(index, '');
      else if (index > 0) {
        const next = [...cells];
        next[index - 1] = '';
        commit(next, index - 1);
      }
    } else if (key === 'Delete') {
      event.preventDefault();
      setAt(index, '');
    } else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
      event.preventDefault();
      const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: length - 1 }[key];
      focusCell(target);
    } else if (key.length === 1) {
      event.preventDefault(); // letters, spaces, symbols: ignored, never shown as an error mid-type
    }
  };

  /** Mobile keyboards and autofill skip keydown, so the change event is the fallback path. */
  const onChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(event.target.value);
    if (!digits) {
      if (!event.target.value) setAt(index, '');
      return;
    }
    if (digits.length >= length) return fillFrom(0, digits);
    if (digits.length === 1) return setAt(index, digits);
    const old = cells[index];
    if (digits.length === 2 && old) return setAt(index, digits[0] === old ? digits[1] : digits[0]);
    fillFrom(index, digits);
  };

  /** Bound on the row, so a paste into any cell is caught, not only the first. */
  const onPaste = (event: ClipboardEvent<HTMLElement>) => {
    const digits = onlyDigits(event.clipboardData.getData('text'));
    event.preventDefault();
    if (!digits) return;
    const index = Number((event.target as HTMLElement).dataset.index ?? 0);
    fillFrom(index, digits);
  };

  const clear = () => setCells(Array(length).fill(''));

  return { cells, inputs, focusCell, onKeyDown, onChange, onPaste, clear };
}
