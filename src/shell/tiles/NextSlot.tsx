import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { weekOpens } from '../../lib/ruler';
import { useFrameTheme } from '../../lib/theme';

/**
 * The next open week, as a tile the same size as a shipped one: an unlit stage (the grid barely
 * there) with one node breathing in the dark, waiting for its component, and one line. The grid closes
 * its row instead of leaving a void. Reduced motion: the node rests half lit.
 */
export default function NextSlot({ week }: { week: number }) {
  const root = useRef<HTMLLIElement>(null);
  const theme = useFrameTheme();

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.8, ease: 'sine.inOut' } })
          .fromTo('.next-halo', { scale: 0.6, opacity: 0.25 }, { scale: 1.3, opacity: 0.9 }, 0)
          .fromTo('.next-node', { opacity: 0.45 }, { opacity: 1 }, 0);
      }),
    { scope: root },
  );

  return (
    <li ref={root} className="tile flex flex-col overflow-hidden rounded-tile border border-dashed border-line">
      <div aria-hidden="true" data-stage-theme={theme} className="relative h-[220px] border-b border-dashed border-line">
        <div className="stage-surface stage-unlit absolute inset-0" />
        <span className="absolute left-1/2 top-1/2 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center">
          <span className="next-halo absolute inset-0 rounded-full opacity-50" />
          <span className="next-node relative block h-2 w-2 rounded-full bg-glow opacity-70" />
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end p-5">
        <p className="font-display text-[22px] font-medium leading-7 tracking-normal text-text-2">Next: Week {week}</p>
        <p className="mt-1 font-mono text-meta text-text-2">Opens {weekOpens(week)}.</p>
      </div>
    </li>
  );
}
