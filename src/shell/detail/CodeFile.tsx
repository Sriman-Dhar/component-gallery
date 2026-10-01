import { useId, useRef, useState } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import type { SourceFile } from '../../lib/types';
import CopyButton from '../CopyButton';
import { FOCUS_RING } from '../focus';

interface Props {
  file: SourceFile;
  /** The first file opens expanded; the rest wait behind "Show file". */
  defaultOpen?: boolean;
}

/**
 * One source file, collapsible. The header always shows the name, line count, the toggle and Copy
 * (copy works while collapsed). Each time the body opens, a 2px accent line scans it top to bottom once.
 */
export default function CodeFile({ file, defaultOpen = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const bodyId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const lines = file.code.replace(/\n$/, '').split('\n');

  useGSAP(
    () =>
      withMotion(() => {
        if (!open) return;
        gsap
          .timeline(defaultOpen ? { scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } } : {})
          .from('.code-body', { opacity: 0.25, duration: 0.6, ease: 'power1.out' })
          .fromTo('.code-scan', { top: '0%', autoAlpha: 1 }, { top: '100%', duration: 0.6, ease: 'power1.inOut' }, 0)
          .to('.code-scan', { autoAlpha: 0, duration: 0.15 });
      }),
    { scope: root, dependencies: [open], revertOnUpdate: true },
  );

  return (
    <figure ref={root} className="overflow-hidden rounded-tile bg-surface shadow-[0_0_0_1px_rgb(var(--color-line))]">
      <figcaption className={`flex items-center justify-between gap-3 bg-surface-2/60 px-4 py-2.5 ${open ? 'border-b border-line' : ''}`}>
        {/* Never truncated and never broken inside the name; below sm the line count takes its own line. */}
        <span className="flex min-w-0 flex-col font-mono text-meta sm:flex-row sm:items-baseline sm:gap-3">
          <span className="whitespace-nowrap text-text">{file.fileName}</span>
          <span className="text-text-2">{lines.length} lines</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            aria-label={`${open ? 'Hide' : 'Show'} ${file.fileName}`}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-control px-3 font-mono text-meta text-text-2 transition-colors duration-fast hover:text-text max-[399px]:px-0 sm:h-8 ${FOCUS_RING}`}
          >
            {/* Below 400px the toggle is a chevron alone, so the file name keeps the line. */}
            <span className="max-[399px]:hidden">{open ? 'Hide file' : 'Show file'}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className={`hidden h-3.5 w-3.5 transition-transform duration-fast max-[399px]:block motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4.5 6 7.5l3-3" />
            </svg>
          </button>
          <CopyButton text={file.code} label="Copy" ariaLabel={`Copy ${file.fileName}`} />
        </span>
      </figcaption>
      <div id={bodyId} hidden={!open} className="relative">
        {open ? (
          // Capped height with its own scroll, so a long file never stretches the page; focusable to scroll by keyboard.
          <pre
            tabIndex={0}
            aria-label={`${file.fileName} source`}
            className={`code-body max-h-[min(70vh,720px)] overflow-auto p-5 font-mono text-[13px] leading-[20px] text-text outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent`}
          >
            <code>
              {lines.map((line, i) => (
                <span key={i} className="block min-h-[20px]">
                  {line}
                </span>
              ))}
            </code>
          </pre>
        ) : null}
        <div aria-hidden="true" className="code-scan pointer-events-none invisible absolute inset-x-0 top-0" />
      </div>
    </figure>
  );
}
