import { useEffect, useRef } from 'react';
import { gsap, POINTER_MOTION, useGSAP, withMotion } from '../lib/motion';
import { useInView } from '../lib/useInView';

/** Three beams from the top of the page: left offset (vw-free, in %), lean and drift range. */
const SHAFTS = [
  { left: '14%', rotate: 16, drift: 24 },
  { left: '46%', rotate: 9, drift: -18 },
  { left: '78%', rotate: -6, drift: 14 },
];

/**
 * The studio lighting: a warm key light top-left and a cool rim at the bottom of the page, both on a
 * page-height layer so their falloff is never cut at the viewport edge; three ultra-soft beams falling
 * from the top that drift slowly (still under reduced motion); a vignette that pulls the eye to the
 * center; and a pointer light in two layers, a tight warm core that leads and a wide halo that trails
 * behind it with inertia (gsap.quickTo, no React state). Below content, never takes input.
 */
export default function LightField() {
  const halo = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const beams = useRef<HTMLDivElement>(null);
  const drift = useRef<gsap.core.Tween[]>([]);
  // The beams live in the top 900px of the page; once scrolled past, their drift stops repainting the frame.
  const { active } = useInView(beams, true);
  const live = useRef(active);
  live.current = active;

  useGSAP(
    () =>
      withMotion(() => {
        drift.current = gsap.utils.toArray<HTMLElement>('.shaft', beams.current).map((el, i) =>
          gsap.to(el, { x: SHAFTS[i].drift, rotation: SHAFTS[i].rotate + 2, duration: 11 + i * 3, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: !live.current }),
        );
        return () => {
          drift.current = [];
        };
      }),
    { scope: beams },
  );

  useEffect(() => {
    drift.current.forEach((tween) => (active ? tween.resume() : tween.pause()));
  }, [active]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(POINTER_MOTION, () => {
      const wide = halo.current;
      const tight = core.current;
      if (!wide || !tight) return;
      const start = { x: window.innerWidth * 0.3, y: window.innerHeight * 0.2, autoAlpha: 1 };
      gsap.set([wide, tight], start);
      const follow = (el: HTMLElement, duration: number) => ({
        x: gsap.quickTo(el, 'x', { duration, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration, ease: 'power3.out' }),
      });
      const lead = follow(tight, 0.25);
      const trail = follow(wide, 0.9);
      const move = (event: PointerEvent) => {
        lead.x(event.clientX);
        lead.y(event.clientY);
        trail.x(event.clientX);
        trail.y(event.clientY);
      };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  });

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="light-key absolute inset-x-0 top-0 h-[900px]" />
        <div className="light-rim absolute inset-x-0 bottom-0 h-[900px]" />
        <div ref={beams} className="absolute inset-x-0 top-0 h-[900px]">
          {SHAFTS.map((shaft) => (
            <div key={shaft.left} className="shaft absolute -top-10" style={{ left: shaft.left, transform: `rotate(${shaft.rotate}deg)` }}>
              <div className="shaft-beam" />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div ref={halo} className="light-pointer invisible absolute left-0 top-0 rounded-full" />
        <div ref={core} className="light-core invisible absolute left-0 top-0 rounded-full" />
      </div>
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-[1]" />
    </>
  );
}
