/** Tailwind reads every color, font and motion value from src/styles/tokens.css. */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        text: token('text'),
        'text-2': token('text-2'),
        accent: token('accent'),
        glow: token('glow'),
        'accent-deep': token('accent-deep'),
        rim: token('rim'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        meta: ['12px', { lineHeight: '16px' }],
        small: ['14px', { lineHeight: '20px' }],
        body: ['16px', { lineHeight: '26px' }],
        lead: ['20px', { lineHeight: '28px' }],
        h2: ['28px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        h1: ['44px', { lineHeight: '48px', letterSpacing: '-0.035em' }],
        numeral: ['72px', { lineHeight: '72px', letterSpacing: '-0.045em' }],
        count: ['112px', { lineHeight: '100px', letterSpacing: '-0.055em' }],
      },
      borderRadius: { control: '8px', tile: '12px' },
      maxWidth: { frame: '1280px', column: '68ch' },
      transitionDuration: { fast: 'var(--dur-fast)', base: 'var(--dur-base)', slow: 'var(--dur-slow)' },
      transitionTimingFunction: { out: 'var(--ease-out)', 'in-out': 'var(--ease-in-out)' },
    },
  },
  plugins: [],
};
