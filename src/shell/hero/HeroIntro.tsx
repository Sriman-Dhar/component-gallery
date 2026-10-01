import { shipped } from '../../lib/catalogue';
import { PACE_LINE } from '../../lib/site';
import Orrery from '../orrery/Orrery';
import CountUp from './CountUp';
import SiteName from './SiteName';

/**
 * Index hero, top half. Desktop: the lit name, the pace line and the lit fraction stacked on the left;
 * the orrery on the right, its foot leaning into the rail below so they read as one scene. Phones: the
 * orrery scales down into its own row under the fraction, just above the rail it is fed by.
 */
export default function HeroIntro() {
  return (
    <div className="grid grid-cols-1 items-end gap-y-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
      <div className="relative z-10 space-y-3 lg:col-span-7 lg:row-start-1">
        <SiteName name="Sriman Gallery" />
        <p className="text-lead text-text-2">{PACE_LINE}</p>
      </div>
      <div className="relative z-10 col-start-1 row-start-2 lg:col-span-7">
        <CountUp count={shipped.length} />
      </div>
      <div className="col-start-1 row-start-3 -mb-6 -mt-2 w-full max-w-[420px] justify-self-end lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-w-[480px]">
        <Orrery shipped={shipped.length} />
      </div>
    </div>
  );
}
