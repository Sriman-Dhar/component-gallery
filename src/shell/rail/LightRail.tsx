import { lazy, Suspense, useMemo, useRef, useState, type PointerEvent } from 'react';
import { gsap, motionAllowed, useGSAP, withMotion } from '../../lib/motion';
import { todayCaption, weekCenter, weekOf } from '../../lib/ruler';
import { useInView } from '../../lib/useInView';
import { canUseWebGL } from '../../lib/webgl';
import RailPoster from './RailPoster';
import RailPulse from './RailPulse';
import { pulseHeat, RAIL_BOX, type RailVariant } from './railLayout';
import type { RailPointer } from './RailParticles';

const RailCanvas = lazy(() => import('./RailCanvas'));

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
 * The light rail, the signature on every route. Hero: SVG poster plus a WebGL particle rail
 * mounted when near the viewport and paused when it leaves. Compact: poster with the week blooming.
 * Unlit: the 404's dead rail that flickers twice and rests dim.
 */
export default function LightRail({ variant, marks = [], litWeek, today = new Date() }: Props) {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef<RailPointer>({ x: 0, y: 0, on: 0 });
  const [canvasOk] = useState(() => variant === 'hero' && motionAllowed() && canUseWebGL());
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const { near, active } = useInView(box, canvasOk && !lost);
  const { height, base } = RAIL_BOX[variant];
  const litWeeks = useMemo(() => [...new Set(marks.map((m) => weekOf(m.date)))], [marks]);
  const litSet = useMemo(() => new Set(litWeeks), [litWeeks]);
  const showCanvas = canvasOk && !lost && near;
  const labels = useRef<SVGTextElement[]>();

  // The week numbers brighten as the particle pulse passes them (style writes only, no React state).
  function onPulse(head: number) {
    labels.current ??= [...(root.current?.querySelectorAll<SVGTextElement>('[data-week-label]') ?? [])];
    for (const el of labels.current) {
      el.style.setProperty('--heat', pulseHeat(head, weekCenter(Number(el.dataset.weekLabel))).toFixed(3));
    }
  }

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
              .to(root.current, { opacity: 0.35, duration: 0.5, ease: 'power2.out' });
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
          if (variant === 'unlit') gsap.set(root.current, { opacity: 0.35 });
          if (variant === 'compact') gsap.set('.rail-bloom', { scale: 1.2, transformOrigin: '50% 50%' });
        },
      ),
    { scope: root },
  );

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = event.clientX - rect.left - rect.width / 2;
    pointer.current.y = rect.height / 2 - (event.clientY - rect.top);
    pointer.current.on = 1;
  }

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
        ref={box}
        className="relative overflow-hidden"
        style={{ height }}
        onPointerMove={showCanvas ? onPointerMove : undefined}
        onPointerLeave={() => (pointer.current.on = 0)}
      >
        <RailPoster variant={variant} litWeeks={litSet} bloomWeek={litWeek} today={today} label={label} dim={ready} />
        {variant !== 'unlit' && !ready ? <RailPulse base={base} /> : null}
        {showCanvas ? (
          <Suspense fallback={null}>
            <RailCanvas
              litWeeks={litWeeks}
              active={active}
              pointer={pointer}
              onPulse={onPulse}
              onReady={() => setReady(true)}
              onLost={() => {
                setLost(true);
                setReady(false);
              }}
            />
          </Suspense>
        ) : null}
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between gap-4 font-mono text-meta text-text-2">
        <span>1 Oct</span>
        <span className={variant === 'unlit' ? '' : 'text-text'}>{variant === 'unlit' ? 'No signal' : todayCaption(today)}</span>
        <span>30 Dec</span>
      </figcaption>
    </figure>
  );
}
