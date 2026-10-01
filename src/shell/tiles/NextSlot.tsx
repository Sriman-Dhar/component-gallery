import { weekOpens } from '../../lib/ruler';

/**
 * The next open week, as a quiet tile the same size as a shipped one: an empty dashed preview
 * area and one line, so the grid closes its row instead of leaving a void.
 */
export default function NextSlot({ week }: { week: number }) {
  return (
    <li className="tile flex flex-col overflow-hidden rounded-tile border border-dashed border-line">
      <div aria-hidden="true" className="flex h-[220px] items-center justify-center border-b border-dashed border-line">
        <span className="block h-2 w-2 rounded-full border border-text-2/60" />
      </div>
      <div className="flex flex-1 flex-col justify-end p-5">
        <p className="text-lead font-semibold tracking-[-0.02em] text-text-2">Next: week {week}</p>
        <p className="mt-1 font-mono text-meta text-text-2">Opens {weekOpens(week)}.</p>
      </div>
    </li>
  );
}
