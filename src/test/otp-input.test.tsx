import { act, fireEvent, render, screen } from '@testing-library/react';
import OtpInput from '../components/otp-input/OtpInput';

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

  it('types digits, auto-advances, ignores letters and completes', () => {
    const onComplete = vi.fn();
    render(<OtpInput onComplete={onComplete} />);
    cell(1).focus();
    for (const key of ['1', 'a', '2', '3', '4', '5', '6', '7']) fireEvent.keyDown(document.activeElement!, { key });
    expect(values()).toBe('123457');
    expect(document.activeElement).toBe(cell(6));
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(onComplete).toHaveBeenLastCalledWith('123457');
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

  it('announces a rejected code, then clears the row for a retry', () => {
    vi.useFakeTimers();
    const onErrorReset = vi.fn();
    const { rerender } = render(<OtpInput onErrorReset={onErrorReset} />);
    paste(cell(1), '111111');
    rerender(<OtpInput error="Wrong code" onErrorReset={onErrorReset} />);
    expect(screen.getByRole('status')).toHaveTextContent('Wrong code');
    expect(cell(1)).toHaveAttribute('aria-invalid', 'true');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(values()).toBe('');
    expect(cell(1)).not.toHaveAttribute('aria-invalid');
    expect(onErrorReset).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
