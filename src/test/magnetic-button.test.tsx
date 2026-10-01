import { fireEvent, render, screen } from '@testing-library/react';
import MagneticButton from '../components/magnetic-button/MagneticButton';

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
