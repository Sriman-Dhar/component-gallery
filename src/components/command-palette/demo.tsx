import { useEffect, useMemo, useRef, useState } from 'react';
import DemoShell from '../../shell/demo/DemoShell';
import { DEMO_CHIP } from '../../shell/demo/demoTheme';
import StateSwitch from '../../shell/demo/StateSwitch';
import CommandPalette from './CommandPalette';
import { DOMEBOARD_GROUPS, domeboardCommands, skyPlates } from './commands';
import { createRecentStore } from './recent';

const RECENT_KEY = 'domeboard:recent';
const MANY = 1000;

/** Domeboard, the night console of the invented Lantern Point Observatory, with its palette scoped to the stage. */
export default function CommandPaletteDemo() {
  const root = useRef<HTMLDivElement>(null);
  const store = useMemo(() => createRecentStore(RECENT_KEY), []);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [many, setMany] = useState(false);
  const [hasRecent, setHasRecent] = useState(() => store.read().length > 0);

  // Mount the overlay in the stage frame, so the 375 / 768 switcher frames the palette too.
  useEffect(() => {
    setStage(root.current?.closest<HTMLElement>('[data-stage-theme]') ?? null);
  }, []);

  const items = useMemo(() => {
    const base = domeboardCommands(setLastRun);
    return many ? [...base, ...skyPlates(MANY - base.length, setLastRun)] : base;
  }, [many]);

  return (
    <div ref={root} className="w-full">
      <DemoShell
        title="Domeboard"
        lede="Press Cmd+K or Ctrl+K, or use the button. Try typing roof, kesa or log."
        controls={
          <>
            <button
              type="button"
              disabled={!hasRecent}
              onClick={() => {
                store.clear();
                setHasRecent(false);
              }}
              className={DEMO_CHIP}
            >
              Clear recent
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
          onOpenChange={(open) => {
            if (!open) setHasRecent(store.read().length > 0);
          }}
        />
        <p role="status" className="min-h-6 font-mono text-[13px] leading-6 text-[rgb(var(--demo-fg)/0.72)]">
          {lastRun ? `Last run: ${lastRun}` : 'Nothing run yet tonight.'}
        </p>
      </DemoShell>
    </div>
  );
}
