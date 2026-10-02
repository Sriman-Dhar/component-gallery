import { render } from '@testing-library/react';
import { BASE_SPIN, ORRERY_ASPECT, project, SLOT_COUNT, slotOf } from '../shell/orrery/orreryModel';
import { createSpin, dragEnd, dragMove, dragStart, stepSpin } from '../shell/orrery/orrerySpin';
import { formationsGlsl } from '../shell/world/glsl/formations';
import World from '../shell/world/World';
import { heroFraming, particleCount } from '../shell/world/worldLayout';
import { diveBeats, FORMATIONS, indexStage, sceneModeFor } from '../shell/world/worldModes';
import { shipped } from '../lib/catalogue';

describe('the living orrery', () => {
  it('orders the formations orbit, rail, halos, glyph, far and compiles one function per formation', () => {
    expect(FORMATIONS).toEqual(['orbit', 'rail', 'halos', 'glyph', 'far']);
    for (const name of ['Orbit', 'Rail', 'Halos', 'Glyph', 'Far']) expect(formationsGlsl).toContain(`Form form${name}()`);
    expect(formationsGlsl).toContain(`const int FORMATION_COUNT = ${FORMATIONS.length};`);
  });

  it('runs the dive from hero orbit to the formed rail on one value', () => {
    expect(diveBeats(0)).toEqual({ flight: 0, stage: 0, bodies: 1, dock: 0 });
    const end = diveBeats(1);
    expect(end.flight).toBe(1);
    expect(end.stage).toBe(1);
    expect(end.bodies).toBe(0);
    expect(diveBeats(0.5).stage).toBeGreaterThan(0);
    expect(diveBeats(0.5).stage).toBeLessThan(1);
    expect(end.dock).toBe(1);
  });

  it('climbs the index stage through every formation in page order', () => {
    expect(indexStage(0, 0, 0)).toBe(0);
    expect(indexStage(1, 0, 0)).toBe(1);
    expect(indexStage(1, 0.5, 0)).toBe(2);
    expect(indexStage(1, 1, 0)).toBe(3);
    expect(indexStage(1, 1, 1)).toBe(FORMATIONS.length - 1);
  });

  it('runs the index story on /, the close orbit on a shipped component, the dark orrery anywhere else', () => {
    expect(sceneModeFor('/')).toBe('index');
    expect(sceneModeFor(`/components/${shipped[0].meta.slug}`)).toBe('close');
    expect(sceneModeFor('/components/no-such-thing')).toBe('dark');
    expect(sceneModeFor('/nope')).toBe('dark');
  });

  it('frames the sun right of the type on wide screens and above it on phones, within the point budget', () => {
    expect(heroFraming(1440, 900).shift[0]).toBeGreaterThan(0.2);
    expect(heroFraming(390, 844).shift[1]).toBeGreaterThan(0.1);
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

  it('shows no poster behind a detail header without WebGL (the header carries its own glow)', () => {
    const { getByTestId, queryByTestId } = render(<World mode="close" shipped={2} litWeeks={[1]} grid={{ labels: [], next: false }} />);
    expect(getByTestId('world')).toHaveAttribute('data-mode', 'close');
    expect(queryByTestId('world-poster')).toBeNull();
  });

  it('falls back to a decorative poster with the shipped slots lit and no canvas without WebGL', () => {
    const { getByTestId, container } = render(<World mode="index" shipped={2} litWeeks={[1]} grid={{ labels: ['01', '02'], next: true }} />);
    expect(getByTestId('world')).toHaveAttribute('aria-hidden', 'true');
    expect(getByTestId('world')).toHaveAttribute('data-render', 'poster');
    expect(container.querySelectorAll('[data-slot]')).toHaveLength(30);
    expect([...container.querySelectorAll('[data-lit="true"]')].map((n) => n.getAttribute('data-slot'))).toEqual(['1', '2']);
    expect(container.querySelector('canvas')).toBeNull();
  });
});
