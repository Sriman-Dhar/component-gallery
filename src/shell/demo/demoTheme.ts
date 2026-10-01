/** Demo chrome reads the stage's colors; components inside a demo only read their own properties. */
export const DEMO_THEME =
  '[--demo-fg:var(--stage-fg,18_18_22)] [--demo-ring:var(--p-amber-700,173_74_5)] [[data-stage-theme=dark]_&]:[--demo-ring:var(--p-amber-500,255_138_42)]';

/** One quiet chip for every demo control: 44px tall, one internal gap, the shared 2px focus offset. */
export const DEMO_CHIP =
  'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgb(var(--demo-fg)/0.14)] px-3.5 text-[13px] font-medium text-[rgb(var(--demo-fg)/0.78)] outline-none transition-colors duration-200 hover:border-[rgb(var(--demo-fg)/0.36)] hover:text-[rgb(var(--demo-fg))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--demo-ring))] disabled:cursor-not-allowed disabled:opacity-[0.45] motion-reduce:transition-none';
