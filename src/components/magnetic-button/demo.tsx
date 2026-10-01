import { useEffect, useRef, useState } from 'react';
import DemoShell from '../../shell/demo/DemoShell';
import StateSwitch from '../../shell/demo/StateSwitch';
import MagneticButton from './MagneticButton';

const HINT = 'Bring the pointer close, or press Tab to reach it.';
const JOINED = 'You are on the list.';
/** How long the joined caption stays before the hint returns. */
const JOINED_MS = 3000;

/** A waitlist hero in miniature: the button, plus switches that hold the loading and disabled states. */
export default function MagneticButtonDemo() {
  const [holdLoading, setHoldLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [joined, setJoined] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const join = () => {
    clearTimers();
    setJoined(false);
    setPending(true);
    timers.current.push(
      window.setTimeout(() => {
        setPending(false);
        setJoined(true);
        timers.current.push(window.setTimeout(() => setJoined(false), JOINED_MS));
      }, 1600),
    );
  };

  return (
    <DemoShell
      title="Get early access"
      controls={
        <>
          <StateSwitch label="Loading" on={holdLoading} onToggle={() => setHoldLoading((v) => !v)} />
          <StateSwitch label="Disabled" on={disabled} onToggle={() => setDisabled((v) => !v)} />
          <p className="basis-full text-[13px] leading-5 text-[rgb(var(--demo-fg)/0.64)]">
            {holdLoading
              ? 'Loading is held: the spinner stays and clicks are ignored until you turn it off.'
              : 'Loading holds the spinner on so you can inspect it. Disabled blocks the pull and the click.'}
          </p>
        </>
      }
    >
      <MagneticButton
        loading={holdLoading || pending}
        disabled={disabled}
        onClick={join}
        busyText="Joining the waitlist"
        doneText="You are on the list"
      >
        Join the waitlist
      </MagneticButton>
      <p className="min-h-5 text-[14px] leading-5 text-[rgb(var(--demo-fg)/0.72)]">{joined ? JOINED : HINT}</p>
    </DemoShell>
  );
}
