import { useEffect, useRef, useState } from 'react';
import DemoShell from '../../shell/demo/DemoShell';
import { DEMO_CHIP } from '../../shell/demo/demoTheme';
import StateSwitch from '../../shell/demo/StateSwitch';
import OtpInput from './OtpInput';

/** The demo accepts one code. Anything else is rejected, so the error path is one wrong digit away. */
const DEMO_CODE = '246810';
const REJECTED = 'That code did not match. Try again.';
const CHECK_MS = 1100;
/** The success sweep plays on the cells before the accepted message replaces them. */
const SWEEP_MS = 700;
const COPIED_MS = 2000;

type Phase = 'entry' | 'verifying' | 'success' | 'accepted';

/** A sign-in verification step: the code row, plus quiet controls to copy the code, force an error, or disable the field. */
export default function OtpInputDemo() {
  const [phase, setPhase] = useState<Phase>('entry');
  const [holdDisabled, setHoldDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number>();
  const submitted = useRef('');
  const startOver = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  // Each phase owns its own timer and the effect cleanup cancels it, so no edit, remount or second
  // completion can drop the step from success to accepted.
  useEffect(() => {
    if (phase === 'accepted') {
      startOver.current?.focus({ preventScroll: true });
      return;
    }
    if (phase === 'entry') return;
    const timer = window.setTimeout(() => {
      if (phase === 'success') return setPhase('accepted');
      if (submitted.current === DEMO_CODE) return setPhase('success');
      setPhase('entry');
      setError(REJECTED);
    }, phase === 'verifying' ? CHECK_MS : SWEEP_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  /** One check at a time: a completion outside the entry phase is ignored. */
  const verify = (code: string) => {
    if (phase !== 'entry' || error) return;
    submitted.current = code;
    setPhase('verifying');
  };

  const copyCode = async () => {
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(DEMO_CODE);
      setCopied(true);
      copyTimer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => {
    setError(null);
    setPhase('entry');
    setRound((n) => n + 1);
  };

  const settled = phase !== 'entry';

  return (
    <DemoShell
      title="Check your phone"
      lede={`We sent a six-digit code to the number ending 4821. For this demo it is ${DEMO_CODE}.`}
      controls={
        <>
          <button type="button" onClick={copyCode} className={`${DEMO_CHIP} min-w-[10.5rem] justify-center`}>
            {copied ? 'Copied, now paste it' : 'Copy the demo code'}
          </button>
          <button type="button" onClick={() => setError(REJECTED)} disabled={settled} className={DEMO_CHIP}>
            Show the error
          </button>
          <StateSwitch label="Disabled" on={holdDisabled} onToggle={() => setHoldDisabled((v) => !v)} disabled={settled} />
        </>
      }
    >
      {phase === 'accepted' ? (
        <div role="status" className="flex min-h-[144px] w-full flex-col items-start justify-center gap-3">
          <p className="text-[20px] font-semibold leading-7">Code accepted. You are signed in.</p>
          <button ref={startOver} type="button" onClick={restart} className={DEMO_CHIP}>
            Start over
          </button>
        </div>
      ) : (
        <div className="min-h-[144px] w-full">
          <OtpInput
            key={round}
            autoFocus
            onComplete={verify}
            verifying={phase === 'verifying'}
            success={phase === 'success'}
            disabled={holdDisabled}
            error={error}
            onErrorReset={() => setError(null)}
          />
        </div>
      )}
    </DemoShell>
  );
}
