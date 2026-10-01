import { Link } from 'react-router-dom';
import { FOCUS_RING } from '../focus';

/**
 * The way back to the index, first thing on every detail page. 44px tall at every width; the arrow
 * slides left a few pixels on hover, and its hairline lights in the accent like a rail segment.
 */
export default function BackLink() {
  return (
    <Link
      to="/"
      data-back=""
      className={`group -ml-2 inline-flex h-11 items-center gap-2.5 rounded-control px-2 font-mono text-small text-text-2 transition-colors duration-fast hover:text-text ${FOCUS_RING}`}
    >
      <span aria-hidden="true" className="relative inline-flex h-4 w-7 items-center">
        <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-line transition-colors duration-fast group-hover:bg-accent" />
        <svg
          viewBox="0 0 12 12"
          className="relative h-3 w-3 transition-transform duration-fast ease-out group-hover:-translate-x-1 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.5 2.5 4 6l3.5 3.5" />
        </svg>
      </span>
      All components
    </Link>
  );
}
