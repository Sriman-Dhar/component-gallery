import { registry } from './registry';
import type { GalleryEntry } from './types';

/** The challenge target: 30 components over 90 days. */
export const TARGET = 30;

function isShipped(entry: GalleryEntry): boolean {
  return entry.meta.week > 0;
}

/** Catalogue order: shipped components by week then slug, the week 0 placeholder last. */
export const catalogue: GalleryEntry[] = [...registry].sort((a, b) => {
  const shipped = Number(isShipped(b)) - Number(isShipped(a));
  return shipped || a.meta.week - b.meta.week || a.meta.slug.localeCompare(b.meta.slug);
});

export const shipped: GalleryEntry[] = catalogue.filter(isShipped);

/** Running number: 1-based position among shipped components, 0 for the placeholder. */
export function numberOf(slug: string): number {
  return shipped.findIndex((entry) => entry.meta.slug === slug) + 1;
}

/** "№ 07" style label. */
export function runningLabel(slug: string): string {
  return String(numberOf(slug)).padStart(2, '0');
}

export function neighbours(slug: string): { prev?: GalleryEntry; next?: GalleryEntry } {
  const index = catalogue.findIndex((entry) => entry.meta.slug === slug);
  if (index < 0) return {};
  return { prev: catalogue[index - 1], next: catalogue[index + 1] };
}
