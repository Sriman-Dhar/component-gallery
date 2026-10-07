import { rank } from './fuzzy';
import type { PaletteGroup, PaletteItem, PaletteRow } from './types';

/** Rows shown at most for one query; the rest are counted, never rendered (1,000 rows would cost a frame). */
export const MAX_ROWS = 50;

export interface Sections {
  groups: PaletteGroup[];
  /** Flattened visible rows, in the order arrow keys walk them. */
  rows: PaletteRow[];
  /** Every row the query earns, rendered or not. */
  total: number;
}

interface Pick {
  item: PaletteItem;
  ranges: PaletteRow['ranges'];
  via?: string;
}

function orderOf(groupOrder: string[]) {
  return (name: string) => {
    const i = groupOrder.indexOf(name);
    return i < 0 ? groupOrder.length : i;
  };
}

/** Cap the rows at MAX_ROWS, number them in display order and flatten them. */
function finish(named: { name: string; picks: Pick[] }[], total: number): Sections {
  const rows: PaletteRow[] = [];
  const groups: PaletteGroup[] = [];
  for (const g of named) {
    const room = MAX_ROWS - rows.length;
    if (room <= 0) break;
    const picks = g.picks.slice(0, room);
    if (picks.length === 0) continue;
    groups.push({
      name: g.name,
      rows: picks.map((p) => {
        const row = { item: p.item, ranges: p.ranges, via: p.via, index: rows.length };
        rows.push(row);
        return row;
      }),
    });
  }
  return { groups, rows, total };
}

/**
 * What the results list shows. An empty query: Recent (newest first), then every other command under its group in
 * `groupOrder`, so the whole list can be browsed. A query: every match ranked by the scorer, grouped under its own
 * group, groups ordered by their best match (so the first selected row is the best match, never just the first
 * group's), ties in `groupOrder`. Both capped at MAX_ROWS; `total` counts the rest.
 */
export function buildSections(items: PaletteItem[], query: string, recent: string[], groupOrder: string[]): Sections {
  const byOrder = orderOf(groupOrder);

  if (!query.trim()) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const recentItems = recent.map((id) => byId.get(id)).filter((item): item is PaletteItem => Boolean(item));
    const taken = new Set(recentItems.map((item) => item.id));
    const rest = items.filter((item) => !taken.has(item.id));
    const names = [...new Set(rest.map((item) => item.group))].sort((a, b) => byOrder(a) - byOrder(b));
    return finish(
      [
        { name: 'Recent', picks: recentItems.map((item) => ({ item, ranges: [] })) },
        ...names.map((name) => ({ name, picks: rest.filter((item) => item.group === name).map((item) => ({ item, ranges: [] })) })),
      ],
      items.length,
    );
  }

  const all = rank(items, query, recent);
  const ranked = all.slice(0, MAX_ROWS);
  const best = new Map<string, number>();
  ranked.forEach((r) => best.set(r.item.group, Math.max(best.get(r.item.group) ?? -Infinity, r.score)));
  const names = [...best.keys()].sort((a, b) => (best.get(b) ?? 0) - (best.get(a) ?? 0) || byOrder(a) - byOrder(b));
  return finish(
    names.map((name) => ({ name, picks: ranked.filter((r) => r.item.group === name) })),
    all.length,
  );
}
