import { useState } from 'react';
import DemoShell from '../../shell/demo/DemoShell';
import { DEMO_CHIP } from '../../shell/demo/demoTheme';
import StateSwitch from '../../shell/demo/StateSwitch';
import TiltProductCard from './TiltProductCard';

/** The demo bag answers after this long, so the adding state is visible. */
const ADD_MS = 900;

/** The card in a small shop moment: a bag count under it, plus Sold out and Reset bag controls. */
export default function TiltProductCardDemo() {
  const [bag, setBag] = useState(0);
  const [soldOut, setSoldOut] = useState(false);

  const addToBag = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setBag((n) => n + 1);
        resolve();
      }, ADD_MS);
    });

  return (
    <DemoShell
      title="Armilla No. 3"
      lede="Move your pointer across the case. On a phone it holds still and stays fully usable."
      controls={
        <>
          <StateSwitch label="Sold out" on={soldOut} onToggle={() => setSoldOut((v) => !v)} />
          <button type="button" onClick={() => setBag(0)} disabled={bag === 0} className={DEMO_CHIP}>
            Reset bag
          </button>
        </>
      }
    >
      <TiltProductCard soldOut={soldOut} onAddToBag={addToBag} bagCount={bag} />
      <p className="min-h-6 font-mono text-[13px] leading-6 tabular-nums text-[rgb(var(--demo-fg)/0.72)]">
        In your bag: {bag}
      </p>
    </DemoShell>
  );
}
