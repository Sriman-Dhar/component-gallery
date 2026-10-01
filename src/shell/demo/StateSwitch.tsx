import type { ReactNode } from 'react';
import { DEMO_CHIP } from './demoTheme';

interface Props {
  label: ReactNode;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/** The one demo switch: a chip with a track and thumb, role switch, shared by every component demo. */
export default function StateSwitch({ label, on, onToggle, disabled = false }: Props) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onToggle} disabled={disabled} className={DEMO_CHIP}>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full border-[1.5px] border-[rgb(var(--demo-fg)/0.6)] transition-colors duration-200 motion-reduce:transition-none ${
          on ? 'bg-[rgb(var(--demo-fg))]' : ''
        }`}
      >
        <span
          className={`absolute left-[2px] top-[2px] h-3 w-3 rounded-full transition-transform duration-200 motion-reduce:transition-none ${
            on ? 'translate-x-[16px] bg-[rgb(var(--stage-bg,246_246_248))]' : 'bg-[rgb(var(--demo-fg)/0.6)]'
          }`}
        />
      </span>
      {label}
    </button>
  );
}
