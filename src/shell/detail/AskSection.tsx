import { useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import CopyButton from '../CopyButton';
import { FOCUS_RING } from '../focus';

/** Collapsed, the prompt shows this many 24px lines and fades out under the last one. */
const PREVIEW_LINES = 8;
const LINE_PX = 24;

/**
 * "The ask": the final prompt. Copy sits at the top of the section; the text runs wide and opens
 * collapsed to its first eight lines, with "Show full prompt" to read the rest. Fades in once.
 */
export default function AskSection({ prompt }: { prompt: string }) {
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLPreElement>(null);
  const bodyId = useId();
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(true);

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.ask-body', {
          opacity: 0,
          y: 8,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });
      }),
    { scope: root },
  );

  // Short prompts never get a toggle: measured once against the collapsed height.
  useLayoutEffect(() => {
    const el = body.current;
    if (el) setOverflows(el.scrollHeight > PREVIEW_LINES * LINE_PX + 4);
  }, [prompt]);

  const collapsed = overflows && !open;
  return (
    <section ref={root} aria-labelledby="the-ask" className="space-y-5 border-t border-line pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="the-ask" className="text-h2 font-semibold text-text">
          The ask
        </h2>
        <CopyButton text={prompt} label="Copy prompt" />
      </div>
      <div className="ask-body relative">
        <pre
          ref={body}
          id={bodyId}
          className="max-w-[112ch] overflow-hidden whitespace-pre-wrap break-words border-l-2 border-accent/60 pl-5 font-mono text-small leading-[24px] text-text"
          style={collapsed ? { maxHeight: PREVIEW_LINES * LINE_PX } : undefined}
        >
          {prompt}
        </pre>
        {collapsed ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
        ) : null}
      </div>
      {overflows ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
          className={`h-11 rounded-control border border-line px-3 sm:h-8 font-mono text-meta text-text transition-colors duration-fast hover:border-text-2 ${FOCUS_RING}`}
        >
          {open ? 'Show less' : 'Show full prompt'}
        </button>
      ) : null}
    </section>
  );
}
