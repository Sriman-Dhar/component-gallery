import { render } from '@testing-library/react';
import { registry } from '../lib/registry';

describe('render smoke', () => {
  it('renders every registered component without throwing', async () => {
    const failures: string[] = [];
    for (const entry of registry) {
      try {
        const { default: Demo } = await entry.loadDemo();
        const view = render(<Demo />);
        view.unmount();
      } catch (error) {
        failures.push(`${entry.meta.slug}: ${(error as Error).message}`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('loads the source of every registered component', async () => {
    for (const entry of registry) {
      const files = await entry.loadSources();
      expect(files.length, entry.meta.slug).toBeGreaterThan(0);
    }
  });
});
