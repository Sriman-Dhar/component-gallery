import { registry } from './registry';
import type { GalleryEntry } from './types';

/** The challenge target: 30 components over 90 days. */
export const TARGET = 30;

/** Week 0 is the scaffold placeholder: registered (it is the test fixture) but never published. */
function isShipped(entry: GalleryEntry): boolean {
  return entry.meta.week > 0;
}

/** Published components in running-number order: by week, then slug. The placeholder is not here. */
export const shipped: GalleryEntry[] = registry
  .filter(isShipped)
  .sort((a, b) => a.meta.week - b.meta.week || a.meta.slug.localeCompare(b.meta.slug));

/** A published component by slug. The placeholder and unknown slugs both resolve to nothing (a 404). */
export function findShipped(slug: string): GalleryEntry | undefined {
  return shipped.find((entry) => entry.meta.slug === slug);
}

/** Running number: 1-based position among shipped components, 0 when not published. */
export function numberOf(slug: string): number {
  return shipped.findIndex((entry) => entry.meta.slug === slug) + 1;
}

/** "07" style label for the № mark. */
export function runningLabel(slug: string): string {
  return String(numberOf(slug)).padStart(2, '0');
}

/** Previous and next published components, in running-number order. */
export function neighbours(slug: string): { prev?: GalleryEntry; next?: GalleryEntry } {
  const index = shipped.findIndex((entry) => entry.meta.slug === slug);
  if (index < 0) return {};
  return { prev: shipped[index - 1], next: shipped[index + 1] };
}
