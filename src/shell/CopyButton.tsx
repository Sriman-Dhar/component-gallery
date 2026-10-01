import { useEffect, useRef, useState } from 'react';
import { gsap, motionAllowed } from '../lib/motion';
import { FOCUS_RING } from './focus';

type CopyState = 'idle' | 'copied' | 'unavailable';

interface Props {
  text: string;
  label: string;
  /** Accessible name when the visible label is short, e.g. "Copy ExampleButton.tsx". */
  ariaLabel?: string;
}

const BLOCKED = 'Clipboard blocked, select the text instead';

/** Copies text; the label morphs to "Copied" with a scale pop for 1.5s. Falls back to a plain instruction. */
export default function CopyButton({ text, label, ariaLabel }: Props) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number>();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(text);
      setState('copied');
      if (motionAllowed() && button.current) {
        gsap.fromTo(button.current, { scale: 0.92 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', clearProps: 'transform' });
      }
    } catch {
      setState('unavailable');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1500);
  }

  const copied = state === 'copied';
  return (
    <span className="inline-flex items-center gap-3">
      {state === 'unavailable' ? <span className="text-meta text-text-2">{BLOCKED}</span> : null}
      <button
        ref={button}
        type="button"
        onClick={copy}
        aria-label={ariaLabel}
        className={`h-11 min-w-[5.5rem] sm:h-8 rounded-control border px-3 font-mono text-meta transition-colors duration-fast ${
          copied ? 'border-accent/60 text-accent' : 'border-line text-text hover:border-text-2'
        } ${FOCUS_RING}`}
      >
        {copied ? 'Copied' : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </span>
  );
}
