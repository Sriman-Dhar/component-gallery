import type { ReactNode } from 'react';
import { DEMO_THEME } from './demoTheme';

interface Props {
  /** The 28/32 headline every demo opens with. */
  title: string;
  /** Optional line under the headline. */
  lede?: ReactNode;
  /** The component and anything that belongs to it (captions, hints). */
  children: ReactNode;
  /** Demo-only state controls, set apart as a quiet row under a hairline. */
  controls?: ReactNode;
  /** Accessible name for the controls row. */
  controlsLabel?: string;
}

/**
 * The one layout every component demo shares: same column width, left alignment, gaps and padding,
 * a 28/32 headline, the component, then a quiet controls row. Lives in the shell, not in a component.
 */
export default function DemoShell({ title, lede, children, controls, controlsLabel = 'Demo controls' }: Props) {
  return (
    <div className={`${DEMO_THEME} flex w-full max-w-[440px] flex-col gap-8 py-4 font-sans text-[rgb(var(--demo-fg))]`}>
      <div className="flex flex-col gap-2">
        <p className="text-[28px] font-semibold leading-8 tracking-[-0.02em]">{title}</p>
        {lede ? <p className="text-[16px] leading-6 text-[rgb(var(--demo-fg)/0.72)]">{lede}</p> : null}
      </div>
      <div className="flex flex-col items-start gap-4">{children}</div>
      {controls ? (
        <div
          role="group"
          aria-label={controlsLabel}
          className="flex flex-wrap items-center gap-2 border-t border-[rgb(var(--demo-fg)/0.1)] pt-4"
        >
          {controls}
        </div>
      ) : null}
    </div>
  );
}
