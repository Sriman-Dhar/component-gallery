import { useRef } from 'react';
import { TARGET } from '../../lib/catalogue';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../lib/motion';
import { WEEK_COUNT, weekOf } from '../../lib/ruler';
import type { GalleryEntry } from '../../lib/types';
import NextSlot from './NextSlot';
import Tile from './Tile';

interface Props {
  /** Newest first; the first is the feature tile. */
  entries: GalleryEntry[];
  shippedCount: number;
}

function nextWeek(entries: GalleryEntry[]): number | undefined {
  const weeks = entries.filter((e) => e.meta.week > 0).map((e) => weekOf(e.meta.date));
  const next = weeks.length ? Math.max(...weeks) + 1 : 1;
  return next <= WEEK_COUNT ? next : undefined;
}

/** Asymmetric live grid: 3 columns desktop, 2 tablet, 1 phone. Tiles reveal in batches as they scroll in. */
export default function TileGrid({ entries, shippedCount }: Props) {
  const root = useRef<HTMLUListElement>(null);
  const upcoming = shippedCount < TARGET ? nextWeek(entries) : undefined;
  const total = entries.length + (upcoming ? 1 : 0);

  useGSAP(
    () =>
      withMotion(() => {
        const tiles = gsap.utils.toArray<HTMLElement>('.tile', root.current);
        gsap.set(tiles, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(tiles, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, overwrite: true, clearProps: 'transform' }),
        });
      }),
    { scope: root },
  );

  return (
    <ul ref={root} aria-label="Components" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {entries.map((entry, i) => (
        <Tile key={entry.meta.slug} entry={entry} feature={i === 0 && total > 1} tall={total > 2} />
      ))}
      {upcoming ? <NextSlot week={upcoming} /> : null}
    </ul>
  );
}
