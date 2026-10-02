import { Link } from 'react-router-dom';
import { pageTitle, useDocumentTitle } from '../lib/useDocumentTitle';
import { FOCUS_RING } from '../shell/focus';
import LightRail from '../shell/rail/LightRail';

export const NOT_FOUND_TITLE = pageTitle('Not found');

/** 404: the rail with no power, one line, one way back. */
export default function NotFoundPage() {
  useDocumentTitle(NOT_FOUND_TITLE);
  return (
    <section aria-labelledby="not-found" className="space-y-12 pb-12 pt-6">
      <LightRail variant="unlit" />
      <div className="space-y-5">
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
    </section>
  );
}
