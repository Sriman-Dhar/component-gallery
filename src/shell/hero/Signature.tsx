import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/**
 * The signature: the name in the script face, in amber, written on left to right by a clip sweep (1.2s,
 * eased) the moment the sun has ignited. Used once per route at most. Reduced motion: written, still.
 * Decorative glyphs: the heading it sits in carries the accessible name.
 */
export default function Signature({ text, delay = 0.55 }: { text: string; delay?: number }) {
  const ink = useRef<HTMLSpanElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap.fromTo(
          ink.current,
          { clipPath: 'inset(-20% 100% -30% -6%)' },
          { clipPath: 'inset(-20% -6% -30% -6%)', duration: 1.2, ease: 'power2.inOut', delay },
        );
      }),
    { scope: ink },
  );

  return (
    <span ref={ink} aria-hidden="true" className="signature-ink block">
      {text}
    </span>
  );
}
