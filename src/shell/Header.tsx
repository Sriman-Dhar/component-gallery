import { Link } from 'react-router-dom';
import { useScrolled } from '../lib/useScrolled';
import { REPO_URL, SITE_NAME, typeset } from '../lib/site';
import { FOCUS_RING } from './focus';
import RepoLink from './RepoLink';
import ThemeToggle from './ThemeToggle';

/**
 * Sticky glass header, 64px: the only glass on the site. The backdrop blur switches on once content can pass
 * under it (scrolled); at the top it would only blur soft light, an invisible result that cost a blur pass per frame.
 */
export default function Header() {
  const scrolled = useScrolled();
  return (
    <header className="glass sticky top-0 z-40" data-scrolled={scrolled}>
      <div className="mx-auto flex h-16 max-w-frame items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link to="/" className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-control font-display text-[18px] font-bold tracking-[-0.02em] text-text sm:min-h-0 [@media(pointer:coarse)]:min-h-11 ${FOCUS_RING}`}>
            {typeset(SITE_NAME)}
          </Link>
          <span className="hidden text-small text-text-2 sm:inline">component gallery</span>
        </div>
        <nav aria-label="Site" className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline">
            <RepoLink label="Source" pending="Source coming soon" className="text-text-2 transition-colors duration-fast hover:text-text" />
          </span>
          {REPO_URL ? (
            <a
              href={REPO_URL}
              aria-label="Source"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-control text-text-2 transition-colors duration-fast hover:text-text sm:hidden ${FOCUS_RING}`}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.5 4 1.5 8l4 4M10.5 4l4 4-4 4" />
              </svg>
            </a>
          ) : null}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
