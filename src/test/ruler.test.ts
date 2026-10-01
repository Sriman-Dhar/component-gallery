import { positionOf, todayCaption, weekCentre, weekOf, weekStart, WINDOW_DAYS } from '../lib/ruler';

describe('ruler math', () => {
  it('maps dates to challenge weeks', () => {
    expect(weekOf('2026-10-01')).toBe(1);
    expect(weekOf('2026-10-07')).toBe(1);
    expect(weekOf('2026-10-08')).toBe(2);
    expect(weekOf('2026-12-30')).toBe(13);
  });

  it('clamps weeks outside the window', () => {
    expect(weekOf('2026-09-25')).toBe(1);
    expect(weekOf('2027-01-15')).toBe(13);
  });

  it('places the cursor from 0 to 1 and clamps before and after', () => {
    expect(WINDOW_DAYS).toBe(90);
    expect(positionOf('2026-10-01')).toBe(0);
    expect(positionOf('2026-12-30')).toBe(1);
    expect(positionOf('2026-11-15')).toBeCloseTo(45 / 90);
    expect(positionOf('2026-09-01')).toBe(0);
    expect(positionOf('2027-02-01')).toBe(1);
  });

  it('reads a Date as the local calendar day', () => {
    expect(weekOf(new Date(2026, 9, 8, 23, 30))).toBe(2);
    expect(positionOf(new Date(2026, 9, 1, 0, 5))).toBe(0);
  });

  it('lays week segments left to right inside the window', () => {
    expect(weekStart(1)).toBe(0);
    expect(weekStart(2)).toBeCloseTo(7 / 90);
    expect(weekCentre(13)).toBeGreaterThan(weekStart(13));
    expect(weekCentre(13)).toBeLessThan(1);
  });

  it('captions today before, during and after the window', () => {
    expect(todayCaption(new Date(2026, 8, 25))).toBe('Starts 1 Oct, in 6 days');
    expect(todayCaption(new Date(2026, 9, 1))).toBe('Day 1, week 1');
    expect(todayCaption(new Date(2026, 9, 8))).toBe('Day 8, week 2');
    expect(todayCaption(new Date(2026, 11, 30))).toBe('Day 91, week 13');
    expect(todayCaption(new Date(2027, 0, 5))).toBe('Challenge complete');
  });
});

describe('date format', () => {
  it('uses one style everywhere: "25 Sep 2026", or without the year', async () => {
    const { formatDate } = await import('../lib/date');
    const { weekOpens } = await import('../lib/ruler');
    expect(formatDate('2026-09-25')).toBe('25 Sep 2026');
    expect(formatDate('2026-10-01', { year: false })).toBe('1 Oct');
    expect(weekOpens(2)).toBe('8 Oct 2026');
  });
});
