import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

interface Props {
  /** The h2 id; the section points its aria-labelledby here. */
  id: string;
  children: string;
  /** A control that sits at the end of the hairline (Copy prompt). */
  action?: ReactNode;
}

/**
 * A station on the rail: a lit node, the heading in the wide display face, and a hairline that runs to the
 * edge. As the section first scrolls in, the node blooms and the hairline draws out from it, once.
 */
export default function SectionHeading({ id, children, action }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
          .from('.sh-node', { scale: 0, duration: 0.35, ease: 'back.out(3)' })
          .from('.sh-halo', { scale: 0.2, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0)
          .from('.sh-line', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8, ease: 'power3.out' }, 0.1);
      }),
    { scope: root },
  );

  return (
    <div ref={root} className="flex items-center gap-4">
      <span aria-hidden="true" className="relative inline-flex h-3 w-3 shrink-0 items-center justify-center">
        <span className="sh-halo absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--color-accent)/0.45),transparent)]" />
        <span className="sh-node rail-lit relative h-2.5 w-2.5 rounded-full bg-glow" />
      </span>
      <h2 id={id} tabIndex={-1} className="shrink-0 scroll-mt-28 outline-none font-display text-[26px] font-bold leading-[34px] tracking-[-0.025em] text-text">
        {children}
      </h2>
      <span
        aria-hidden="true"
        className="sh-line h-px min-w-6 flex-1 bg-gradient-to-r from-accent/70 via-line to-line/40"
      />
      {action ? <span className="shrink-0">{action}</span> : null}
    </div>
  );
}
