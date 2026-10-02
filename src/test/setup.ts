import '@testing-library/jest-dom/vitest';

// jsdom has no WebGL: the world canvas is replaced by nothing, the SVG posters carry the orrery and the rail.
vi.mock('@react-three/fiber', () => ({
  Canvas: () => null,
  useFrame: () => undefined,
  useThree: () => ({}),
}));

// jsdom has no matchMedia. No query matches, so GSAP's motion branches stay idle in tests.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
