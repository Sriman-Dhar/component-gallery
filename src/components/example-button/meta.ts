import type { ComponentMeta } from '../../lib/types';

export const meta: ComponentMeta = {
  slug: 'example-button',
  name: 'Example Button',
  type: 'button',
  week: 0,
  date: '2026-09-25',
  summary: 'Scaffold placeholder, kept as the folder-pattern reference.',
  prompt: `Build a plain button component for the gallery scaffold.
It takes a label and an optional onClick, renders a native <button type="button">,
and uses only neutral gray Tailwind classes. No design decisions: this is a placeholder.`,
};
