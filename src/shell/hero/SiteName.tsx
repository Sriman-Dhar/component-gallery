import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { typeset } from '../../lib/site';
import RiseText from '../RiseText';
import { useLetterLight } from './useLetterLight';

/**
 * The site name, the quiet half of the two tone hero: the roman of the display face at 600 in text colour, letters
 * rising 20ms apart; then a light sweeps across it once and the letters keep catching the pointer light.
 * Set with the typographic apostrophe; screen readers get the plain name.
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
    <h1 ref={root} aria-label={name} className="hero-name font-display font-semibold text-text">
      <RiseText text={typeset(name)} letterClass="lit-letter" />
    </h1>
  );
}
