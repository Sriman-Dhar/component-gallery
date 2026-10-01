import { useEffect, useRef, useState } from 'react';
import MagneticButton from './MagneticButton';

/** Demo chrome reads the stage's colours; the button itself only reads its own properties. */
const DEMO_THEME =
  '[--demo-fg:var(--stage-fg,18_18_22)] [--demo-ring:var(--p-amber-700,173_74_5)] [[data-stage-theme=dark]_&]:[--demo-ring:var(--p-amber-500,255_138_42)]';

/** A waitlist hero in miniature: the button, plus switches that hold the loading and disabled states. */
export default function MagneticButtonDemo() {
  const [holdLoading, setHoldLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const join = () => {
    setPending(true);
    timer.current = window.setTimeout(() => {
      setPending(false);
      setJoined(true);
    }, 1600);
  };

  return (
    <div className={`${DEMO_THEME} flex w-full max-w-[560px] flex-col items-center gap-12 py-6 font-sans text-[rgb(var(--demo-fg))]`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-[28px] font-semibold leading-8 tracking-[-0.02em]">Get early access</p>
        <MagneticButton
          loading={holdLoading || pending}
          disabled={disabled}
          onClick={join}
          busyText="Joining the waitlist"
          doneText="You are on the list"
        >
          Join the waitlist
        </MagneticButton>
        <p className="min-h-5 text-[14px] leading-5 text-[rgb(var(--demo-fg)/0.72)]">
          {joined ? 'You are on the list.' : 'Bring the pointer close, or press Tab to reach it.'}
        </p>
      </div>
      <div role="group" aria-label="Demo states" className="flex flex-wrap justify-center gap-3">
        <StateSwitch label="Loading" on={holdLoading} onToggle={() => setHoldLoading((v) => !v)} />
        <StateSwitch label="Disabled" on={disabled} onToggle={() => setDisabled((v) => !v)} />
      </div>
    </div>
  );
}

function StateSwitch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="inline-flex min-h-[44px] items-center gap-3 rounded-full border border-[rgb(var(--demo-fg)/0.18)] px-4 text-[14px] font-medium outline-none transition-colors duration-200 hover:border-[rgb(var(--demo-fg)/0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--demo-ring))]"
    >
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full border-[1.5px] border-[rgb(var(--demo-fg)/0.6)] transition-colors duration-200 ${on ? 'bg-[rgb(var(--demo-fg))]' : ''}`}
      >
        <span
          className={`absolute left-[2px] top-[2px] h-3 w-3 rounded-full transition-transform duration-200 motion-reduce:transition-none ${
            on ? 'translate-x-[17px] bg-[rgb(var(--stage-bg,246_246_248))]' : 'bg-[rgb(var(--demo-fg)/0.6)]'
          }`}
        />
      </span>
      {label}
    </button>
  );
}
