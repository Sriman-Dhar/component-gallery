import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { routerFuture } from '../lib/router';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <App />
    </MemoryRouter>,
  );
}

describe('routes', () => {
  it('shows the hero, the count, the light rail and a live tile on the index', async () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Sriman Gallery' })).toBeInTheDocument();
    expect(screen.getByText('Thirty components in ninety days.')).toBeInTheDocument();
    expect(screen.getByLabelText('0 of 30 components shipped')).toBeInTheDocument();
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'hero');
    expect(screen.getByRole('link', { name: 'Example Button' })).toHaveAttribute('href', '/components/example-button');
    expect(screen.getAllByText('Type: button').length).toBeGreaterThan(0);
    expect(screen.getByText('Week 1')).toBeInTheDocument();
    expect(await screen.findByText('Example button')).toBeInTheDocument();
  });

  it('shows the detail page with its Type stamp, compact rail, stage, ask and code', async () => {
    renderAt('/components/example-button');
    expect(screen.getByRole('heading', { level: 1, name: 'Example Button' })).toBeInTheDocument();
    expect(screen.getAllByText('Type: button').length).toBeGreaterThan(0);
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'compact');
    expect(screen.getByRole('heading', { name: 'The ask' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The code' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Stage width' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark stage' })).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByRole('button', { name: 'Example button' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Copy ExampleButton.tsx' })).toBeInTheDocument();
  });

  it('shows the 404 view with the unlit rail for an unknown slug', () => {
    renderAt('/components/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Nothing shipped here.' })).toBeInTheDocument();
    expect(screen.getByTestId('light-rail')).toHaveAttribute('data-variant', 'unlit');
    expect(screen.getByRole('link', { name: 'Back to the index' })).toHaveAttribute('href', '/');
  });

  it('flips the frame theme on <html> without leaving a wipe overlay (reduced motion path)', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    renderAt('/');
    const toggle = screen.getByRole('button', { name: 'Dark frame' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.querySelector('.theme-wipe')).toBeNull();
    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(await screen.findByText('Example button')).toBeInTheDocument();
  });
});
