import { shipped } from '../lib/catalogue';
import HeroIntro from '../shell/hero/HeroIntro';
import LightRail from '../shell/rail/LightRail';
import TileGrid from '../shell/tiles/TileGrid';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));

/** Index: the name and count, the particle light rail (the hero), then the tile grid in № order. */
export default function IndexPage() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <section aria-label="Introduction" className="space-y-10 sm:space-y-14">
        <HeroIntro />
        <LightRail variant="hero" marks={marks} />
      </section>
      <TileGrid entries={shipped} />
    </div>
  );
}
