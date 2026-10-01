import { render } from '@testing-library/react';
import { MAX_POINTS } from '../shell/rail/railGeometry';
import Orrery from '../shell/orrery/Orrery';
import { BASE_SPIN, ORRERY_ASPECT, ORRERY_MAX_POINTS, project, SLOT_COUNT, slotOf } from '../shell/orrery/orreryModel';
import { createSpin, dragEnd, dragMove, dragStart, stepSpin } from '../shell/orrery/orrerySpin';

describe('hero orrery', () => {
  it('keeps the rail and the orrery together within the 7000 point budget', () => {
    expect(MAX_POINTS + ORRERY_MAX_POINTS).toBeLessThanOrEqual(7000);
  });

  it('places all 30 slots inside the box at any yaw', () => {
    for (const yaw of [0, 1, 2.5, 4]) {
      for (let i = 0; i < SLOT_COUNT; i++) {
        const { ring, u } = slotOf(i);
        const p = project(ring, u, 0, yaw);
        expect(Math.abs(p.x)).toBeLessThan(0.5);
        expect(Math.abs(p.y)).toBeLessThan(0.5 / ORRERY_ASPECT);
      }
    }
  });

  it('spins at the base rate, follows a drag, then eases back to the base rate', () => {
    const spin = createSpin(0);
    stepSpin(spin, 1);
    expect(spin.yaw).toBeCloseTo(BASE_SPIN, 5);
    dragStart(spin, 100, 0);
    dragMove(spin, 160, 16);
    expect(spin.yaw).toBeGreaterThan(BASE_SPIN + 0.4);
    expect(spin.vel).toBeGreaterThan(BASE_SPIN * 10);
    dragEnd(spin, 20);
    const flick = spin.vel;
    stepSpin(spin, 0.5);
    expect(spin.vel).toBeLessThan(flick);
    for (let i = 0; i < 480; i++) stepSpin(spin, 1 / 60);
    expect(spin.vel).toBeCloseTo(BASE_SPIN, 2);
  });

  it('renders a decorative poster with the shipped slots lit and no canvas without WebGL', () => {
    const { getByTestId, container } = render(<Orrery shipped={2} />);
    expect(getByTestId('orrery')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[data-slot]')).toHaveLength(30);
    expect([...container.querySelectorAll('[data-lit="true"]')].map((n) => n.getAttribute('data-slot'))).toEqual(['1', '2']);
    expect(container.querySelector('canvas')).toBeNull();
  });
});
