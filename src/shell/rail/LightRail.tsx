import { useMemo, useRef } from 'react';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import { todayCaption, weekOf } from '../../lib/ruler';
import { useWorldStatus } from '../world/worldState';
import RailPoster from './RailPoster';
import RailPulse from './RailPulse';
import { RAIL_BOX, type RailVariant } from './railLayout';

export interface RailMark {
  slug: string;
  date: string;
}

interface Props {
  variant: RailVariant;
  /** Shipped components; each lights the week it shipped in. Ignored on the unlit variant. */
  marks?: RailMark[];
  /** This component's week (detail page): its node blooms once on mount. */
  litWeek?: number;
  /** Injectable for tests; defaults to now. */
  today?: Date;
}

/**
 * The light rail, the signature on every route. Hero: the anchor the Living Orrery's particles stream into
 * and form (its box carries data-world-anchor); while the scene is live the drawn line steps back to a track
 * and the scene warms the week labels; without the scene it is the SVG poster with its DOM pulse.
 * Compact: poster with the week blooming. Unlit: the 404's dead rail that flickers twice and rests dim.
 */
export default function LightRail({ variant, marks = [], litWeek, today = new Date() }: Props) {
  const root = useRef<HTMLElement>(null);
  const status = useWorldStatus();
  const formed = variant === 'hero' && status === 'live';
  const { height, base } = RAIL_BOX[variant];
  const litWeeks = useMemo(() => new Set(marks.map((m) => weekOf(m.date))), [marks]);

  useGSAP(
    () =>
      withMotion(
        () => {
          if (variant === 'unlit') {
            gsap
              .timeline({ delay: 0.2 })
              .fromTo(root.current, { opacity: 0.2 }, { opacity: 0.6, duration: 0.08, ease: 'none' })
              .to(root.current, { opacity: 0.15, duration: 0.12, ease: 'none' })
              .to(root.current, { opacity: 0.6, duration: 0.06, ease: 'none' })
              .to(root.current, { opacity: 0.6, duration: 0.5, ease: 'power2.out' });
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.from('.rail-line', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9 })
            .from('.rail-node', { scale: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.03 }, 0.15)
            .from('.rail-cursor', { autoAlpha: 0, duration: 0.3 }, 0.5);
          if (variant === 'compact') {
            tl.to('.rail-bloom', { scale: 1.6, duration: 0.3, ease: 'power2.out' }, 0.7).to('.rail-bloom', {
              scale: 1.2,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          }
        },
        () => {
          if (variant === 'unlit') gsap.set(root.current, { opacity: 0.6 });
          if (variant === 'compact') gsap.set('.rail-bloom', { scale: 1.2, transformOrigin: '50% 50%' });
        },
      ),
    { scope: root },
  );

  const weekCount = marks.filter((mark) => weekOf(mark.date) === litWeek).length;
  const label = [
    'Light rail, 1 Oct to 30 Dec 2026',
    variant === 'unlit' ? 'nothing lit' : `${marks.length} ${marks.length === 1 ? 'component' : 'components'} shipped`,
    litWeek ? `Week ${litWeek} highlighted` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <figure ref={root} data-testid="light-rail" data-variant={variant} className="w-full">
      <div
        className="relative overflow-hidden"
        style={{ height }}
        data-world-anchor={variant === 'hero' ? 'rail' : undefined}
        data-base={base}
      >
        <RailPoster variant={variant} litWeeks={litWeeks} bloomWeek={litWeek} today={today} label={label} dim={formed} />
        {variant !== 'unlit' && !formed ? <RailPulse base={base} /> : null}
      </div>
      <figcaption className="rail-caption mt-2 flex items-baseline justify-between gap-4 font-mono text-meta text-text-2">
        <span>1 Oct</span>
        <span className={variant === 'unlit' ? '' : 'text-text'}>
          {variant === 'unlit' ? 'No signal' : todayCaption(today)}
          {/* The compact rail says what its lit week holds, so the one bright tick is not the whole story. */}
          {variant === 'compact' && litWeek ? <span className="hidden text-text-2 sm:inline">{`, ${weekCount} shipped in week ${litWeek}`}</span> : null}
        </span>
        <span>30 Dec</span>
      </figcaption>
    </figure>
  );
}
