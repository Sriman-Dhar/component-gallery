import { useRef } from 'react';
import { TARGET } from '../../lib/catalogue';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

const TICKS = Array.from({ length: TARGET }, (_, i) => i);

/**
 * The index's oversized moment, a designed fraction: the shipped count as a lit numeral in the display
 * face (136px, 96 on phones) with a bloom behind it, the total ghosted as an outline, and a micro rail
 * of one tick per component with the shipped ones lit. Load: the ticks draw in, the count runs up
 * (0.9s, expo.out) with the lamp dim, then it ignites (flicker, settle) and the bloom swells once.
 * Reduced motion: the settled, lit state.
 */
export default function CountUp({ count }: { count: number }) {
  const root = useRef<HTMLParagraphElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        const el = number.current;
        if (!el) return;
        const state = { value: 0 };
        gsap.set(el, { opacity: 0.3 });
        const tl = gsap.timeline({ delay: 0.25 });
        tl.from('.micro-tick', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.4, ease: 'power3.out', stagger: 0.012 }, 0)
          .to(state, {
            value: count,
            duration: 0.9,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = String(Math.round(state.value));
            },
          }, 0)
          .to(el, { keyframes: { opacity: [0.3, 1, 0.45, 1, 0.75, 1] }, duration: 0.42, ease: 'none' }, 0.85)
          .from('.numeral-bloom', { opacity: 0, scale: 0.5, duration: 0.25, ease: 'power2.out' }, 0.85)
          .to('.numeral-bloom', { keyframes: { scale: [1, 1.18, 1] }, duration: 0.8, ease: 'power2.inOut' }, 1.05)
          .from('.micro-tick[data-lit="true"]', { opacity: 0.2, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, 1.0);
      }),
    { scope: root, dependencies: [count] },
  );

  return (
    <p ref={root} className="flex flex-col items-start gap-3 sm:items-end" aria-label={`${count} of ${TARGET} components shipped`}>
      <span aria-hidden="true" className="flex items-end gap-2">
        <span className="relative">
          <span className="numeral-bloom pointer-events-none absolute -inset-x-16 -inset-y-12" />
          <span
            ref={number}
            className="numeral-lit relative block pr-[0.06em] font-display text-[96px] font-bold leading-[84px] tracking-[-0.03em] tabular-nums sm:text-[136px] sm:leading-[112px]"
          >
            {count}
          </span>
        </span>
        <span className="numeral-ghost pb-1 font-display text-[48px] font-bold leading-none tracking-[-0.03em] sm:pb-2 sm:text-[64px]">
          /{TARGET}
        </span>
      </span>
      <span aria-hidden="true" className="flex items-center gap-3">
        <span className="flex items-end gap-[3px]">
          {TICKS.map((i) => (
            <span key={i} data-lit={i < count ? 'true' : 'false'} className="micro-tick block h-2.5 w-[3px] rounded-full" />
          ))}
        </span>
        <span className="font-mono text-meta text-text-2">shipped</span>
      </span>
    </p>
  );
}
