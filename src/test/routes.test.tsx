import { render, screen } from '@testing-library/react';
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
  it('lists components on the index page', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Example Button' })).toHaveAttribute(
      'href',
      '/components/example-button',
    );
  });

  it('shows the detail page with its Type label', async () => {
    renderAt('/components/example-button');
    expect(screen.getByRole('heading', { name: 'Example Button' })).toBeInTheDocument();
    expect(screen.getAllByText('Type: button').length).toBeGreaterThan(0);
    expect(await screen.findByRole('button', { name: 'Example button' })).toBeInTheDocument();
  });

  it('shows the 404 view for an unknown slug', () => {
    renderAt('/components/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument();
  });
});
