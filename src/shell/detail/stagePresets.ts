import type { Segment } from '../Segmented';

export type WidthPreset = '375' | '768' | 'full';

/** The stage's width presets, in picker order; useStageWidth hides the ones the room cannot fit. */
export const PRESETS: Segment<WidthPreset>[] = [
  { id: '375', label: '375' },
  { id: '768', label: '768' },
  { id: 'full', label: 'Full' },
];
