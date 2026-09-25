import { shipped } from '../../lib/catalogue';
import CountUp from './CountUp';
import SiteName from './SiteName';

/** Index hero, top half: the site name and one line on the left, the count moment on the right. */
export default function HeroIntro() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div className="space-y-3">
        <SiteName name="Sriman Gallery" />
        <p className="text-lead text-text-2">Thirty components in ninety days.</p>
      </div>
      <CountUp count={shipped.length} />
    </div>
  );
}
