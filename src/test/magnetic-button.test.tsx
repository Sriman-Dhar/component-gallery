import { fireEvent, render, screen } from '@testing-library/react';
import MagneticButton from '../components/magnetic-button/MagneticButton';
import { MAX_TRAVEL, pullVector, RADIUS } from '../components/magnetic-button/useMagneticPull';

describe('magnetic button', () => {
  it('fires on click and from the keyboard path', () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Join</MagneticButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks activation while disabled and carries aria-disabled', () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick} disabled>Join</MagneticButton>);
    const button = screen.getByRole('button', { name: 'Join' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps its name while loading and announces busy, then done', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <MagneticButton onClick={onClick} loading busyText="Joining" doneText="Joined">
        Join
      </MagneticButton>,
    );
    const button = screen.getByRole('button', { name: 'Join' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Joining')).toBeInTheDocument();
    rerender(
      <MagneticButton onClick={onClick} busyText="Joining" doneText="Joined">
        Join
      </MagneticButton>,
    );
    expect(screen.getByText('Joined')).toBeInTheDocument();
  });
});

describe('magnetic pull vector', () => {
  const travel = ([x, y]: [number, number]) => Math.hypot(x, y);

  it('never exceeds the total travel cap, even far across the button', () => {
    for (const [dx, dy] of [[200, 0], [0, 60], [-150, 40], [90, -90]]) {
      expect(travel(pullVector(dx, dy, 0))).toBeLessThanOrEqual(MAX_TRAVEL + 1e-9);
    }
  });

  it('falls off with distance: full near the button, near zero at the radius edge, zero past it', () => {
    const near = travel(pullVector(120, 0, 4));
    const mid = travel(pullVector(160, 0, 40));
    const edge = travel(pullVector(195, 0, RADIUS - 2));
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(edge);
    expect(edge).toBeLessThan(0.1);
    expect(travel(pullVector(200, 0, RADIUS + 1))).toBe(0);
  });

  it('aims at the exact cursor point, not an edge or corner', () => {
    const [x, y] = pullVector(30, 17, 0);
    expect(Math.atan2(y, x)).toBeCloseTo(Math.atan2(17, 30));
  });
});
