import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/** The site name, 600 weight, letters rising in 20ms apart. Screen readers get the plain name. */
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
    <h1 ref={root} aria-label={name} className="text-h1 font-semibold text-text sm:text-[56px] sm:leading-[60px] sm:tracking-[-0.045em]">
      <span aria-hidden="true" className="inline-block overflow-hidden pb-1 align-bottom">
        {[...name].map((char, i) => (
          <span key={i} className="letter inline-block whitespace-pre">
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
}
