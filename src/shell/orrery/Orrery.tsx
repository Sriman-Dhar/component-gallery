import { lazy, Suspense, useRef, useState, type PointerEvent } from 'react';
import { motionAllowed } from '../../lib/motion';
import { useInView } from '../../lib/useInView';
import { canUseWebGL } from '../../lib/webgl';
import type { RailPointer } from '../rail/RailParticles';
import { ORRERY_ASPECT, POSTER_YAW } from './orreryModel';
import OrreryPoster from './OrreryPoster';
import { createSpin, dragEnd, dragMove, dragStart } from './orrerySpin';

const OrreryCanvas = lazy(() => import('./OrreryCanvas'));

/**
 * The hero's live object: the 30 components as an orrery, the shipped ones lit. Decorative (the fraction
 * beside it says the same in words), so it is hidden from assistive tech and takes no focus. Poster first;
 * the particle layer mounts near the viewport, pauses offscreen, and falls back to the poster if lost.
 * A horizontal drag spins it (touch keeps vertical scrolling: touch-action pan-y).
 */
export default function Orrery({ shipped }: { shipped: number }) {
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef<RailPointer>({ x: 0, y: 0, on: 0 });
  const spin = useRef(createSpin(POSTER_YAW));
  const [canvasOk] = useState(() => motionAllowed() && canUseWebGL());
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const { near, active } = useInView(box, canvasOk && !lost);
  const live = canvasOk && !lost && near;

  function track(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = event.clientX - rect.left - rect.width / 2;
    pointer.current.y = rect.height / 2 - (event.clientY - rect.top);
    pointer.current.on = 1;
    dragMove(spin.current, event.clientX, event.timeStamp);
  }

  function grab(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStart(spin.current, event.clientX, event.timeStamp);
  }

  function release(event: PointerEvent<HTMLDivElement>) {
    dragEnd(spin.current, event.timeStamp);
    if (event.pointerType !== 'mouse') pointer.current.on = 0;
  }

  return (
    <div
      ref={box}
      aria-hidden="true"
      data-testid="orrery"
      data-live={live && ready ? 'true' : 'false'}
      style={{ aspectRatio: ORRERY_ASPECT }}
      className={`relative w-full select-none ${live ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''}`}
      onPointerDown={live ? grab : undefined}
      onPointerMove={live ? track : undefined}
      onPointerUp={live ? release : undefined}
      onPointerCancel={live ? release : undefined}
      onPointerLeave={() => (pointer.current.on = 0)}
    >
      <div className="orrery-atmos pointer-events-none absolute -inset-x-[6%] -inset-y-[14%]" />
      <OrreryPoster shipped={shipped} hidden={ready} />
      {live ? (
        <Suspense fallback={null}>
          <OrreryCanvas
            shipped={shipped}
            active={active}
            pointer={pointer}
            spin={spin}
            onReady={() => setReady(true)}
            onLost={() => {
              setLost(true);
              setReady(false);
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
