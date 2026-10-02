import { PACE_LINE, SITE_NAME } from '../../lib/site';
import PaceAccent from './PaceAccent';
import SiteName from './SiteName';

/**
 * The index hero's words, over the Living Orrery. Left aligned on every width: against the dark side of
 * the rings on wide screens, at the foot of the viewport under the orrery on phones.
 */
export default function HeroIntro() {
  return (
    <div className="hero-copy relative max-w-[min(100%,980px)]">
      <SiteName name={SITE_NAME} />
      <PaceAccent text={PACE_LINE} />
    </div>
  );
}
