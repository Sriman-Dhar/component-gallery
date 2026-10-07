import type { MutableRefObject, RefObject } from 'react';
import { gsap, motionAllowed, POINTER_MOTION, useGSAP } from '../../lib/motion';
import { GLARE_PARK, GLASS_SCALE, RIM_PARK, RIM_REST, RINGS, glareFor, rimFor, spreadFor, tiltFor, vitrineBox } from './tiltMath';

export interface TiltParts {
  /** The untransformed card root: pointer coordinates are read against its box, so they never wobble with the tilt. */
  root: RefObject<HTMLElement>;
  /** The case: rotateX / rotateY. */
  tilt: RefObject<HTMLElement>;
  glare: RefObject<HTMLElement>;
  rim: RefObject<HTMLElement>;
  core: RefObject<HTMLElement>;
  rings: MutableRefObject<(HTMLElement | null)[]>;
}

const ROTATE = { duration: 0.45, ease: 'power3.out' };
const LIGHT = { duration: 0.3, ease: 'power3.out' };
const SPREAD = { duration: 0.6, ease: 'power3.out' };
/** Home: rotation and spread spring back with one soft overshoot (magnetic-button's elastic family). */
const HOME = { duration: 0.9, ease: 'elastic.out(1, 0.5)' };
const LIGHT_HOME = { duration: 0.6, ease: 'power3.out' };
/** Over a control the tilt halves, so a target never drifts out from under the cursor. */
const CONTROLS = 'a, button, input, label';

type QuickTo = ReturnType<typeof gsap.quickTo>;
type Track = [HTMLElement, string, QuickTo];

/**
 * Pointer tilt for the case. Runs only for a fine pointer that allows motion (POINTER_MOTION): touch and reduced
 * motion never attach a listener, and `still` attaches nothing at all. Every tween lives in the useGSAP scope and
 * its matchMedia, so unmount reverts them. Returns `flare`, the add-to-bag success pulse on the core.
 */
export function useTilt(parts: TiltParts, { maxTilt, still }: { maxTilt: number; still: boolean }) {
  const { contextSafe } = useGSAP(
    () => {
      // The ring poses go through GSAP once, so the spread's z tweens keep each ring's gimbal angle.
      parts.rings.current.forEach((el, i) => el && gsap.set(el, { ...RINGS[i].pose, z: 0 }));
      if (still) return;
      const mm = gsap.matchMedia();
      mm.add(POINTER_MOTION, (_context, contextSafeMm) => {
        const card = parts.root.current;
        const { tilt, glare, rim, core } = parts;
        const [outer, , inner] = parts.rings.current;
        const els = [tilt.current, glare.current, rim.current, core.current, outer, inner];
        if (!card || els.some((el) => !el)) return;
        const [t, g, r, c, o, n] = els as HTMLElement[];

        const tracks: Track[] = [
          [t, 'rotationX', gsap.quickTo(t, 'rotationX', ROTATE)],
          [t, 'rotationY', gsap.quickTo(t, 'rotationY', ROTATE)],
          // The core is a billboard: it turns against the case so it always faces the viewer.
          [c, 'rotationX', gsap.quickTo(c, 'rotationX', ROTATE)],
          [c, 'rotationY', gsap.quickTo(c, 'rotationY', ROTATE)],
          [g, 'x', gsap.quickTo(g, 'x', LIGHT)],
          [g, 'y', gsap.quickTo(g, 'y', LIGHT)],
          [r, 'x', gsap.quickTo(r, 'x', LIGHT)],
          [r, 'y', gsap.quickTo(r, 'y', LIGHT)],
          [r, 'opacity', gsap.quickTo(r, 'opacity', LIGHT)],
          [o, 'z', gsap.quickTo(o, 'z', SPREAD)],
          [n, 'z', gsap.quickTo(n, 'z', SPREAD)],
        ];
        let engaged = false;
        let settle: gsap.core.Timeline | null = null;
        const safe = <T extends (...args: never[]) => void>(fn: T): T => (contextSafeMm ? (contextSafeMm(fn) as T) : fn);

        const release = safe(() => {
          if (!engaged) return;
          engaged = false;
          tracks.forEach(([, , to]) => to.tween.pause());
          settle = gsap
            .timeline({ defaults: HOME })
            .to(t, { rotationX: 0, rotationY: 0 }, 0)
            .to(c, { rotationX: 0, rotationY: 0 }, 0)
            .to([o, n], { z: 0 }, 0)
            .to([g, r], { x: 0, y: 0, ...LIGHT_HOME }, 0)
            .to(r, { opacity: RIM_REST, ...LIGHT_HOME }, 0);
        });

        const onMove = safe((event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          const box = card.getBoundingClientRect();
          const overControl = event.target instanceof Element && event.target.closest(CONTROLS) !== null;
          const { rx, ry } = tiltFor(event.clientX, event.clientY, box, maxTilt * (overControl ? 0.5 : 1));
          const spread = spreadFor(rx, ry);
          // The glare moves in glass-local px (the glass is GLASS_SCALE of the vitrine); both lights move relative to their park points.
          const vit = vitrineBox(box);
          const halfW = (vit.width * GLASS_SCALE) / 2;
          const halfH = (vit.height * GLASS_SCALE) / 2;
          const at = glareFor(event.clientX, event.clientY, vit);
          const away = rimFor(at.x, at.y);
          const values = [
            rx,
            ry,
            -rx,
            -ry,
            (at.x - GLARE_PARK.x) * halfW,
            (at.y - GLARE_PARK.y) * halfH,
            // The rim lives on the case edge, so it moves in vitrine px.
            ((away.x - RIM_PARK.x) * vit.width) / 2,
            ((away.y - RIM_PARK.y) * vit.height) / 2,
            away.strength,
            spread * RINGS[0].spread,
            spread * RINGS[2].spread,
          ];
          const fresh = !engaged;
          if (fresh) {
            engaged = true;
            settle?.kill();
          }
          tracks.forEach(([el, prop, to], i) => {
            // After a spring home, restart each tracker from where the element really is.
            if (fresh) to(values[i], gsap.getProperty(el, prop) as number);
            else to(values[i]);
          });
        });

        card.addEventListener('pointermove', onMove, { passive: true });
        card.addEventListener('pointerleave', release);
        card.addEventListener('pointercancel', release);
        return () => {
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', release);
          card.removeEventListener('pointercancel', release);
        };
      });
      return () => mm.revert();
    },
    { scope: parts.root, dependencies: [still, maxTilt], revertOnUpdate: true },
  );

  /** Add to bag success: the core flares once (1 to 1.12 and back, 400ms). The only celebration; none under reduced motion. */
  const flare = contextSafe(() => {
    const core = parts.core.current;
    if (!core || still || !motionAllowed()) return;
    gsap.fromTo(core, { scale: 1 }, { scale: 1.12, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 });
  });

  return { flare };
}
