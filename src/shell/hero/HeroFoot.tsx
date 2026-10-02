import { useEffect, useState } from 'react';
import { motionAllowed } from '../../lib/motion';
import { FOCUS_RING } from '../focus';
import { useWorldStatus } from '../world/worldState';

const HINT_KEY = 'gallery-turned';

function seenBefore(): boolean {
  try {
    return window.localStorage.getItem(HINT_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * The hero's foot: the way to the work (jumps past the dive to the shipped tiles, focus follows) and, until
 * the visitor first turns the orrery, a quiet hint that it turns. The hint retires for good once used.
 */
export default function HeroFoot({ shipped, turned }: { shipped: number; turned: boolean }) {
  const [fresh, setFresh] = useState(false);
  useEffect(() => setFresh(!seenBefore()), []);
  // Only a live scene turns: no hint over the still or the no-WebGL poster.
  const live = useWorldStatus() === 'live';
  const hint = fresh && live;
  useEffect(() => {
    if (!turned) return;
    try {
      window.localStorage.setItem(HINT_KEY, '1');
    } catch {
      /* storage blocked: the hint simply returns next visit */
    }
  }, [turned]);

  const toWork = () => {
    const heading = document.getElementById('shipped-heading');
    heading?.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' });
    heading?.focus({ preventScroll: true });
  };

  return (
    <div className="hero-foot relative mt-10 flex items-center justify-between gap-4 lg:absolute lg:inset-x-0 lg:bottom-8 lg:mt-0">
      <button
        type="button"
        onClick={toWork}
        className={`group inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface/70 px-4 font-mono text-small text-text backdrop-blur-sm transition-colors duration-fast hover:border-accent/60 ${FOCUS_RING}`}
      >
        See the {shipped} shipped
        <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 text-accent transition-transform duration-fast group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />
        </svg>
      </button>
      {hint ? (
        <p
          aria-hidden="true"
          className={`drag-hint pointer-events-none flex items-center whitespace-nowrap gap-2 font-mono text-meta text-text-2 transition-opacity duration-slow ${turned ? 'opacity-0' : 'opacity-100'}`}
        >
          <svg viewBox="0 0 20 12" className="h-3 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <ellipse cx="10" cy="6" rx="8.5" ry="3.6" />
            <path d="M15.5 1.2 18.6 2.6 17 5.4" />
          </svg>
          <span className="hidden [@media(pointer:fine)]:inline">Drag to turn</span>
          <span className="[@media(pointer:fine)]:hidden">Swipe to turn</span>
        </p>
      ) : null}
    </div>
  );
}
