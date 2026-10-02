import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { neighbours, shipped } from '../lib/catalogue';
import { formatDate } from '../lib/date';
import { routerFuture } from '../lib/router';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <App />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('shows the hero, the count, the light rail and equal tiles in № order on the index', async () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: "Sriman's Gallery" })).toBeInTheDocument();
    expect(screen.getByText('Thirty components in thirteen weeks.')).toBeInTheDocument();
    expect(screen.getByLabelText(`${shipped.length} of 30 components shipped`)).toBeInTheDocument();
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'hero');
    const grid = screen.getByRole('list', { name: 'Components' });
    const names = within(grid).getAllByRole('link').map((link) => link.textContent);
    expect(names).toEqual(shipped.map(({ meta }) => meta.name));
    expect(names.slice(0, 2)).toEqual(['Magnetic Button', 'OTP Input']);
    expect(within(grid).getByText('Next: Week 2')).toBeInTheDocument();
    expect(within(grid).getAllByText('Type: button').length).toBeGreaterThan(0);
    expect(within(grid).getAllByText(formatDate(shipped[0].meta.date)).length).toBeGreaterThan(0);
    expect(await within(grid).findByText('Join the waitlist')).toBeInTheDocument();
  });

  it('never publishes the week 0 placeholder: no tile, no neighbour, and its route is a 404', () => {
    renderAt('/');
    expect(screen.queryByRole('link', { name: 'Example Button' })).toBeNull();
    for (const { meta } of shipped) {
      const { prev, next } = neighbours(meta.slug);
      expect(prev?.meta.week ?? 1).toBeGreaterThan(0);
      expect(next?.meta.week ?? 1).toBeGreaterThan(0);
    }
  });

  it('renders the example-button route as the 404 view', () => {
    renderAt('/components/example-button');
    expect(screen.getByRole('heading', { name: 'Nothing shipped here.' })).toBeInTheDocument();
  });

  it('shows the detail page with its Type stamp, compact rail, stage, ask and collapsible code', async () => {
    renderAt('/components/magnetic-button');
    expect(screen.getByRole('heading', { level: 1, name: 'Magnetic Button' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All components' })).toHaveAttribute('href', '/');
    const rail = screen.getByRole('navigation', { name: 'On this page' });
    expect(within(rail).getAllByRole('link').map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Stage', '#stage'],
      ['The ask', '#ask'],
      ['The code', '#code'],
      ['Previous and next', '#more'],
    ]);
    for (const id of ['stage', 'ask', 'code', 'more']) expect(document.getElementById(id)).not.toBeNull();
    expect(screen.getAllByText('Type: button').length).toBeGreaterThan(0);
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'compact');
    expect(screen.getByRole('heading', { name: 'The ask' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The code' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Stage width' })).toBeInTheDocument();
    // The stage opens dark (in the world); both themes are visible choices, the current one pressed.
    expect(screen.getByRole('button', { name: 'Dark stage' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Light stage' }));
    expect(screen.getByRole('button', { name: 'Light stage' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('[data-stage-theme="light"]')).not.toBeNull();
    expect(await screen.findByRole('button', { name: 'Copy MagneticButton.tsx' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide MagneticButton.tsx' })).toHaveAttribute('aria-expanded', 'true');
    const demoToggle = screen.getByRole('button', { name: 'Show demo.tsx' });
    expect(demoToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(demoToggle);
    expect(screen.getByRole('button', { name: 'Hide demo.tsx' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('names every route in the document title', () => {
    const cases: [string, string][] = [
      ['/', "Sriman's Gallery"],
      ['/components/magnetic-button', "Magnetic Button · Sriman's Gallery"],
      ['/components/otp-input', "OTP Input · Sriman's Gallery"],
      ['/components/does-not-exist', "Not found · Sriman's Gallery"],
    ];
    for (const [path, title] of cases) {
      const view = renderAt(path);
      expect(document.title).toBe(title);
      view.unmount();
    }
  });

  it('shows the 404 view with the unlit rail for an unknown slug', () => {
    renderAt('/components/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Nothing shipped here.' })).toBeInTheDocument();
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'unlit');
    expect(screen.getByRole('link', { name: 'Back to the index' })).toHaveAttribute('href', '/');
  });

  it('links the public repo from the header (text and phone icon), the footer and the coda', () => {
    renderAt('/');
    const links = [...screen.getAllByRole('link', { name: /source/i }), screen.getByRole('link', { name: 'Follow along on GitHub' })];
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute('href', 'https://github.com/Sriman-Dhar/component-gallery');
    }
    expect(screen.queryByText(/coming soon/i)).toBeNull();
  });

  it('flips the frame theme on <html> from two visible choices, the current one pressed (reduced motion path)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    renderAt('/');
    const group = screen.getByRole('group', { name: 'Frame theme' });
    const dark = within(group).getByRole('button', { name: 'Dark' });
    const light = within(group).getByRole('button', { name: 'Light' });
    expect(dark).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(light);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(light).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('.theme-wipe')).toBeNull();
    fireEvent.click(light);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fireEvent.click(dark);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
