import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** full: every tween. reduced: instant press only. none: no matchMedia (tests, SSR), nothing moves. */
export type MotionMode = 'full' | 'reduced' | 'none';

const QUERIES = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  fine: '(pointer: fine)',
};

/** Pull engages when the pointer is within this many px of the button's edge. */
const RADIUS = 80;
/** The fill travels this fraction of the cursor offset, capped. */
const FILL = { ratio: 0.22, cap: 8 };
/** The label leads the fill by a little more, so the press reads as depth, not a flat slide. */
const LABEL = { ratio: 0.06, cap: 3 };
const TRACK = { duration: 0.4, ease: 'power3.out' };

type QuickTo = ReturnType<typeof gsap.quickTo>;

/** Scales the offset vector down to `cap` without changing its direction. */
function clampVector(x: number, y: number, cap: number): [number, number] {
  const length = Math.hypot(x, y);
  if (length <= cap || length === 0) return [x, y];
  return [(x / length) * cap, (y / length) * cap];
}

interface MagneticTargets {
  root: RefObject<HTMLElement>;
  fill: RefObject<HTMLElement>;
  glow: RefObject<HTMLElement>;
  label: RefObject<HTMLElement>;
  mode: MutableRefObject<MotionMode>;
  enabled: boolean;
}

/**
 * The magnetic pull. The button element itself never moves (its hit area stays honest); the fill,
 * label and an inner key light drift toward the exact cursor position through quickTo tweens.
 * Leaving the radius pauses the trackers and eases everything home with a soft overshoot.
 * Only for a fine pointer that allows motion; touch and reduced motion never attach the listener.
 */
export function useMagneticPull({ root, fill, glow, label, mode, enabled }: MagneticTargets) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const releaseRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (!enabled) releaseRef.current();
  }, [enabled]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(QUERIES, (context, contextSafe) => {
        const { motion, reduced, fine } = context.conditions as Record<keyof typeof QUERIES, boolean>;
        mode.current = motion ? 'full' : reduced ? 'reduced' : 'none';
        const button = root.current;
        const els = [fill.current, label.current, glow.current];
        if (!motion || !fine || !button || els.some((el) => !el)) return () => void (mode.current = 'none');
        const [f, l, g] = els as HTMLElement[];

        const glowTrack = { duration: 0.25, ease: 'power2.out' };
        const trackers: [HTMLElement, 'x' | 'y', QuickTo][] = [
          [f, 'x', gsap.quickTo(f, 'x', TRACK)],
          [f, 'y', gsap.quickTo(f, 'y', TRACK)],
          [l, 'x', gsap.quickTo(l, 'x', TRACK)],
          [l, 'y', gsap.quickTo(l, 'y', TRACK)],
          [g, 'x', gsap.quickTo(g, 'x', glowTrack)],
          [g, 'y', gsap.quickTo(g, 'y', glowTrack)],
        ];
        let engaged = false;
        let settle: gsap.core.Timeline | null = null;

        // Listener callbacks join the matchMedia context, so its revert also kills tweens they started.
        const safe = <T extends (...args: never[]) => void>(fn: T): T => (contextSafe ? (contextSafe(fn) as T) : fn);
        const release = safe(() => {
          if (!engaged) return;
          engaged = false;
          trackers.forEach(([, , to]) => to.tween.pause());
          settle = gsap
            .timeline({ defaults: { duration: 0.75, ease: 'back.out(2.6)' } })
            .to([f, l], { x: 0, y: 0 }, 0)
            .to(g, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0);
        });

        const onMove = safe((event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          if (!enabledRef.current) return release();
          const r = button.getBoundingClientRect();
          const edgeX = Math.max(r.left - event.clientX, 0, event.clientX - r.right);
          const edgeY = Math.max(r.top - event.clientY, 0, event.clientY - r.bottom);
          if (Math.hypot(edgeX, edgeY) > RADIUS) return release();

          // Offset from the button centre to the exact cursor point: the pull aims there, never at an edge.
          const dx = event.clientX - (r.left + r.width / 2);
          const dy = event.clientY - (r.top + r.height / 2);
          const [fx, fy] = clampVector(dx * FILL.ratio, dy * FILL.ratio, FILL.cap);
          const [lx, ly] = clampVector(dx * LABEL.ratio, dy * LABEL.ratio, LABEL.cap);
          const gx = gsap.utils.clamp(-r.width / 2, r.width / 2, dx - fx);
          const gy = gsap.utils.clamp(-r.height / 2, r.height / 2, dy - fy);
          const values = [fx, fy, fx + lx, fy + ly, gx, gy];

          const fresh = !engaged;
          if (fresh) {
            engaged = true;
            settle?.kill();
            gsap.to(g, { opacity: 1, duration: 0.3, ease: 'power1.out', overwrite: 'auto' });
          }
          trackers.forEach(([el, prop, to], i) => {
            // After a settle, restart each tracker from where the element really is, not where it last aimed.
            if (fresh) to(values[i], gsap.getProperty(el, prop) as number);
            else to(values[i]);
          });
        });

        releaseRef.current = release;
        document.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', release);
        return () => {
          document.removeEventListener('pointermove', onMove);
          document.documentElement.removeEventListener('pointerleave', release);
          releaseRef.current = () => undefined;
          mode.current = 'none';
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
