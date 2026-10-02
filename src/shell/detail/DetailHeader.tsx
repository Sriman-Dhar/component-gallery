import { useRef } from 'react';
import { runningLabel } from '../../lib/catalogue';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import type { ComponentMeta } from '../../lib/types';
import RiseText from '../RiseText';
import MetaChips from './MetaChips';

/**
 * Header rail: the running number in the display face, oversized and lit from behind (a warm bloom that
 * swells once and settles), the name rising in letter by letter, then the stamp chips and the summary.
 * Everything settles and stays still; reduced motion shows the settled state.
 */
export default function DetailHeader({ meta }: { meta: ComponentMeta }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.dh-num', { yPercent: 100, duration: 0.7 })
          .from('.dh-bloom', { scale: 0.3, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.15)
          .to('.dh-bloom', { scale: 1.15, duration: 0.25, ease: 'power2.out' }, 0.75)
          .to('.dh-bloom', { scale: 1, duration: 0.5, ease: 'power2.inOut' })
          .from('h1 .letter', { yPercent: 110, duration: 0.7, stagger: 0.02 }, 0.1)
          .from('.dh-rise', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.35);
      }),
    { scope: root },
  );

  const number = runningLabel(meta.slug);
  return (
    <header ref={root} className="relative grid grid-cols-1 gap-y-5 pb-8 lg:grid-cols-12 lg:gap-x-8">
      {/* The close orbit's socket: an empty box beside the title where the scene puts this component's body,
          clear of the numeral and the summary (phones: right of the numeral; wide: past the title's end). */}
      <span
        aria-hidden="true"
        data-world-anchor="close"
        className="pointer-events-none absolute -top-4 right-0 h-28 w-[34%] sm:h-32 lg:top-2 lg:h-40 lg:w-[16%]"
      />
      <p className="relative lg:col-span-3" aria-label={`Number ${number}`}>
        <span
          aria-hidden="true"
          className="dh-bloom pointer-events-none absolute -left-6 -top-8 h-44 w-56 bg-[radial-gradient(closest-side,rgb(var(--color-accent)/var(--bloom-alpha)),rgb(var(--color-accent-deep)/calc(var(--bloom-alpha)*0.5))_55%,transparent)] blur-md lg:h-56 lg:w-72"
        />
        {/* Clipped at the foot only, so the number can rise from below while its glow spills freely. */}
        <span aria-hidden="true" className="relative -mb-5 block pb-6 [clip-path:inset(-48px_-64px_0_-48px)]">
          <span data-world-veil className="dh-num inline-flex items-start font-display text-numeral font-semibold tracking-[-0.02em] text-text [text-shadow:0_0_28px_rgb(var(--color-accent)/calc(var(--bloom-alpha)*1.25)),0_0_2px_rgb(var(--color-glow)/calc(var(--bloom-alpha)*1.8))] lg:text-count">
            <span className="mr-2 mt-3 font-display text-meta font-bold tracking-[0.02em] text-accent lg:mt-5">No.</span>
            {number}
          </span>
        </span>
      </p>
      <div className="lg:col-span-9 lg:pr-[19%] lg:pt-3">
        {/* The veil is the words alone, not the column's padding, which is where the body lives. */}
        <div data-world-veil className="copy-scrim">
          <h1
            aria-label={meta.name}
            className="font-display text-[34px] font-extrabold leading-[40px] tracking-[-0.03em] text-text sm:text-[52px] sm:leading-[58px]"
          >
            <RiseText text={meta.name} />
          </h1>
          <div className="dh-rise mt-5">
            <MetaChips meta={meta} />
          </div>
          <p className="dh-rise mt-5 max-w-column text-lead text-text-2">{meta.summary}</p>
        </div>
      </div>
    </header>
  );
}
