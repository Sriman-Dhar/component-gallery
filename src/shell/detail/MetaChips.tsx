import { formatDate } from '../../lib/date';
import type { ComponentMeta } from '../../lib/types';
import TypeStamp from '../TypeStamp';

const CHIP =
  'inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/70 px-3 font-mono text-meta text-text shadow-[inset_0_1px_0_rgb(var(--color-text)/0.05)]';

/**
 * The stamp row in the rail's family: the Type stamp, then the week as a lit chip (its node is the same
 * node that blooms on the rail below), then the date.
 */
export default function MetaChips({ meta }: { meta: ComponentMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TypeStamp type={meta.type} />
      <span className={`${CHIP} border-accent/40`}>
        <span aria-hidden="true" className="rail-lit h-1.5 w-1.5 rounded-full bg-glow" />
        Week {meta.week}
      </span>
      <span className={`${CHIP} text-text-2`}>
        <time dateTime={meta.date}>{formatDate(meta.date)}</time>
      </span>
    </div>
  );
}
