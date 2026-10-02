import { useCallback, useRef, useState } from 'react';
import { shipped } from '../lib/catalogue';
import { weekOf } from '../lib/ruler';
import { pageTitle, useDocumentTitle } from '../lib/useDocumentTitle';
import SectionHeading from '../shell/detail/SectionHeading';
import FarCoda from '../shell/coda/FarCoda';
import CountUp from '../shell/hero/CountUp';
import BodyTag from '../shell/hero/BodyTag';
import HeroFoot from '../shell/hero/HeroFoot';
import HeroIntro from '../shell/hero/HeroIntro';
import LightRail from '../shell/rail/LightRail';
import TileGrid from '../shell/tiles/TileGrid';
import { useLandOnTiles } from '../shell/tiles/useLandOnTiles';
import { useDiveScroll } from '../shell/world/useDiveScroll';
import { useGridScroll } from '../shell/world/useGridScroll';
import { useWorldInput } from '../shell/world/useWorldInput';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));
/** The latest week and what it shipped, under the count: the number gets its names. */
const lastWeek = Math.max(0, ...shipped.map(({ meta }) => weekOf(meta.date)));
const lastNames = shipped.filter(({ meta }) => weekOf(meta.date) === lastWeek).map(({ meta }) => meta.name);

/**
 * Index, one continuous world (the Living Orrery behind it, see shell/world): the hero over the full-bleed
 * orrery (drag to turn it, hover a body to name it, click for a shockwave); the dive, where the camera passes through the rings
 * beside the lit fraction; the light rail the particles stream down into; the tiles in № order, haloed, their
 * numbers rising behind them; then the coda, the whole system far away and still.
 */
export default function IndexPage() {
  useDocumentTitle(pageTitle());
  const hero = useRef<HTMLElement>(null);
  const rail = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const coda = useRef<HTMLDivElement>(null);
  useDiveScroll(hero, rail);
  useGridScroll(grid, coda);
  useLandOnTiles('shipped-heading');
  const [turned, setTurned] = useState(false);
  useWorldInput(hero, useCallback(() => setTurned(true), []));

  return (
    <div>
      <section
        ref={hero}
        aria-label="Introduction"
        className="hero-stage relative -mt-8 flex min-h-[calc(100svh-6.5rem)] touch-pan-y select-none flex-col justify-end pb-12 sm:-mt-12 lg:justify-center lg:pb-16"
      >
        <HeroIntro />
        <HeroFoot shipped={shipped.length} turned={turned} />
        <BodyTag />
      </section>
      <section aria-label="Progress" className="flex min-h-[52svh] items-end pb-6 pt-16 sm:pb-8 lg:min-h-[70svh]">
        <div>
          <CountUp count={shipped.length} />
          {lastNames.length ? (
            <p className="rail-caption mt-3 font-mono text-meta text-text-2">
              <span>
                Week {lastWeek}: <span className="text-text">{lastNames.join(', ')}</span>
              </span>
            </p>
          ) : null}
        </div>
      </section>
      <section ref={rail} aria-label="Ninety day light rail" className="pb-20 sm:pb-28">
        <LightRail variant="hero" marks={marks} />
      </section>
      <section aria-labelledby="shipped-heading" className="space-y-6 sm:space-y-10">
        <SectionHeading id="shipped-heading">Shipped so far</SectionHeading>
        <TileGrid ref={grid} entries={shipped} />
      </section>
      <FarCoda ref={coda} shipped={shipped.length} />
    </div>
  );
}
