import { WEEK_COUNT, pct, positionOf, weekCenter } from '../../lib/ruler';
import { RAIL_BOX, type RailVariant } from './railLayout';

interface Props {
  variant: RailVariant;
  litWeeks: Set<number>;
  bloomWeek?: number;
  today: Date;
  label: string;
}

const WEEKS = Array.from({ length: WEEK_COUNT }, (_, i) => i + 1);

/**
 * The rail as plain SVG: the line, the lit span up to today, 13 week nodes, the today cursor in rim.
 * It is the whole rail without WebGL or with reduced motion, and the underlay beneath the particles.
 */
export default function RailPoster({ variant, litWeeks, bloomWeek, today, label }: Props) {
  const { height, base } = RAIL_BOX[variant];
  const unlit = variant === 'unlit';
  const cursor = pct(positionOf(today));
  const labelY = variant === 'hero' ? base + 40 : base + 22;

  return (
    <svg role="img" aria-label={label} width="100%" height={height} className="absolute inset-0 block overflow-visible">
      <line className="rail-line stroke-text-2/40" x1="0" x2="100%" y1={base} y2={base} strokeWidth={1} />
      {!unlit ? (
        <line className="rail-line stroke-accent/70" x1="0" x2={cursor} y1={base} y2={base} strokeWidth={1.5} />
      ) : null}
      {WEEKS.map((week) => {
        const lit = !unlit && litWeeks.has(week);
        const bloom = week === bloomWeek;
        return (
          <circle
            key={week}
            data-node={week}
            data-lit={lit || bloom ? 'true' : 'false'}
            className={`rail-node ${bloom ? 'rail-bloom' : ''} ${lit || bloom ? 'rail-lit fill-glow' : 'fill-bg stroke-text-2/60'}`}
            cx={pct(weekCenter(week))}
            cy={base}
            r={lit || bloom ? 4 : 3}
            strokeWidth={lit || bloom ? 0 : 1}
          />
        );
      })}
      {WEEKS.map((week) => (
        <text
          key={week}
          x={pct(weekCenter(week))}
          y={labelY}
          textAnchor="middle"
          className={`font-mono text-meta ${week === bloomWeek ? 'fill-accent' : 'fill-text-2'}`}
        >
          {week}
        </text>
      ))}
      {!unlit ? (
        <line className="rail-cursor stroke-rim" x1={cursor} x2={cursor} y1={base - 14} y2={base + 14} strokeWidth={1.5} />
      ) : null}
    </svg>
  );
}
