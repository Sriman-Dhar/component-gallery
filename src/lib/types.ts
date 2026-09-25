import type { ComponentType } from 'react';

/** The challenge's Type labels. Each component in the set carries exactly one. */
export const COMPONENT_TYPES = [
  'button',
  'form',
  'card',
  'modal',
  'navbar',
  'table',
  'loader',
  'section',
  'chart',
  'input',
] as const;

export type ComponentTypeLabel = (typeof COMPONENT_TYPES)[number];

/** Shape of every `src/components/<slug>/meta.ts` default-less `meta` export. */
export interface ComponentMeta {
  /** URL slug, must equal the folder name. Served at /components/<slug>. */
  slug: string;
  /** Human name shown in the gallery. */
  name: string;
  /** Challenge Type label. */
  type: ComponentTypeLabel;
  /** Challenge week, 1 to 13. 0 is reserved for the scaffold placeholder. */
  week: number;
  /** ISO date the component shipped, YYYY-MM-DD. */
  date: string;
  /** One line on what the component is. */
  summary: string;
  /** The final prompt, posted with the component. Required for points. */
  prompt: string;
}

export interface SourceFile {
  fileName: string;
  code: string;
}

export interface GalleryEntry {
  meta: ComponentMeta;
  /** Lazy loader for what the detail page renders: demo.tsx if present, else the component. */
  loadDemo: () => Promise<{ default: ComponentType }>;
  /** Lazy loaders for the raw source of every .tsx file in the folder. */
  loadSources: () => Promise<SourceFile[]>;
}
