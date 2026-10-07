import { fireEvent, render, screen } from '@testing-library/react';
import CommandPalette from '../components/command-palette/CommandPalette';
import { domeboardCommands, skyPlates } from '../components/command-palette/commands';
import { rank, score } from '../components/command-palette/fuzzy';
import { createRecentStore } from '../components/command-palette/recent';
import { navStep } from '../components/command-palette/usePaletteNav';

const items = domeboardCommands(() => undefined);
const labels = (query: string) => rank(items, query).map((r) => r.item.label);

describe('command palette fuzzy', () => {
  it('puts both dome actions in the top 2 for "dome"', () => {
    expect(labels('dome').slice(0, 2).sort()).toEqual(['Close the dome', 'Open the dome']);
  });

  it('finds "Open the dome" from word initials', () => {
    expect(labels('otd')).toContain('Open the dome');
  });

  it('ranks a whole-label prefix above a mid-word match of the same query', () => {
    const prefix = score('lan', 'Lantern hall');
    const mid = score('lan', 'Tonight plan');
    expect(prefix && mid && prefix.score > mid.score).toBe(true);
  });

  it('finds "Open the dome" through its keywords', () => {
    expect(labels('roof')[0]).toBe('Open the dome');
  });

  it('tolerates one typo in 4+ character queries', () => {
    expect(labels('kesa')).toContain('Kessa Cluster');
    expect(labels('kesx')).toContain('Kessa Cluster');
  });

  it('returns nothing for "zzzz"', () => {
    expect(rank(items, 'zzzz')).toEqual([]);
  });

  it('returns ranges that cover exactly the matched characters', () => {
    const cases: [string, string][] = [
      ['otd', 'Open the dome'],
      ['dome', 'Open the dome'],
      ['kesa', 'Kessa Cluster'],
    ];
    for (const [query, label] of cases) {
      const m = score(query, label);
      expect(m).not.toBeNull();
      const picked = m!.ranges.map(([a, b]) => label.slice(a, b)).join('').toLowerCase();
      expect(picked).toBe(query);
    }
  });

  it('ranks 1,000 items in under 4ms (median of 20 runs)', () => {
    const big = [...items, ...skyPlates(1000 - items.length, () => undefined)];
    expect(big).toHaveLength(1000);
    rank(big, 'warmup');
    const times: number[] = [];
    for (let i = 0; i < 20; i++) {
      const t0 = performance.now();
      rank(big, i % 2 ? 'plate 04' : 'kesx');
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    expect(times[10]).toBeLessThan(4);
  });
});

describe('command palette recent store', () => {
  afterEach(() => vi.restoreAllMocks());

  it('de-duplicates, caps at 5 and keeps the newest first', () => {
    const store = createRecentStore('test:recent-a', 5);
    store.clear();
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach((id) => store.push(id));
    store.push('c');
    expect(store.read()).toEqual(['c', 'f', 'e', 'd', 'b']);
  });

  it('never throws when localStorage throws, and falls back to memory', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const store = createRecentStore('test:recent-b', 5);
    expect(() => store.push('open-dome')).not.toThrow();
    expect(() => store.push('logbook')).not.toThrow();
    expect(store.read()).toEqual(['logbook', 'open-dome']);
  });
});

describe('command palette navigation', () => {
  it('wraps ArrowDown from the last row to the first and ArrowUp from the first to the last', () => {
    expect(navStep(4, 'ArrowDown', 5)).toBe(0);
    expect(navStep(0, 'ArrowUp', 5)).toBe(4);
    expect(navStep(1, 'ArrowDown', 5)).toBe(2);
  });

  it('jumps with Home and End', () => {
    expect(navStep(3, 'Home', 5)).toBe(0);
    expect(navStep(0, 'End', 5)).toBe(4);
  });

  it('stays at 0 when nothing is visible', () => {
    expect(navStep(0, 'ArrowDown', 0)).toBe(0);
  });
});

describe('command palette component', () => {
  it('opens on Ctrl+K with focus in the combobox, and Escape hands focus back', () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <CommandPalette items={items} groupOrder={['Targets', 'Actions', 'Go to', 'Help']} recentKey="test:recent-c" />
      </>,
    );
    screen.getByRole('button', { name: 'Elsewhere' }).focus();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toHaveAttribute('aria-modal', 'true');
    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Search commands' }));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Elsewhere' }));
  });

  it('runs the active command after closing and lists it under Recent next time', () => {
    const ran: string[] = [];
    const list = domeboardCommands((label) => ran.push(label));
    render(<CommandPalette items={list} groupOrder={['Targets', 'Actions', 'Go to', 'Help']} recentKey="test:recent-d" triggerLabel="Search Domeboard" />);
    const trigger = screen.getByRole('button', { name: /Search Domeboard/ });
    fireEvent.click(trigger);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'roof' } });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(ran).toEqual(['Open the dome']);
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    const recent = screen.getByRole('group', { name: 'Recent' });
    expect(recent).toHaveTextContent('Open the dome');
  });

  it('registers no hotkey when static (the gallery tile)', () => {
    render(<CommandPalette items={items} groupOrder={['Targets', 'Actions', 'Go to', 'Help']} hotkey={false} staticOpen initialQuery="dom" recentKey="test:recent-e" />);
    const before = screen.getAllByRole('dialog').length;
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getAllByRole('dialog')).toHaveLength(before);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Open the dome');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
  });
});
