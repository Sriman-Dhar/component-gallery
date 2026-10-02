import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { SIGNATURE, TITLE_WORD } from '../../lib/site';
import RiseText from '../RiseText';
import Signature from './Signature';
import { useLetterLight } from './useLetterLight';

/**
 * The site name in two voices: the signature written on in amber script, and the title word in the wide
 * display sans, its letters rising 30ms apart and then catching the light (a sweep, then the pointer).
 * Screen readers get the plain name.
 */
export default function SiteName({ name }: { name: string }) {
  const root = useRef<HTMLHeadingElement>(null);
  useLetterLight(root, 0.9);

  useGSAP(
    () =>
      withMotion(() => {
        gsap.from('.letter', { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.03, delay: 0.25 });
      }),
    { scope: root },
  );

  return (
    <h1 ref={root} aria-label={name} className="hero-title">
      <Signature text={SIGNATURE} />
      <span className="hero-name block font-display font-extrabold uppercase text-text">
        <RiseText text={TITLE_WORD} letterClass="lit-letter" />
      </span>
    </h1>
  );
}
