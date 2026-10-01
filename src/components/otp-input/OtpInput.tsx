import { useEffect, useId, useRef, useState } from 'react';
import OtpCell, { type RowState } from './OtpCell';
import { useOtpCode } from './useOtpCode';
import { useOtpMotion } from './useOtpMotion';

/**
 * The component's own custom properties, flipped by the stage theme. Every value reads a page
 * primitive first and falls back to its literal triple, so the field keeps its look when lifted out
 * of this gallery. Light stage: white cells, warm gray border. Dark stage: dark cells, light border.
 * Borders hold 3:1 against both the cell and the stage; text and error copy hold 4.5:1.
 */
const THEME = [
  '[--otp-cell:var(--p-mist-0,255_255_255)]',
  '[--otp-border:var(--p-warm-500,140_135_128)]',
  '[--otp-border-filled:var(--p-ink-990,18_18_22)]',
  '[--otp-ink:var(--p-ink-990,18_18_22)]',
  '[--otp-dash:var(--p-warm-250,200_196_190)]',
  '[--otp-muted:var(--p-ink-600,93_93_107)]',
  '[--otp-ring:var(--p-amber-700,173_74_5)]',
  '[--otp-error:var(--p-red-600,194_37_58)]',
  '[--otp-success:var(--p-green-600,21_128_61)]',
  '[[data-stage-theme=dark]_&]:[--otp-cell:var(--p-ink-900,26_26_33)]',
  '[[data-stage-theme=dark]_&]:[--otp-border:var(--p-slate-500,120_120_132)]',
  '[[data-stage-theme=dark]_&]:[--otp-border-filled:var(--p-mist-400,156_156_171)]',
  '[[data-stage-theme=dark]_&]:[--otp-ink:var(--p-mist-50,243_243_246)]',
  '[[data-stage-theme=dark]_&]:[--otp-dash:var(--p-ink-750,72_72_84)]',
  '[[data-stage-theme=dark]_&]:[--otp-muted:var(--p-mist-400,156_156_171)]',
  '[[data-stage-theme=dark]_&]:[--otp-ring:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--otp-error:var(--p-red-300,255_107_122)]',
  '[[data-stage-theme=dark]_&]:[--otp-success:var(--p-green-400,74_222_128)]',
].join(' ');

/** How long the rejected code stays on screen in the error color before the row clears. */
export const ERROR_HOLD_MS = 1400;
/** Narrowest visible cell and the gap below the sm breakpoint: six cells and five gaps fit in 246px. */
export const CELL_MIN_PX = 36;
export const GAP_NARROW_PX = 6;

const FADE = 'transition-opacity duration-150 ease-out motion-reduce:transition-none [grid-area:1/1]';

export interface OtpInputProps {
  /** Number of cells. Six is the common length for SMS and email codes. */
  length?: number;
  /** Visible label above the row. */
  label?: string;
  /** Helper line under the row; the error message takes its place while an error shows. */
  hint?: string;
  /** Digits to start with (a preview, or a code restored after navigation). */
  defaultValue?: string;
  /** Focus the first cell on mount, without scrolling the page. */
  autoFocus?: boolean;
  /** Fires once every cell holds a digit. */
  onComplete?: (code: string) => void;
  /** The code is being checked: cells dim, turn read-only and keep focus; a spinner joins the hint. */
  verifying?: boolean;
  /** Line shown with the spinner while verifying. */
  verifyingText?: string;
  /** The code was accepted: a success border sweeps across the cells. */
  success?: boolean;
  /** Fully unavailable: native disabled, out of the tab order. */
  disabled?: boolean;
  /** A rejected code: set a message, the row shakes once, then clears for a retry. */
  error?: string | null;
  /** Called after the row has cleared, so the parent can reset `error` to null. */
  onErrorReset?: () => void;
}

export default function OtpInput({
  length = 6,
  label = 'Verification code',
  hint = 'Paste the code into any box, or type it.',
  defaultValue = '',
  autoFocus = false,
  onComplete,
  verifying = false,
  verifyingText = 'Checking the code',
  success = false,
  disabled = false,
  error = null,
  onErrorReset,
}: OtpInputProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [rejected, setRejected] = useState(false);
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(-1);
  const lastMessage = useRef('');
  if (message) lastMessage.current = message;

  const cascadeRef = useRef<(start: number, count: number) => void>(() => undefined);
  const code = useOtpCode({
    length,
    initial: defaultValue,
    locked: verifying || success,
    onComplete,
    onEdit: () => setMessage(''),
    onFill: (start, count) => cascadeRef.current(start, count),
  });
  const { cells, inputs, focusCell, clear } = code;
  const caretKey = `${focused}:${focused >= 0 ? cells[focused] : ''}`;
  const { shake, cascade } = useOtpMotion(root, row, caretKey);
  cascadeRef.current = cascade;

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus({ preventScroll: true });
    // Mount only: autofocus is a first-render decision.
  }, []);

  const handled = useRef<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!error) {
      handled.current = null;
      return;
    }
    if (handled.current === error) return;
    handled.current = error;
    setRejected(true);
    setMessage(error);
    shake();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      clear();
      setRejected(false);
      setMessage('');
      focusCell(0);
      onErrorReset?.();
    }, ERROR_HOLD_MS);
    // Keyed on the error alone: the other values are handlers whose behavior never changes.
  }, [error]);

  const showError = rejected || Boolean(message);
  const state: RowState = { rejected, success, busy: verifying, disabled, endLocked: code.endLocked };

  return (
    <div ref={root} className={`${THEME} flex w-full max-w-[372px] flex-col gap-3 font-sans text-[rgb(var(--otp-ink))]`}>
      <label id={`${id}-label`} htmlFor={`${id}-0`} className="text-[14px] font-medium leading-5">
        {label}
      </label>
      <div
        ref={row}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-note`}
        aria-busy={verifying || undefined}
        onPaste={code.onPaste}
        className={`flex gap-1.5 transition-opacity duration-150 motion-reduce:transition-none sm:gap-3 ${
          disabled ? 'cursor-not-allowed opacity-50' : verifying ? 'cursor-progress opacity-60' : ''
        }`}
      >
        {cells.map((digit, index) => (
          <OtpCell
            key={index}
            id={id}
            index={index}
            length={length}
            digit={digit}
            focused={focused === index}
            row={state}
            inputRef={(el) => (inputs.current[index] = el)}
            onKeyDown={code.onKeyDown}
            onChange={code.onChange}
            onFocus={setFocused}
            onBlur={(index) => setFocused((current) => (current === index ? -1 : current))}
            onPick={code.onPick}
          />
        ))}
      </div>
      {/* Two reserved lines: the hint (or the checking line), with the error fading in over it. */}
      <div id={`${id}-note`} className="grid min-h-10 text-[14px] leading-5">
        <span aria-hidden={showError || undefined} className={`${FADE} text-[rgb(var(--otp-muted))] ${showError ? 'opacity-0' : ''}`}>
          {verifying ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              {verifyingText}
            </span>
          ) : (
            hint
          )}
        </span>
        <span aria-hidden={!showError || undefined} className={`${FADE} text-[rgb(var(--otp-error))] ${showError ? '' : 'opacity-0'}`}>
          {message || lastMessage.current}
        </span>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  );
}

/** A 14px inline spinner for the checking line; a slower turn under reduced motion. */
function Spinner() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 animate-spin motion-reduce:animate-[spin_1.6s_linear_infinite]">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
