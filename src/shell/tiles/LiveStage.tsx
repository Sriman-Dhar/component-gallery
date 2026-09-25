import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import type { GalleryEntry } from '../../lib/types';
import DemoBoundary from '../DemoBoundary';
import { useFrameTheme } from '../../lib/theme';

/** The virtual viewport a tile renders the component in before fitting it to the tile. */
const VIRTUAL = { width: 720, height: 450 };

/**
 * The component itself, live, fitted into the tile by a scale transform (ResizeObserver writes the
 * style directly, no React state). Inert: never focusable or clickable. A crash shows a plain line.
 * The tile stage follows the frame theme so a dark frame never shows a wall of lit white boxes.
 */
export default function LiveStage({ entry, className = '' }: { entry: GalleryEntry; className?: string }) {
  const Demo = useMemo(() => lazy(entry.loadDemo), [entry]);
  const stageTheme = useFrameTheme();
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = frame.current;
    const view = inner.current;
    if (!box || !view) return;
    box.setAttribute('inert', '');
    const fit = () => {
      const scale = Math.min(box.clientWidth / VIRTUAL.width, box.clientHeight / VIRTUAL.height) || 0.4;
      const left = (box.clientWidth - VIRTUAL.width * scale) / 2;
      const top = (box.clientHeight - VIRTUAL.height * scale) / 2;
      view.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} aria-hidden="true" data-stage-theme={stageTheme} className={`stage-surface pointer-events-none relative overflow-hidden ${className}`}>
      <div
        ref={inner}
        className="absolute left-0 top-0 flex origin-top-left items-center justify-center"
        style={{ width: VIRTUAL.width, height: VIRTUAL.height }}
      >
        <DemoBoundary fallback={() => <p className="font-mono text-lead">This demo failed to render.</p>}>
          <Suspense fallback={null}>
            <Demo />
          </Suspense>
        </DemoBoundary>
      </div>
    </div>
  );
}
