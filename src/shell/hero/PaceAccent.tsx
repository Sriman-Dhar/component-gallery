import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/**
 * The pace statement under the name: wide caps in the amber ramp. It rises in just after the title's
 * letters land, then a sheen sweeps it once, left to right, and parks. Reduced motion: the settled ramp.
 */
export default function PaceAccent({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ delay: 0.7 })
          .from(root.current, { y: 14, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
          .fromTo('.accent-ink', { '--sheen-x': '100%' }, { '--sheen-x': '0%', duration: 1.3, ease: 'power2.inOut' }, 0.4);
      }),
    { scope: root },
  );

  return (
    <p ref={root} className="hero-accent font-display font-bold uppercase">
      <span className="accent-ink">{text}</span>
    </p>
  );
}
