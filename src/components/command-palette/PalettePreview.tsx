import { Keycaps } from './PaletteRow';
import type { PaletteItem } from './types';

/** A stable angle per item, so each command's body always sits at the same place on its orbit. */
function orbitAngle(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 3600;
  return (h / 10) * (Math.PI / 180);
}

/** A small orbit: the amber key body at the centre, a tilted orbit in the cool rim, the item's body on it (none when empty). */
function OrbitGlyph({ item }: { item: PaletteItem | null }) {
  const a = item ? orbitAngle(item.id) : 0;
  const x = 60 + 46 * Math.cos(a);
  const y = 60 + 17 * Math.sin(a);
  const behind = Math.sin(a) < 0;
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" width="112" height="112" className="shrink-0">
      <g transform="rotate(-18 60 60)">
        <ellipse cx="60" cy="60" rx="46" ry="17" fill="none" stroke="rgb(var(--pal-rim) / 0.55)" strokeWidth="1" />
        <ellipse cx="60" cy="60" rx="30" ry="11" fill="none" stroke="rgb(var(--pal-rim) / 0.25)" strokeWidth="1" strokeDasharray="2 4" />
        {item && behind ? <circle cx={x} cy={y} r="4.5" fill="rgb(var(--pal-ink))" /> : null}
        <circle cx="60" cy="60" r="12" fill="rgb(var(--pal-key) / 0.16)" />
        <circle cx="60" cy="60" r="6" fill="rgb(var(--pal-key))" />
        {item && !behind ? <circle cx={x} cy={y} r="4.5" fill="rgb(var(--pal-ink))" /> : null}
        {item?.icon === 'target' ? <circle cx={x} cy={y} r="9" fill="none" stroke="rgb(var(--pal-edge))" strokeWidth="1" /> : null}
      </g>
    </svg>
  );
}

/**
 * Desktop preview of the active item: its orbit, group, name (the palette's one display line), the one-line hint and
 * its shortcut. Visual only: the hint is also read out as part of the option, so this pane is hidden from AT.
 */
export default function PalettePreview({ item }: { item: PaletteItem | null }) {
  return (
    <aside
      aria-hidden="true"
      className="flex w-[232px] shrink-0 flex-col gap-4 border-l border-[rgb(var(--pal-line))] bg-[rgb(var(--pal-surface-2)/0.5)] px-5 py-5"
    >
      {item ? (
        <>
          <OrbitGlyph item={item} />
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-[rgb(var(--pal-rim))]">{item.group}</p>
            <p className="font-display text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-[rgb(var(--pal-ink))]">{item.label}</p>
          </div>
          {item.hint ? <p className="text-[13px] leading-5 text-[rgb(var(--pal-ink-2))]">{item.hint}</p> : null}
          {item.shortcut ? (
            <div className="mt-auto flex items-center gap-2 text-[12px] text-[rgb(var(--pal-ink-2))]">
              Shortcut <Keycaps keys={item.shortcut} />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <OrbitGlyph item={null} />
          <p className="text-[13px] leading-5 text-[rgb(var(--pal-ink-2))]">No command selected.</p>
        </>
      )}
    </aside>
  );
}
