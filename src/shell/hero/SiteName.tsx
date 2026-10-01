import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import RiseText from '../RiseText';

/** The site name in the display face, 700 weight, letters rising in 20ms apart. Screen readers get the plain name. */
export default function SiteName({ name }: { name: string }) {
  const root = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.letter', { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.02, delay: 0.05 });
      }),
    { scope: root },
  );

  return (
    <h1 ref={root} aria-label={name} className="font-display text-h1 font-bold text-text sm:text-[60px] sm:leading-[64px] tracking-[-0.02em] sm:tracking-[-0.025em]">
      <RiseText text={name} />
    </h1>
  );
}
