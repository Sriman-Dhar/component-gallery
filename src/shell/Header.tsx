import { Link } from 'react-router-dom';
import { SITE_NAME } from '../lib/site';
import { FOCUS_RING } from './focus';
import RepoLink from './RepoLink';
import ThemeToggle from './ThemeToggle';

/** Sticky glass header, 64px: the only glass on the site. */
export default function Header() {
  return (
    <header className="glass sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-frame items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link to="/" className={`whitespace-nowrap rounded-control text-lead font-semibold tracking-[-0.02em] text-text ${FOCUS_RING}`}>
            {SITE_NAME}
          </Link>
          <span className="hidden text-small text-text-2 sm:inline">component gallery</span>
        </div>
        <nav aria-label="Site" className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <RepoLink label="Source" pending="Source coming soon" className="text-text-2 transition-colors duration-fast hover:text-text" />
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
