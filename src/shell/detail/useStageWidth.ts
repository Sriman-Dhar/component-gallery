import { useEffect, useRef, useState, type RefObject } from 'react';
import { gsap, motionAllowed } from '../../lib/motion';
import { PRESETS, type WidthPreset } from './StageControls';

const PX: Record<Exclude<WidthPreset, 'full'>, number> = { '375': 375, '768': 768 };

/**
 * The stage frame's width preset. The frame itself narrows to 375 or 768 and stays centered, tweened
 * 280ms on power3.inOut; Full releases the cap after the tween. A preset as wide as the room the frame
 * has (a phone, a narrow window) would change nothing, so it is reported as unavailable and, if it was
 * the active one, the stage falls back to Full.
 */
export function useStageWidth(room: RefObject<HTMLElement>, frame: RefObject<HTMLElement>) {
  const [width, setWidth] = useState<WidthPreset>('full');
  const [roomPx, setRoomPx] = useState(Infinity);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = room.current;
    if (!el) return;
    const measure = () => setRoomPx(el.clientWidth || Infinity);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [room]);
  useEffect(() => () => void tween.current?.kill(), []);

  const unavailable = PRESETS.map((p) => p.id).filter((id): id is Exclude<WidthPreset, 'full'> => id !== 'full' && PX[id] >= roomPx);

  const resize = (next: WidthPreset) => {
    setWidth(next);
    const el = frame.current;
    const box = room.current;
    if (!el || !box) return;
    const full = box.clientWidth;
    const target = next === 'full' ? full : Math.min(PX[next], full);
    const settle = () => void (el.style.maxWidth = next === 'full' ? '' : `${target}px`);
    tween.current?.kill();
    if (!motionAllowed()) return settle();
    tween.current = gsap.fromTo(
      el,
      { maxWidth: el.getBoundingClientRect().width },
      { maxWidth: target, duration: 0.28, ease: 'power3.inOut', onComplete: settle },
    );
  };

  // The active preset outgrew the room: release it back to Full.
  const stale = width !== 'full' && unavailable.includes(width);
  useEffect(() => {
    if (stale) resize('full');
    // resize is recreated every render; the flag alone decides.
  }, [stale]);

  return { width, unavailable: unavailable as WidthPreset[], resize };
}
