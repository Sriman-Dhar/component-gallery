import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import type { SourceFile } from '../../lib/types';
import CopyButton from '../CopyButton';

/** One source file. On first reveal a 2px accent line scans top to bottom once (600ms), then it is still. */
export default function CodeFile({ file }: { file: SourceFile }) {
  const root = useRef<HTMLElement>(null);
  const lines = file.code.replace(/\n$/, '').split('\n');

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
          .from('.code-body', { autoAlpha: 0.25, duration: 0.6, ease: 'power1.out' })
          .fromTo('.code-scan', { top: '0%', autoAlpha: 1 }, { top: '100%', duration: 0.6, ease: 'power1.inOut' }, 0)
          .to('.code-scan', { autoAlpha: 0, duration: 0.15 });
      }),
    { scope: root },
  );

  return (
    <figure ref={root} className="overflow-hidden rounded-tile bg-surface shadow-[0_0_0_1px_rgb(var(--color-line))]">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span className="truncate font-mono text-meta text-text">{file.fileName}</span>
        <CopyButton text={file.code} label="Copy" ariaLabel={`Copy ${file.fileName}`} />
      </figcaption>
      <div className="relative">
        <pre className="code-body overflow-x-auto p-5 font-mono text-[13px] leading-[20px] text-text">
          <code>
            {lines.map((line, i) => (
              <span key={i} className="block min-h-[20px]">
                {line}
              </span>
            ))}
          </code>
        </pre>
        <div aria-hidden="true" className="code-scan pointer-events-none invisible absolute inset-x-0 top-0" />
      </div>
    </figure>
  );
}
