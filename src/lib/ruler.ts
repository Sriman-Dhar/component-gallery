/**
 * The challenge window the ruler spans, 1 Oct to 30 Dec 2026 (the "90 days" of the challenge).
 * Pure date math, no DOM, so it is unit-tested directly.
 */
import { formatDate } from './date';

export const WINDOW_START = '2026-10-01';
export const WINDOW_END = '2026-12-30';
export const WEEK_COUNT = 13;

const DAY_MS = 86_400_000;

/** Whole-day UTC timestamp for an ISO date string or a Date (read as the viewer's local calendar day). */
function dayStamp(value: string | Date): number {
  if (typeof value === 'string') {
    const [y, m, d] = value.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  }
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
}

const START = dayStamp(WINDOW_START);
/** Days from the first to the last day of the window (90). */
export const WINDOW_DAYS = (dayStamp(WINDOW_END) - START) / DAY_MS;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Days since 2026-10-01; negative before the window. */
export function daysSinceStart(value: string | Date): number {
  return Math.round((dayStamp(value) - START) / DAY_MS);
}

/** Challenge week (1 to 13) a date falls in, clamped to the window. */
export function weekOf(value: string | Date): number {
  return clamp(Math.floor(daysSinceStart(value) / 7) + 1, 1, WEEK_COUNT);
}

/** Position of a date along the ruler, 0 (first day) to 1 (last day), clamped. */
export function positionOf(value: string | Date): number {
  return clamp(daysSinceStart(value) / WINDOW_DAYS, 0, 1);
}

/** Left edge of a week's segment, 0 to 1. */
export function weekStart(week: number): number {
  return clamp(((week - 1) * 7) / WINDOW_DAYS, 0, 1);
}

/** Centre of a week's segment, 0 to 1 (week 13 is the short last segment). */
export function weekCentre(week: number): number {
  const end = week >= WEEK_COUNT ? 1 : weekStart(week + 1);
  return (weekStart(week) + end) / 2;
}

/** Plain caption for the today cursor. Day 1 is 1 Oct; no "of N", so the count never argues with the copy. */
export function todayCaption(today: Date): string {
  const days = daysSinceStart(today);
  if (days < 0) return `Starts 1 Oct, in ${-days} ${days === -1 ? 'day' : 'days'}`;
  if (days > WINDOW_DAYS) return 'Challenge complete';
  return `Day ${days + 1}, week ${weekOf(today)}`;
}

/** SVG percentage string for a 0..1 position. */
export function pct(position: number): string {
  return `${(position * 100).toFixed(3)}%`;
}

/** "8 Oct 2026" style label for the first day of a challenge week. */
export function weekOpens(week: number): string {
  const [y, m, d] = WINDOW_START.split('-').map(Number);
  return formatDate(new Date(Date.UTC(y, m - 1, d + (week - 1) * 7)).toISOString().slice(0, 10));
}
