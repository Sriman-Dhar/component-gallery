import { useRef } from 'react';
import { shipped } from '../lib/catalogue';
import { pageTitle, useDocumentTitle } from '../lib/useDocumentTitle';
import SectionHeading from '../shell/detail/SectionHeading';
import CountUp from '../shell/hero/CountUp';
import HeroIntro from '../shell/hero/HeroIntro';
import LightRail from '../shell/rail/LightRail';
import TileGrid from '../shell/tiles/TileGrid';
import { useDiveScroll } from '../shell/world/useDiveScroll';
import { useWorldInput } from '../shell/world/useWorldInput';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));

/**
 * Index, one continuous world (the Living Orrery behind it, see shell/world): the hero over the full-bleed
 * orrery (drag to turn it, click for a shockwave); the dive, where the camera passes through the rings
 * beside the lit fraction; the light rail the particles stream down into; then the tiles in № order.
 */
export default function IndexPage() {
  useDocumentTitle(pageTitle());
  const hero = useRef<HTMLElement>(null);
  const rail = useRef<HTMLElement>(null);
  useDiveScroll(hero, rail);
  useWorldInput(hero);

  return (
    <div>
      <section
        ref={hero}
        aria-label="Introduction"
        className="hero-stage relative -mt-8 flex min-h-[calc(100svh-6.5rem)] touch-pan-y select-none flex-col justify-end pb-12 sm:-mt-12 lg:justify-center lg:pb-16"
      >
        <HeroIntro />
      </section>
      <section aria-label="Progress" className="flex min-h-[52svh] items-center py-16 lg:min-h-[70svh]">
        <CountUp count={shipped.length} />
      </section>
      <section ref={rail} aria-label="Ninety day light rail" className="pb-20 sm:pb-28">
        <LightRail variant="hero" marks={marks} />
      </section>
      <section aria-labelledby="shipped-heading" className="space-y-6 sm:space-y-10">
        <SectionHeading id="shipped-heading">Shipped so far</SectionHeading>
        <TileGrid entries={shipped} />
      </section>
    </div>
  );
}
