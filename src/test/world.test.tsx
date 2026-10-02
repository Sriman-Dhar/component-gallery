import { render } from '@testing-library/react';
import { BASE_SPIN, ORRERY_ASPECT, project, SLOT_COUNT, slotOf } from '../shell/orrery/orreryModel';
import { createSpin, dragEnd, dragMove, dragStart, stepSpin } from '../shell/orrery/orrerySpin';
import { formationsGlsl } from '../shell/world/glsl/formations';
import World from '../shell/world/World';
import { heroFraming, particleCount } from '../shell/world/worldLayout';
import { diveBeats, FORMATIONS, sceneModeFor } from '../shell/world/worldModes';

describe('the living orrery', () => {
  it('orders the formations orbit then rail and compiles one function per formation', () => {
    expect(FORMATIONS.slice(0, 2)).toEqual(['orbit', 'rail']);
    expect(formationsGlsl).toContain('Form formOrbit()');
    expect(formationsGlsl).toContain('Form formRail()');
    expect(formationsGlsl).toContain(`const int FORMATION_COUNT = ${FORMATIONS.length};`);
  });

  it('runs the dive from hero orbit to the formed rail on one value', () => {
    expect(diveBeats(0)).toEqual({ flight: 0, stage: 0, bodies: 1 });
    const end = diveBeats(1);
    expect(end.flight).toBe(1);
    expect(end.stage).toBe(1);
    expect(end.bodies).toBe(0);
    expect(diveBeats(0.5).stage).toBeGreaterThan(0);
    expect(diveBeats(0.5).stage).toBeLessThan(1);
  });

  it('has a scene on the index only (Part A)', () => {
    expect(sceneModeFor('/')).toBe('index');
    expect(sceneModeFor('/components/otp-input')).toBeNull();
  });

  it('frames the sun right of the type on wide screens and above it on phones, within the point budget', () => {
    expect(heroFraming(1440, 900).shift[0]).toBeGreaterThan(0.2);
    expect(heroFraming(390, 844).shift[1]).toBeGreaterThan(0.3);
    expect(particleCount(2560)).toBeLessThanOrEqual(11000);
    expect(particleCount(390)).toBeLessThan(particleCount(1440));
  });

  it('places all 30 slots inside the poster box at any yaw', () => {
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

  it('falls back to a decorative poster with the shipped slots lit and no canvas without WebGL', () => {
    const { getByTestId, container } = render(<World shipped={2} litWeeks={[1]} />);
    expect(getByTestId('world')).toHaveAttribute('aria-hidden', 'true');
    expect(getByTestId('world')).toHaveAttribute('data-render', 'poster');
    expect(container.querySelectorAll('[data-slot]')).toHaveLength(30);
    expect([...container.querySelectorAll('[data-lit="true"]')].map((n) => n.getAttribute('data-slot'))).toEqual(['1', '2']);
    expect(container.querySelector('canvas')).toBeNull();
  });
});
