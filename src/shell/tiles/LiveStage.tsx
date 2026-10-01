import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrameTheme } from '../../lib/theme';
import type { GalleryEntry } from '../../lib/types';
import DemoBoundary from '../DemoBoundary';

/** The virtual viewport a demo renders in before it is fitted, for components without a preview. */
const VIRTUAL = { width: 720, height: 450 };

/**
 * The component itself, live and inert (never focusable or clickable), on a mini stage that follows
 * the frame theme. A component's `preview.tsx` renders at its own designed size, centered and cropped
 * by the tile; without one, the demo is scaled to fit as a fallback. A crash shows a plain line.
 */
export default function LiveStage({ entry, className = '' }: { entry: GalleryEntry; className?: string }) {
  const hasPreview = Boolean(entry.loadPreview);
  const View = useMemo(() => lazy(entry.loadPreview ?? entry.loadDemo), [entry]);
  const stageTheme = useFrameTheme();
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = frame.current;
    const view = inner.current;
    if (!box) return;
    box.setAttribute('inert', '');
    if (hasPreview || !view) return;
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
  }, [hasPreview]);

  const content = (
    <DemoBoundary fallback={() => <p className="font-mono text-small">This preview failed to render.</p>}>
      <Suspense fallback={null}>
        <View />
      </Suspense>
    </DemoBoundary>
  );

  return (
    <div ref={frame} aria-hidden="true" data-stage-theme={stageTheme} className={`stage-surface pointer-events-none relative overflow-hidden ${className}`}>
      {hasPreview ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">{content}</div>
      ) : (
        <div
          ref={inner}
          className="absolute left-0 top-0 flex origin-top-left items-center justify-center"
          style={{ width: VIRTUAL.width, height: VIRTUAL.height }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
