import { weekOpens } from '../../lib/ruler';

/** The next open week on the grid: an unlit slot, so the grid never ends in a blank cell. */
export default function NextSlot({ week }: { week: number }) {
  return (
    <li className="tile flex min-h-[220px] flex-col justify-between rounded-tile border border-dashed border-line p-5">
      <span aria-hidden="true" className="block h-2 w-2 rounded-full border border-text-2/60" />
      <div>
        <p className="text-lead font-semibold tracking-[-0.02em] text-text">Week {week}</p>
        <p className="mt-1 font-mono text-meta text-text-2">Opens {weekOpens(week)}.</p>
      </div>
    </li>
  );
}
