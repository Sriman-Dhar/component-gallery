import { shipped } from '../../lib/catalogue';
import { PACE_LINE } from '../../lib/site';
import CountUp from './CountUp';
import SiteName from './SiteName';

/** Index hero, top half: the lit site name and one line on the left, the lit fraction on the right. */
export default function HeroIntro() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
      <div className="space-y-3">
        <SiteName name="Sriman Gallery" />
        <p className="text-lead text-text-2">{PACE_LINE}</p>
      </div>
      <CountUp count={shipped.length} />
    </div>
  );
}
