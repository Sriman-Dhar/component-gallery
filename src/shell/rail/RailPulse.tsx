import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/** The DOM pulse for the poster rail: a short bright window travels the line every 4s. */
export default function RailPulse({ base }: { base: number }) {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() =>
    withMotion(() => {
      const el = bar.current;
      const track = el?.parentElement;
      if (!el || !track) return;
      gsap.fromTo(
        el,
        { x: -120, autoAlpha: 1 },
        { x: () => track.offsetWidth, duration: 1.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 2.4, delay: 0.9 },
      );
    }),
  );

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="rail-pulse pointer-events-none invisible absolute left-0 h-[3px] w-[120px] rounded-full"
      style={{ top: base - 1 }}
    />
  );
}
