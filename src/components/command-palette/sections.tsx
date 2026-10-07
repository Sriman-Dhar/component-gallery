import { rank } from './fuzzy';
import type { PaletteGroup, PaletteItem, PaletteRow } from './types';

/** Rows shown at most for one query; the rest are counted, never rendered (1,000 rows would cost a frame). */
export const MAX_ROWS = 50;
/** How many suggestions an empty query shows: the first two of each group, in group order. */
const SUGGEST_PER_GROUP = 2;
const MAX_SUGGESTED = 6;

export interface Sections {
  groups: PaletteGroup[];
  /** Flattened visible rows, in the order arrow keys walk them. */
  rows: PaletteRow[];
  /** Every match for the query, rendered or not. */
  total: number;
}

function orderOf(groupOrder: string[]) {
  return (name: string) => {
    const i = groupOrder.indexOf(name);
    return i < 0 ? groupOrder.length : i;
  };
}

/** Number the rows in display order and flatten them. */
function finish(named: { name: string; picks: { item: PaletteItem; ranges: PaletteRow['ranges'] }[] }[], total: number): Sections {
  const rows: PaletteRow[] = [];
  const groups = named
    .filter((g) => g.picks.length > 0)
    .map((g) => ({
      name: g.name,
      rows: g.picks.map((p) => {
        const row = { item: p.item, ranges: p.ranges, index: rows.length };
        rows.push(row);
        return row;
      }),
    }));
  return { groups, rows, total };
}

/**
 * What the results list shows. An empty query: Recent (newest first), then a short Suggested set. A query: every
 * match ranked by the scorer, grouped under its own group in `groupOrder` (unknown groups last), capped at MAX_ROWS.
 */
export function buildSections(items: PaletteItem[], query: string, recent: string[], groupOrder: string[]): Sections {
  const byOrder = orderOf(groupOrder);

  if (!query.trim()) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const recentItems = recent.map((id) => byId.get(id)).filter((item): item is PaletteItem => Boolean(item));
    const taken = new Set(recentItems.map((item) => item.id));
    const counts = new Map<string, number>();
    const suggested = [...items]
      .sort((a, b) => byOrder(a.group) - byOrder(b.group))
      .filter((item) => {
        if (taken.has(item.id)) return false;
        const n = counts.get(item.group) ?? 0;
        counts.set(item.group, n + 1);
        return n < SUGGEST_PER_GROUP;
      })
      .slice(0, MAX_SUGGESTED);
    return finish(
      [
        { name: 'Recent', picks: recentItems.map((item) => ({ item, ranges: [] })) },
        { name: 'Suggested', picks: suggested.map((item) => ({ item, ranges: [] })) },
      ],
      recentItems.length + suggested.length,
    );
  }

  const ranked = rank(items, query, recent);
  const shown = ranked.slice(0, MAX_ROWS);
  const names = [...new Set(shown.map((r) => r.item.group))].sort((a, b) => byOrder(a) - byOrder(b));
  return finish(
    names.map((name) => ({ name, picks: shown.filter((r) => r.item.group === name) })),
    ranked.length,
  );
}
