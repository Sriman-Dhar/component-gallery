import { useLocation } from 'react-router-dom';
import { numberOf, runningLabel, shipped, upcomingWeek } from '../lib/catalogue';
import { formatDate } from '../lib/date';
import { WINDOW_END, WINDOW_START, weekOf } from '../lib/ruler';
import { PACE_LINE } from '../lib/site';
import GrainLayer from './GrainLayer';
import Header from './Header';
import LightField from './LightField';
import RepoLink from './RepoLink';
import RouteTransition from './RouteTransition';
import World from './world/World';
import { sceneModeFor } from './world/worldModes';

const litWeeks = [...new Set(shipped.map(({ meta }) => weekOf(meta.date)))];
/** The grid the scene's halos and numerals form on: the shipped tiles' numbers and the next slot. */
const grid = { labels: shipped.map(({ meta }) => runningLabel(meta.slug)), next: upcomingWeek(shipped) !== undefined };

/**
 * Frame: the studio lights, the Living Orrery (the index story, a detail page's close orbit, the 404's dark
 * system), grain, glass header, the routed view, one-line footer. Max 1280.
 */
export default function Layout() {
  const { pathname } = useLocation();
  const mode = sceneModeFor(pathname);
  const slot = Math.max(0, numberOf(pathname.split('/')[2] ?? '') - 1);
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-bg text-text">
      <LightField />
      <World key={mode === 'index' ? mode : pathname} mode={mode} shipped={shipped.length} litWeeks={litWeeks} grid={grid} slot={slot} />
      <GrainLayer />
      <Header />
      <div className="relative z-10 mx-auto max-w-frame px-4 sm:px-8 lg:px-12">
        <main className="pb-20 pt-8 sm:pt-12">
          <RouteTransition />
        </main>
        <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-6 text-small text-text-2">
          <span>
            {PACE_LINE} {formatDate(WINDOW_START, { year: false })} to {formatDate(WINDOW_END)}.
          </span>
          <RepoLink
            label="Source"
            pending="Source coming soon"
            className="text-text underline decoration-line underline-offset-4 hover:decoration-accent"
          />
        </footer>
      </div>
    </div>
  );
}
