/** One command in the palette. Only `id`, `label`, `group` and `run` are required. */
export interface PaletteItem {
  id: string;
  label: string;
  /** Results are grouped under this header; any string works. */
  group: string;
  /** Extra match terms, never displayed ("roof" finds "Open the dome"). */
  keywords?: string[];
  /** One line shown in the preview pane. */
  hint?: string;
  /** Rendered as keycaps, e.g. ['G', 'L']. */
  shortcut?: string[];
  icon?: 'target' | 'action' | 'screen' | 'help';
  run: () => void;
}

/** [start, end) character ranges of a label that the query matched. */
export type MatchRange = [number, number];

/** An item as the results list shows it: where it sits in the flat order and which characters light up. */
export interface PaletteRow {
  item: PaletteItem;
  ranges: MatchRange[];
  /** Index in the flattened, visible order (what arrow keys walk). */
  index: number;
}

/** A visible group: its header and its rows, already in display order. */
export interface PaletteGroup {
  name: string;
  rows: PaletteRow[];
}
