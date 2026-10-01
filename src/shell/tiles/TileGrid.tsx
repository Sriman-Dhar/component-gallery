import { useRef } from 'react';
import { TARGET } from '../../lib/catalogue';
import { gsap, ScrollTrigger, useGSAP, withMotion } from '../../lib/motion';
import { WEEK_COUNT, weekOf } from '../../lib/ruler';
import type { GalleryEntry } from '../../lib/types';
import NextSlot from './NextSlot';
import Tile from './Tile';

interface Props {
  /** Published components in № order. */
  entries: GalleryEntry[];
}

function nextWeek(entries: GalleryEntry[]): number | undefined {
  const weeks = entries.map((e) => weekOf(e.meta.date));
  const next = weeks.length ? Math.max(...weeks) + 1 : 1;
  return next <= WEEK_COUNT ? next : undefined;
}

/** Equal tiles in № order: 3 columns desktop, 2 tablet, 1 phone, closed by the next week's slot. */
export default function TileGrid({ entries }: Props) {
  const root = useRef<HTMLUListElement>(null);
  const upcoming = entries.length < TARGET ? nextWeek(entries) : undefined;

  useGSAP(
    () =>
      withMotion(() => {
        const tiles = gsap.utils.toArray<HTMLElement>('.tile', root.current);
        gsap.set(tiles, { opacity: 0, y: 24 });
        ScrollTrigger.batch(tiles, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, overwrite: true, clearProps: 'transform' }),
        });
      }),
    { scope: root },
  );

  return (
    <ul ref={root} aria-label="Components" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {entries.map((entry) => (
        <Tile key={entry.meta.slug} entry={entry} />
      ))}
      {upcoming ? <NextSlot week={upcoming} /> : null}
    </ul>
  );
}
