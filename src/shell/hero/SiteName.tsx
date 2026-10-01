import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import RiseText from '../RiseText';
import { useLetterLight } from './useLetterLight';

/**
 * The site name in the display face, 700 weight, letters rising in 20ms apart; then a light sweeps
 * across it once and the letters keep catching the pointer light. Screen readers get the plain name.
 */
export default function SiteName({ name }: { name: string }) {
  const root = useRef<HTMLHeadingElement>(null);
  useLetterLight(root, 0.75);

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.letter', { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.02, delay: 0.05 });
      }),
    { scope: root },
  );

  return (
    <h1 ref={root} aria-label={name} className="font-display text-h1 font-semibold text-text tracking-[-0.015em] sm:text-[64px] sm:leading-[68px] sm:tracking-[-0.02em]">
      <RiseText text={name} letterClass="lit-letter" />
    </h1>
  );
}
