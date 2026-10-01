import { useMemo } from 'react';
import { ORRERY_ASPECT, POSTER_YAW, project, RINGS, SLOT_COUNT, slotOf } from './orreryModel';

const STEPS = 120;
const HALF_HEIGHT = 0.5 / ORRERY_ASPECT;

/** One ring as two dotted paths, the half facing the viewer and the half behind, from the same projection. */
function ringPaths(ring: number): { front: string; back: string } {
  let front = '';
  let back = '';
  let prev: 'front' | 'back' | null = null;
  for (let i = 0; i <= STEPS; i++) {
    const p = project(ring, i / STEPS, 0, POSTER_YAW);
    const side = p.z >= 0 ? 'front' : 'back';
    const cmd = side === prev ? 'L' : 'M';
    const seg = `${cmd}${p.x.toFixed(4)} ${(-p.y).toFixed(4)}`;
    if (side === 'front') front += seg;
    else back += seg;
    prev = side;
  }
  return { front, back };
}

/**
 * The orrery as a still: dotted rings (the particle language at rest), the 30 slots with the shipped ones
 * lit and blooming, the core glowing around a hot point. Near slots are drawn larger (the same perspective). It is the whole orrery without WebGL or with reduced motion, and the underlay the
 * particles assemble over, fading out once they are live.
 */
export default function OrreryPoster({ shipped, hidden = false }: { shipped: number; hidden?: boolean }) {
  const rings = useMemo(() => RINGS.map((_, i) => ringPaths(i)), []);
  const slots = useMemo(
    () =>
      Array.from({ length: SLOT_COUNT }, (_, i) => {
        const at = slotOf(i);
        return { i, ...project(at.ring, at.u, 0, POSTER_YAW) };
      }),
    [],
  );

  return (
    <svg
      viewBox={`-0.5 ${-HALF_HEIGHT} 1 ${HALF_HEIGHT * 2}`}
      className="absolute inset-0 h-full w-full overflow-visible transition-opacity duration-slow"
      style={{ opacity: hidden ? 0 : 1 }}
      data-testid="orrery-poster"
    >
      <defs>
        <radialGradient id="orrery-core">
          <stop offset="0%" className="orrery-stop-core" />
          <stop offset="45%" className="orrery-stop-body" />
          <stop offset="100%" className="orrery-stop-clear" />
        </radialGradient>
        <filter id="orrery-bloom" x="-2" y="-2" width="5" height="5">
          <feGaussianBlur stdDeviation="0.01" />
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round">
        {rings.map(({ back }, i) => (
          <path key={i} d={back} className="stroke-accent/25" strokeWidth={1.6} strokeDasharray="0 5" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <circle r={0.07} fill="url(#orrery-core)" />
      <circle r={0.016} className="fill-glow" filter="url(#orrery-bloom)" />
      <circle r={0.007} className="orrery-hot" />
      <g fill="none" strokeLinecap="round">
        {rings.map(({ front }, i) => (
          <path key={i} d={front} className="stroke-accent/80" strokeWidth={2} strokeDasharray="0 3.5" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {slots.map(({ i, x, y, s }) => {
        const lit = i < shipped;
        return (
          <g key={i} data-slot={i + 1} data-lit={lit ? 'true' : 'false'}>
            {lit ? <circle cx={x} cy={-y} r={0.03 * s} className="fill-accent/60" filter="url(#orrery-bloom)" /> : null}
            <circle cx={x} cy={-y} r={(lit ? 0.011 : 0.005) * s} className={lit ? 'fill-glow' : 'fill-rim/70'} />
          </g>
        );
      })}
    </svg>
  );
}
