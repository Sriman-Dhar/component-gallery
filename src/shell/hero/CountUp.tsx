import { useRef } from 'react';
import { TARGET } from '../../lib/catalogue';
import { gsap, useGSAP, withMotion } from '../../lib/motion';

/** The index's oversized moment: shipped count at 112px, counting up once (0.9s, expo.out). */
export default function CountUp({ count }: { count: number }) {
  const root = useRef<HTMLParagraphElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        const el = number.current;
        if (!el || count === 0) return;
        const state = { value: 0 };
        gsap.to(state, {
          value: count,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.25,
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
        });
      }),
    { scope: root, dependencies: [count] },
  );

  return (
    <p ref={root} className="flex items-end gap-4" aria-label={`${count} of ${TARGET} components shipped`}>
      <span
        ref={number}
        aria-hidden="true"
        className="bg-gradient-to-b from-text to-text/60 bg-clip-text pr-[0.06em] text-[88px] font-semibold leading-[80px] tracking-[-0.055em] text-transparent tabular-nums sm:text-count"
      >
        {count}
      </span>
      <span aria-hidden="true" className="pb-3 font-mono text-small text-text-2">
        / {TARGET} shipped
      </span>
    </p>
  );
}
