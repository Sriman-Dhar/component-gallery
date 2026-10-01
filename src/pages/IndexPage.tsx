import { shipped } from '../lib/catalogue';
import { pageTitle, useDocumentTitle } from '../lib/useDocumentTitle';
import SectionHeading from '../shell/detail/SectionHeading';
import HeroIntro from '../shell/hero/HeroIntro';
import LightRail from '../shell/rail/LightRail';
import TileGrid from '../shell/tiles/TileGrid';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));

/**
 * Index: the lit name and fraction, the particle light rail (the hero), then a rail station heading
 * (the detail pages' section language, so both routes read as one system) over the tiles in № order.
 */
export default function IndexPage() {
  useDocumentTitle(pageTitle());
  return (
    <div className="space-y-12 sm:space-y-20">
      <section aria-label="Introduction" className="space-y-10 sm:space-y-14">
        <HeroIntro />
        <LightRail variant="hero" marks={marks} />
      </section>
      <section aria-labelledby="shipped-heading" className="space-y-6 sm:space-y-10">
        <SectionHeading id="shipped-heading">Shipped so far</SectionHeading>
        <TileGrid entries={shipped} />
      </section>
    </div>
  );
}
