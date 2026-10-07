interface Props {
  name: string;
  saved: boolean;
  onToggle: () => void;
}

/** Save: a toggle button (aria-pressed). The bookmark fills when saved, so the state never rests on colour alone. */
export default function SaveButton({ name, saved, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${name}`}
      onClick={onToggle}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-control border border-[rgb(var(--tc-line))] text-[rgb(var(--tc-ink))] outline-none transition-[border-color,transform] duration-150 hover:border-[rgb(var(--tc-ink-2))] active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--tc-focus))] motion-reduce:transition-none [touch-action:manipulation]"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
        <path
          d="M5.5 3.5h9v13l-4.5-3.2-4.5 3.2z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
