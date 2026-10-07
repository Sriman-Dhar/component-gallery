import { act, fireEvent, render, screen } from '@testing-library/react';
import TiltProductCard from '../components/tilt-product-card/TiltProductCard';
import { MAX_SPREAD, clampTilt, glareFor, rimFor, spreadFor, tiltFor } from '../components/tilt-product-card/tiltMath';

const rect = { left: 100, top: 50, width: 300, height: 400 };

describe('tilt math', () => {
  it('gives no tilt at the card centre', () => {
    const { rx, ry } = tiltFor(250, 250, rect, 10);
    expect(rx).toBe(0);
    expect(ry).toBe(0);
  });

  it('gives the max tilt with the right signs at the top left corner', () => {
    // Top left: the face turns up and left, so the top edge comes back (rotateX +) and the left edge recedes (rotateY -).
    expect(tiltFor(100, 50, rect, 10)).toEqual({ rx: 10, ry: -10 });
    expect(tiltFor(400, 450, rect, 10)).toEqual({ rx: -10, ry: 10 });
  });

  it('clamps beyond the rect and clamps maxTilt to 0..14', () => {
    expect(tiltFor(-500, -900, rect, 10)).toEqual({ rx: 10, ry: -10 });
    expect(tiltFor(-500, -900, rect, 40)).toEqual({ rx: 14, ry: -14 });
    expect(clampTilt(-3)).toBe(0);
    expect(clampTilt(undefined)).toBe(10);
  });

  it('spreads 0 at rest and at most 18px', () => {
    expect(spreadFor(0, 0)).toBe(0);
    expect(spreadFor(10, -10)).toBeCloseTo(MAX_SPREAD);
    expect(spreadFor(14, 14)).toBe(MAX_SPREAD);
    expect(MAX_SPREAD).toBe(18);
  });

  it('puts the glare under the pointer and the rim on the opposite edge', () => {
    expect(glareFor(400, 50, rect)).toEqual({ x: 1, y: -1 });
    const rim = rimFor(1, -1);
    expect(rim.x).toBeLessThan(0);
    expect(rim.y).toBeGreaterThan(0);
    expect(rim.strength).toBe(1);
  });
});

describe('tilt product card', () => {
  const realMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = realMatchMedia;
    vi.restoreAllMocks();
  });

  /** Every media query matches, as on a desktop with a mouse that allows motion. */
  const desktop = () => {
    window.matchMedia = ((query: string) => ({ ...realMatchMedia(query), matches: true, media: query })) as typeof window.matchMedia;
  };
  /** pointermove listeners the card itself attached (React's own root listeners sit on the container div). */
  const pointerListeners = (spy: ReturnType<typeof vi.spyOn>) =>
    spy.mock.calls.filter(([type], i) => type === 'pointermove' && (spy.mock.contexts[i] as Element).tagName === 'ARTICLE').length;

  it('attaches a pointermove listener on a fine pointer, and none at all when still', () => {
    desktop();
    const spy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const off = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const live = render(<TiltProductCard />);
    expect(pointerListeners(spy) - pointerListeners(off)).toBe(1);
    live.unmount();
    expect(pointerListeners(spy) - pointerListeners(off)).toBe(0);
    spy.mockClear();
    render(<TiltProductCard still />);
    expect(pointerListeners(spy)).toBe(0);
  });

  it('is an article named by its product link, with finish radios, Save and Add to bag', () => {
    render(<TiltProductCard />);
    expect(screen.getByRole('article', { name: 'Armilla No. 3' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Armilla No. 3' })).toHaveAttribute('href', '#armilla');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Brass' })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Save Armilla No. 3' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Add to bag' })).toBeInTheDocument();
  });

  it('updates the hidden description with the finish and toggles Save', () => {
    const onFinishChange = vi.fn();
    const { container } = render(<TiltProductCard onFinishChange={onFinishChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Frost' }));
    expect(onFinishChange).toHaveBeenCalledWith('frost');
    expect(container.querySelector('[data-vitrine-description]')).toHaveTextContent('Desk armillary in frost finish');
    const save = screen.getByRole('button', { name: 'Save Armilla No. 3' });
    fireEvent.click(save);
    expect(save).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows busy, then announces the added count', async () => {
    let resolve = () => undefined as void;
    const onAddToBag = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const { rerender } = render(<TiltProductCard onAddToBag={onAddToBag} bagCount={1} />);
    const add = screen.getByRole('button', { name: 'Add to bag' });
    fireEvent.click(add);
    expect(onAddToBag).toHaveBeenCalledWith('brass');
    expect(add).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Adding to bag')).toBeInTheDocument();
    rerender(<TiltProductCard onAddToBag={onAddToBag} bagCount={2} />);
    await act(async () => resolve());
    expect(screen.getByText('Added. 2 in your bag.')).toBeInTheDocument();
  });

  it('blocks Add to bag when sold out and keeps the finish picker usable', () => {
    const onAddToBag = vi.fn();
    render(<TiltProductCard soldOut onAddToBag={onAddToBag} />);
    const sold = screen.getByRole('button', { name: 'Sold out' });
    expect(sold).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(sold);
    expect(onAddToBag).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('radio', { name: 'Graphite' }));
    expect(screen.getByRole('radio', { name: 'Graphite' })).toBeChecked();
  });
});
