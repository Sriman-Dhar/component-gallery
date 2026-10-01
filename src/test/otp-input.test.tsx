import { act, fireEvent, render, screen } from '@testing-library/react';
import OtpInput, { CELL_MIN_PX, ERROR_HOLD_MS, GAP_NARROW_PX } from '../components/otp-input/OtpInput';

const cell = (n: number) => screen.getByRole('textbox', { name: `Digit ${n} of 6` });
const values = () => [1, 2, 3, 4, 5, 6].map((n) => (cell(n) as HTMLInputElement).value).join('');
const paste = (target: HTMLElement, text: string) =>
  fireEvent.paste(target, { clipboardData: { getData: () => text } });

describe('otp input', () => {
  it('renders six numeric one-time-code cells announced by position', () => {
    render(<OtpInput />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    for (let n = 1; n <= 6; n += 1) {
      expect(cell(n)).toHaveAttribute('inputmode', 'numeric');
      expect(cell(n)).toHaveAttribute('autocomplete', 'one-time-code');
    }
  });

  it('types digits, auto-advances, ignores letters, completes, and ignores typing past the end', () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    cell(1).focus();
    for (const key of ['1', 'a', '2', '3', '4', '5', '6', '7']) fireEvent.keyDown(document.activeElement!, { key });
    expect(values()).toBe('123456');
    expect(document.activeElement).toBe(cell(6));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('lets a deliberately picked cell be overwritten, even the last one', () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    paste(cell(1), '123456');
    fireEvent.pointerDown(cell(6));
    fireEvent.keyDown(cell(6), { key: '9' });
    expect(values()).toBe('123459');
    expect(onComplete).toHaveBeenLastCalledWith('123459');
  });

  it('shows a caret in the focused empty cell and an overwrite cue on a focused filled cell', () => {
    render(<OtpInput defaultValue="4" />);
    act(() => cell(2).focus());
    expect(cell(2).parentElement!.querySelector('[data-caret]')).not.toBeNull();
    expect(cell(1).parentElement!.querySelector('[data-caret]')).toBeNull();
    act(() => cell(1).focus());
    expect(cell(1).parentElement!.querySelector('[data-caret]')).toBeNull();
    expect(cell(1).parentElement!.innerHTML).toContain('--otp-ring)/0.12');
  });

  it('walks backward with backspace, clearing one digit per press', () => {
    render(<OtpInput />);
    paste(cell(1), '123456');
    fireEvent.keyDown(cell(6), { key: 'Backspace' });
    expect(values()).toBe('12345');
    fireEvent.keyDown(cell(6), { key: 'Backspace' });
    expect(values()).toBe('1234');
    expect(document.activeElement).toBe(cell(5));
  });

  it('fills every cell from a paste into cell four and focuses the last cell', () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    paste(cell(4), '246 810');
    expect(values()).toBe('246810');
    expect(document.activeElement).toBe(cell(6));
    expect(onComplete).toHaveBeenCalledWith('246810');
  });

  it('blocks input while disabled', () => {
    render(<OtpInput disabled />);
    expect(cell(1)).toBeDisabled();
  });

  it('keeps focus while verifying: read-only, aria-disabled, edits ignored, spinner line shown', () => {
    const { rerender } = render(<OtpInput />);
    act(() => cell(3).focus());
    rerender(<OtpInput verifying />);
    expect(cell(3)).toHaveAttribute('readonly');
    expect(cell(3)).toHaveAttribute('aria-disabled', 'true');
    expect(cell(3)).not.toBeDisabled();
    expect(document.activeElement).toBe(cell(3));
    fireEvent.keyDown(cell(3), { key: '5' });
    paste(cell(3), '123456');
    expect(values()).toBe('');
    expect(screen.getByText('Checking the code')).toBeInTheDocument();
  });

  it('fits six cells and five narrow gaps inside a 320px stage content box', () => {
    // 320 viewport - 2 x 16 page gutter - 2 x 16 stage padding - 2px stage border = 254px.
    expect(6 * CELL_MIN_PX + 5 * GAP_NARROW_PX).toBeLessThanOrEqual(254);
  });

  it('announces a rejected code, then clears the row for a retry', () => {
    vi.useFakeTimers();
    const onErrorReset = vi.fn();
    const { rerender } = render(<OtpInput onErrorReset={onErrorReset} />);
    paste(cell(1), '111111');
    rerender(<OtpInput error="Wrong code" onErrorReset={onErrorReset} />);
    expect(screen.getByRole('status')).toHaveTextContent('Wrong code');
    expect(cell(1)).toHaveAttribute('aria-invalid', 'true');
    act(() => {
      vi.advanceTimersByTime(ERROR_HOLD_MS + 50);
    });
    expect(values()).toBe('');
    expect(cell(1)).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(screen.getByText('Paste the code into any box, or type it.')).not.toHaveAttribute('aria-hidden');
    expect(onErrorReset).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
