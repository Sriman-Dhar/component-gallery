import type { CSSProperties, RefObject } from 'react';
import { GLASS_SCALE, GLASS_Z } from './tiltMath';

/** The glass is drawn smaller and pushed forward, so through the perspective it lands exactly on the vitrine. */
const GLASS_INSET = `${(((1 - GLASS_SCALE) / 2) * 100).toFixed(3)}%`;
/**
 * Soft edges on all four sides: wherever the glare sits, it fades out before the case border, never a hard cut.
 * Masks are inline styles, not utility classes, so the longhands can never be reset by a shorthand's CSS order.
 */
const FADE = (dir: string) => `linear-gradient(${dir}, transparent, black 16%, black 84%, transparent)`;
const EDGE_FADE: CSSProperties = {
  maskImage: `${FADE('to right')}, ${FADE('to bottom')}`,
  WebkitMaskImage: `${FADE('to right')}, ${FADE('to bottom')}`,
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
};
/**
 * The rim hugs the case opening itself (in the case's own plane, not on the forward glass, whose edge would float
 * off the opening at full tilt): four edge ramps 12px deep, brightest on the edge, so it reads as light on a rim.
 */
const RAMP = (dir: string) => `linear-gradient(${dir}, black, transparent 12px)`;
const RIM_RAMPS = [RAMP('to right'), RAMP('to left'), RAMP('to bottom'), RAMP('to top')].join(', ');
const EDGE_ONLY: CSSProperties = { maskImage: RIM_RAMPS, WebkitMaskImage: RIM_RAMPS };

interface Props {
  glare: RefObject<HTMLDivElement>;
  rim: RefObject<HTMLDivElement>;
}

/**
 * The two lights, both pre-painted gradients that only ever move by transform (PERF.md: the cursor light fix): the
 * amber glare on the forward glass, resting upper left where the site's key light sits, and the cool rim on the case
 * edge, resting lower right. No blend modes, no filters.
 */
export default function CardLight({ glare, rim }: Props) {
  return (
    <>
      <div aria-hidden="true" style={EDGE_ONLY} className="pointer-events-none absolute inset-0 overflow-hidden rounded-control">
        <div
          ref={rim}
          className="absolute left-[80%] top-[82%] -ml-[150px] -mt-[150px] h-[300px] w-[300px] rounded-full opacity-[0.55] will-change-transform [background:radial-gradient(closest-side,rgb(var(--tc-rim)),rgb(var(--tc-rim)/0.45)_50%,transparent)]"
        />
      </div>
      <div
        aria-hidden="true"
        style={{ inset: GLASS_INSET, transform: `translateZ(${GLASS_Z}px)` }}
        className="pointer-events-none absolute overflow-hidden rounded-[7px]"
      >
        <div style={EDGE_FADE} className="absolute inset-0">
          <div
            ref={glare}
            className="absolute left-[24%] top-[22%] -ml-[150px] -mt-[150px] h-[300px] w-[300px] rounded-full will-change-transform [background:radial-gradient(closest-side,rgb(var(--tc-glare)/var(--tc-glare-alpha)),rgb(var(--tc-glare-edge)/var(--tc-glare-edge-alpha))_48%,transparent)]"
          />
        </div>
      </div>
    </>
  );
}
