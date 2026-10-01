import { useRef } from 'react';
import { runningLabel } from '../../lib/catalogue';
import { formatDate } from '../../lib/date';
import { gsap, useGSAP, withMotion } from '../../lib/motion';
import type { ComponentMeta } from '../../lib/types';
import TypeStamp from '../TypeStamp';

/** Header rail: the running number at 72 rises in, then name, type stamp, week, date, summary. */
export default function DetailHeader({ meta }: { meta: ComponentMeta }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () =>
      withMotion(() => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.dh-num', { yPercent: 100, duration: 0.7 })
          .from('.dh-rise', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.1);
      }),
    { scope: root },
  );

  return (
    <header ref={root} className="grid grid-cols-1 gap-y-5 pb-8 lg:grid-cols-12 lg:gap-x-8">
      <p className="overflow-hidden lg:col-span-3" aria-label={`Number ${runningLabel(meta.slug)}`}>
        <span aria-hidden="true" className="dh-num inline-flex items-start text-numeral font-semibold tabular-nums text-text">
          <span className="mr-1 mt-2 font-mono text-small font-normal text-accent">№</span>
          {runningLabel(meta.slug)}
        </span>
      </p>
      <div className="lg:col-span-9 lg:pt-2">
        <h1 className="dh-rise text-[36px] font-semibold leading-[40px] tracking-[-0.035em] text-text sm:text-h1">{meta.name}</h1>
        <div className="dh-rise mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-small text-text-2">
          <TypeStamp type={meta.type} />
          <span>Week {meta.week}</span>
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
        </div>
        <p className="dh-rise mt-4 max-w-column text-lead text-text-2">{meta.summary}</p>
      </div>
    </header>
  );
}
