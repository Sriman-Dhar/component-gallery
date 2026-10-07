import { useEffect, useRef, useState, type ReactNode } from 'react';

type Status = 'idle' | 'adding' | 'added' | 'error';

/** How long "Added" holds before the button offers to add again. */
const ADDED_MS = 1800;
const ERROR_MS = 2400;
const SWAP = 'transition-[opacity,transform] duration-[180ms] ease-out motion-reduce:transition-none';

interface Props {
  soldOut: boolean;
  /** A returned promise drives the adding state; a rejection shows the error state. */
  onAdd: () => Promise<void> | void;
  /** Called once the add resolves, for the core's flare. */
  onAdded?: () => void;
  /** When known, the announcement says how many are in the bag. */
  bagCount?: number;
}

/**
 * Add to bag: idle, adding (spinner, aria-busy), added (check), error, and sold out (aria-disabled). Every label
 * shares one grid cell, so the button never changes size. A polite live region speaks each change.
 */
export default function BagButton({ soldOut, onAdd, onAdded, bagCount }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'added' && status !== 'error') return;
    const timer = window.setTimeout(() => setStatus('idle'), status === 'added' ? ADDED_MS : ERROR_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const blocked = soldOut || status === 'adding';
  const add = async () => {
    if (blocked) return;
    setStatus('adding');
    try {
      await onAdd();
      if (!alive.current) return;
      setStatus('added');
      onAdded?.();
    } catch {
      if (alive.current) setStatus('error');
    }
  };

  const label = soldOut ? 'Sold out' : 'Add to bag';
  const shown = soldOut ? 'idle' : status;
  const message =
    status === 'adding'
      ? 'Adding to bag'
      : status === 'added'
        ? bagCount === undefined
          ? 'Added to your bag.'
          : `Added. ${bagCount} in your bag.`
        : status === 'error'
          ? 'Could not add to bag. Try again.'
          : '';

  return (
    <>
      <button
        type="button"
        onClick={add}
        aria-disabled={blocked || undefined}
        aria-busy={status === 'adding' || undefined}
        className={`relative inline-grid min-h-[48px] min-w-0 flex-1 place-items-center rounded-control px-4 text-[15px] font-semibold outline-none [touch-action:manipulation] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--tc-focus))] ${
          soldOut
            ? 'cursor-not-allowed bg-[rgb(var(--tc-muted))] text-[rgb(var(--tc-ink-2))]'
            : `bg-[rgb(var(--tc-cta))] text-[rgb(var(--tc-cta-ink))] transition-transform duration-150 hover:bg-[rgb(var(--tc-cta-hover))] active:scale-[0.97] motion-reduce:transition-none ${
                status === 'adding' ? 'cursor-progress' : 'cursor-pointer'
              }`
        }`}
      >
        <Face show={shown === 'idle'}>{label}</Face>
        <Face show={shown === 'adding'} hidden>
          <Spinner spinning={shown === 'adding'} />
          Adding
        </Face>
        <Face show={shown === 'added'} hidden>
          <CheckMark />
          Added
        </Face>
        <Face show={shown === 'error'} hidden>
          Try again
        </Face>
      </button>
      <span aria-live="polite" className="sr-only">
        {message}
      </span>
    </>
  );
}

/** One label in the shared cell. Only the idle label names the button; the others are visual and announced instead. */
function Face({ show, hidden = false, children }: { show: boolean; hidden?: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className={`inline-flex items-center gap-2 whitespace-nowrap [grid-area:1/1] ${SWAP} ${show ? '' : 'translate-y-1.5 opacity-0'}`}
    >
      {children}
    </span>
  );
}

/** Spins only while shown, so a hidden spinner never holds a composited layer. */
function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${spinning ? 'animate-spin motion-reduce:animate-[spin_1.6s_linear_infinite]' : ''}`}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4">
      <path d="M3 8.4l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
