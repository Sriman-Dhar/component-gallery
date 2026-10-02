import { forwardRef, useImperativeHandle, useRef } from 'react';
import { upcomingWeek } from '../../lib/catalogue';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../lib/motion';
import type { GalleryEntry } from '../../lib/types';
import NextSlot from './NextSlot';
import Tile from './Tile';

interface Props {
  /** Published components in № order. */
  entries: GalleryEntry[];
}

/**
 * Equal tiles in № order: 3 columns desktop, 2 tablet, 1 phone, closed by the next week's slot.
 * Each reveal is a stage being lit: the tile rises, the light ignites, the component appears. The gutters
 * are tall: the scene's particle numerals rise from behind each tile into the space above it.
 */
const TileGrid = forwardRef<HTMLUListElement, Props>(function TileGrid({ entries }, ref) {
  const root = useRef<HTMLUListElement>(null);
  useImperativeHandle(ref, () => root.current as HTMLUListElement);
  const upcoming = upcomingWeek(entries);

  useGSAP(
    () =>
      withMotion(() => {
        const tiles = gsap.utils.toArray<HTMLElement>('.tile', root.current);
        gsap.set(tiles, { opacity: 0, y: 24 });
        gsap.set(gsap.utils.toArray('.tile-card', root.current), { '--spot-on': 0 });
        gsap.set(gsap.utils.toArray('.stage-content', root.current), { opacity: 0 });
        ScrollTrigger.batch(tiles, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            const cards = batch.flatMap((tile) => [...tile.querySelectorAll('.tile-card')]);
            const content = batch.flatMap((tile) => [...tile.querySelectorAll('.stage-content')]);
            // The tile rises, its stage light flickers on, then the component appears in the light.
            // The next slot has no card or stage: a batch of it alone tweens only the rise.
            const tl = gsap
              .timeline()
              .to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, overwrite: true, clearProps: 'transform' });
            if (cards.length) tl.to(cards, { keyframes: { '--spot-on': [0, 0.8, 0.2, 1] }, duration: 0.45, ease: 'none', stagger: 0.08 }, 0.2);
            if (content.length) tl.to(content, { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08, clearProps: 'opacity' }, 0.5);
          },
        });
      }),
    { scope: root },
  );

  return (
    <ul ref={root} aria-label="Components" className="relative grid grid-cols-1 gap-x-5 gap-y-24 pt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
      {entries.map((entry) => (
        <Tile key={entry.meta.slug} entry={entry} />
      ))}
      {upcoming ? <NextSlot week={upcoming} /> : null}
    </ul>
  );
});

export default TileGrid;
