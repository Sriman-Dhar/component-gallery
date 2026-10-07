import CommandPalette from './CommandPalette';
import { DOMEBOARD_GROUPS, domeboardCommands } from './commands';

const ITEMS = domeboardCommands(() => undefined);

/**
 * Gallery tile close crop: the palette open and still, mid search for "dom" with the light on "Open the dome".
 * Static (no listeners, no focus moves) and hotkey off, so the index never answers Cmd+K.
 */
export default function CommandPalettePreview() {
  return (
    <div className="h-[380px] w-[640px]">
      <CommandPalette items={ITEMS} groupOrder={DOMEBOARD_GROUPS} hotkey={false} staticOpen initialQuery="dom" recentKey="command-palette:preview" />
    </div>
  );
}
