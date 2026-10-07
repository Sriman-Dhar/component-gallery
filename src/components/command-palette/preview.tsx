import CommandPalette from './CommandPalette';
import { DOMEBOARD_GROUPS, domeboardCommands } from './commands';

const ITEMS = domeboardCommands(() => undefined);

/**
 * Gallery tile close crop: the palette open and still, mid search for "dome" with the light on "Open the dome".
 * Static (no listeners, no focus moves) and hotkey off, so the index never answers Cmd+K. 264px tall: the widest tile
 * (a detail page's previous / next, scaled to 0.83) still fits it whole in its 220px stage, like the index tile does.
 */
export default function CommandPalettePreview() {
  return (
    <div className="h-[264px] w-[640px]">
      <CommandPalette items={ITEMS} groupOrder={DOMEBOARD_GROUPS} hotkey={false} staticOpen initialQuery="dome" recentKey="command-palette:preview" />
    </div>
  );
}
