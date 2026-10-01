import type { ChangeEvent, KeyboardEvent } from 'react';

/** Visual state of the whole row, decided once in OtpInput and read by every cell. */
export interface RowState {
  rejected: boolean;
  success: boolean;
  /** Verifying: read-only, aria-disabled, focus kept. */
  busy: boolean;
  disabled: boolean;
  /** The code is complete and parked on the last cell: typing there is ignored. */
  endLocked: boolean;
}

interface Props {
  id: string;
  index: number;
  length: number;
  digit: string;
  focused: boolean;
  row: RowState;
  inputRef: (el: HTMLInputElement | null) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: (index: number) => void;
  onBlur: (index: number) => void;
  onPick: () => void;
}

/** Each cell's border eases in 120ms; the success sweep staggers it 45ms per cell, left to right. */
const SWEEP_MS = 45;

function borderClass(row: RowState, digit: string): string {
  if (row.success) return 'border-[rgb(var(--otp-success))]';
  if (row.rejected) return 'border-[rgb(var(--otp-error))]';
  return digit ? 'border-[rgb(var(--otp-border-filled))]' : 'border-[rgb(var(--otp-border))]';
}

/** The focus ring takes the row's state color, so a red row or the green sweep stays one color. */
function ringClass(row: RowState): string {
  if (row.success) return 'focus-visible:outline-[rgb(var(--otp-success))]';
  if (row.rejected) return 'focus-visible:outline-[rgb(var(--otp-error))]';
  return 'focus-visible:outline-[rgb(var(--otp-ring))]';
}

/**
 * One digit cell. A label wrapper whose ::before reaches into the gaps keeps the tap target 44px+
 * even when a narrow stage shrinks the visible box toward 36px. Layers over the input, none of them
 * taking pointer input: a tint (overwrite cue or error fill), the paste flash ring, the placeholder
 * dash, and a 2px blinking caret while the cell is focused and empty.
 */
export default function OtpCell({ id, index, length, digit, focused, row, inputRef, onKeyDown, onChange, onFocus, onBlur, onPick }: Props) {
  const live = !row.busy && !row.disabled && !row.success && !row.rejected;
  const showCaret = focused && !digit && live;
  const overwriteCue = focused && Boolean(digit) && live && !row.endLocked;
  const tint = row.rejected
    ? 'bg-[rgb(var(--otp-error)/0.06)] opacity-100'
    : overwriteCue
      ? 'bg-[rgb(var(--otp-ring)/0.12)] opacity-100'
      : 'opacity-0';

  return (
    <label
      data-cell={index}
      className="otp-cell relative min-w-[36px] max-w-[52px] flex-1 before:absolute before:-inset-x-[4px] before:inset-y-0 before:content-[''] sm:before:-inset-x-[6px]"
    >
      <input
        ref={inputRef}
        id={`${id}-${index}`}
        data-index={index}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        aria-label={`Digit ${index + 1} of ${length}`}
        aria-invalid={row.rejected || undefined}
        aria-disabled={row.busy || undefined}
        readOnly={row.busy || row.success || row.rejected}
        value={digit}
        disabled={row.disabled}
        onKeyDown={(event) => onKeyDown(index, event)}
        onChange={(event) => onChange(index, event)}
        onPointerDown={onPick}
        onFocus={(event) => {
          event.target.select();
          onFocus(index);
        }}
        onBlur={() => onBlur(index)}
        style={row.success ? { transitionDelay: `${index * SWEEP_MS}ms` } : undefined}
        className={`relative block h-14 w-full rounded-control border-[1.5px] bg-[rgb(var(--otp-cell))] text-center text-[32px] font-semibold leading-none text-[rgb(var(--otp-ink))] caret-transparent outline-none transition-[border-color] duration-[120ms] ease-out [font-variant-numeric:tabular-nums] selection:bg-[rgb(var(--otp-ring)/0.12)] selection:text-[rgb(var(--otp-ink))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed motion-reduce:transition-none ${ringClass(row)} ${borderClass(row, digit)}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-control transition-opacity duration-[120ms] ease-out motion-reduce:transition-none ${tint}`}
      />
      {/* The fill peaks near 6% under the flash tween, so the flash also reads on a white cell. */}
      <span
        aria-hidden="true"
        className="otp-flash pointer-events-none absolute inset-0 rounded-control border-[1.5px] border-[rgb(var(--otp-ring))] bg-[rgb(var(--otp-ring)/0.09)] opacity-0"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--otp-dash))] ${
          digit || showCaret ? 'opacity-0' : ''
        }`}
      />
      {showCaret ? (
        <span
          aria-hidden="true"
          data-caret=""
          className="otp-caret pointer-events-none absolute left-1/2 top-1/2 h-7 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--otp-ring))]"
        />
      ) : null}
    </label>
  );
}
