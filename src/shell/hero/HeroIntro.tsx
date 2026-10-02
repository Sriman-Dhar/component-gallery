import { useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { PACE_LINE, SITE_NAME } from '../../lib/site';
import PaceAccent from './PaceAccent';
import SiteName from './SiteName';

/**
 * The index hero's words, over the Living Orrery. Left aligned on every width: against the dark side of
 * the rings on wide screens, at the foot of the viewport under the orrery on phones. As the dive starts the
 * words lift and fade with the camera (scrubbed), so no line is left hanging over the flight.
 */
export default function HeroIntro() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () =>
      withMotion(() => {
        gsap.to(root.current, {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 18%', end: 'bottom 12%', scrub: true },
        });
      }),
    { scope: root },
  );
  return (
    <div ref={root} data-world-veil className="hero-copy relative max-w-[min(100%,980px)]">
      <SiteName name={SITE_NAME} />
      <PaceAccent text={PACE_LINE} />
    </div>
  );
}
