import { useRef } from 'react';
import { useScrolled } from '../../lib/useScrolled';
import OrreryPoster from '../orrery/OrreryPoster';
import { usePosterVeil } from './usePosterVeil';

/** How far down the page (a share of the viewport) the fixed poster steps back behind the story. */
const RECEDE_AT = 0.6;

/**
 * The orrery without WebGL: the SVG still framed like the live hero (sun right of center on wide screens,
 * above the type on phones), with its warm atmosphere. On the index it stays fixed behind the page with the rest of the world box,
 * and once the hero has gone it steps back (dimmed), so section headings and tiles never sit on its rings. On a
 * phone's 404 (`quiet`) the rings run under the ruler and the caption, so it stays stepped back there; on a wide
 * 404 the sun rides 120px higher, clear of the footer rule that would otherwise cut through it.
 */
export default function WorldPoster({ shipped, recede = false, quiet = false }: { shipped: number; recede?: boolean; quiet?: boolean }) {
  const past = useScrolled(typeof window === 'undefined' ? 0 : window.innerHeight * RECEDE_AT);
  const back = recede && past;
  const root = useRef<HTMLDivElement>(null);
  usePosterVeil(root);
  return (
    <div
      ref={root}
      data-testid="world-poster"
      className={`pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden transition-opacity duration-slow ease-out motion-reduce:transition-none ${back ? 'opacity-25' : ''} ${quiet ? '[@media(max-width:639px)]:opacity-25' : ''}`}
    >
      <div className={`absolute left-[-4%] top-[4%] aspect-[1.3] w-[108%] lg:left-auto lg:right-[-10%] lg:top-[10%] lg:w-[84%] ${quiet ? 'xl:-translate-y-[120px]' : ''}`}>
        <div className="orrery-atmos absolute -inset-x-[6%] -inset-y-[14%]" />
        <OrreryPoster shipped={shipped} />
      </div>
    </div>
  );
}
