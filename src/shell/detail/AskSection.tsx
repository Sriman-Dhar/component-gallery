import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import CopyButton from '../CopyButton';

/** "The ask": the final prompt, always visible. Its lines stagger in once (18ms each), then hold still. */
export default function AskSection({ prompt }: { prompt: string }) {
  const root = useRef<HTMLElement>(null);
  const lines = prompt.split('\n');

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.ask-line', {
          autoAlpha: 0,
          y: 8,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.018,
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });
      }),
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="the-ask" className="grid grid-cols-1 gap-y-4 border-t border-line pt-10 lg:grid-cols-12 lg:gap-x-8">
      <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:flex-col lg:items-start">
        <h2 id="the-ask" className="text-h2 font-semibold text-text">
          The ask
        </h2>
        <CopyButton text={prompt} label="Copy prompt" />
      </div>
      <pre className="max-w-column whitespace-pre-wrap break-words border-l-2 border-accent/60 pl-5 font-mono text-small leading-[24px] text-text lg:col-span-9">
        {lines.map((line, i) => (
          <span key={i} className="ask-line block min-h-[24px]">
            {line}
          </span>
        ))}
      </pre>
    </section>
  );
}
