import { act, fireEvent, render, screen } from '@testing-library/react';
import OtpInputDemo from '../components/otp-input/demo';

const cell = (n: number) => screen.getByRole('textbox', { name: `Digit ${n} of 6` });

function typeCode(code: string) {
  for (const key of code) fireEvent.keyDown(document.activeElement!, { key });
}

describe('otp input demo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('hand-typing the demo code always ends in the accepted panel with Start over focused', () => {
    render(<OtpInputDemo />);
    act(() => cell(1).focus());
    typeCode('246810');
    expect(screen.getByText('Checking the code')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getAllByRole('status').some((n) => n.textContent === 'Code accepted')).toBe(true);
    expect(screen.getByRole('button', { name: 'Show the error' })).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByText('Code accepted. You are signed in.')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByRole('switch', { name: 'Disabled' })).toBeDisabled();
  });

  it('a wrong code cannot start a second check during the error hold, then the right one is accepted', () => {
    render(<OtpInputDemo />);
    act(() => cell(1).focus());
    typeCode('111111');
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(cell(1)).toHaveAttribute('aria-invalid', 'true');
    fireEvent.pointerDown(cell(6));
    fireEvent.keyDown(cell(6), { key: '9' });
    expect(screen.queryByText('Checking the code')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(cell(1)).not.toHaveAttribute('aria-invalid');
    typeCode('246810');
    // Each phase schedules its own timer once committed, so advance phase by phase.
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByRole('button', { name: 'Start over' })).toHaveFocus();
  });
});
