import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { useFrameTheme } from '../../lib/theme';
import type { GalleryEntry } from '../../lib/types';
import DemoBoundary from '../DemoBoundary';
import StageCorners from './StageCorners';
import StageControls, { type StageTheme, type WidthPreset } from './StageControls';
import { useStageThemeFade } from './useStageThemeFade';
import { useStageWidth } from './useStageWidth';

const WIDTH_NOTE: Record<WidthPreset, string> = { '375': '375 px viewport', '768': '768 px viewport', full: 'Full width' };
const THEME_NAME: Record<StageTheme, string> = { light: 'Light', dark: 'Dark' };

/** The stage: 1px grid, its own theme (the frame's until the visitor picks one, the dark one lit by the scene's sun along its top edge; light on demand), a frame that narrows to three widths, lit corner marks. Slides up into place. */
export default function Stage({ entry }: { entry: GalleryEntry }) {
  const Demo = useMemo(() => lazy(entry.loadDemo), [entry]);
  const root = useRef<HTMLElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  // The stage follows the frame's theme (a dark slab on paper was the loudest thing on the page), live switches
  // included, until the visitor picks a stage theme; that pick then holds for this component's page.
  const frameTheme = useFrameTheme();
  const [pick, setPick] = useState<{ slug: string; theme: StageTheme } | null>(null);
  const theme = pick?.slug === entry.meta.slug ? pick.theme : frameTheme;
  const { width, unavailable, resize } = useStageWidth(room, frame);
  useStageThemeFade(veil, rim, theme);

  useGSAP(
    () =>
      withMotion(() => {
        // Opacity, not visibility: a demo may take focus on mount.
        gsap.from('.stage-frame', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
      }),
    { scope: root },
  );

  return (
    <section ref={root} id="stage" tabIndex={-1} aria-label="Live demo" className="scroll-mt-24 space-y-3 outline-none short:!mt-6">
      <StageControls
        width={width}
        unavailable={unavailable}
        onWidth={resize}
        theme={theme}
        onTheme={(next) => setPick({ slug: entry.meta.slug, theme: next })}
      />
      <div ref={room}>
        <div
          ref={frame}
          data-stage-theme={theme}
          data-width={width}
          className="stage-frame stage-surface mx-auto w-full overflow-hidden rounded-tile shadow-[0_0_0_1px_rgb(var(--color-line)),0_40px_80px_-40px_rgb(var(--color-accent-deep)/var(--shadow-alpha))]"
        >
          <StageCorners />
          <div ref={veil} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] opacity-0" />
          <div ref={rim} aria-hidden="true" className="stage-rim pointer-events-none absolute inset-x-0 top-0 z-[4] h-px opacity-0" />
          <div className="flex min-h-[520px] w-full items-center justify-center overflow-auto p-3 sm:p-8">
            <DemoBoundary
              fallback={(message) => (
                <p role="alert" className="max-w-[48ch] font-mono text-small">
                  This demo crashed while rendering: {message}
                </p>
              )}
            >
              <Suspense fallback={<p className="font-mono text-small opacity-70">Loading demo</p>}>
                <Demo />
              </Suspense>
            </DemoBoundary>
          </div>
        </div>
      </div>
      <p className="font-mono text-meta text-text-2" aria-live="polite">
        {WIDTH_NOTE[width]}, {THEME_NAME[theme]} stage
      </p>
    </section>
  );
}
