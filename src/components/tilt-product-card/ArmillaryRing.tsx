import type { CSSProperties } from 'react';

/** Neutral light and shade over any finish (page primitives with literal fallbacks), so one shading reads as metal in all three. */
const LIT = (a: number) => `rgb(var(--p-mist-0, 255 255 255) / ${a})`;
const SHADE = (a: number) => `rgb(var(--p-ink-990, 18 18 22) / ${a})`;

/**
 * A ring band cut from a disc by a radial mask. The mask ramps over 0.75px on both edges, so the band is anti-aliased
 * however the plane is turned, where a border on a rotated box steps and breaks into dashes edge on.
 */
function band(width: number, inset = 0): CSSProperties {
  const outer = `calc(100% - ${inset}px)`;
  const mask = `radial-gradient(closest-side, transparent calc(${outer} - ${width + 0.75}px), black calc(${outer} - ${width}px), black calc(${outer} - 0.75px), transparent ${outer})`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

/** The lit face: a fixed key from the upper left, the shade under it, a bounce on the far side (brushed metal). */
const FACE_SHADING = `conic-gradient(from 300deg, ${LIT(0.6)}, ${LIT(0.12)} 14%, ${SHADE(0.38)} 36%, ${SHADE(0.5)} 50%, ${SHADE(0.2)} 64%, ${LIT(0.22)} 82%, ${LIT(0.6)})`;
/** The specular arc: a short hot streak in the finish's highlight with a white core. It turns with the tilt. */
const SPEC = `conic-gradient(from -30deg, transparent, rgb(var(--f-hi) / 0.8) 4%, ${LIT(1)} 8%, rgb(var(--f-hi) / 0.8) 12%, transparent 17%, transparent)`;
/** Depths of the band's body layers behind the lit face, 1px apart: edge on, the stack reads as a solid 4px thick ring. */
const BODY = [-2, -1, 0, 1];
const FADE = 'transition-colors duration-[240ms] ease-out motion-reduce:transition-none';

interface Props {
  size: number;
  /** Band width in px. */
  width: number;
  css: string;
  dim: boolean;
  ringRef: (el: HTMLDivElement | null) => void;
  specRef: (el: HTMLDivElement | null) => void;
}

/**
 * One gimbal ring with real thickness: four body layers in the shade tone, a lit face in the body tone under a
 * fixed metal shading, and a specular arc that the tilt slides around the ring. Body colours crossfade with the finish.
 */
export default function ArmillaryRing({ size, width, css, dim, ringRef, specRef }: Props) {
  return (
    <div
      ref={ringRef}
      style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, transform: css }}
      className={`absolute left-0 top-0 will-change-transform [transform-style:preserve-3d] transition-opacity duration-[240ms] motion-reduce:transition-none ${dim ? 'opacity-50' : ''}`}
    >
      {BODY.map((z) => (
        <span
          key={z}
          style={{ ...band(width), transform: `translateZ(${z}px)` }}
          className={`absolute inset-0 rounded-full bg-[rgb(var(--f-lo))] ${FADE}`}
        />
      ))}
      <span style={{ ...band(width), transform: 'translateZ(2px)' }} className={`absolute inset-0 rounded-full bg-[rgb(var(--f-mid))] ${FADE}`}>
        <span className="absolute inset-0 rounded-full" style={{ background: FACE_SHADING }} />
        {/* The inner lip catches the light: a hairline in the highlight tone along the band's inner edge. */}
        <span style={band(1, width - 1)} className={`absolute inset-0 rounded-full bg-[rgb(var(--f-hi))] opacity-80 ${FADE}`} />
      </span>
      <div ref={specRef} style={{ ...band(width - 1.5, 0.75), background: SPEC }} className="absolute inset-0 rounded-full will-change-transform" />
    </div>
  );
}
