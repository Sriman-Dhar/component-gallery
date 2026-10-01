import { render } from '@testing-library/react';
import CountUp from '../shell/hero/CountUp';
import { pulseHeat } from '../shell/rail/railLayout';

describe('index showcase', () => {
  it('lights one micro tick per shipped component, out of thirty', () => {
    const { container, getByLabelText } = render(<CountUp count={2} />);
    expect(getByLabelText('2 of 30 components shipped')).toBeInTheDocument();
    expect(container.querySelectorAll('.micro-tick')).toHaveLength(30);
    expect(container.querySelectorAll('.micro-tick[data-lit="true"]')).toHaveLength(2);
  });

  it('heats a rail label under the pulse head, leaves an afterglow behind it and nothing ahead', () => {
    expect(pulseHeat(0.5, 0.5)).toBe(1);
    const behind = pulseHeat(0.6, 0.5);
    expect(behind).toBeGreaterThan(0);
    expect(behind).toBeLessThan(1);
    expect(pulseHeat(0.4, 0.5)).toBe(0);
    expect(pulseHeat(1.4, 0.5)).toBeLessThan(0.01);
  });
});
