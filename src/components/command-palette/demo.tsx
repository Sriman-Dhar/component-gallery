import { useEffect, useMemo, useRef, useState } from 'react';
import DemoShell from '../../shell/demo/DemoShell';
import { DEMO_CHIP } from '../../shell/demo/demoTheme';
import StateSwitch from '../../shell/demo/StateSwitch';
import CommandPalette from './CommandPalette';
import { commandLabel, DOMEBOARD_GROUPS, domeboardCommands, skyPlates } from './commands';
import { createRecentStore } from './recent';

const RECENT_KEY = 'domeboard:recent';
const MANY = 1000;

/** The status line comes from the stored recent list, so after a reload or a clear it agrees with the palette's Recent. */
function lastRunOf(ids: string[]): string | null {
  return ids.length > 0 ? commandLabel(ids[0]) : null;
}

/** Domeboard, the night console of the invented Lantern Point Observatory, with its palette scoped to the stage. */
export default function CommandPaletteDemo() {
  const root = useRef<HTMLDivElement>(null);
  const store = useMemo(() => createRecentStore(RECENT_KEY), []);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const [headerBottom, setHeaderBottom] = useState(0);
  const [lastRun, setLastRun] = useState<string | null>(() => lastRunOf(store.read()));
  const [many, setMany] = useState(false);
  const [hasRecent, setHasRecent] = useState(() => store.read().length > 0);

  // Mount the overlay in the stage frame, so the 375 / 768 switcher frames the palette too. On touch the palette
  // mounts on the page instead, as a sheet under the site's sticky header (the first header on the page).
  useEffect(() => {
    setStage(root.current?.closest<HTMLElement>('[data-stage-theme]') ?? null);
    setHeaderBottom(document.querySelector('header')?.offsetHeight ?? 0);
  }, []);

  const items = useMemo(() => {
    const ran = (label: string) => {
      setLastRun(label);
      setHasRecent(true);
    };
    const base = domeboardCommands(ran);
    return many ? [...base, ...skyPlates(MANY - base.length, ran)] : base;
  }, [many]);

  return (
    <div ref={root} className="w-full">
      <DemoShell
        title="Domeboard"
        lede={
          <>
            <span className="[@media(pointer:coarse)]:hidden">Press Cmd+K or Ctrl+K, or use the button. Try roof, kesa or log; with it closed, press C or G then L.</span>
            <span className="hidden [@media(pointer:coarse)]:inline">Tap the button. Try typing roof, kesa or log.</span>
          </>
        }
        controls={
          <>
            <button
              type="button"
              disabled={!hasRecent}
              onClick={() => {
                store.clear();
                setHasRecent(false);
                setLastRun(null);
              }}
              className={DEMO_CHIP}
            >
              Reset recent
            </button>
            <StateSwitch label="Many items" on={many} onToggle={() => setMany((v) => !v)} />
          </>
        }
      >
        <CommandPalette
          items={items}
          groupOrder={[...DOMEBOARD_GROUPS, 'Archive']}
          triggerLabel="Search Domeboard"
          recentKey={RECENT_KEY}
          container={stage}
          sheetTop={headerBottom}
          onOpenChange={(open) => {
            if (open) return;
            // A clear from inside the palette resets the line too; a run sets it right after this, from its own callback.
            const ids = store.read();
            setHasRecent(ids.length > 0);
            setLastRun(lastRunOf(ids));
          }}
        />
        <p role="status" className="min-h-6 font-mono text-[13px] leading-6 text-[rgb(var(--demo-fg)/0.72)]">
          {lastRun ? `Last run: ${lastRun}` : 'Nothing run yet tonight.'}
        </p>
      </DemoShell>
    </div>
  );
}
