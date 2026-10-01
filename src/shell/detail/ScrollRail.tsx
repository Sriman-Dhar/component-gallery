import { useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motionAllowed } from '../../lib/motion';
import { FOCUS_RING } from '../focus';
import { useScrollRail } from './useScrollRail';

export interface RailStop {
  /** The id of the section the stop jumps to. */
  id: string;
  label: string;
}

const FILL = 'bg-gradient-to-b from-accent-deep via-accent to-glow shadow-[0_0_10px_rgb(var(--color-accent)/0.55)]';

/**
 * The detail page's own light rail. From lg up: a slim vertical line fixed in the left gutter that fills
 * with amber light as the page scrolls, with a node per section that lights as it is reached and jumps
 * there on click. Below lg: a 2px progress line under the header, no nodes. Portaled to <body> so the
 * route transition's transform never captures the fixed position.
 */
export default function ScrollRail({ stops }: { stops: RailStop[] }) {
  const fill = useRef<HTMLSpanElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { stops: at, lit } = useScrollRail(
    stops.map((stop) => stop.id),
    { fill, head, bar },
  );

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' });
    target.focus({ preventScroll: true });
  }

  return createPortal(
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-16 z-30 h-[2px] lg:hidden">
        <span ref={bar} className={`block h-full w-full origin-left bg-gradient-to-r from-accent-deep via-accent to-glow [transform:scaleX(0)]`} />
      </div>
      <nav
        aria-label="On this page"
        className="fixed left-[max(4px,calc((100vw-1280px)/2+4px))] top-1/2 z-30 hidden h-[clamp(240px,44vh,420px)] w-11 -translate-y-1/2 lg:block"
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
        <span ref={fill} aria-hidden="true" className={`absolute inset-y-0 left-[calc(50%-1px)] w-[2px] origin-top rounded-full ${FILL} [transform:scaleY(0)]`} />
        <span ref={head} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full">
          <span className="rail-lit absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow" />
        </span>
        <ol className="absolute inset-0">
          {stops.map((stop, i) => {
            const on = i < lit;
            const current = i === lit - 1;
            return (
              <li key={stop.id} className="absolute left-0 w-full" style={{ top: `${(at[i] ?? 0) * 100}%` }}>
                <a
                  href={`#${stop.id}`}
                  onClick={(event) => jump(event, stop.id)}
                  aria-current={current ? 'location' : undefined}
                  className={`group absolute left-0 top-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full ${FOCUS_RING}`}
                >
                  <span
                    aria-hidden="true"
                    className={`relative h-2.5 w-2.5 rounded-full transition-[background-color,box-shadow,transform] duration-base ease-out motion-reduce:transition-none ${
                      on ? 'rail-lit scale-100 bg-glow' : 'scale-90 bg-bg shadow-[inset_0_0_0_1.5px_rgb(var(--color-text-2)/0.6)]'
                    } ${current ? 'shadow-[0_0_0_4px_rgb(var(--color-accent)/0.18)]' : ''}`}
                  />
                  <span className="pointer-events-none absolute left-full top-1/2 ml-1 -translate-y-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-meta text-text opacity-0 shadow-[0_8px_24px_-12px_rgb(var(--color-accent-deep)/0.6)] transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    {stop.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>,
    document.body,
  );
}
