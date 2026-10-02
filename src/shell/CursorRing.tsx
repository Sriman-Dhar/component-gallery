import { useRef } from 'react';
import { gsap, POINTER_MOTION, useGSAP } from '../lib/motion';
import { world } from './world/worldState';

const INTERACTIVE = 'a, button, [role="button"], summary, label, [data-cursor="pointer"]';
/** Where the native cursor is the tool (typing, selecting code), the ring steps out of the way. */
const TEXTUAL = 'input, textarea, select, [contenteditable="true"], pre, code';

/**
 * The pointer's light in the world: a small lit ring that trails the native cursor (which stays), swells and
 * warms over anything clickable, tightens while the orrery is grabbed, and hides over text fields and code.
 * It also feeds the scene's pointer well on every route. Fine pointers with motion allowed only; it rides
 * GSAP's ticker (quickTo), so it adds no loop of its own.
 */
export default function CursorRing() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(POINTER_MOTION, () => {
      const el = root.current!;
      const x = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        x(event.clientX);
        y(event.clientY);
        world.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        world.pointer.y = 1 - (event.clientY / window.innerHeight) * 2;
        world.pointer.on = 1;
        const target = event.target instanceof Element ? event.target : null;
        const state = !target
          ? 'idle'
          : target.closest(TEXTUAL)
            ? 'text'
            : target.closest('[data-cursor="grabbing"]')
              ? 'grab'
              : target.closest(INTERACTIVE)
                ? 'hot'
                : 'idle';
        if (el.dataset.state !== state) el.dataset.state = state;
        // On paper (the light frame or a light stage) the ring takes a warm-ink stroke so it never fades out.
        const paper = document.documentElement.dataset.theme === 'light' || Boolean(target?.closest('[data-stage-theme="light"]'));
        if (el.dataset.paper !== String(paper)) el.dataset.paper = String(paper);
        el.dataset.on = 'true';
      };
      const leave = () => {
        el.dataset.on = 'false';
        world.pointer.on = 0;
      };
      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      return () => {
        window.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', leave);
      };
    });
    return () => mm.revert();
  });

  return (
    <div ref={root} aria-hidden="true" data-on="false" data-state="idle" className="cursor-ring pointer-events-none fixed left-0 top-0 z-[60]">
      <span className="cursor-ring-dot" />
    </div>
  );
}
