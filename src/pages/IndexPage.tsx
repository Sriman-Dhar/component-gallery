import { catalogue, shipped } from '../lib/catalogue';
import HeroIntro from '../shell/hero/HeroIntro';
import LightRail from '../shell/rail/LightRail';
import TileGrid from '../shell/tiles/TileGrid';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));
/** Newest shipped first (the feature tile), the week 0 placeholder after them. */
const tiles = [...shipped].reverse().concat(catalogue.filter((entry) => entry.meta.week === 0));

/** Index: the name and count, the particle light rail (the hero), then the live tile grid. */
export default function IndexPage() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <section aria-label="Introduction" className="space-y-10 sm:space-y-14">
        <HeroIntro />
        <LightRail variant="hero" marks={marks} />
      </section>
      <TileGrid entries={tiles} shippedCount={shipped.length} />
    </div>
  );
}
