import type { PaletteItem } from './types';

/** Domeboard: the night console of the invented Lantern Point Observatory. Every name here is invented. */
export const DOMEBOARD_GROUPS = ['Targets', 'Actions', 'Go to', 'Help'];

type Spec = Omit<PaletteItem, 'run'>;

const SPECS: Spec[] = [
  { id: 'kessa', label: 'Kessa Cluster', group: 'Targets', icon: 'target', keywords: ['open cluster'], hint: 'Young open cluster, best after midnight.' },
  { id: 'orrin', label: "Orrin's Veil", group: 'Targets', icon: 'target', keywords: ['nebula'], hint: 'Faint emission veil, needs the long exposure.' },
  { id: 'tamsin', label: 'Tamsin Doublet', group: 'Targets', icon: 'target', keywords: ['double star', 'binary'], hint: 'Close double, splits at high power.' },
  { id: 'lantern-pair', label: 'The Lantern Pair', group: 'Targets', icon: 'target', keywords: ['double star', 'binary'], hint: 'Amber and blue pair low in the east.' },
  { id: 'halden', label: 'Halden Arc', group: 'Targets', icon: 'target', keywords: ['galaxy'], hint: 'Edge on galaxy with a dark lane.' },
  { id: 'ivel', label: 'Ivel Spiral', group: 'Targets', icon: 'target', keywords: ['galaxy'], hint: 'Face on spiral, rises at nine.' },
  { id: 'open-dome', label: 'Open the dome', group: 'Actions', icon: 'action', keywords: ['roof', 'shutter', 'slit'], shortcut: ['O'], hint: 'Rolls the shutter back. Checks wind first.' },
  { id: 'close-dome', label: 'Close the dome', group: 'Actions', icon: 'action', keywords: ['roof', 'shutter', 'slit'], shortcut: ['C'], hint: 'Closes the shutter and parks the slit.' },
  { id: 'exposure', label: 'Start a 30 second exposure', group: 'Actions', icon: 'action', keywords: ['capture', 'image', 'shoot', 'frame'], shortcut: ['E'], hint: 'One frame on the main camera, 30 s.' },
  { id: 'red-light', label: 'Switch to red light', group: 'Actions', icon: 'action', keywords: ['night vision', 'lamp', 'dark'], shortcut: ['R'], hint: 'Keeps your eyes dark adapted.' },
  { id: 'export-log', label: "Export tonight's log", group: 'Actions', icon: 'action', keywords: ['download', 'save', 'csv'], shortcut: ['X'], hint: 'Saves every frame and note from tonight.' },
  { id: 'park', label: 'Park the telescope', group: 'Actions', icon: 'action', keywords: ['home', 'stow', 'rest'], shortcut: ['P'], hint: 'Sends the mount to its rest position.' },
  { id: 'flats', label: 'Take calibration flats', group: 'Actions', icon: 'action', keywords: ['flat field', 'twilight'], hint: 'Ten flats against the dome screen.' },
  { id: 'tracking', label: 'Pause tracking', group: 'Actions', icon: 'action', keywords: ['stop', 'hold', 'mount'], shortcut: ['T'], hint: 'Holds the mount where it points now.' },
  { id: 'logbook', label: 'Logbook', group: 'Go to', icon: 'screen', keywords: ['notes', 'journal', 'history'], shortcut: ['G', 'L'], hint: 'Every night on record, newest first.' },
  { id: 'weather', label: 'Weather', group: 'Go to', icon: 'screen', keywords: ['wind', 'cloud', 'humidity', 'forecast'], shortcut: ['G', 'W'], hint: 'Wind, cloud and dew point, live.' },
  { id: 'equipment', label: 'Equipment', group: 'Go to', icon: 'screen', keywords: ['camera', 'mount', 'focuser', 'gear'], shortcut: ['G', 'E'], hint: 'Camera, mount and focuser status.' },
  { id: 'plan', label: "Tonight's plan", group: 'Go to', icon: 'screen', keywords: ['schedule', 'queue'], shortcut: ['G', 'P'], hint: 'The target queue in rising order.' },
  { id: 'settings', label: 'Settings', group: 'Go to', icon: 'screen', keywords: ['preferences', 'options', 'config'], shortcut: ['G', 'S'], hint: 'Site, units and alerts.' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', group: 'Help', icon: 'help', keywords: ['keys', 'hotkeys'], shortcut: ['?'], hint: 'Every key the console listens to.' },
  { id: 'checklist', label: 'Observing checklist', group: 'Help', icon: 'help', keywords: ['start', 'routine'], hint: 'The ten steps before first light.' },
  { id: 'fault', label: 'Report a fault', group: 'Help', icon: 'help', keywords: ['bug', 'problem', 'broken'], hint: 'Sends a note to the day crew.' },
  { id: 'about', label: 'About Domeboard', group: 'Help', icon: 'help', keywords: ['version', 'console'], hint: 'The night console of Lantern Point.' },
];

/** The demo's 23 commands; `onRun` hears the label of whatever runs. */
export function domeboardCommands(onRun: (label: string) => void): PaletteItem[] {
  return SPECS.map((spec) => ({ ...spec, run: () => onRun(spec.label) }));
}

/** A synthetic archive of numbered sky plates, so the demo can prove filtering speed at 1,000 items. */
export function skyPlates(count: number, onRun: (label: string) => void): PaletteItem[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(4, '0');
    const label = `Sky plate ${n}`;
    return {
      id: `plate-${n}`,
      label,
      group: 'Archive',
      icon: 'screen' as const,
      keywords: [`field ${(i % 48) + 1}`],
      hint: `Archived plate from field ${(i % 48) + 1}.`,
      run: () => onRun(label),
    };
  });
}
