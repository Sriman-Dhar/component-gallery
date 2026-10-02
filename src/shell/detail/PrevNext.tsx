import { neighbours, shipped, upcomingWeek } from '../../lib/catalogue';
import NextSlot from '../tiles/NextSlot';
import OrbitStart from './OrbitStart';
import Tile from '../tiles/Tile';

/** Previous / next published component in running order, as tiles; the first one's previous is the start of the
 * orbit and the newest one's next is the waiting slot. */
export default function PrevNext({ slug }: { slug: string }) {
  const { prev, next } = neighbours(slug);
  const upcoming = upcomingWeek(shipped);
  if (!prev && !next) return null;
  return (
    <nav id="more" aria-label="More components" tabIndex={-1} className="scroll-mt-24 border-t border-line pt-10 outline-none">
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* The first component's previous is the start of the orbit, so the pair is balanced from page one. */}
        {prev ? <Tile entry={prev} caption="Previous" rel="prev" /> : <OrbitStart />}
        {/* The newest component points at what comes next: the waiting slot, so the page never ends on a gap. */}
        {next ? <Tile entry={next} caption="Next" rel="next" /> : upcoming ? <NextSlot week={upcoming} /> : null}
      </ul>
    </nav>
  );
}
