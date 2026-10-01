import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/**
 * The loud half of the two tone hero: the pace line in the italic of the display serif, set as a display
 * line in the amber ramp. It rises in as one line just after the name's letters land (italic overhangs make
 * per letter masks clip), then a sheen sweeps it once, left to right, and parks. Reduced motion: the
 * settled ramp, no sweep.
 */
export default function PaceAccent({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ delay: 0.45 })
          .from(root.current, { y: 18, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
          .fromTo('.accent-ink', { '--sheen-x': '100%' }, { '--sheen-x': '0%', duration: 1.4, ease: 'power2.inOut' }, 0.5);
      }),
    { scope: root },
  );

  return (
    <p ref={root} className="hero-accent max-w-[19ch] font-display font-medium italic">
      <span className="accent-ink">{text}</span>
    </p>
  );
}
