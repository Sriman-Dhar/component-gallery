import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useOtpCode } from './useOtpCode';

gsap.registerPlugin(useGSAP);

/**
 * The component's own custom properties, flipped by the stage theme. Page primitives are read only
 * with literal fallbacks. Light stage: white cells, warm gray border. Dark stage: dark cells, light border.
 * Borders hold 3:1 against both the cell and the stage; text and error copy hold 4.5:1.
 */
const THEME = [
  '[--otp-cell:var(--p-mist-0,255_255_255)]',
  '[--otp-border:140_135_128]',
  '[--otp-border-filled:var(--p-ink-990,18_18_22)]',
  '[--otp-ink:var(--p-ink-990,18_18_22)]',
  '[--otp-dash:200_196_190]',
  '[--otp-muted:var(--p-ink-600,93_93_107)]',
  '[--otp-ring:var(--p-amber-700,173_74_5)]',
  '[--otp-error:194_37_58]',
  '[[data-stage-theme=dark]_&]:[--otp-cell:var(--p-ink-900,26_26_33)]',
  '[[data-stage-theme=dark]_&]:[--otp-border:120_120_132]',
  '[[data-stage-theme=dark]_&]:[--otp-border-filled:var(--p-mist-400,156_156_171)]',
  '[[data-stage-theme=dark]_&]:[--otp-ink:var(--p-mist-50,243_243_246)]',
  '[[data-stage-theme=dark]_&]:[--otp-dash:72_72_84]',
  '[[data-stage-theme=dark]_&]:[--otp-muted:var(--p-mist-400,156_156_171)]',
  '[[data-stage-theme=dark]_&]:[--otp-ring:var(--p-amber-500,255_138_42)]',
  '[[data-stage-theme=dark]_&]:[--otp-error:255_107_122]',
].join(' ');

/** How long the rejected code stays on screen in the error colour before the row clears. */
const ERROR_HOLD_MS = 900;

export interface OtpInputProps {
  /** Number of cells. Six is the common length for SMS and email codes. */
  length?: number;
  /** Visible label above the row. */
  label?: string;
  /** Helper line under the row; the error message takes its place while an error shows. */
  hint?: string;
  /** Fires once every cell holds a digit. */
  onComplete?: (code: string) => void;
  /** Set while the code is being verified: cells dim and take no input. */
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
  onComplete,
  disabled = false,
  error = null,
  onErrorReset,
}: OtpInputProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const motionOk = useRef(false);
  const [rejected, setRejected] = useState(false);
  const [message, setMessage] = useState('');
  const { cells, inputs, focusCell, onKeyDown, onChange, onPaste, clear } = useOtpCode({
    length,
    onComplete,
    onEdit: () => setMessage(''),
  });

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        motionOk.current = true;
        return () => void (motionOk.current = false);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /** The only motion in the component: one short shake on a rejected code. Reduced motion skips it. */
  const shake = contextSafe(() => {
    if (!motionOk.current || !row.current) return;
    gsap.fromTo(
      row.current,
      { x: 0 },
      { keyframes: { x: [0, -10, 9, -7, 5, -2, 0], easeEach: 'sine.inOut' }, duration: 0.42, overwrite: true },
    );
  });

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
      focusCell(0);
      onErrorReset?.();
    }, ERROR_HOLD_MS);
    // Keyed on the error alone: the other values are handlers whose behaviour never changes.
  }, [error]);

  const showError = rejected || Boolean(message);

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
        onPaste={onPaste}
        className={`flex gap-2 sm:gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {cells.map((digit, index) => (
          // A label wrapper whose ::before reaches into the gaps: the tap target stays 48px+ even when a
          // narrow screen shrinks the visible box toward 44px.
          <label
            key={index}
            className="relative min-w-[44px] max-w-[52px] flex-1 before:absolute before:-inset-x-[5px] before:inset-y-0 before:content-['']"
          >
            <input
              ref={(el) => (inputs.current[index] = el)}
              id={`${id}-${index}`}
              data-index={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={rejected || undefined}
              value={digit}
              disabled={disabled}
              onKeyDown={(event) => onKeyDown(index, event)}
              onChange={(event) => onChange(index, event)}
              onFocus={(event) => event.target.select()}
              className={`relative block h-14 w-full rounded-control border-[1.5px] bg-[rgb(var(--otp-cell))] text-center text-[28px] font-semibold leading-none tabular-nums text-[rgb(var(--otp-ink))] caret-transparent outline-none [font-variant-numeric:tabular-nums] selection:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--otp-ring))] disabled:cursor-not-allowed ${
                rejected
                  ? 'border-[rgb(var(--otp-error))]'
                  : digit
                    ? 'border-[rgb(var(--otp-border-filled))]'
                    : 'border-[rgb(var(--otp-border))]'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--otp-dash))] ${
                digit ? 'opacity-0' : ''
              }`}
            />
          </label>
        ))}
      </div>
      {/* Two reserved lines: the hint, or the error in its place. Height never changes. */}
      <p
        id={`${id}-note`}
        className={`min-h-10 text-[14px] leading-5 ${showError ? 'text-[rgb(var(--otp-error))]' : 'text-[rgb(var(--otp-muted))]'}`}
      >
        {message || hint}
      </p>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  );
}
