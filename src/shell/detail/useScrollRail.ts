import { useEffect, useState, type RefObject } from 'react';
import { ScrollTrigger } from '../../lib/motion';

/** A stop lights when its section's top crosses this line in the viewport. */
const STOP_LINE = 'top 70%';
const clamp = (n: number) => Math.min(1, Math.max(0, n));

interface Fills {
  /** The vertical fill (scaleY) and the travelling head (translateY in % of the rail). */
  fill: RefObject<HTMLElement>;
  head: RefObject<HTMLElement>;
  /** The phone bar under the header (scaleX). */
  bar: RefObject<HTMLElement>;
}

/**
 * Page progress for the detail rail, driven by ScrollTrigger (no scroll listener, no per-frame React
 * state). Each stop sits on the rail where the page's progress equals its section's light line, so the
 * fill reaches a node at the moment that node lights. Returns the stop positions (0..1) and how many
 * are lit; both change only on refresh or when a stop is crossed. Re-measures when the page resizes
 * (the code loads late and files open and close).
 */
export function useScrollRail(ids: string[], { fill, head, bar }: Fills) {
  const [stops, setStops] = useState<number[]>(() => ids.map(() => 0));
  const [lit, setLit] = useState(0);
  const key = ids.join('|');

  useEffect(() => {
    let positions = ids.map(() => 0);
    const marks = ids.map((id) => {
      const el = document.getElementById(id);
      return el ? ScrollTrigger.create({ trigger: el, start: STOP_LINE }) : null;
    });

    const apply = (progress: number) => {
      if (fill.current) fill.current.style.transform = `scaleY(${progress})`;
      if (head.current) head.current.style.transform = `translateY(${progress * 100}%)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      setLit(positions.filter((at) => progress >= at - 0.002).length);
    };
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      positions = marks.map((mark) => (mark ? clamp(mark.start / max) : 1));
      setStops(positions);
    };

    const page = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
    });
    measure();
    apply(page.progress);

    let timer = 0;
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
          });
    observer?.observe(document.body);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      page.kill();
      marks.forEach((mark) => mark?.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the ids (joined as key) are the identity; the refs are stable.
  }, [key]);

  return { stops, lit };
}
