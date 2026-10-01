import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, motionAllowed, useGSAP, withMotion } from '../../lib/motion';
import type { GalleryEntry } from '../../lib/types';
import DemoBoundary from '../DemoBoundary';
import StageControls, { type StageTheme, type WidthPreset } from './StageControls';

const PX: Record<Exclude<WidthPreset, 'full'>, number> = { '375': 375, '768': 768 };
const WIDTH_NOTE: Record<WidthPreset, string> = { '375': '375 px viewport', '768': '768 px viewport', full: 'Full width' };
const THEME_NAME: Record<StageTheme, string> = { light: 'Light', dark: 'Dark' };

/** The stage: 1px grid, its own light/dark theme, three viewport widths. Slides up into place. */
export default function Stage({ entry }: { entry: GalleryEntry }) {
  const Demo = useMemo(() => lazy(entry.loadDemo), [entry]);
  const root = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [width, setWidth] = useState<WidthPreset>('full');
  const [theme, setTheme] = useState<StageTheme>('light');

  useGSAP(
    () =>
      withMotion(() => {
        // Opacity, not visibility: a demo may take focus on mount.
        gsap.from('.stage-frame', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
      }),
    { scope: root },
  );
  useEffect(() => () => void tween.current?.kill(), []);

  /** Tweens the inner frame's width to the preset (280ms, power3.inOut); Full releases the cap after. */
  const resize = (next: WidthPreset) => {
    setWidth(next);
    const el = viewport.current;
    const box = surface.current;
    if (!el || !box) return;
    const full = box.clientWidth;
    const target = next === 'full' ? full : Math.min(PX[next], full);
    const settle = () => {
      el.style.maxWidth = next === 'full' ? '' : `${target}px`;
    };
    tween.current?.kill();
    if (!motionAllowed()) return settle();
    tween.current = gsap.fromTo(
      el,
      { maxWidth: el.getBoundingClientRect().width },
      { maxWidth: target, duration: 0.28, ease: 'power3.inOut', onComplete: settle },
    );
  };

  return (
    <section ref={root} aria-label="Live demo" className="space-y-3">
      <StageControls width={width} onWidth={resize} theme={theme} onTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <div
        ref={surface}
        data-stage-theme={theme}
        className="stage-frame stage-surface overflow-hidden rounded-tile shadow-[0_0_0_1px_rgb(var(--color-line)),0_40px_80px_-40px_rgb(var(--color-accent-deep)/var(--shadow-alpha))]"
      >
        <div
          ref={viewport}
          data-width={width}
          className="mx-auto flex min-h-[520px] w-full items-center justify-center overflow-auto border-x border-dashed p-4 sm:p-8"
          style={{ borderColor: width === 'full' ? 'transparent' : 'rgb(var(--stage-fg) / 0.18)' }}
        >
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
      <p className="font-mono text-meta text-text-2" aria-live="polite">
        {WIDTH_NOTE[width]}, {THEME_NAME[theme]} stage
      </p>
    </section>
  );
}
