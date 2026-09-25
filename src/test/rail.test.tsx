import { render } from '@testing-library/react';
import LightRail from '../shell/rail/LightRail';

const today = new Date(2026, 9, 20);

describe('light rail poster', () => {
  it('renders 13 week nodes and lights the weeks that shipped', () => {
    const { container } = render(
      <LightRail variant="hero" marks={[{ slug: 'a', date: '2026-10-02' }, { slug: 'b', date: '2026-10-16' }]} today={today} />,
    );
    const nodes = container.querySelectorAll('[data-node]');
    expect(nodes).toHaveLength(13);
    const lit = [...container.querySelectorAll('[data-lit="true"]')].map((n) => n.getAttribute('data-node'));
    expect(lit).toEqual(['1', '3']);
  });

  it('blooms the detail week and lights nothing on the unlit rail', () => {
    const compact = render(<LightRail variant="compact" marks={[]} litWeek={5} today={today} />);
    expect(compact.container.querySelector('.rail-bloom')).toHaveAttribute('data-node', '5');
    compact.unmount();
    const unlit = render(<LightRail variant="unlit" marks={[{ slug: 'a', date: '2026-10-02' }]} today={today} />);
    expect(unlit.container.querySelectorAll('[data-lit="true"]')).toHaveLength(0);
    expect(unlit.container.querySelector('canvas')).toBeNull();
  });
});
