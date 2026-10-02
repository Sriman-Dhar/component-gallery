/** Reads an "r g b" token from :root as a 0..1 sRGB triple (shader colors follow the design tokens). */
export function tokenRgb(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [r = 255, g = 255, b = 255] = raw.split(/\s+/).map(Number);
  return [r / 255, g / 255, b / 255];
}
