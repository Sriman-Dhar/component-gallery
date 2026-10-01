import { useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const MOTION_OK = '(prefers-reduced-motion: no-preference)';
/** Delay between cells in the paste cascade. */
const CASCADE_STAGGER = 0.025;
/** The rejected-code shake, in px, and the field width under which it swings half as far. */
const SHAKE_X = [0, -10, 9, -7, 5, -2, 0];
const NARROW_PX = 340;

/**
 * The component's motion, all of it GSAP and all of it skipped under reduced motion:
 * one shake on a rejected code, a pop-in cascade with a faint ring flash when a pasted code lands,
 * and the caret blink. `caretKey` changes whenever the caret moves, so the blink restarts on it.
 */
export function useOtpMotion(root: RefObject<HTMLElement>, row: RefObject<HTMLElement>, caretKey: string) {
  const motionOk = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        motionOk.current = true;
        return () => void (motionOk.current = false);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The caret blinks on a hard step, like a text caret. Reduced motion leaves it solid.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const caret = root.current?.querySelector('.otp-caret');
        if (caret) gsap.to(caret, { opacity: 0, duration: 0.53, ease: 'steps(1)', repeat: -1, yoyo: true, delay: 0.5 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [caretKey], revertOnUpdate: true },
  );

  const shake = contextSafe(() => {
    if (!motionOk.current || !row.current) return;
    // A narrow field (a phone) has no slack around the row: a smaller swing keeps it inside its stage.
    const narrow = (row.current.parentElement?.clientWidth ?? NARROW_PX) < NARROW_PX;
    const swing = SHAKE_X.map((x) => (narrow ? Math.round(x * 0.5) : x));
    gsap.fromTo(row.current, { x: 0 }, { keyframes: { x: swing, easeEach: 'sine.inOut' }, duration: 0.42, overwrite: true });
  });

  /** Cells start..start+count pop in one after another (scale 0.9 to 1, opacity) under a faint ring flash. */
  const cascade = contextSafe((start: number, count: number) => {
    const host = root.current;
    if (!motionOk.current || !host) return;
    const cells = gsap.utils.toArray<HTMLElement>('.otp-cell', host).slice(start, start + count);
    const flashes = cells.map((cell) => cell.querySelector('.otp-flash')).filter(Boolean) as HTMLElement[];
    // Opacity only, never visibility: the focused last cell must keep focus while it pops in.
    gsap.fromTo(
      cells,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'power2.out', stagger: CASCADE_STAGGER, overwrite: true, clearProps: 'transform,opacity' },
    );
    gsap.fromTo(
      flashes,
      { opacity: 0 },
      { keyframes: { opacity: [0, 0.65, 0] }, duration: 0.5, ease: 'power1.out', stagger: CASCADE_STAGGER, overwrite: true },
    );
  });

  return { shake, cascade };
}
