import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { runningLabel } from '../../lib/catalogue';
import { formatDate } from '../../lib/date';
import type { GalleryEntry } from '../../lib/types';
import TypeStamp from '../TypeStamp';
import LiveStage from './LiveStage';
import { useTilt } from './useTilt';

interface Props {
  entry: GalleryEntry;
  /** Small caption above the name, e.g. "Previous" on the detail page. */
  caption?: string;
  rel?: 'prev' | 'next';
}

/**
 * A live tile, every one the same size: a close-cropped live render of the component at a fixed
 * height, then №, name, type stamp, week and date (the same set the detail header shows).
 * The stage is lit from above: a beam lands as a pool on its floor behind the component and leans
 * toward the pointer. Tilts toward the pointer; an "Open" cue slides in on hover or keyboard focus.
 */
export default function Tile({ entry, caption, rel }: Props) {
  const { meta } = entry;
  const tile = useRef<HTMLLIElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  useTilt(tile, card, sheen);

  return (
    <li
      ref={tile}
      className="tile group relative rounded-tile transition-transform duration-fast ease-out [perspective:1000px] active:scale-[0.98] has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent"
    >
      <div ref={card} className="tile-card relative flex h-full flex-col overflow-hidden rounded-tile bg-surface">
        <LiveStage entry={entry} className="stage-spot h-[220px] w-full border-b border-line" />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-meta text-text opacity-0 transition-[opacity,transform] duration-fast ease-out [transform:translateX(-4px)] group-focus-within:opacity-100 group-focus-within:[transform:none] group-hover:opacity-100 group-hover:[transform:none] motion-reduce:transition-none"
        >
          Open
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 9 9 3M4.5 3H9v4.5" />
          </svg>
        </span>
        <div ref={sheen} aria-hidden="true" className="tile-sheen pointer-events-none absolute inset-0" />
        <div className="flex flex-1 flex-col justify-end gap-3 p-5">
          <div className="min-w-0">
            <p className="mb-1 font-mono text-meta text-text-2">
              {caption ? `${caption} · ` : ''}
              <span className="text-accent">№</span> {runningLabel(meta.slug)}
            </p>
            <Link
              to={`/components/${meta.slug}`}
              rel={rel}
              className="-my-2 block truncate py-2 font-display text-[22px] font-medium leading-7 tracking-normal text-text outline-none after:absolute after:inset-0 after:content-['']"
            >
              {meta.name}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-meta text-text-2">
            <TypeStamp type={meta.type} />
            <span>Week {meta.week}</span>
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          </div>
        </div>
      </div>
    </li>
  );
}
