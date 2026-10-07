import { useRef, useState } from 'react';
import { DEMO_CHIP, DEMO_THEME } from '../../shell/demo/demoTheme';
import StateSwitch from '../../shell/demo/StateSwitch';
import TiltProductCard from './TiltProductCard';

/** The demo bag answers after this long, so the adding state is visible. */
const ADD_MS = 900;
/** Stacked on a narrow stage; on a wide one the case leads at the top left and the copy sits beside it. */
const LAYOUT =
  'grid w-full justify-center gap-x-14 gap-y-8 [grid-template-areas:"head"_"card"_"foot"] [@container(min-width:760px)]:[grid-template-areas:"card_head"_"card_foot"] [@container(min-width:760px)]:[grid-template-columns:380px_minmax(0,360px)] [@container(min-width:760px)]:[grid-template-rows:auto_1fr]';

/**
 * The card in a small shop moment: a bag count under it, plus Sold out, Fail next add and Reset bag controls.
 * Same type, chips and controls row as every DemoShell demo; laid out so the case is in the first view at 1440x900.
 */
export default function TiltProductCardDemo() {
  const [bag, setBag] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const failing = useRef(false);
  failing.current = failNext;

  const addToBag = () =>
    new Promise<void>((resolve, reject) => {
      window.setTimeout(() => {
        // The failure path, on demand: one add fails, then the switch turns itself off.
        if (failing.current) {
          setFailNext(false);
          reject(new Error('The demo bag refused this add.'));
          return;
        }
        setBag((n) => n + 1);
        resolve();
      }, ADD_MS);
    });

  return (
    <div className={`${DEMO_THEME} w-full font-sans text-[rgb(var(--demo-fg))] [container-type:inline-size]`}>
      <div className={LAYOUT}>
        <div className="flex max-w-[440px] flex-col gap-2 [grid-area:head]">
          <p className="text-[28px] font-semibold leading-8 tracking-[-0.02em]">Display case</p>
          <p className="text-[16px] leading-6 text-[rgb(var(--demo-fg)/0.72)]">
            <span className="[@media(pointer:coarse)]:hidden">Move your pointer across the case: only the case turns, the text stays put.</span>
            <span className="hidden [@media(pointer:coarse)]:inline">On a phone the case holds still and stays fully usable.</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 [grid-area:card]">
          <TiltProductCard soldOut={soldOut} onAddToBag={addToBag} bagCount={bag} />
          <p className="min-h-6 font-mono text-[13px] leading-6 tabular-nums text-[rgb(var(--demo-fg)/0.72)]">In your bag: {bag}</p>
        </div>
        <div
          role="group"
          aria-label="Demo controls"
          className="flex flex-wrap content-start items-center gap-2 border-t border-[rgb(var(--demo-fg)/0.1)] pt-4 [grid-area:foot]"
        >
          <StateSwitch label="Sold out" on={soldOut} onToggle={() => setSoldOut((v) => !v)} />
          <StateSwitch label="Fail next add" on={failNext} onToggle={() => setFailNext((v) => !v)} />
          <button type="button" onClick={() => setBag(0)} disabled={bag === 0} className={DEMO_CHIP}>
            Reset bag
          </button>
        </div>
      </div>
    </div>
  );
}
