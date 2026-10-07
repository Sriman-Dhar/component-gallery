import { fireEvent, render, screen } from '@testing-library/react';
import CommandPalette from '../components/command-palette/CommandPalette';
import { domeboardCommands } from '../components/command-palette/commands';
import { score } from '../components/command-palette/fuzzy';
import { buildSections } from '../components/command-palette/sections';

const GROUPS = ['Targets', 'Actions', 'Go to', 'Help'];
const items = domeboardCommands(() => undefined);
const firstLabel = (query: string) => buildSections(items, query, [], GROUPS).rows[0]?.item.label;

describe('command palette ranking (fix 1)', () => {
  it('selects the best match first, not the first group: "log" picks Logbook', () => {
    expect(firstLabel('log')).toBe('Logbook');
  });

  it('names the keyword a hidden match came through', () => {
    expect(score('roof', 'Open the dome', ['roof', 'shutter'])).toMatchObject({ ranges: [], via: 'roof' });
  });

  it('treats a space as a word boundary and drops scattered noise', () => {
    const labels = (q: string) => buildSections(items, q, [], GROUPS).rows.map((r) => r.item.label);
    // Word initials only: Observing checklist, plus Kessa Cluster through its shown keyword "open cluster".
    expect(labels('o c')).toEqual(['Observing checklist', 'Kessa Cluster']);
    expect(buildSections(items, 'o c', [], GROUPS).rows[1].via).toBe('open cluster');
    expect(labels('cls')).not.toContain('Take calibration flats');
    expect(labels('cls')).not.toContain('Observing checklist');
  });

  it('lists every command on an empty query, Recent first', () => {
    const sections = buildSections(items, '', ['weather'], GROUPS);
    expect(sections.groups[0].name).toBe('Recent');
    expect(sections.rows).toHaveLength(items.length);
  });
});

describe('command palette shortcuts and pages (fix 1)', () => {
  const setup = () => {
    const ran: string[] = [];
    render(<CommandPalette items={domeboardCommands((l) => ran.push(l))} groupOrder={GROUPS} recentKey="test:depth" triggerLabel="Search Domeboard" />);
    return ran;
  };

  it('runs a keycap shortcut while closed, single keys and G then L', () => {
    const ran = setup();
    fireEvent.keyDown(document.body, { key: 'c' });
    fireEvent.keyDown(document.body, { key: 'g' });
    fireEvent.keyDown(document.body, { key: 'l' });
    expect(ran).toEqual(['Close the dome', 'Logbook']);
  });

  it('keeps typing as search while open: a shortcut letter never runs', () => {
    const ran = setup();
    fireEvent.click(screen.getByRole('button', { name: /Search Domeboard/ }));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'r' });
    expect(ran).toEqual([]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens a sub page with a breadcrumb, and Backspace on an empty query goes back', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Search Domeboard/ }));
    const box = screen.getByRole('combobox');
    fireEvent.change(box, { target: { value: 'go to a night' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Back from Go to a night' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Night of 6 Oct');
    fireEvent.keyDown(box, { key: 'Backspace' });
    expect(screen.queryByRole('button', { name: /Back from/ })).toBeNull();
  });
});
