import { useEffect, useRef } from 'react';
import { world } from '../world/worldState';

/**
 * The hover label over an orrery body: its number and component (shipped) or the week its slot opens. The
 * scene's frame moves it onto the body (bodyScreen.ts); the pointer hook fills it. Decorative for assistive
 * tech: the same facts are the tiles' links, reachable by keyboard.
 */
export default function BodyTag() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    world.tag = root.current;
    return () => {
      world.tag = null;
      world.hover = -1;
    };
  }, []);
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="body-tag pointer-events-none fixed left-0 top-0 z-30 opacity-0 transition-opacity duration-fast"
    >
      <div className="-translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-control border border-line bg-surface/90 px-3 py-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-sm">
        <p className="font-mono text-meta text-accent" data-tag="number" />
        <p className="font-display text-small font-semibold text-text" data-tag="title" />
      </div>
    </div>
  );
}
