import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { GalleryEntry } from '../../lib/types';
import TypeStamp from '../TypeStamp';
import LiveStage from './LiveStage';
import { useTilt } from './useTilt';

interface Props {
  entry: GalleryEntry;
  /** The newest component: 2 columns wide on tablet and up. */
  feature?: boolean;
  /** Tall feature: also 2 rows on desktop, when the grid has tiles to fill beside it. */
  tall?: boolean;
  /** Small caption above the name, e.g. "Previous" on the detail page. */
  caption?: string;
  rel?: 'prev' | 'next';
}

/** A live tile: the real component on a mini stage, name, type stamp, week. Tilts toward the pointer. */
export default function Tile({ entry, feature = false, tall = false, caption, rel }: Props) {
  const { meta } = entry;
  const tile = useRef<HTMLLIElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  useTilt(tile, card, sheen);

  const span = feature ? `md:col-span-2 ${tall ? 'lg:row-span-2' : ''}` : '';
  return (
    <li
      ref={tile}
      className={`tile group relative rounded-tile transition-transform duration-fast ease-out [perspective:1000px] active:scale-[0.98] has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent ${span}`}
    >
      <div ref={card} className="tile-card relative flex h-full flex-col overflow-hidden rounded-tile bg-surface">
        <LiveStage entry={entry} className={`w-full border-b border-line ${feature ? 'aspect-[16/9] lg:aspect-auto lg:min-h-[340px] lg:flex-1' : 'aspect-[16/10]'}`} />
        <div ref={sheen} aria-hidden="true" className="tile-sheen pointer-events-none absolute inset-0" />
        <div className="flex items-end justify-between gap-4 p-5">
          <div className="min-w-0">
            {caption ? <p className="mb-1 font-mono text-meta text-text-2">{caption}</p> : null}
            <Link
              to={`/components/${meta.slug}`}
              rel={rel}
              className={`block text-balance font-semibold tracking-[-0.02em] text-text outline-none after:absolute after:inset-0 after:content-[''] ${feature ? 'text-h2' : 'text-lead'}`}
            >
              {meta.name}
            </Link>
            <p className="mt-1 truncate font-mono text-meta text-text-2">/components/{meta.slug}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <TypeStamp type={meta.type} />
            <span className="font-mono text-meta text-text-2">Week {meta.week}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
