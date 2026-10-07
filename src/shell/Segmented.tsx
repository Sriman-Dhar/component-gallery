import type { MouseEvent, ReactNode } from 'react';
import { FOCUS_RING } from './focus';

export interface Segment<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface Props<T extends string> {
  /** The group's accessible name ("Frame theme", "Stage width"). */
  label: string;
  options: Segment<T>[];
  value: T;
  onPick: (id: T, event: MouseEvent<HTMLButtonElement>) => void;
  /** Labels show from sm up only; below that the icon carries the choice (its label stays accessible). */
  compact?: boolean;
}

/** 44px tall on touch, 32px with a fine pointer from sm up; never under 44px wide (an icon-only option on a phone). */
const BUTTON = `inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-control px-3 font-mono text-meta transition-colors duration-fast sm:h-8 [@media(pointer:coarse)]:h-11 ${FOCUS_RING}`;
const ON = 'bg-surface-2 text-text shadow-[inset_0_0_0_1px_rgb(var(--color-accent)/0.5)]';
const OFF = 'text-text-2 hover:text-text';

/**
 * A two or three way choice where every option is visible and the current one is lit: the state is never
 * read off a switch's position. Each option is a pressed or unpressed button.
 */
export default function Segmented<T extends string>({ label, options, value, onPick, compact = false }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1 rounded-control border border-line bg-surface/70 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          aria-label={compact ? option.label : undefined}
          onClick={(event) => value !== option.id && onPick(option.id, event)}
          className={`${BUTTON} ${value === option.id ? ON : OFF}`}
        >
          {option.icon}
          <span className={compact ? 'hidden sm:inline' : undefined}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
