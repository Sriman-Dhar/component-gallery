import { useEffect, useRef, useState } from 'react';
import OtpInput from './OtpInput';

/** The demo accepts one code. Anything else is rejected, so the error path is one wrong digit away. */
const DEMO_CODE = '246810';
const REJECTED = 'That code did not match. Try again.';

const DEMO_THEME =
  '[--demo-fg:var(--stage-fg,18_18_22)] [--demo-ring:var(--p-amber-700,173_74_5)] [[data-stage-theme=dark]_&]:[--demo-ring:var(--p-amber-500,255_138_42)]';
const CHIP =
  'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgb(var(--demo-fg)/0.18)] px-4 text-[14px] font-medium outline-none transition-colors duration-200 hover:border-[rgb(var(--demo-fg)/0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--demo-ring))] disabled:opacity-50';

/** A sign-in verification step: the code row, plus controls to copy the code, hold the disabled state, or force an error. */
export default function OtpInputDemo() {
  const [verifying, setVerifying] = useState(false);
  const [holdDisabled, setHoldDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [round, setRound] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const verify = (code: string) => {
    setVerifying(true);
    timer.current = window.setTimeout(() => {
      setVerifying(false);
      if (code === DEMO_CODE) setAccepted(true);
      else setError(REJECTED);
    }, 1100);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_CODE);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => {
    setAccepted(false);
    setRound((n) => n + 1);
  };

  return (
    <div className={`${DEMO_THEME} flex w-full max-w-[460px] flex-col gap-8 py-4 font-sans text-[rgb(var(--demo-fg))]`}>
      <div className="flex flex-col gap-2">
        <p className="text-[28px] font-semibold leading-8 tracking-[-0.02em]">Check your phone</p>
        <p className="text-[16px] leading-6 text-[rgb(var(--demo-fg)/0.72)]">
          We sent a 6 digit code to the number ending 4821. For this demo it is {DEMO_CODE}.
        </p>
      </div>

      {accepted ? (
        <div role="status" className="flex min-h-[144px] flex-col items-start justify-center gap-3">
          <p className="text-[20px] font-semibold leading-7">Code accepted. You are signed in.</p>
          <button type="button" onClick={restart} className={CHIP}>
            Start over
          </button>
        </div>
      ) : (
        <div className="min-h-[144px]">
          <OtpInput
            key={round}
            onComplete={verify}
            disabled={verifying || holdDisabled}
            error={error}
            onErrorReset={() => setError(null)}
            hint={verifying ? 'Checking the code' : undefined}
          />
        </div>
      )}

      <div role="group" aria-label="Demo controls" className="flex flex-wrap gap-3">
        <button type="button" onClick={copyCode} className={CHIP}>
          {copied ? 'Code copied, now paste it' : 'Copy the demo code'}
        </button>
        <button type="button" onClick={() => setError(REJECTED)} disabled={accepted || verifying} className={CHIP}>
          Show the error
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={holdDisabled}
          onClick={() => setHoldDisabled((v) => !v)}
          className={CHIP}
        >
          <span
            aria-hidden="true"
            className={`h-3 w-3 rounded-full border-[1.5px] border-[rgb(var(--demo-fg)/0.6)] ${holdDisabled ? 'bg-[rgb(var(--demo-fg))]' : ''}`}
          />
          Disabled
        </button>
      </div>
    </div>
  );
}
