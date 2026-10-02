import { describe, expect, it } from 'vitest';
import { slotCaption } from '../lib/catalogue';
import { highlight } from '../lib/highlight';
import { bankOf, createSpin, dragEnd, dragMove, dragStart, stepSpin } from '../shell/orrery/orrerySpin';

describe('highlight', () => {
  it('splits source into lines of typed tokens', () => {
    const lines = highlight("import { x } from 'y';\n// note\nconst n = Foo(42);");
    expect(lines).toHaveLength(3);
    expect(lines[0][0]).toEqual({ kind: 'k', text: 'import' });
    expect(lines[0].find((t) => t.kind === 's')?.text).toBe("'y'");
    expect(lines[1]).toEqual([{ kind: 'c', text: '// note' }]);
    expect(lines[2].find((t) => t.text === 'Foo')?.kind).toBe('t');
    expect(lines[2].find((t) => t.text === '42')?.kind).toBe('n');
    expect(lines[2].map((t) => t.text).join('')).toBe('const n = Foo(42);');
  });

  it('keeps a block comment that spans lines on each of its lines', () => {
    const lines = highlight('/* a\nb */ x');
    expect(lines[0]).toEqual([{ kind: 'c', text: '/* a' }]);
    expect(lines[1][0]).toEqual({ kind: 'c', text: 'b */' });
  });
});

describe('orrery drag', () => {
  it('tips the ring plane on a vertical drag and springs back level', () => {
    const spin = createSpin(0);
    dragStart(spin, 100, 0, 100);
    dragMove(spin, 100, 16, 180);
    expect(spin.tilt).toBeGreaterThan(0.2);
    dragEnd(spin, 20);
    for (let i = 0; i < 300; i++) stepSpin(spin, 1 / 60);
    expect(Math.abs(spin.tilt)).toBeLessThan(0.02);
  });

  it('banks the camera only while the spin runs above its base rate', () => {
    const spin = createSpin(0);
    expect(bankOf(spin)).toBe(0);
    dragStart(spin, 0, 0);
    dragMove(spin, 200, 16);
    expect(Math.abs(bankOf(spin))).toBeGreaterThan(0.05);
  });
});

describe('slotCaption', () => {
  it('names shipped slots and dates the rest by the week they open', () => {
    expect(slotCaption(0)).toMatchObject({ number: 'No 01', slug: 'magnetic-button' });
    const later = slotCaption(11);
    expect(later.slug).toBeUndefined();
    expect(later.title).toMatch(/^Week 5, opens 29 Oct$/);
  });
});
