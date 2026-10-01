import { useLayoutEffect, useState } from 'react';
import { DEFAULT_FACE, LAB_FACES, LAB_FONTS_HREFS, labCss, type LabFace } from './fontLabFaces';
import { FOCUS_RING } from './focus';

/**
 * Font lab (temporary, dev only): a floating picker that swaps the display face on every display surface,
 * so the owner picks by eye on the live page. Mounted from Layout only when import.meta.env.DEV is true.
 * The choice lives in sessionStorage; the committed default (Zodiak) is untouched until one is picked for real.
 */
const STORE_KEY = 'gallery-font-lab';
const LINK_ID = 'font-lab-fonts';
const STYLE_ID = 'font-lab-style';

function readStored(): string {
  try {
    const id = sessionStorage.getItem(STORE_KEY);
    if (id && LAB_FACES.some((face) => face.id === id)) return id;
  } catch {
    /* storage blocked: fall back to the default */
  }
  return DEFAULT_FACE;
}

function ensureFontsLoaded() {
  LAB_FONTS_HREFS.forEach((href, i) => {
    const id = `${LINK_ID}-${i}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
}

function applyFace(face: LabFace) {
  const root = document.documentElement;
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = labCss(face);
  if (face.id === DEFAULT_FACE) {
    root.style.removeProperty('--font-display');
    root.removeAttribute('data-font-lab');
  } else {
    root.style.setProperty('--font-display', face.stack);
    root.setAttribute('data-font-lab', face.id);
  }
}

export default function FontLab() {
  const [current, setCurrent] = useState(readStored);
  const [open, setOpen] = useState(true);

  useLayoutEffect(() => {
    ensureFontsLoaded();
    const face = LAB_FACES.find((f) => f.id === current) ?? LAB_FACES[0];
    applyFace(face);
    try {
      sessionStorage.setItem(STORE_KEY, face.id);
    } catch {
      /* storage blocked: the swap still works for this page view */
    }
  }, [current]);

  const chip = `inline-flex h-11 items-center rounded-full border px-4 transition-colors duration-fast ${FOCUS_RING}`;

  return (
    <aside aria-label="Font lab" className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      {open && (
        <div id="font-lab-panel" className="glass w-64 rounded-tile border border-line p-3 shadow-[0_12px_40px_rgb(0_0_0/var(--shadow-alpha))]">
          <p className="mb-2 flex items-baseline justify-between px-1 font-mono text-meta text-text-2">
            <span className="text-text">Font lab</span>
            <span>pick one</span>
          </p>
          <ul className="flex flex-col gap-1.5">
            {LAB_FACES.map((face) => {
              const active = face.id === current;
              return (
                <li key={face.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCurrent(face.id)}
                    style={{ fontFamily: face.stack, fontStretch: face.stretch }}
                    className={`${chip} w-full justify-between text-[17px] font-semibold ${
                      active ? 'border-accent bg-accent/10 text-text' : 'border-line bg-surface/60 text-text-2 hover:border-text-2 hover:text-text'
                    }`}
                  >
                    {face.name}
                    {active && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-glow shadow-[0_0_8px_rgb(var(--color-accent)/0.7)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="font-lab-panel"
        onClick={() => setOpen((v) => !v)}
        className={`${chip} gap-2 border-line bg-surface/80 font-mono text-meta text-text hover:border-text-2`}
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
        {open ? 'Hide font lab' : 'Font lab'}
      </button>
    </aside>
  );
}
