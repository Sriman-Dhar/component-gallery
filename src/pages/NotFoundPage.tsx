import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { FOCUS_RING } from '../shell/focus';
import LightRail from '../shell/rail/LightRail';
import { NOT_FOUND_TITLE } from './notFoundTitle';

/** Keeps a soft 404 out of search results while it is on screen (the static host answers every path 200). */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

/** 404: the rail with no power, one line, one way back. */
export default function NotFoundPage() {
  useDocumentTitle(NOT_FOUND_TITLE);
  useNoIndex();
  return (
    <section aria-labelledby="not-found" className="flex min-h-[calc(100svh-18.5rem)] flex-col justify-center gap-12 sm:min-h-[calc(100svh-16.5rem)]">
      {/* The ruler row is type the dark system keeps clear of, like the copy below it. */}
      <div data-world-veil>
        <LightRail variant="unlit" />
      </div>
      {/* Hugs the copy, so the veil never reaches across the empty field to the sun on the right. */}
      <div data-world-veil className="w-fit">
        <div className="copy-scrim copy-scrim-soft space-y-5">
          <h1 id="not-found" className="font-display text-[34px] font-extrabold leading-[40px] tracking-[-0.03em] text-text sm:text-[52px] sm:leading-[60px]">
            Nothing shipped <span className="accent-ink">here.</span>
          </h1>
          <p className="max-w-[52ch] text-text-2">No component lives at this address. The index lists every one that does.</p>
          <Link
            to="/"
            className={`inline-flex h-11 items-center rounded-control border border-line bg-surface px-4 font-mono text-small text-text transition-colors duration-fast hover:border-accent/60 ${FOCUS_RING}`}
          >
            Back to the index
          </Link>
        </div>
      </div>
    </section>
  );
}
