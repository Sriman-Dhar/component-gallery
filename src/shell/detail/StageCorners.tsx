import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/** Each corner: where it sits, and which way its two arms grow out from the corner point. */
const CORNERS = [
  { at: 'left-2 top-2', h: 'left-0 top-0 origin-left', v: 'left-0 top-0 origin-top' },
  { at: 'right-2 top-2', h: 'right-0 top-0 origin-right', v: 'right-0 top-0 origin-top' },
  { at: 'bottom-2 right-2', h: 'bottom-0 right-0 origin-right', v: 'bottom-0 right-0 origin-bottom' },
  { at: 'bottom-2 left-2', h: 'bottom-0 left-0 origin-left', v: 'bottom-0 left-0 origin-bottom' },
];

/**
 * Four lit corner marks on the stage frame. On mount the light traces round the frame once, corner by
 * corner (top left, top right, bottom right, bottom left), flares and settles dim. Reduced motion: settled.
 */
export default function StageCorners() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        // Settle to the theme's own rest opacity (the dark stage burns brighter), then hand back to CSS.
        const rest = Number(getComputedStyle(root.current!.querySelector('.sc-corner')!).opacity);
        gsap
          .timeline({ delay: 0.45 })
          .from('.sc-arm', { scale: 0, duration: 0.32, ease: 'power3.out', stagger: 0.07 })
          .fromTo('.sc-corner', { opacity: 1 }, { opacity: rest, duration: 0.6, ease: 'power2.inOut', clearProps: 'opacity' }, '+=0.1');
      }),
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {CORNERS.map((corner) => (
        <span key={corner.at} className={`sc-corner absolute h-4 w-4 opacity-[0.55] ${corner.at}`}>
          <span className={`sc-arm absolute h-[1.5px] w-4 bg-accent shadow-[0_0_6px_rgb(var(--color-accent)/0.8)] ${corner.h}`} />
          <span className={`sc-arm absolute h-4 w-[1.5px] bg-accent shadow-[0_0_6px_rgb(var(--color-accent)/0.8)] ${corner.v}`} />
        </span>
      ))}
    </div>
  );
}
