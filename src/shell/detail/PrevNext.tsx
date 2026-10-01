import { neighbours } from '../../lib/catalogue';
import Tile from '../tiles/Tile';

/** Previous / next published component in № order, as tiles; each side hides at its end. */
export default function PrevNext({ slug }: { slug: string }) {
  const { prev, next } = neighbours(slug);
  if (!prev && !next) return null;
  return (
    <nav id="more" aria-label="More components" tabIndex={-1} className="scroll-mt-24 border-t border-line pt-10 outline-none">
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {prev ? <Tile entry={prev} caption="Previous" rel="prev" /> : <li aria-hidden="true" className="hidden md:block" />}
        {next ? <Tile entry={next} caption="Next" rel="next" /> : null}
      </ul>
    </nav>
  );
}
