import { useId } from 'react';
import { FINISH_VARS, finishSpec, finishStyle, type Finish } from './finishes';

interface Props {
  finishes: Finish[];
  value: string;
  onChange: (id: string) => void;
}

/**
 * Finish: a native radio group. Tab enters once, arrow keys move the selection (browser behaviour). Each swatch is
 * a 28px metal disc in a 44px hit area; the chosen one gets a ring and a check glyph, and its name is written out
 * beside the label, so colour never carries the choice alone. The focus ring is ink, not amber, so it never melts into
 * the brass swatch's own edge.
 */
export default function FinishPicker({ finishes, value, onChange }: Props) {
  const name = useId();
  const labelId = useId();
  const current = finishes.find((f) => f.id === value)?.label ?? '';
  return (
    <div role="radiogroup" aria-labelledby={labelId} className="flex flex-col gap-1">
      <p className="flex items-baseline gap-2 text-[14px] leading-5">
        <span id={labelId} className="text-[rgb(var(--tc-ink-2))]">
          Finish
        </span>
        <span aria-hidden="true" className="font-medium">
          {current}
        </span>
      </p>
      <div className="-ml-2 flex gap-1">
        {finishes.map((finish) => {
          const checked = finish.id === value;
          return (
            <label
              key={finish.id}
              style={finishStyle(finishSpec(finish.id, finishes))}
              className={`${FINISH_VARS} group relative grid h-11 w-11 cursor-pointer place-items-center rounded-full`}
            >
              <input
                type="radio"
                name={name}
                value={finish.id}
                checked={checked}
                onChange={() => onChange(finish.id)}
                className="peer absolute inset-0 m-0 cursor-pointer appearance-none rounded-full outline-none"
              />
              <span className="sr-only">{finish.label}</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none grid h-7 w-7 place-items-center rounded-full shadow-[inset_0_1px_0_rgb(var(--f-hi)/0.9),inset_0_-2px_3px_rgb(var(--f-lo)/0.7),0_0_0_1px_rgb(var(--tc-line))] [background:radial-gradient(circle_at_35%_30%,rgb(var(--f-hi)),rgb(var(--f-mid))_55%,rgb(var(--f-lo)))] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[5px] peer-focus-visible:outline-[rgb(var(--tc-ink))] ${
                  checked ? 'ring-2 ring-[rgb(var(--tc-ink))] ring-offset-2 ring-offset-[rgb(var(--tc-surface))]' : 'group-hover:scale-[1.08] transition-transform duration-150 motion-reduce:transition-none'
                }`}
              >
                {checked ? <Check /> : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/** The check glyph: a single stroke on a contrast disc so it reads on brass, graphite and frost alike. */
function Check() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full bg-[rgb(var(--tc-surface))]">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-[rgb(var(--tc-ink))]">
        <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
